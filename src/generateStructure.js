import fs from "fs";
import path from "path";
import { createIgnore, formatFileSize } from "./utils.js";

export async function generateStructure(
  rootPath,
  options = {
    includeCode: false,
    ignorePatterns: [],
    maxDepth: Infinity,
    showSize: false,
    format: "md",
  }
) {
  const defaultIgnore = [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
    ".DS_Store",
    "*.log",
  ];

  const ignore = createIgnore([
    ...defaultIgnore,
    ...(options.ignorePatterns || []),
  ]);
  let output = "";
  let fileContents = [];

  // Initialize output based on format
  if (options.format === "md") {
    output += "# Project Structure\n\n";
    output += "## Directory Tree\n\n";
    output += "```text\n";
  }

  function processDirectory(currentPath, prefix = "", depth = 0) {
    if (depth > options.maxDepth) return;

    const items = fs.readdirSync(currentPath).sort((a, b) => {
      const aStats = fs.statSync(path.join(currentPath, a));
      const bStats = fs.statSync(path.join(currentPath, b));
      if (aStats.isDirectory() && !bStats.isDirectory()) return -1;
      if (!aStats.isDirectory() && bStats.isDirectory()) return 1;
      return a.localeCompare(b);
    });

    items.forEach((item, index) => {
      const fullPath = path.join(currentPath, item);
      const relativePath = path.relative(rootPath, fullPath);

      if (ignore.ignores(relativePath)) return;

      const isLast = index === items.length - 1;
      const stats = fs.statSync(fullPath);
      const sizeInfo = options.showSize
        ? ` (${formatFileSize(stats.size)})`
        : "";

      if (stats.isDirectory()) {
        output += `${prefix}${isLast ? "└── " : "├── "}${item}/${sizeInfo}\n`;
        processDirectory(
          fullPath,
          `${prefix}${isLast ? "    " : "│   "}`,
          depth + 1
        );
      } else {
        output += `${prefix}${isLast ? "└── " : "├── "}${item}${sizeInfo}\n`;

        if (options.includeCode) {
          try {
            const content = fs.readFileSync(fullPath, "utf-8");
            const extension = path.extname(item).slice(1);
            fileContents.push({
              path: relativePath,
              content: content,
              extension: extension,
            });
          } catch (error) {
            fileContents.push({
              path: relativePath,
              content: "Unable to read file content",
              extension: "text",
            });
          }
        }
      }
    });
  }

  processDirectory(rootPath);

  if (options.format === "md") {
    output += "```\n\n";

    if (options.includeCode && fileContents.length > 0) {
      output += "## File Contents\n\n";
      fileContents.forEach((file) => {
        output += `### ${file.path}\n\n`;
        output += "```" + file.extension + "\n";
        output += file.content;
        output += "\n```\n\n";
      });
    }

    const stats = getDirectoryStats(rootPath, ignore);
    output += "## Project Statistics\n\n";
    output += "```text\n";
    output += `Total Files: ${stats.files}\n`;
    output += `Total Directories: ${stats.directories}\n`;
    output += `Total Size: ${formatFileSize(stats.totalSize)}\n`;
    output += "```\n";
  } else {
    // For text format, just add a simple separator before statistics
    if (options.includeCode && fileContents.length > 0) {
      output += "\nFile Contents:\n\n";
      fileContents.forEach((file) => {
        output += `--- ${file.path} ---\n`;
        output += file.content;
        output += "\n\n";
      });
    }

    const stats = getDirectoryStats(rootPath, ignore);
    output += "\nProject Statistics:\n";
    output += `Total Files: ${stats.files}\n`;
    output += `Total Directories: ${stats.directories}\n`;
    output += `Total Size: ${formatFileSize(stats.totalSize)}\n`;
  }

  return output;
}

function getDirectoryStats(dirPath, ignore) {
  let stats = { files: 0, directories: 0, totalSize: 0 };

  function processDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      if (ignore.ignores(path.relative(dirPath, fullPath))) return;

      const itemStats = fs.statSync(fullPath);
      if (itemStats.isDirectory()) {
        stats.directories++;
        processDir(fullPath);
      } else {
        stats.files++;
        stats.totalSize += itemStats.size;
      }
    });
  }

  processDir(dirPath);
  return stats;
}
