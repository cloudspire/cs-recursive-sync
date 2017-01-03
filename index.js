var syncronize = require('./sync');
var __ = require('underscore');

exports.compare = function(source_dir_path, sync_dir_path) {
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
	
	var predicate1 = source_dir_path + '\\';
	var predicate2 = sync_dir_path + '\\';

	//FOLDERS
	syncronize.getAllDirectories(source_dir_path)
		.then((rslt) => { source_dirs = syncronize.mapRelativeNames(rslt, predicate1); finished1(); });

	syncronize.getAllDirectories(sync_dir_path)
		.then((rslt) => { sync_dirs = syncronize.mapRelativeNames(rslt, predicate2); return sync_dirs; })
		.then((rslt) => { dirs_map = syncronize.convertListToHash(rslt); finished1(); });

	//FILES
	syncronize.getAllFiles(source_dir_path)
		.then((rslt) => { source_files = syncronize.mapRelativeNames(rslt, predicate1); finished2(); });
		
	syncronize.getAllFiles(sync_dir_path)
		.then((rslt) => { sync_files = syncronize.mapRelativeNames(rslt, predicate2); return sync_files; })
		.then((rslt) => { files_map = syncronize.convertListToHash(rslt); finished2(); });
}