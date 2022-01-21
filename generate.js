import fs from "fs";
import path from "path";

// Around ~4099 fs.watch calls triggers EMFILE errors on macOS 11.6.2. With the
// watchOptions below, TypeScript performs 2 fs.watch calls per project.
const NUM_PACKAGES_TO_GENERATE = 2050;

const PACKAGES_DIR = "packages"

main()

async function main() {
  await fs.promises.rm(PACKAGES_DIR, { recursive: true, force: true });

  await Promise.all(range(NUM_PACKAGES_TO_GENERATE).map(createProject))
  await createRootTsconfig()
}

async function createProject(i) {
  const packageDir = path.join(PACKAGES_DIR, i.toString());
  await fs.promises.mkdir(packageDir, { recursive: true })

  const projectTsconfig = {
    compilerOptions: {
      composite: true
    }
  };

  await Promise.all([
    fs.promises.writeFile(path.join(packageDir, "tsconfig.json"), JSON.stringify(projectTsconfig, undefined, 2)),
    fs.promises.writeFile(path.join(packageDir, "index.ts"), "")
  ])
}

async function createRootTsconfig() {
  const solutionStyleTsconfig = {
    watchOptions: {
      watchFile: "useFsEventsOnParentDirectory",
      watchDirectory: "useFsEvents"
    },
    references: range(NUM_PACKAGES_TO_GENERATE).map(i => ({ path: path.join("./packages", i.toString()) }))
  };

  await fs.promises.writeFile("tsconfig.json", JSON.stringify(solutionStyleTsconfig, undefined, 2));
}

function range(num) {
  return [...[...Array(num)].keys()]
}
