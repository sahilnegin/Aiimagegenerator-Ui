const fs = require("fs");
const path = require("path");

function convertTsxToJsx(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove TypeScript type imports
    content = content.replace(/import.*?type.*?from.*?;?\n/g, "");
    content = content.replace(/,\s*type\s+\w+.*?(?=\})/g, "");

    // Remove interface declarations
    content = content.replace(/export interface \w+.*?\{[\s\S]*?\}\n/g, "");
    content = content.replace(/interface \w+.*?\{[\s\S]*?\}\n/g, "");

    // Remove type annotations from React.forwardRef
    content = content.replace(
      /React\.forwardRef<[^>]+,\s*[^>]+>/g,
      "React.forwardRef",
    );

    // Remove type annotations from function parameters
    content = content.replace(/\(\s*\{[^}]*\}\s*:\s*[^,)]+/g, (match) => {
      return match.replace(/:\s*[^,)]+/, "");
    });

    // Remove type annotations from variables
    content = content.replace(/:\s*React\.[A-Za-z<>[\]|&\s,]+(?=\s*=)/g, "");
    content = content.replace(/:\s*[A-Z][A-Za-z<>[\]|&\s,]*(?=\s*=)/g, "");

    // Remove VariantProps type usage
    content = content.replace(/,\s*VariantProps<typeof \w+>/g, "");

    // Remove type assertions
    content = content.replace(/as\s+[A-Z][A-Za-z<>[\]|&\s,]*/g, "");

    // Clean up extra whitespace and imports
    content = content.replace(/\n\n\n+/g, "\n\n");
    content = content.replace(/^import.*?type.*?;?\n/gm, "");

    return content;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
    return null;
  }
}

function getAllTsxFiles(dir) {
  const files = [];

  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith(".tsx")) {
        files.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

// Convert all TSX files in client/components/ui
const uiDir = path.join(__dirname, "client", "components", "ui");
const tsxFiles = getAllTsxFiles(uiDir);

console.log(`Found ${tsxFiles.length} TSX files to convert...`);

for (const tsxFile of tsxFiles) {
  const jsxFile = tsxFile.replace(".tsx", ".jsx");
  const convertedContent = convertTsxToJsx(tsxFile);

  if (convertedContent) {
    fs.writeFileSync(jsxFile, convertedContent);
    console.log(
      `Converted: ${path.basename(tsxFile)} -> ${path.basename(jsxFile)}`,
    );
  }
}

console.log("Conversion completed!");
