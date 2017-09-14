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
            let ruleTable = this.verifyRules(data[0], data[1]);
            PubSub.publish('DISPLAY_RULES', [ruleTable, data[2]]);
        });

        // [xml, ruleTable, message.data -> filePath]
        PubSub.subscribe('CHECK_RULES_FOR_FILE', (msg, data) => {
            let ruleTable = this.checkRules(data[0], data[1], data[2]);
            PubSub.publish('DISPLAY_UPDATE_RULES_FOR_FILE', [ruleTable, data[2]]);
        });

    }

    /**
     * verify the rules for all xml files
     * @param xmlFiles : object of `filePath` and `xml`
     * @param ruleTable retrieved from ruleJson.txt
     */
    verifyRules(xmlFiles, ruleTable) {
        for (let i = 0; i < ruleTable.length; i++) {
            for (let j = 0; j < xmlFiles.length; j++)
                ruleTable[i] = this.runXPathQuery(xmlFiles[j], ruleTable[i]);
        }
        // console.log(ruleTable);

        return ruleTable;
    }


    /**
     * runs the XPath query
     * @param xmlFile
     * @param ruleI
     */
    runXPathQuery(xmlFile, ruleI) {
        let parser = new DOMParser();
        let quantifierResult = [];
        let satisfiedResult = [];

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
        let quantifierNodes = xml.evaluate(ruleI.quantifierXpath, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let quantifierNameNodes = xml.evaluate(ruleI.quantifierXpathName, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultQNode = quantifierNodes.iterateNext();
        let resultQNameNode = quantifierNameNodes.iterateNext();
        let index = 0;
        while (resultQNode) {
            let xmlAndText = this.getXmlData(xml, ruleI.quantifierXpath, index);
            quantifierResult.push({
                "filePath": xmlFile['filePath'],
                // "result": new XMLSerializer().serializeToString(resultQNode),
                "xml": xmlAndText.xmlJson,
                // "xmlText": xmlAndText.xmlText,
                "name": resultQNameNode ? new XMLSerializer().serializeToString(resultQNameNode) : "error in xpath",
                "snippet": xmlAndText.snippet
            });
            resultQNode = quantifierNodes.iterateNext();
            resultQNameNode = quantifierNameNodes.iterateNext();
            index += 1;
        }

        let satisfiedNodes = xml.evaluate(ruleI.conditionedXpath, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let satisfiedNameNodes = xml.evaluate(ruleI.conditionedXpathName, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultCNode = satisfiedNodes.iterateNext();
        let resultCNameNode = satisfiedNameNodes.iterateNext();
        index = 0;
        while (resultCNode) {
            let xmlAndText = this.getXmlData(xml, ruleI.conditionedXpath, index);
            satisfiedResult.push({
                "filePath": xmlFile['filePath'],
                // "result": new XMLSerializer().serializeToString(resultCNode),
                "xml": xmlAndText.xmlJson,
                // "xmlText": xmlAndText.xmlText,
                "name": resultCNameNode ? new XMLSerializer().serializeToString(resultCNameNode) : "error in xpath",
                "snippet": xmlAndText.snippet
            });
            resultCNode = satisfiedNodes.iterateNext();
            resultCNameNode = satisfiedNameNodes.iterateNext();
            index += 1;
        }

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
        else // TODO error prone! check this later!
            ruleI['xPathQueryResult'].filter((d) => {
                return d['filePath'] === xmlFile['filePath']
            })[0]['data'] = resultData;

        return ruleI;

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
     * re-run the xpath queries and detect changes for one file.
     * @param xmlFiles
     * @param ruleTable
     * @param filePath
     */
    checkRules(xmlFiles, ruleTable, filePath) {

        let targetXml = xmlFiles.filter((d) => {
            return d['filePath'] === filePath
        })[0];

        for (let i = 0; i < ruleTable.length; i++) {

            let ruleResultI = ruleTable[i]['xPathQueryResult'].filter((d) => {
                return d['filePath'] === filePath;
            })[0]['data'];

            // console.log(ruleResultI);

            let prevQuantifierResult = ruleResultI['quantifierResult'].slice(0);
            let prevSatisfiedResult = ruleResultI['satisfiedResult'].slice(0);
            let prevSatisfied = ruleResultI['satisfied'];
            let prevViolated = ruleResultI['violated'];

            // console.log(prevSatisfied, prevMissing);

            ruleTable[i] = this.runXPathQuery(targetXml, ruleTable[i]);

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

        let par, nameIndex;
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


        let fileName = par.getAttribute("filename");
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