import fs from "node:fs"
import path from "node:path"
import { scheduler } from 'node:timers/promises';

async function main() {
  let didAnyWatcherError = false;

  const watchers = [];

  for await (const directory of getDirsRecursive(process.cwd())) {
    // Waiting before setting up the next file watcher gives a more consistent
    // failure at the 4097th watcher. This suggests the FSEvents watcher limit
    // is 4096.
    await scheduler.wait(200);

    if (didAnyWatcherError) {
      break;
    }

    console.log(`Watching: ${directory}`);
    const watcher = fs.watch(directory, { persistent: true }, logChange);
    watchers.push(watcher);

    watcher.on("error", (err) => {
      // It appears all watchers emit an EMFILE error after the first one errors.
      // https://github.com/nodejs/node/issues/43267#issuecomment-1143250277
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
