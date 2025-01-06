#!/usr/bin/env node

import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import figures from "figures";

const getPackagejson = () => {
  const filePath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found in this directory");
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const generateReadme = (json) => {
  const { name, description, scripts, dependencies } = json;
  const dependencyList = dependencies
    ? Object.entries(dependencies)
        .map(([key, value]) => `- ${key}`)
        .join("\n")
    : "No dependencies";

  return `Docs generated with docs-generate-readme
  
# ${name}

## ${description || ""}

<a href="link-here">Visit project</a>

### install

1- Install dependencies

npm i

#### Dependencies
        
${dependencyList}

## Scripts

${
  scripts &&
  Object.entries(scripts)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
}
`;
};

const transcribeDoc = async () => {
  const { overwrite } = await inquirer.prompt([
    {
      type: "confirm",
      name: "overwrite",
      message: "Already exist a README.md. ¿Do you want to transcribe it?",
      default: false,
    },
  ]);
  return overwrite;
};

const createDoc = async () => {
  try {
    const packageJson = getPackagejson();
    const readmeContent = generateReadme(packageJson);
    const readmePath = path.resolve(process.cwd(), "README.md");
    if (fs.existsSync(readmePath)) {
      const overwrite = await transcribeDoc();
      if (!overwrite) {
        console.log("Operation cancelled");
        return;
      }
    }

    fs.writeFileSync(readmePath, readmeContent);
    console.log(
      `${figures.pointer} ${figures.lineVerticalDashed1}README.md generated succesfully${figures.lineVerticalDashed1} ${figures.tick}`
    );
  } catch (error) {
    console.log("Error:", error.message);
  }
};

createDoc();
