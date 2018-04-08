/**
 * Created by saharmehrpour on 9/5/17.
 */

import PubSub from 'pubsub-js';
import Utilities from './utilities';

class RuleExecutor {

    constructor() {
        this.attachListener();
    }

    /**
     * Attach listeners
     */
    attachListener() {

        // [xml, ruleTable, tagTable]
        PubSub.subscribe('VERIFY_RULES', (msg, data) => {
            let ruleTable = this.checkRulesForAll(data[0], data[1]);
            PubSub.publish('DISPLAY_RULES', [ruleTable, data[2]]);
        });

        // [xml, ruleTable, filePath]
        PubSub.subscribe('CHECK_RULES_FOR_FILE', (msg, data) => {
            let ruleTable = this.checkRulesForFile(data[0], data[1], data[2]);
            PubSub.publish('DISPLAY_UPDATE_RULES_FOR_FILE', [ruleTable, data[2]]);
        });

        // [xml, ruleTable, tagTable]
        PubSub.subscribe('VERIFY_RULE', (msg, data) => {
            data[1][data[1].length - 1] = this.runRulesByTypes(data[0], data[1][data[1].length - 1]);
            PubSub.publish('DISPLAY_RULES', [data[1], data[2]]);
            PubSub.publish('UPDATE_HASH', ['rule', data[1][data[1].length - 1].index]);
        });


    }

    /**
     * verify the rules for all xml files
     * @param xmlFiles : object of `filePath` and `xml`
     * @param ruleTable retrieved from ruleJson.txt
     */
    checkRulesForAll(xmlFiles, ruleTable) {
        for (let i = 0; i < ruleTable.length; i++)
            ruleTable[i] = this.runRulesByTypes(xmlFiles, ruleTable[i]);

        return ruleTable;
    }

    /**
     * re-run the xpath queries and detect changes for one file.
     * @param xmlFiles
     * @param ruleTable
     * @param filePath
     */
    checkRulesForFile(xmlFiles, ruleTable, filePath) {

        let targetXml = xmlFiles.filter((d) => {
            return d['filePath'] === filePath
        });

        for (let i = 0; i < ruleTable.length; i++) {

            if (ruleTable[i]['xPathQueryResult'].filter((d) => {
                    return d['filePath'] === filePath;
                }).length === 0)
                continue;

            let ruleResultI = ruleTable[i]['xPathQueryResult'].filter((d) => {
                return d['filePath'] === filePath;
            })[0]['data'];

            // console.log(ruleResultI);

            let prevQuantifierResult = ruleResultI['quantifierResult'].slice(0);
            let prevSatisfiedResult = ruleResultI['satisfiedResult'].slice(0);
            let prevSatisfied = ruleResultI['satisfied'];
            let prevViolated = ruleResultI['violated'];

            // console.log(prevSatisfied, prevViolated);

            ruleTable[i] = this.runRulesByTypes(targetXml, ruleTable[i]);

            ruleResultI = ruleTable[i]['xPathQueryResult'].filter((d) => {
                return d['filePath'] === filePath;
            })[0]['data'];

            // console.log(ruleResultI);

            ruleResultI['changed'] = (!Utilities.ResultArraysEqual(prevQuantifierResult, ruleResultI['quantifierResult']) ||
                !Utilities.ResultArraysEqual(prevSatisfiedResult, ruleResultI['satisfiedResult']) ||
                prevSatisfied !== ruleResultI['satisfied'] ||
                prevViolated !== ruleResultI['violated']);

            ruleResultI['violatedChanged'] = (prevViolated < ruleResultI['violated'] ? 'greater' :
                prevViolated > ruleResultI['violated'] ? 'smaller' : 'none');
            ruleResultI['satisfiedChanged'] = (prevSatisfied < ruleResultI['satisfied'] ? 'greater' :
                prevSatisfied > ruleResultI['satisfied'] ? 'smaller' : 'none');
            ruleResultI['allChanged'] = ((prevSatisfied + prevViolated) < (ruleResultI['violated'] + ruleResultI['satisfied']) ? 'greater' :
                (prevSatisfied + prevViolated) > (ruleResultI['violated'] + ruleResultI['satisfied']) ? 'smaller' : 'none');

        }
        return ruleTable;
    }


