/*
 * This code is written by Genni Mansi.
 * Edited by Sahar Mehrpour
 * Nov 2019
 */

import fs from 'fs';

import {addClassAnnotations, addClsFunctions, addConstructors, addImplementations,
    addMemberVars, findClassAnnotations, findClsFunctions, findConstructors,
    findImplements, findMemberVars} from "./sci_functions";

let et = require('elementtree'); // todo import?


export const outputMetaData = (allAttributes, outputFile, queryMap) => {

    let entries = Array.from(allAttributes.entries());
    let queries = Array.from(queryMap.entries());

    let data = "";

    for(let x = 0; x < entries.length; x++){
        // Just while debugging is happening; remove after last queries
        // developed

        data += entries[x][1] + " " + entries[x][0] + "\n" + queries[x][0] + "\n";
    }

    fs.appendFile(outputFile, data, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    });
};

export const makePairsList = (classRoot, childParent, classLocations) => {

    let childName = "DOES NOT EXIST";
    let parentName = "DOES NOT EXIST";

    let cls = classRoot.findall('.//class');

    for(let i = 0 ; i < cls.length; i++){

        // Figure out what the child class's name is
        let chName = cls[i].find('name');
        //console.log(chName);
        if(chName === null){
            continue;
        }

        if(chName.text === null){
            childName = (chName.find('name')).text
        }
        else{
            childName = chName.text;

            if(childName !== ''){
                classLocations[childName] = classRoot.find('[@filename]').get('filename');
            }

        }
        // If we can't find a name, then we go on to the next class in
        // the srcML file
        if(childName === ''){
            continue;
        }

        let ext = cls[i].find(".//super/extends");
        if (ext !== null){

            let ptName = ext.find('name');

            if(ptName.text === ''){
                parentName = (ptName.find('name')).text;
            }
            else{
                parentName = ptName.text;
            }

            // If we can't find the parent name, then we go ahead append
            // and skip past this case
            if (parentName === null){
                continue;
            }

            if (!childParent.has(parentName)){
                childParent.set(parentName, [childName]);
            }
            else{
                childParent.get(parentName).push(childName);
            }
        }

    }

};


export const addChildren = (parent, childParent, groupID, currDepth, groupList) => {

    if (currDepth <= 0 || !childParent.has(parent)){
        return parent;
    }

    for (let i = 0; i < childParent.get(parent).length; i++){

        let nextChild = addChildren((childParent.get(parent))[i], childParent, groupID, currDepth - 1, groupList);

        if (!groupList.has(groupID)){
            groupList.set(groupID, [nextChild]);
        }
        else{
            groupList.get(groupID).push(nextChild);
        }

    }

    return parent;
};


