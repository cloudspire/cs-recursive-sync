## Synopsis

Need an easy way to programatically sync 2 folders in javascript? Let cs-recursive-sync do the hard-lifting for you! Simply pass in the source folder and the sync folder as parameters and our algorithm will do the rest.

##Requirements

Before building this project you will need the following resources:

- npm

## Quick Start

To begin, clone the project into a folder of your choosing. Navigate to the project in a command terminal and type "npm install". Now, inside of a Node JS application simply require the file 'sync.js' 
and call the function 'syncDirectories(source, destination)'. The 'syncDirectories' function returns a promise which will resolve with an object of potential errors; this object will be split into two parts: 
files and folders, each containing their respective errors.