    /**
     * find relevant xml files based on the rule 'checkFor' property
     * and call respective methods based on 'ruleType' property of the rule.
     * @param xmlFiles
     * @param ruleI
     * @returns ruleI
     */
    runRulesByTypes(xmlFiles, ruleI) {

        let xmlFilesToVerify = [];
        let checkForFiles = ruleI['ruleType']['checkFor'].slice(0); // deep copy


        switch (ruleI['ruleType']['constraint']) {
            case 'NONE':
                xmlFilesToVerify = xmlFiles.slice(0); // deep copy
                break;

            case 'SOME':
                for (let j = 0; j < checkForFiles.length; j++)
                    // Warning
                    // This can lead to error if fileName is saved as X.java in ruleJson.txt and there exists also aX.java
                    xmlFilesToVerify = xmlFilesToVerify.concat(xmlFiles.filter((d) => d['filePath'].endsWith(checkForFiles[j])));
                break;

            case 'EXCEPT':
                xmlFilesToVerify = xmlFiles.filter((d) => {
                    for (let j = 0; j < checkForFiles.length; j++)
                        // Warning
                        // This can lead to error if fileName is saved as X.java in ruleJson.txt and there exists also aX.java
                        if (d['filePath'].endsWith(checkForFiles[j])) {
                            checkForFiles.splice(j, 1);
                            return false;
                        }
                    return true;
                });
                break;

            case 'FOLDER':
                for (let j = 0; j < checkForFiles.length; j++)
                    // Warning
                    // This can lead to error if the target folder is X in ruleJson.txt and there exists also a folder Xy
                    xmlFilesToVerify = xmlFilesToVerify.concat(xmlFiles.filter((d) => d['filePath'].indexOf(checkForFiles[j]) !== -1));
                break;

            case 'FOLDER EXCEPT':
                for (let j = 0; j < checkForFiles[0].length; j++)
                    // Warning
                    // This can lead to error if the target folder is X in ruleJson.txt and there exists also a folder Xy
                    xmlFilesToVerify = xmlFilesToVerify.concat(xmlFiles.filter((d) => d['filePath'].indexOf(checkForFiles[0][j]) !== -1));

                xmlFilesToVerify = xmlFilesToVerify.filter((d) => {
                    for (let j = 0; j < checkForFiles[1].length; j++)
                        // Warning
                        // This can lead to error if fileName is saved as X.java in ruleJson.txt and there exists also aX.java
                        if (d['filePath'].endsWith(checkForFiles[1][j]))
                            return false;
                    return true;
                });
                break;

            case 'FOLDER SOME':
                for (let j = 0; j < checkForFiles[0].length; j++)
                    // Warning
                    // This can lead to error if the target folder is X in ruleJson.txt and there exists also a folder Xy
                    xmlFilesToVerify = xmlFilesToVerify.concat(xmlFiles.filter((d) => d['filePath'].indexOf(checkForFiles[0][j]) !== -1));

                xmlFilesToVerify = xmlFilesToVerify.filter((d) => {
                    for (let j = 0; j < checkForFiles[1].length; j++)
                        // Warning
                        // This can lead to error if fileName is saved as X.java in ruleJson.txt and there exists also aX.java
                        if (d['filePath'].endsWith(checkForFiles[1][j]))
                            return true;
                    return false;
                });
                break;

            default:
                console.log('error in XML: ruleTable[index=' + ruleI['index'] + '][\'constraint\']');
                return ruleI;
        }


        if (ruleI['ruleType']['type'] === 'WITHIN') {
            for (let j = 0; j < xmlFilesToVerify.length; j++)
                ruleI = this.runXPathQueryWithin(xmlFilesToVerify[j], ruleI);
        }
        else if (ruleI['ruleType']['type'] === 'BETWEEN') {
            ruleI = this.runXpathQueryBetween(xmlFilesToVerify, ruleI);
        }
        else if (ruleI['ruleType']['type'] === 'MIXED') {
            ruleI = this.runXpathQueryMixed(xmlFilesToVerify, ruleI);
        }

        return ruleI;
    }


