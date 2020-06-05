/*
 * This code is written by Genni Mansi.
 * Edited by Sahar Mehrpour
 * Nov 2019
 */

/*
creates the attributes and analyzes the XML files.
 -> Requirements: xml files that are to be analyzed must be in same directory
 -> Output:
    (A.) A series of databases with the name "AE_crowdCode_subClassOf*.txt"
    - Each database contains a row of numbers with each row representing a different class.
    (B.) A file called "attributeMETAdata_crowdCode.txt"
    - File contains all the attribute keys, descriptions, and queries that were found
         in all provided xml files.
    (C.) A file called "fileLocations.txt"
       - File contains a list of databases and the xml files used to create that
         database.
       - Each database name is directly followed by the xml files used to create
         that database. (edited)
-> The purpose of main.js is to create the databases that are going to be analyzed
by the FPGrowth algorithm. It does the following steps:
(1.) Finds all possible attributes in all XML files.
    - The program creates a global list of attributes.
    - Each attribute in the list is identified by a unique number and description.
    - Each attribute also has a corresponding XPath query that is generated and
      stored.
(2.) Finds the child-parent relationships between the classes in the code.
    - Our databases are created based off of the child-parent relationships
      that exists between the classes in the code base.
    - This step groups the classes to be analyzed together based off of the
      child-parent relationships it finds and stores the file locations
      for each of the classes in the group.
(3.) Stores parent information
    - Some of the attributes requires information about the parent class if
      it is available. Since the parent class and child class are not always
      in the same file, and since the parent class's information will be used
      repeatedly, we gather up all the parent information in one step, so that
      such attributes can be more easily found.
(4.) Outputs a file with all the metadata.
    - File that is output has the name _attributeMETAdata_crowdCode.txt.
    - Every two lines in the file are paired. The first line of the pair is the
      attribute key followed on the same line by a short written description of
      the attribute. The second line of the pair is the XML query that corresponds
      to that attribute key/description.
(5.) Outputs "fileLocations.txt"
    - See output bullet under miningRules.js for more information.
(6.) Outputs the databases.
    - Each database has a name in the format "AE_crowdCode_subClassOf*.txt"
    - Each parent-child grouping has its own database. Each line in the database
      represents a different class in the grouping.
    - Each class in each grouping is search for attributes from the
      global list of attributes made in the first step.
-> "sci_class.js" and "sci_functions.js" contain functions that are used
in this process.
 */

import {addChildren, addParentChildRelations, findParentChildRelations,
        makePairsList, findCustomRelations, addCustomRelations} from "./sci_class";

import et from 'elementtree';
import Utilities from "../core/utilities";
import {webSocketSendMessage} from "../core/coreConstants";

/**
 *
 * @param xmlFiles is an array of objects: {filePath:"", xml: ""}
 * @param metaData {key: {attr: "", query: ""}}
 * @param ws
 * @param algorithm TNR or FP_MAX
 * @param fpMaxSupport
 * @param tnrConfidence
 * @param tnrK
 * @param tnrDelta
 * @param customQueries
 */
