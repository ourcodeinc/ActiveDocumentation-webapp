/*
 * This code is written by Genni Mansi.
 * Edited by Sahar Mehrpour
 * Nov 2019
 */

/*
executes JavaScript code that runs command line prompts that
runs the FPGrowth algorithm on each of the databases.
-> Requirements: databases that were generated using main.js must be in the same
directory. "fileLocations.txt" must also be in the same directory.
-> Output: A series of files that are the output of the FPGrowth algorithm
that is used.
    - Each file has a title in the format of 'output' + numericValue + '.txt'.
       - Each file contains the FIs that were found along with the support count for
         each FI; following all the FIs are the XML files used to produce the database
         that is analyzed.
    - Note: These are different from 'output' + numbericValue + '_mod.txt'. The
         output from this step directly contains the result from the command line
         prompt, including support counts.
 */

/* This script is used to run the algorithm that mines the database. Essentially,
it runs the proper command line prompts to analyze the databases and output the
frequent itemsets */

import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

export const analyze = () => {

    // Path to directory with xml files we wish to iterate through
    // Currenlty, the directory is the directory main.js is running in
    let directoryPath = path.join(__dirname);
    // Make a list of xml files
    let fileList = [];
    fs.readdirSync(directoryPath).forEach(file => {
        let p = path.parse(file);
        //console.log(p.name);

        if ((p.name).includes("AE_crowdcode")) {
            fileList.push(file);
        }

    });
    // The way this map works is that the key is the .txt file name (database),
    // and the corresponding value is a list of the xml files used to create
    // the txt value.
    let fileLocMap = new Map();
    // We read in all the Attribute Encoding database file names and the xml files
    // that were used to create them from 'fileLocations.txt'. This txt file
    // is structured such that each database (fileName ending in ''.txt') is
    // followed immediately by the list of 'xml' files used to create that
    // database.
    let array = fs.readFileSync('fileLocations.txt').toString().split("\n");
    let aeFile;
    for (let i in array) {

        // If it is the name of a database, then we want to keep it in this
        // local variable, and use it as the key in the map as we make a list
        // of the xml files that follow it
        if (array[i].split(".")[1] === "txt") {
            aeFile = array[i];
        }
        // If it is not a database name, then it is an xml file used to create
        // that database. Either (1) We have already recorded an xml file name
        // for this key (database name ); or (2) We have not yet read in/recorded
        // an xml file name for this key.

        // (1) If a list of xml files already exists for this
        // datbase, then we just append this file name to the end of the list
        else if (fileLocMap.has(aeFile)) {
            if (array[i] !== "") {
                let entry = fileLocMap.get(aeFile);
                entry.push(array[i]);
                fileLocMap.set(aeFile, entry);
            }
        }
        // (2) However, if we have not yet recorded an xml file name for this key,
        // then we need to add this key to the map with a value that is a list
        // that contains this first xml file name.
        else {
            if (array[i] !== "") {
                fileLocMap.set(aeFile, [array[i]]);
            }
        }
    }

    let SUPPORT = 60;
    // We want to analyze each of the files in this list
    for (let i = 0; i < fileList.length; i++) {

        let prompt = "java -jar spmf.jar run FPMax " + fileList[i]
            + " output" + i + ".txt " + SUPPORT + "%";

        // Execute analysis
        exec(prompt,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

    }


    // Add xml files that FI's apply to, to bottom of output file
    for (let i = 0; i < fileList.length; i++) {

        // Add list of xml files to bottom of analysis file
        let f = "output" + i + ".txt";
        let stream = fs.createWriteStream(f, {flags: 'a'});
        let arr = fileLocMap.get(fileList[i]);
        let data = "";

        for (let j = 0; j < arr.length; j++) {
            data = data + arr[j] + "\n";
        }
        stream.write(data);
        stream.close();

    }

};