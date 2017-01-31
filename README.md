## Synopsis

Need an easy way to programatically sync 2 folders in javascript? Let cs-recursive-sync do the hard-lifting for you! Simply pass in the source folder and the sync folder as parameters and our algorithm will do the rest.

##Requirements

Before building this project you will need the following resources:

- npm

## Installation

```js
npm install cs-recursive-sync --save
```

## Usage

There are 2 functions exposed in this module, 'beginSync' and 'compare'. Both functions return promises.

### Syncronize Directories
```js
var sync = require('cs-recursive-sync');
sync.beginSync(source_dir_path, sync_dir_path)
	.then((rslt) => { //do something else });
```

### Compare Directories
```js
var sync = require('cs-recursive-sync');
sync.compareDirectories(source_dir_path, sync_dir_path)
	.then((rslt) => { //do something else });
```