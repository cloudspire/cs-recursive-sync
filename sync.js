var dir = require('node-dir');
var __ = require('underscore');

function syncDirectories(source_dir_path, sync_dir_path) {
    compareDirectories(source_dir_path, sync_dir_path)
        .then((rslt) => { console.dir(rslt); });
}

function compareDirectories(source_dir_path, sync_dir_path) {
    return new Promise((res, err) => {
        var source_dirs, sync_dirs, dirs_map;
        var source_files, sync_files, files_map;

        //WILL FIRE AFTER SOURCE DIRECTORY IS MAPPED
        var finished1 = __.after(2, () => { finished2(); });

        //WILL FIRE AFTER SYNC DIRECTORY IS MAPPED AND SOURCE DIRECTORY HAS BEEN MAPPED
        var finished2 = __.after(3, () => {
            var folders_to_add = compareListToMap(source_dirs, dirs_map);
            var files_to_add = compareListToMap(source_files, files_map);
            res({ folders: folders_to_add, files: files_to_add });
        });

        var predicate1 = source_dir_path + '\\';
        var predicate2 = sync_dir_path + '\\';

        //FOLDERS
        getAllDirectories(source_dir_path)
            .then((rslt) => { source_dirs = mapRelativeNames(rslt, predicate1); finished1(); });

        getAllDirectories(sync_dir_path)
            .then((rslt) => { sync_dirs = mapRelativeNames(rslt, predicate2); return sync_dirs; })
            .then((rslt) => { dirs_map = convertListToHash(rslt); finished1(); });

        //FILES
        getAllFiles(source_dir_path)
            .then((rslt) => { source_files = mapRelativeNames(rslt, predicate1); finished2(); });

        getAllFiles(sync_dir_path)
            .then((rslt) => { sync_files = mapRelativeNames(rslt, predicate2); return sync_files; })
            .then((rslt) => { files_map = convertListToHash(rslt); finished2(); });
    })
}

//list all directories (recursive)
function getAllDirectories(start) {
    return new Promise((res, error) => {
        dir.subdirs(start, function (err, subdirs) {
            if (err) error(err);
            else res(subdirs);
        });
    });
}

//list all files (recursive)
function getAllFiles(start) {
    return new Promise((res, error) => {
        dir.files(start, function (err, files) {
            if (err) error(err);
            else res(files);
        });
    });
}

//removes predicate string from each item in list
function mapRelativeNames(list, predicate) {
    return list.map((item) => {
        return item.replace(predicate, '');
    });
}

//takes an array and converts it to an object (used as simple hash-table)
function convertListToHash(list) {
    var rslt = {};
    for (var i = 0; i < list.length; i++) {
        rslt[list[i]] = true;
    }
    return rslt;
}

//iterate over a list and return the values that exist in the map
function compareListToMap(list, map) {
    return list.filter((item) => {
        return map[item] == null;
    });
}

module.exports.syncDirectories = syncDirectories;
module.exports.compareDirectories = compareDirectories;