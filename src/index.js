#!/usr/bin/env node

import { program } from "commander";
import { generateStructure } from "./generateStructure.js";
import path from "path";
import fs from "fs";

program
  .version("1.0.0")
  .description("Generate markdown documentation of folder structure");

const commonOptions = (command) => {
  return command
    .option(
      "-i, --ignore <patterns...>",
      'Patterns to ignore (e.g., "node_modules/**" "*.log")'
    )
    .option("-o, --output <filename>", "Output file name")
    .option("-d, --depth <number>", "Maximum depth to traverse", parseInt)
    .option("-s, --size", "Include file sizes in the output", false)
    .option("-f, --format <type>", "Output format (md or txt)", "md");
};

commonOptions(
  program
    .command("structure")
    .description("Generate folder structure without file contents")
).action(async (options) => {
  const format = options.format || "md";
  const defaultExt = format === "md" ? ".md" : ".txt";
  const outputFile = options.output || `output${defaultExt}`;

  const output = await generateStructure(process.cwd(), {
    includeCode: false,
    ignorePatterns: options.ignore,
    maxDepth: options.depth || Infinity,
    showSize: options.size,
    format: format,
  });
  fs.writeFileSync(outputFile, output);
  console.log(`Structure has been written to ${outputFile}`);
});

commonOptions(
  program
    .command("structure-with-code")
    .description("Generate folder structure with file contents")
).action(async (options) => {
  const format = options.format || "md";
  const defaultExt = format === "md" ? ".md" : ".txt";
  const outputFile = options.output || `output${defaultExt}`;

  const output = await generateStructure(process.cwd(), {
    includeCode: true,
    ignorePatterns: options.ignore,
    maxDepth: options.depth || Infinity,
    showSize: options.size,
    format: format,
  });
  fs.writeFileSync(outputFile, output);
  console.log(`Structure with code has been written to ${outputFile}`);
});

program.parse(process.argv);
