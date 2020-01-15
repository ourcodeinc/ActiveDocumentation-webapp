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

/**
 *
 * @param fileList entries in fpMaxOutput ["file1" ,"file2"]
 * @param attributeQueryMap metaData calculated before {key: {attr: value, query: value}}
 * @return Array ["modifiedFile1", "modifiedFile2"]
 */
export const parseGrouping = (fileList, attributeQueryMap) => {

    let modifiedResults = [];

    for (let i = 0; i < fileList.length; i++) {

        let databaseLines = fileList[i].split("\n");
        let result = {
            attributes: [],
            files: []
        };

        let files = [];

        for (let j = 0; j < databaseLines.length; j++) {

            // If it is an FI, then we want to parse the info in the FI so we can
            // output the attribute info
            while (databaseLines[j] !== undefined && !(databaseLines[j]).includes(".xml")) {

                // Get all the attributes
                let allAttributes = (databaseLines[j]).split(" #")[0];
                let atr = [];

                if (allAttributes !== "\n") {

                    let indivAttributes = allAttributes.split(" ");
                    for (let k = 0; k < indivAttributes.length; k++) {

                        if (+indivAttributes[k]) { // check if it is a number
                            if (attributeQueryMap[+indivAttributes[k]]) {
                                // Output the attribute desc and qury for each attribute
                                atr.push({
                                    id: indivAttributes[k],
                                    attr: attributeQueryMap[indivAttributes[k]]["attr"],
                                    query: attributeQueryMap[indivAttributes[k]]["query"]
                                });

                            }
                            else {
                                atr.push({
                                    id: "",
                                    attr: "Meta Data is not found.",
                                    query: ""
                                });
                            }
                        }
                    }
                }
                if (atr.length > 0) result["attributes"].push(atr);
                j++;  // what is this??
            }
        }


        // Now just output the xml files used to create FIs in the original file
        for (let j = 0; j < databaseLines.length; j++) {
            // Once we're done putting all the attribute info in for each query, then
            // we write the names of the xml files to the bottom of the modified
            // output file.

            if (databaseLines[j] !== undefined && (databaseLines[j]).includes(".java")) {
                files.push(databaseLines[j]);
            }
        }
        result["files"] = files;

        modifiedResults.push(result);
    }

    return modifiedResults;
};