var dir = require('node-dir');

//list all directories (recursive)
module.exports.getAllDirectories = function(start) {
	return new Promise((res, error) => {
		dir.subdirs(start, function(err, subdirs) {
			if (err) error(err);
			else res(subdirs);
		});
	});
}

//list all files (recursive)
module.exports.getAllFiles = function(start) {
	return new Promise((res, error) => {
		dir.files(start, function(err, files) {
			if (err) error(err);
			else res(files);
		});
	});
}

//removes predicate string from each item in list
module.exports.mapRelativeNames = function(list, predicate) {
	return list.map((item) => {
		return item.replace(predicate, '');
	});
}

//takes an array and converts it to an object (used as simple hash-table)
module.exports.convertListToHash = function(list) {
	var rslt = {};
	for (var i = 0; i < list.length; i++) {
		rslt[list[i]] = true;
	}
	return rslt;
}

//iterate over a list and return the values that exist in the map
module.exports.compareListToMap = function(list, map) {
	return list.filter((item) => {		
		return map[item] == null;
	});
}