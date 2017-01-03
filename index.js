var syncronize = require('./sync');
var __ = require('underscore');

var source_dirs, sync_dirs, dirs_map;
var source_files, sync_files, files_map;

var finished1 = __.after(2, () => {
	var test = syncronize.compareListToMap(source_dirs, dirs_map);
	console.dir(test);
	finished2();
});

var finished2 = __.after(3, () => {
	var test = syncronize.compareListToMap(source_files, files_map);
	console.dir(test);
});

var predicate1 = String(__dirname) + '\\test_structures\\Source_Folder\\';
var predicate2 = String(__dirname) + '\\test_structures\\Sync_Folder\\';

//FOLDERS
syncronize.getAllDirectories(String(__dirname) + '\\test_structures\\Source_Folder')
	.then((rslt) => { source_dirs = syncronize.mapRelativeNames(rslt, predicate1); finished1(); });

syncronize.getAllDirectories(String(__dirname) + '\\test_structures\\Sync_Folder')
	.then((rslt) => { sync_dirs = syncronize.mapRelativeNames(rslt, predicate2); return sync_dirs; })
	.then((rslt) => { dirs_map = syncronize.convertListToHash(rslt); finished1(); });

//FILES
syncronize.getAllFiles(String(__dirname) + '\\test_structures\\Source_Folder')
	.then((rslt) => { source_files = syncronize.mapRelativeNames(rslt, predicate1); finished2(); });
	
syncronize.getAllFiles(String(__dirname) + '\\test_structures\\Sync_Folder')
	.then((rslt) => { sync_files = syncronize.mapRelativeNames(rslt, predicate2); return sync_files; })
	.then((rslt) => { files_map = syncronize.convertListToHash(rslt); finished2(); });