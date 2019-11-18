/*
 * This code is written by Genni Mansi.
 * Edited by Sahar Mehrpour
 * Nov 2019
 */

/*
processes information output from analyzeDatabases.js and
outputs final product.
-> Requirements: output files generated using analyzeDatabases.js must
be in the same directory. "attributeMETAdata_crowdCode.txt" must also be in the
same directory.
-> Output: The final result of our FI mining algorithm.
       - Each file has a title in the format of 'output' + numericValue + '_mod.txt'.
       - Each file contains the FIs that were found, followed by the description and
         XPath query of each attribute.
    - The support counts are removed.
    - See Final Output section of the instructions for more detailed information
         on the formatting.
 */

/* This file is used to parse the frequent itemsets. The frequent itemsets already
formatted as a line of numbers with the support at the end of each line, set off
with a hashtag. This reads in the contents of each file, and outputs a list of
corresponding attribute desciprtions for each one.*/

// We don't edit the file that is passed in; instead, we read in all the lines,
// and for each line, we output the attribute descriptions for each attribute

// THINGS WE NEED:
// MetaDataFile Path/Info
// File path to output
// Each of the FI sets - All begin with AE_crowdCode

import fs from 'fs';
import path from 'path';

export const parseGrouping = () => {

    // Path to directory with xml files we wish to iterate through
    // Currenlty, the directory is the directory main.js is running in
    let directoryPath = path.join(__dirname);
    // Make a list of xml files
    let fileList = [];
    fs.readdirSync(directoryPath).forEach(file => {
        let p = path.parse(file);

        // Make sure it is not a modified output file
        if ((p.name).includes("output") && !(p.name).includes("mod")) {
            //console.log(p.name);
            fileList.push(file);
        }

    });

    // We need to obtain all the metadata info
    let attributeMap = new Map();
    let queryMap = new Map();

    let metaData = fs.readFileSync("attributeMETAdata_crowdCode.txt");
    let data = (metaData.toString()).split("\n");

    for (let q = 0; q < data.length; q++) {

        let idNo, desc, qury;
        let dataPieces = data[q].split(" ");
        // If we are on a row with an attribute ID and description, then we want to
        // store that information
        if (!isNaN(dataPieces[0]) && dataPieces[0] !== "") {
            idNo = dataPieces[0];
            dataPieces = data[q].split(idNo + " ");
            desc = dataPieces[1];
        } else {
            qury = data[q];
        }
        // Store the info
        attributeMap.set(idNo, desc);
        queryMap.set(idNo, qury);

    }

    // Empty the contents of any files whose names contain "output" and "mod";
    for (let i = 0; i < fileList.length; i++) {
        let newFileName = fileList[i].split(".")[0] + "_mod.txt";
        fs.writeFileSync(newFileName, "");
    }

    // Now we are ready to create our modified output text files
    let stream;
    for (let i = 0; i < fileList.length; i++) {

        let contents = fs.readFileSync(fileList[i]);
        let databaseLines = (contents.toString()).split("\n");

        for (let j = 0; j < databaseLines.length; j++) {

            // If it is an FI, then we want to parse the info in the FI so we can
            // output the attribute info
            while (databaseLines[j] !== undefined && !(databaseLines[j]).includes(".xml")) {
                // Get all the attributes
                let allAttributes = (databaseLines[j]).split(" #")[0];

                // We create a new file that is modified with this information
                let newFileName = fileList[i].split(".")[0] + "_mod.txt";

                if (allAttributes !== "\n") {

                    // Write the FI set to the new file
                    stream = fs.writeFileSync(newFileName, allAttributes + "\n", {flag: 'a'});

                    let indivAttributes = allAttributes.split(" ");
                    for (let k = 0; k < indivAttributes.length; k++) {

                        if (indivAttributes[k] !== "") {
                            // Output the attribute desc and qury for each attribute
                            stream = fs.writeFileSync(newFileName, indivAttributes[k] + " "
                                + attributeMap.get(indivAttributes[k]) + "\n", {flag: 'a'});
                            stream = fs.writeFileSync(newFileName, queryMap.get(indivAttributes[k]) + "\n", {flag: 'a'});
                        }
                    }
                }
                j++;
            }
        }

        // Now just output the xml files used to create FIs in the original file
        for (let j = 0; j < databaseLines.length; j++) {
            // Once we're done putting all the attribute info in for each query, then
            // we write the names of the xml files to the bottom of the modified
            // output file.
            let fileName = fileList[i].split(".")[0] + "_mod.txt";
            if (databaseLines[j] !== undefined && (databaseLines[j]).includes(".xml")) {
                stream = fs.writeFileSync(fileName, databaseLines[j] + "\n", {flag: 'a'});
            }
        }


    }
};