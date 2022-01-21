```
npm install
npm run repro
```

For convenience, the `repro` script is defined as:

```json
{
  "scripts": {
    "tsc --watch --extendedDiagnostics"
  }
}
```

After a few seconds setting up watchers, `tsc` will switch them all to a `MissingFileSystemEntryWatcher`.

```
[11:48:15 AM] Found 0 errors. Watching for file changes.

Files:                        2055
Lines of Library:            22668
Lines of Definitions:            0
Lines of TypeScript:          2050
Lines of JavaScript:             0
Lines of JSON:                   0
Lines of Other:                  0
Nodes of Library:           105493
Nodes of Definitions:            0
Nodes of TypeScript:          4100
Nodes of JavaScript:             0
Nodes of JSON:                   0
Nodes of Other:                  0
Identifiers:                 38403
Symbols:                     26276
Types:                        9156
Instantiations:               2538
Memory used:               220295K
Assignability cache size:     3020
Identity cache size:             0
Subtype cache size:              0
Strict subtype cache size:       0
I/O Read time:               0.75s
Parse time:                  0.27s
Program time:                8.57s
Bind time:                   0.09s
Check time:                  0.52s
printTime time:              1.10s
Emit time:                   1.12s
transformTime time:          0.19s
commentTime time:            0.01s
I/O Write time:              0.75s
Total time:                 10.30s
DirectoryWatcher:: Added:: WatchInfo: /Volumes/git/typescript-emfile-repro 1 {"watchFile":5,"watchDirectory":0} Wild card directory
Elapsed:: 0.4360110005363822ms DirectoryWatcher:: Added:: WatchInfo: /Volumes/git/typescript-emfile-repro 1 {"watchFile":5,"watchDirectory":0} Wild card directory
sysLog:: /Volumes/git/typescript-emfile-repro:: Changing watcher to MissingFileSystemEntryWatcher
sysLog:: /Volumes/git/typescript-emfile-repro/packages/0:: Changing watcher to MissingFileSystemEntryWatcher
sysLog:: /Volumes/git/typescript-emfile-repro/packages/0:: Changing watcher to MissingFileSystemEntryWatcher
```
