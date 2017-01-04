var sync = require('./index.js');
var source = String(__dirname) + '\\test_structures\\Source_Folder'
var dest = String(__dirname) + '\\test_structures\\Sync_Folder'
sync.beginSync(source, dest);