    /**
     * run xPath queries for rules that hold for each file independently
     * @param xmlFile
     * @param ruleI
     * @returns ruleI
     */
    runXPathQueryWithin(xmlFile, ruleI) {

        let quantifierResult = this.runXPathQuery(xmlFile, ruleI, 'quantifier');
        let satisfiedResult = this.runXPathQuery(xmlFile, ruleI, 'conditioned');

        // compare results
        let violatedResult = this.violatedResults(quantifierResult, satisfiedResult);

        let resultData = {
            'quantifierResult': quantifierResult,
            'satisfiedResult': satisfiedResult,
            'violatedResult': violatedResult,
            'satisfied': quantifierResult.length - violatedResult.length,
            'violated': violatedResult.length
        };

        if (!ruleI.hasOwnProperty('xPathQueryResult'))
            ruleI['xPathQueryResult'] = [];

        let resultArray = ruleI['xPathQueryResult'].filter((d) => {
            return d['filePath'] === xmlFile['filePath']
        });

        if (resultArray.length === 0)
            ruleI['xPathQueryResult'].push({'filePath': xmlFile['filePath'], 'data': resultData});
        else {
            if (ruleI['xPathQueryResult'].filter((d) => {
                    return d['filePath'] === xmlFile['filePath']
                }).length > 0)
                ruleI['xPathQueryResult'].filter((d) => {
                    return d['filePath'] === xmlFile['filePath']
                })[0]['data'] = resultData;
        }

        return ruleI;

    }


    /**
     * << NOT tested yet >>
     * run xPath queries for rules that depends on several files
     * @param xmlFiles
     * @param ruleI
     * @returns ruleI
     */
    runXpathQueryBetween(xmlFiles, ruleI) {

        let quantifierResult = [];
        let conditionedResult = [];
        for (let j = 0; j < xmlFiles.length; j++) {
            quantifierResult = quantifierResult.concat(this.runXPathQuery(xmlFiles[j], ruleI, 'quantifier'));
            conditionedResult = conditionedResult.concat(this.runXPathQuery(xmlFiles[j], ruleI, 'conditioned'));
        }
        // compare results
        let violatedResult = this.violatedResults(quantifierResult, conditionedResult);

        let resultData = {
            'quantifierResult': quantifierResult,
            'satisfiedResult': conditionedResult,
            'violatedResult': violatedResult,
            'satisfied': quantifierResult.length - violatedResult.length,
            'violated': violatedResult.length
        };

        if (!ruleI.hasOwnProperty('xPathQueryResult'))
            ruleI['xPathQueryResult'] = [];

        ruleI['xPathQueryResult'].push({'filePath': 'MIXED', 'data': resultData});

        return ruleI;

    }


    /**
     * run Xpath query when a group has multiple commands
     * @param xmlFiles
     * @param ruleI
     * @returns {*}
     */
    runXpathQueryMixed(xmlFiles, ruleI) {

        let quantifierResult = [];
        let conditionedResult = [];

        if (ruleI['quantifier'].hasOwnProperty('type') && ruleI['quantifier']['type'] === 'FIND_FROM_TEXT')
            quantifierResult = this.findFromText(xmlFiles, ruleI, 'quantifier');
        else if (ruleI['quantifier'].hasOwnProperty('type') && ruleI['quantifier']['type'] === 'RETURN_TO_BASE')
            quantifierResult = this.findAndReturnToBase(xmlFiles, ruleI, 'quantifier');
        else
            for (let j = 0; j < xmlFiles.length; j++)
                quantifierResult = quantifierResult.concat(this.runXPathQuery(xmlFiles[j], ruleI, 'quantifier'));


        if (ruleI['conditioned'].hasOwnProperty('type') && ruleI['conditioned']['type'] === 'FIND_FROM_TEXT')
            conditionedResult = this.findFromText(xmlFiles, ruleI, 'conditioned');
        else if (ruleI['conditioned'].hasOwnProperty('type') && ruleI['conditioned']['type'] === 'RETURN_TO_BASE')
            conditionedResult = this.findAndReturnToBase(xmlFiles, ruleI, 'conditioned');
        else
            for (let j = 0; j < xmlFiles.length; j++)
                conditionedResult = conditionedResult.concat(this.runXPathQuery(xmlFiles[j], ruleI, 'conditioned'));


        // console.log(ruleI['quantifier'], quantifierResult);
        // console.log(ruleI['conditioned'], conditionedResult);


        // compare results
        let violatedResult = this.containResults(conditionedResult, quantifierResult);

        let resultData = {
            'quantifierResult': quantifierResult,
            'satisfiedResult': conditionedResult,
            'violatedResult': violatedResult,
            'satisfied': quantifierResult.length - violatedResult.length,
            'violated': violatedResult.length
        };

        if (!ruleI.hasOwnProperty('xPathQueryResult'))
            ruleI['xPathQueryResult'] = [];

        ruleI['xPathQueryResult'].push({'filePath': 'MIXED', 'data': resultData});

        // console.log(ruleI.index, resultData);
        return ruleI;

    }