export const mineRulesFromXmlFiles = (xmlFiles, metaData, ws,
                                      algorithm, fpMaxSupport, tnrConfidence, tnrK, tnrDelta, customQueries = []) => {

    let analysisFileName = "AttributeEncoding";

    let allAttributes = new Map();

    // This is to keep track of the XML queries used for each of the attributes
    let queryMap = new Map();

    // This variable will always be used when trying to obtain the
    // root for each file
    let classRoot;
    // These are used to store the child-parent and interface-implementation
    // pairs that are found
    let childParent = new Map();

    // Used to keep track of where certain classes had been seen
    let classLocations = new Map();

    // Used to keep track of what xml files were used to create what databases
    let fileAnalysisMap = new Map();

    // To check if a class is a parentClass we can simply check to see if
    // childParent[parentName] === undefined; if so, then it is not a parent;
    // otherwise, it is a parent name.

    // The basic idea of the algorithm is to extract all the attributes from a
    // single base class, and then look for those attributes in a set of classes
    // that are related to the base class in some way. Only attributes found in
    // both the base class and the related (peripheral) classes are output to
    // the database that is fed to the FP Growth algorithm.

    // Our first step is to make a list of all the parent classes in the
    // code base; to do this, we need to go through every srcML fle
    // in the directory and find the names of all the parentClasses.

    // Path to directory with xml files we wish to iterate through
    // Currenlty, the directory is the directory main.js is running in


    for (let i=0; i< xmlFiles.length; i++) {
        try {
            classRoot = (et.parse(xmlFiles[i]["xml"]));
            makePairsList(classRoot, childParent, classLocations);
        }
        catch (e) {
            console.log("elementTree failed to parse: ", xmlFiles[i]["xml"]);
            console.error(e);
            return;
        }
    }

    // This is a global variable that controls how "deep" the chlid-parent
    // relationships can extend
    let DEPTH = 2;

    // This map keeps each of the groupings that we make
    let groupList = new Map();

    // Now we need to generate class groupings based off of their inheritance
    // structure
    for (const supa of childParent.keys()) {

        addChildren(supa, childParent, supa, DEPTH, groupList);
        (groupList.get(supa)).push(supa);

    }


    //Now, we're going to populate an information list about the parents defined
    // in this code, so that attributes can be generated
    let parentInfo = new Map();
    // We already have all the fileNames, so all we have to do now go through
    // each file and pull out the parent attributes
    for (let i = 0; i < xmlFiles.length; i++){

        // let data = fs.readFileSync(fileList[i]).toString();
        classRoot = (et.parse(xmlFiles[i]["xml"]));

        // We're going to pull out all the parent info
        let cls = classRoot.findall(".//class");

        for(let j = 0; j < cls.length; j++){

            let ptName = cls[j].find('name');
            let parentName;

            if(ptName !== null && ptName === ''){
                parentName = (ptName.find('name')).text;
            }
            else if(ptName !== null){
                parentName = ptName.text;
            }

            // If class name is not found, then we know it was defined and
            // not simply imported into the code
            if(parentName != null){

                if(childParent.get(parentName) !== undefined){
                    //console.log(parentName);
                    let functionList = [];
                    // Get all the functions in this class
                    let fncs = cls[j].findall('block/function');
                    for(let k = 0; k < fncs.length; k++){
                        // Get the function name
                        let fncName = (fncs[k].find('name')).text;
                        // Make sure we found a valid function name
                        if(fncName !== ''){
                            (functionList).push(fncName);
                        }
                    }

                    // Sort all the functions for easy comparison
                    (functionList).sort();


                    parentInfo.set(parentName, {name:parentName,
                        totalChildren:(childParent.get(parentName)).length,
                        children:childParent.get(parentName),
                        pathToFile: xmlFiles[i]["filePath"],
                        functions: functionList});
                }
            }
        }
    }

    // Now we have all the information we need to generate the attributes
    let id_start = {id : 0};
    for (const group of groupList.keys()) {

        allAttributes = new Map(allAttributes,
            findParentChildRelations(id_start, groupList.get(group),
                allAttributes, classLocations, parentInfo, queryMap, xmlFiles));

    }

    // Add any custom attributes
    findCustomRelations(id_start, customQueries, allAttributes, queryMap);

    // Output the metadata to a file
    outputMetaData(allAttributes, queryMap, metaData, ws);

    let dataMap = new Map();
    for (const group of groupList.keys()){
        let grouping = groupList.get(group);
        addParentChildRelations(allAttributes, grouping, analysisFileName,
            classLocations, parentInfo, fileAnalysisMap, dataMap, xmlFiles);
    }

    // Now look for customRelations
    for (const group of groupList.keys()){
      var grouping = groupList.get(group);
      addCustomRelations(allAttributes, customQueries, grouping, analysisFileName,
                                   classLocations, parentInfo, fileAnalysisMap, dataMap, xmlFiles);
    }

    outputDataBases(dataMap, ws);

    outputFileAnalysisData(fileAnalysisMap, ws);

    if (algorithm === "FP_MAX")
        Utilities.sendToServer(ws, webSocketSendMessage.execute_fp_max_msg, {fpMaxSupport});
    else if (algorithm === "TNR")
        Utilities.sendToServer(ws, webSocketSendMessage.execute_tnr_msg, {tnrConfidence, tnrK, tnrDelta});

};

const outputMetaData = (allAttributes, queryMap, metaData, ws) => {

    let entries = Array.from(allAttributes.entries());
    let queries = Array.from(queryMap.entries());

    let data = "";

    for(let x = 0; x < entries.length; x++){
        // Just while debugging is happening; remove after last queries
        // developed

        data += entries[x][1] + " " + entries[x][0] + "\n" + queries[x][0] + "\n";
        metaData[entries[x][1]] = {attr: entries[x][0], query: queries[x][0]};
    }

    Utilities.sendToServer(ws, webSocketSendMessage.learn_rules_metadata_msg, {fileName: "attribute_META_data.txt", content: data})

};

const outputFileAnalysisData = (fileAnalysisMap, ws) => {

    let entries = Array.from(fileAnalysisMap.entries());
    //console.log(fileAnalysisMap);

    let stream = "";

    for(let x = 0; x < entries.length; x++){
        stream += entries[x][0] + "\n" + entries[x][1] + "\n";
    }

    Utilities.sendToServer(ws, webSocketSendMessage.learn_rules_file_location_msg, {fileName: "fileLocations.txt", content: stream})

};


const outputDataBases = (dataMap, ws) => {
    // This variable is an array of all of our databases in the format:
    //[ ["nameOfFile.txt", "data that is going to be written into file"],
    // ["nextFile.txt", "some other data"]]
    let databases = Array.from(dataMap.entries());
    let finalFormat = formatDatabases(databases);
    // websocket seems to fail in sending large messages. Instead of sending the database as a whole, we send messages in patches.
    finalFormat.forEach((d => {
        Utilities.sendToServer(ws, webSocketSendMessage.learn_rules_databases_msg, [d])
    }))

};

const formatDatabases = (databases) => {

  // Write new contents
  var finalFormat = [];
  for (var x = 0; x < databases.length; x++){

    var table = [];
    // nameFile.txt
    var fileN = databases[x][0];
    table.push(fileN);

    var dataWritten = "";
    for(var y = 0; y < databases[x].length; y++){
      var data = databases[x][y];

      if(data !== fileN){
        for(const arr of data){
          for(const num of arr){
            dataWritten = dataWritten + num + " ";
          }
          dataWritten += "\n";
        }
        table.push(dataWritten);
      }
    }
    finalFormat.push(table);
  }
  return finalFormat;
};


export const dangerousParseMetaDataFile = (metaData) => {
    let metaDataObject = {};
    let lines = metaData.split("\n");

    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] === "") break;
        let id = lines[i].split(" ")[0];
        let attr = lines[i].substring(lines[i].indexOf(" ") + 1);
        let query = lines[i + 1];
        metaDataObject[id] = {attr: attr, query: query};
    }
    return metaDataObject;
};