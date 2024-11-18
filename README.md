# @project-halycon/folder-map

A CLI tool by HALYCON that generates markdown documentation of your project's folder structure. Perfect for documenting project architecture or creating README files, especially useful for sharing with AI tools like ChatGPT.

## Features

- Generate a markdown tree view of your folder structure
- Option to include file contents in the output
- Multiple output formats (markdown or text)
- Customizable file/folder ignoring patterns
- Custom output file naming
- Depth limitation for large projects
- File size information
- Directory statistics
- Sorted output (directories first, then files)
- Syntax highlighting for code blocks
- Easy-to-use CLI interface
- AI-friendly output formatting

## Installation

Install globally:

```
npm install -g @project-halycon/folder-map
```

Or as a dev dependency:

```
npm install -D @project-halycon/folder-map
```

## Usage

### Generate Basic Structure

```
folder-map structure
```

This will create an output file with your folder structure in the specified format:

```
# Project Structure

## Directory Tree

project/
├── src/
│   ├── components/
│   │   └── Button.js (2.5 KB)
│   └── App.js (1.2 KB)
├── public/
│   └── index.html (3.1 KB)
└── package.json (1.8 KB)

## Project Statistics

Total Files: 4
Total Directories: 3
Total Size: 8.6 KB
```

### Generate Structure with Code

```
folder-map structure-with-code
```

This will include the contents of each file in the output.

### Available Commands

```
folder-map structure [options]        Generate folder structure without file contents
folder-map structure-with-code [options]   Generate folder structure with file contents
```

### Options

- `-i, --ignore <patterns...>` - Patterns to ignore (e.g., "node\*modules/\*\*" "\_.log")
- `-o, --output <filename>` - Custom output file name (default: "output.md")
- `-d, --depth <number>` - Maximum depth to traverse
- `-s, --size` - Include file sizes in the output
- `-f, --format <type>` - Output format: 'md' or 'txt' (default: 'md')
- `-v, --version` - Output the version number
- `-h, --help` - Display help for command

## Default Ignored Patterns

The following patterns are ignored by default:

- node_modules/\*\*
- .git/\*\*
- dist/\*\*
- build/\*\*
- .DS_Store
- \*.log

## Examples

### Basic Usage Examples

```
# Generate basic structure in markdown format
folder-map structure

# Generate structure with file sizes
folder-map structure -s

# Generate structure up to 2 levels deep
folder-map structure -d 2

# Custom output file
folder-map structure -o project-structure.md

# Generate in text format
folder-map structure --format txt

# Combine options
folder-map structure-with-code -s -d 3 -o docs/structure.md -f md -i "node_modules/**" "*.test.js"
```

### Example Output with Code (Markdown Format)

```
# Project Structure

## Directory Tree

project/
├── src/
│   └── index.js (128 B)
└── package.json (325 B)

## File Contents

### src/index.js
javascript
console.log('Hello World');

### package.json
json
{
  "name": "example",
  "version": "1.0.0"
}

## Project Statistics

Total Files: 2
Total Directories: 1
Total Size: 453 B
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request to our [GitHub repository](https://github.com/Project-HALYCON/folder-map).

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub Issues page](https://github.com/Project-HALYCON/folder-map/issues).

## License

MIT © MANNAY - HALYCON Project