    /**
     * When a group consists of two commands, the first command
     * @param xmlFiles
     * @param ruleIOrg
     * @param group
     * @returns {Array}
     */
    findFromText(xmlFiles, ruleIOrg, group) {
        let result1 = [], result2 = [];
        let ruleI = Utilities.cloneJSON(ruleIOrg);

        ruleI[group]['command'] = ruleI[group]['command1'];
        for (let j = 0; j < xmlFiles.length; j++) {
            result1 = result1.concat(this.runXPathQuery(xmlFiles[j], ruleI, group));
        }

        for (let i = 0; i < result1.length; i++) {
            ruleI[group]['command'] = ruleI[group]['command2'].replace('<TEMP>', result1[i].snippet);
            for (let j = 0; j < xmlFiles.length; j++) {
                result2 = result2.concat(this.runXPathQuery(xmlFiles[j], ruleI, group));
            }
        }
        return result2;
    }


    /**
     * When a group consists of tree commands, the first and last command is on the same file
     * @param xmlFiles
     * @param ruleIOrg
     * @param group
     * @returns {Array}
     */
    findAndReturnToBase(xmlFiles, ruleIOrg, group) {
        let result1, result2, result3 = [];
        let ruleI = Utilities.cloneJSON(ruleIOrg);

        for (let base = 0; base < xmlFiles.length; base++) {
            ruleI[group]['command'] = ruleI[group]['command1'];
            result1 = this.runXPathQuery(xmlFiles[base], ruleI, group);

            for (let i = 0; i < result1.length; i++) {
                for (let j = 0; j < xmlFiles.length; j++) {
                    ruleI[group]['command'] = ruleI[group]['command2'].replace(new RegExp('<TEMP>', 'g'), result1[i].snippet);
                    result2 = this.runXPathQuery(xmlFiles[j], ruleI, group);

                    for (let k = 0; k < result2.length; k++) {
                        ruleI[group]['command'] = ruleI[group]['command3'].replace('<TEMP>', result2[k].snippet);
                        result3 = result3.concat(this.runXPathQuery(xmlFiles[base], ruleI, group));
                    }

                }
            }
        }
        return result3;
    }


    /**
     * runs the XPath query and compare results
     * @param xmlFile
     * @param ruleI
     * @param group either 'quantifier' or 'conditioned'
     */
    runXPathQuery(xmlFile, ruleI, group) {
        let parser = new DOMParser();
        let result = [];

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(xmlFile['xml'], "text/xml");
        if (!xml.evaluate) {
            console.log('error in xml.evaluate');
            return;
        }

        // run xpath queries
        let quantifierNodes = xml.evaluate(ruleI[group]['command'], xml, nsResolver, XPathResult.ANY_TYPE, null);
        // let quantifierNameNodes = xml.evaluate(ruleI[group]['command'], xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultQNode = quantifierNodes.iterateNext();
        // let resultQNameNode = quantifierNameNodes.iterateNext();
        let index = 0;
        while (resultQNode) {
            let xmlAndText = this.getXmlData(xml, ruleI[group]['command'], index);
            result.push({
                "filePath": xmlFile['filePath'],
                // "result": new XMLSerializer().serializeToString(resultQNode),
                "xml": xmlAndText.xmlJson,
                // "xmlText": xmlAndText.xmlText,
                // "name": resultQNameNode ? new XMLSerializer().serializeToString(resultQNameNode) : "error in xpath",
                "snippet": xmlAndText.snippet
            });
            resultQNode = quantifierNodes.iterateNext();
            // resultQNameNode = quantifierNameNodes.iterateNext();
            index += 1;
        }

        return result;

    }


