import fs from "node:fs"
import path from "node:path"

async function main() {
  let didAnyWatcherError = false;

  const watchers = [];

  for await (const directory of getDirsRecursive(process.cwd())) {
    if (didAnyWatcherError) {
      break;
    }

    console.log(`Watching: ${directory}`);
    const watcher = fs.watch(directory, { persistent: true }, logChange);
    watchers.push(watcher);

    watcher.on("error", (err) => {
      // All watchers error after the first one errors.
      // It appeares all watchers error after the first one errors.
      if (didAnyWatcherError) {
        return;
      }

      didAnyWatcherError = true;

      console.error(`First watch failure on: ${directory}`);
      console.error(`Attempted to create ${watchers.length} total watchers before error`);
      console.error(err);
    });
  }

  if (didAnyWatcherError) {
    console.log(`Closing ${watchers.length} watchers. This may take a few minutes.`);
    while (watchers.length > 0) {
      const watcher = watchers.pop();
      watcher.close();
    }
    console.log("All existing watchers have now been closed.");

    // Try watching again:
    console.log(`Watching: ${process.cwd()}`);
    fs.watch(process.cwd());
  }
}

main();

async function* getDirsRecursive(dir) {
  for (const dirEntry of await fs.promises.readdir(dir, { withFileTypes: true })) {
    const dirPath = path.join(dir, dirEntry.name);
    if (dirEntry.isDirectory()) {
      yield dirPath;
      yield* getDirsRecursive(dirPath);
    }
  }
}

function logChange(event, fileName) {
  console.log(`${event}: ${fileName}`);
}