export const addParentChildRelations = (id_start, classGroupings, attributeList, classLocations, parentInfo, queryMap) => {

    let parentClass = classGroupings[classGroupings.length-1];
    let subCLfncs = [];
    let classTree;
    // Get all the children classes' info

    // This array is to keep track of what functions are overridden in
    // the child class; we assume they are overridden, but once we
    // find a class that doesn't override a parent function we set that
    // element to False

    for(let i = 0; i < classGroupings.length; i++){

        let f = classLocations[classGroupings[i]];

        if(f !== undefined){
            f = f.split("\\")[(f.split("\\")).length - 1];
            f = f.split(".")[0] + ".xml";

            let data = fs.readFileSync(f).toString();
            classTree = et.parse(data); // todo

        }
        else{
            continue;
        }

        let subCL = classTree.findall('.//class');
        let childName;
        for(let j = 0; j < subCL.length; j++){
            // Figure out what the child class's name is
            let chName = subCL[j].find('name');

            if(chName === null){
                continue;
            }

            if(chName.text === null){
                childName = (chName.find('name')).text
            }
            else{
                childName = chName.text;
            }
            // If we can't find a name, then we go on to the next class in
            // the srcML file
            if(childName === ''){
                continue;
            }

            // Each xml file might contain multiple classes, so just because setInterval(function () {
            // is in the file, doesn't mean that it is the one that we want, so
            // we need to check that the filename is in classGroupings
            if(classGroupings.includes(childName)){

                if(parentInfo.get(parentClass) !== undefined){

                    // This will contain a list of functions that are present in both
                    // the parent class and the child class.
                    let matchingFunctions;
                    if (parentClass !== childName){

                        // First get a list of all the child functions
                        let fncs = subCL[j].findall('block/function');

                        for (let k = 0; k < fncs.length; k++){
                            subCLfncs.push((fncs[k].find('name')).text);
                        }

                        subCLfncs.sort();

                        // Then see what functions are in common between the two lists;
                        // If there are matching functions, then matchingFunctions will
                        // contain their names.
                        matchingFunctions = subCLfncs.filter(element => (parentInfo.get(parentClass).functions).includes(element));

                        subCLfncs.length = 0;

                    }
                    // Come here and output attribute about parent functions matching
                    // Clear out matching functions here as well
                    if(matchingFunctions !== null){
                        for (let m = 0; m < matchingFunctions.length; m++){

                            let name = "class overrides function of name \""
                                + matchingFunctions[m]
                                + "\" in parent class";

                            // Check if this attribute has been seen globally
                            if(!attributeList.has(name)){

                                let command = "//src:function[src:annotation/src:name/text()=\"Override\""
                                    + "and src:name/text()=\"" + matchingFunctions[m]
                                    + "\"]";
                                //console.log(command);

                                attributeList.set(name, id_start.id);
                                queryMap.set(command, id_start.id);

                                id_start.id += 1;
                            }
                            name = "";

                        }
                        matchingFunctions.length = 0;
                        matchingFunctions = [];
                    }
                }

                // Finds attributes having to do with the annotations above the class
                findClassAnnotations(subCL[j], attributeList, id_start, queryMap);

                // Finds attributes having to do with the constructors in the
                // class
                findConstructors(subCL[j], attributeList, id_start, queryMap);

                // Finds attributes having to do with member variables
                findMemberVars(subCL[j], attributeList, id_start, queryMap);

                // Finds attributes having to do with class implementations
                findImplements(subCL[j], attributeList, id_start, queryMap);

                // Finds attributes about class visibility and class functions
                findClsFunctions(subCL[j], attributeList, id_start, queryMap);

            }
        }
    }

};