    /**
     * compare the quantifier and the result
     * @param quantifierResult
     * @param satisfiedResult
     */
    violatedResults(quantifierResult, satisfiedResult) {

        let matches = [];
        let mismatches = [];

        let sliceArr = satisfiedResult.slice(0);
        for (let i = 0; i < quantifierResult.length; i++) {
            let found = false;
            for (let j = 0; j < sliceArr.length; j++) {
                // TODO find a better comparison measures
                if (quantifierResult[i]['snippet'] === sliceArr[j]['snippet']) {
                    matches.push(quantifierResult[i]);
                    sliceArr.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                mismatches.push(quantifierResult[i]);
            }
        }

        return mismatches;
    }


    /**
     * check if all elements of a sample array exists in the container array
     * repetition is allowed
     * @param containerResult
     * @param sampleResult
     * @returns {Array}
     */
    containResults(containerResult, sampleResult) {
        let matches = [];
        let mismatches = [];

        for (let i = 0; i < sampleResult.length; i++) {
            let found = false;
            for (let j = 0; j < containerResult.length; j++) {
                // TODO find a better comparison measures
                if (sampleResult[i]['snippet'] === containerResult[j]['snippet']) {
                    matches.push(sampleResult[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                mismatches.push(sampleResult[i]);
            }
        }

        return mismatches;
    }


    /**
     * remove the following nodes.The resulting xml is sent to the server to be processed by srcML
     * and find the line number.
     * @param mainXml
     * @param query
     * @param index
     */
    getXmlData(mainXml, query, index) {

        // passing the nodes and working with that changes the main XML
        // and produces error for next nodes in the same query.

        let xml = Utilities.cloneXML(mainXml);

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        let nodes = xml.evaluate(query, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let res = nodes.iterateNext();
        let i = 0;
        while (i < index) {
            res = nodes.iterateNext();
            i += 1;
        }

        // TODO extract better snippet
        // get the first two line
        let resTextArray = new XMLSerializer().serializeToString(res).split(/\r?\n/);
        let resText = resTextArray.length > 1 ? resTextArray[0] + '\n' + resTextArray[1] : resTextArray[0];


        /**
         * remove first node sib, sib, parent sib, grandparent sib, grand-grandparent sib, ... <- recursive
         * @param node
         * @returns {*}
         */
        function removeSib(node) {
            if (node.nodeName === 'unit')
                return node;
            let sib = node.nextSibling;
            while (sib && sib.nodeType !== -1) {
                node.parentNode.removeChild(sib);
                sib = node.nextSibling;
            }
            return removeSib(node.parentNode);
        }


        let par = res, nameIndex, fileName = "";
        if (res.children) {

            for (nameIndex = 0; nameIndex < res.children.length; nameIndex++)
                if (res.children[nameIndex].tagName.toString() === 'name') {
                    break;
                }

            if (res.firstChild && res.firstChild.nodeType !== -1 && nameIndex !== -1 && nameIndex !== res.children.length)
                par = removeSib(res.children[nameIndex]);
            else if (res.nextSibling)
                par = removeSib(res.nextSibling);
            else
                par = res;

            fileName = par.getAttribute("filename");
        }


        let temp = new XMLSerializer().serializeToString(par);
        return {
            'xmlJson': {
                'fileName': fileName,
                'xml': temp
            },
            'xmlText': new XMLSerializer().serializeToString(par),
            'snippet': resText
        };

    }

}

/**
 * Factory method to create a new app instance
 * @returns {RuleExecutor}
 */
export function create() {
    return new RuleExecutor();
}