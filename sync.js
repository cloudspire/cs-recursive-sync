var dir = require('node-dir');
var __ = require('underscore');
var fs = require('fs-extra');
var async = require('async-series');

function syncDirectories(source_dir_path, sync_dir_path) {
    compareDirectories(source_dir_path, sync_dir_path)
        .then(getMinimumFolders)
        .then((rslt) => { return generateInstructions(rslt, sync_dir_path, source_dir_path); })
        .then(syncAllContent)
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

//reduce folders for minimum number of inserts
function getMinimumFolders(data) {
    data.folders = generateDirectory(data.folders);
    data.folders = getLeaves(data.folders, "");
    data.folders = generateListFromDelimeter(data.folders, ';');
    return data;
}

//create directory structure
function generateDirectory(array) {
    var dir = {}, current, tmp;
    for (var i = 0; i < array.length; i++) {
        current = dir;
        tmp = array[i].split('\\');
        for (var j = 0; j < tmp.length; j++) {
            if (current[tmp[j]] == null) {
                current[tmp[j]] = {};
            }
            current = current[tmp[j]];
        }
    }
    return dir;
}

//get all terminal nodes (leaves)
function getLeaves(array, folder_name) {
    var keys = Object.keys(array);
    if (keys.length == 0) {
        return folder_name + ';';
    } else {
        var tmp = '', next;
        for (var i = 0; i < keys.length; i++) {
            next = (folder_name == "" ? "" : folder_name + '\\') + keys[i];
            tmp += getLeaves(array[keys[i]], next);
        }
        return tmp;
    }
}

//generate instructions to insert folders and files
function generateInstructions(data, predicate1, predicate2) {
    var func1 = (item) => {
        return (done) => {
            var dir = predicate1 + '\\' + item;
            fs.mkdirs(dir, (err) => { done(err); });
            //console.log('copy: ' + dir);
            //done();
        }
    };
    var func2 = (item) => {
        return (done) => {
            var f1 = predicate2 + '\\' + item;
            var f2 = predicate1 + '\\' + item;
            fs.copy(f1, f2, (err) => { done(err); });
            //console.log('copy from: ' + f1);
            //console.log('copy to: ' + f2);
            //done();
        }
    };
    return {
        folders: data.folders.map(func1),
        files: data.files.map(func2)
    }
}

//copy files to sync directory
function syncAllContent(data) {
    return new Promise((res) => {
        async(data.folders, (rslt1) => {
            async(data.files, (rslt2) => {
                res({
                    folders: rslt1.message,
                    files: rslt2.message
                })
            });
        });
    });
}

module.exports.syncDirectories = syncDirectories;
module.exports.compareDirectories = compareDirectories;

//UTILITY FUNCTIONS
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

//turn delimited list into array (reverse of split)
function generateListFromDelimeter(list, delimeter) {
    return String(list).substring(0, list.length - 1).split(delimeter);
}