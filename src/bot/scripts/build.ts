import * as path from "@std/path";

const projectRoot = path.dirname(import.meta.dirname!);
const libRoot = path.join(projectRoot, "lib");

const embeddableFiles = ["help.hbs"];

for (const fileName of embeddableFiles) {
  const target = path.join(libRoot, fileName + ".ts");
  const source = path.join(libRoot, fileName);
  const sourceContent = await Deno.readTextFile(source);
  const content = `// DO NOT EDIT: This file is generated from ${target}.\nexport default ${JSON.stringify(sourceContent)};`;
  await Deno.writeTextFile(target, content);
}