export const findParentChildRelations = (allAttributes, classGroupings,
                                            analysisFileName, classLocations,
                                            parentInfo, fileAnalysisMap) => {

    let parentClass = classGroupings[classGroupings.length-1];
    let subCLfncs = [];
    let classTree;

    // Empty the analysisFile first in case anything has been written before
    fileN = analysisFileName + "_subClassOf" + parentClass + ".txt";
    let d = "";
    fs.writeFile(fileN, d, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    });

    // Used to keep track of all the files we have accessed
    let listOfFiles = [];

    // This array is to keep track of what functions are overridden in
    // the child class; we assume they are overridden, but once we
    // find a class that doesn't override a parent function we set that
    // element to False

    for(let i = 0; i < classGroupings.length; i++){

        let f = classLocations[classGroupings[i]];

        if(f !== undefined){
            f = f.split("\\")[(f.split("\\")).length - 1]
            f = f.split(".")[0] + ".xml";

            let data = fs.readFileSync(f).toString();
            classTree = et.parse(data);

        }
        else{
            continue;
        }

        let attributes = [];
        let subCL = classTree.findall('.//class');
        let childName;
        for(let j = 0; j < subCL.length; j++){
            // Figure out what the child class's name is
            let chName = subCL[j].find('name');

            if(chName === null){
                continue;
            }

            if(chName.text === null){
                childName = (chName.find('name')).text
            }
            else{
                childName = chName.text;
            }
            // If we can't find a name, then we go on to the next class in
            // the srcML file
            if(childName === ''){
                continue;
            }

            // Each xml file might contain multiple classes, so just because setInterval(function () {
            // is in the file, doesn't mean that it is the one that we want, so
            // we need to check that the filename is in classGroupings
            if(classGroupings.includes(childName)){

                if(parentInfo.get(parentClass) !== undefined){

                    let parentFncsOverridden = new Array((parentInfo.get(parentClass).length)).fill(true);
                    // This will contain a list of functions that are present in both
                    // the parent class and the child class.
                    let matchingFunctions;
                    if (parentClass !== childName){

                        // First get a list of all the child functions
                        let fncs = subCL[j].findall('block/function');

                        for (let k = 0; k < fncs.length; k++){

                            subCLfncs.push((fncs[k].find('name')).text);

                        }

                        subCLfncs.sort();

                        // Then see what functions are in common between the two lists;
                        // If there are matching functions, then matchingFunctions will
                        // contain their names.
                        matchingFunctions = subCLfncs.filter(element => (parentInfo.get(parentClass).functions).includes(element));

                        subCLfncs.length = 0;

                    }
                    // Come here and output attribute about parent functions matching
                    // Clear out matching functions here as well
                    if(matchingFunctions !== null){
                        for (let m = 0; m < matchingFunctions.length; m++){

                            let name = "class overrides function of name \""
                                + matchingFunctions[m]
                                + "\" in parent class";

                            // Check if this attribute has been seen globally
                            if(!allAttributes.has(name)){
                                attributes.push(allAttributes.get(name));
                            }
                            name = "";
                        }

                        matchingFunctions.length = 0;
                        matchingFunctions = [];

                    }
                }

                // Adds attributes having to do with the annotations above the class
                addClassAnnotations(subCL[j], attributes, allAttributes);

                // Adds attributes having to do with the constructors in the class
                addConstructors(subCL[j], attributes, allAttributes);

                // Adds attributes having to do with the member variables in the class
                addMemberVars(subCL[j], attributes, allAttributes);

                addImplementations(subCL[j], attributes, allAttributes);

                // Adds attributes about class visibility and class functions
                addClsFunctions(subCL[j], attributes, allAttributes);

                // This is the file we will be outputting to
                fileN = analysisFileName + "_subClassOf" + parentClass + ".txt";

                // Output attributes found to database
                // Current FP Growth implementation will stop when it reads a newline
                // so we don't want it to output newlines when attributes is empty
                if(attributes.length > 0){
                    // Remove duplicate elements from attributes
                    let finalList = attributes.filter(function(elem, pos) {
                        return attributes.indexOf(elem) === pos;
                    });

                    // By default the JavaScript sort() method will sort values as strings
                    // in alphabetical ascending order; if numbers are sorted as strings,
                    // then "6" is bigger than "542", so we have to supply a sort function
                    // that we define
                    // Sort the attributes we found in ascending order
                    finalList.sort((a,b)=> a-b);

                    //console.log(finalList);

                    let data = finalList.join(" ") + "\n";

                    let stream = fs.createWriteStream(fileN, {flags:'a'});
                    stream.write(data);
                    stream.end();
                    /*
                    fs.appendFile(fileN, data, (err) => {
                    // In case of a error throw err.
                    if (err) throw err;
                  });*/

                }

                attributes.length = 0;
                attributes = [];

                if (!listOfFiles.includes(f)){
                    listOfFiles.push(f);
                }
            }
        }
    }// End of outermost for loop

    // Record that this file was used to contribute to this database
    let fileN = analysisFileName + "_subClassOf" + parentClass + ".txt";
    let newStuff = listOfFiles.join("\n");

    fileAnalysisMap.set(fileN, newStuff);


};

export const outputFileAnalysisData = (fileAnalysisMap) => {

    let entries = Array.from(fileAnalysisMap.entries());
    //console.log(fileAnalysisMap);

    let fileN = "fileLocations.txt";
    let stream = fs.createWriteStream(fileN, {flags:'w'});

    for(let x = 0; x < entries.length; x++){

        stream.write(entries[x][0]);
        stream.write("\n");
        stream.write(entries[x][1]);
        stream.write("\n");

    }
};