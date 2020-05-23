/**
 * Created by saharmehrpour on 9/8/17.
 */

class Utilities {

    static BREAK_LINE = 9000;
    /**
     * send the message to the server
     * @param ws web socket
     * @param command
     * @param data
     */
    static sendToServer(ws, command, data) {
        let messageJson = {"source": "WEB", "destination": "IDEA", "command": command};

        if (ws) {
            switch (command) {
                case "MODIFIED_RULE":
                    messageJson.data = {
                        ruleID: data.ID,
                        ruleInfo: data
                    };
                    break;
                case "MODIFIED_TAG":
                    messageJson.data = {
                        tagID: data.ID,
                        tagInfo: data
                    };
                    break;
                case "XML_RESULT":
                    messageJson.data = {
                        filePath: data.filePath,
                        xml: data.xml
                    };
                    break;

                case "EXPR_STMT":
                    messageJson.data = {
                        codeText: data.codeText,
                        messageID: data.messageID
                    };
                    break;


                case "NEW_RULE":
                    messageJson.data = {
                        ruleID: data.ID,
                        ruleInfo: data
                    };
                    break;
                case "NEW_TAG":
                    messageJson.data = {
                        tagID: data.ID,
                        tagInfo: data
                    };
                    break;

                    /*  mining rules  */

                case "LEARN_RULES_META_DATA":
                    if (data.content.length > this.BREAK_LINE) {
                        this.sendChunkedData(messageJson, data.content.slice(0), data.fileName, ws);
                        return;
                    }
                    messageJson.data = [[data.fileName, data.content]];
                    break;

                case "LEARN_RULES_FILE_LOCATIONS":
                    if (data.content.length > this.BREAK_LINE) {
                        this.sendChunkedData(messageJson, data.content.slice(0), data.fileName, ws);
                        return;
                    }
                    messageJson.data = [[data.fileName, data.content]];
                    break;

                case "LEARN_RULES_DATABASES":
                    if (data[0][1].length > this.BREAK_LINE) {
                        this.sendChunkedData(messageJson, data[0][1].slice(0), data[0][0], ws);
                        return;
                    }
                    messageJson.data = data; // array of arrays: [["file_name.txt", "data to be written"]]
                    break;

                case "EXECUTE_TNR":
                    messageJson.data = {
                        confidence: data.tnrConfidence, // double
                        k: data.tnrK, //int
                        delta: data.tnrDelta // int
                    };
                    break;

                case "EXECUTE_FP_MAX":
                    messageJson.data = data.fpMaxSupport; // support
                    break;

                case "OPEN_FILE":
                    messageJson["command"] = "XML_RESULT"; // there is no separate command in the server
                    messageJson.data = {
                        fileName: data,
                        xml: "<unit xmlns=\"http://www.srcML.org/srcML/src\" revision=\"0.9.5\" language=\"Java\">\n" +
                            "</unit>"
                    };
                    break;

                case "DANGEROUS_READ_MINED_RULES":
                    messageJson["command"] = "DANGEROUS_READ_MINED_RULES";
                    break;

                default:
                    break;
            }

            ws.send(JSON.stringify(messageJson));
        }
    }

    /**
     * websocket cannot send data larger than 64KB. Here the function
     * break the data to smaller pieces for transfer
     * @param messageJson  data: [[fileName, initData]]
     * @param initData
     * @param fileName
     * @param ws
     */
    static sendChunkedData (messageJson, initData, fileName, ws) {
        messageJson["command"] += "_APPEND";
        let start = 0; let cnt = 0;
        while (start < initData.length) {
            messageJson.data = [[fileName, initData.substring(start, Math.min(start + this.BREAK_LINE, initData.length))]];
            messageJson["part"] = cnt; // only for debugging
            ws.send(JSON.stringify(messageJson));
            start += this.BREAK_LINE;
            cnt ++;
        }
    }

    /**
     * check whether two arrays are equals
     * @param array1
     * @param array2
     * @returns {boolean}
     */
    static ResultArraysEqual(array1, array2) {

        let arr1 = array1.slice(0);
        let arr2 = array2.slice(0);

        if (arr1.length !== arr2.length)
            return false;
        for (let i = arr2.length; i--;) {

            let item = arr1.filter((d) => d.name === arr2[i].name);
            if (item.length === 0)
                return false;

            // only remove one occurrence
            let removed = false;
            arr1 = arr1.filter((d) => {
                if (!removed && d.name === arr2[i].name) {
                    removed = !removed;
                    return false;
                }
                return true;
            });
        }
        return true;
    }

    /**
     * deep copy of an xml data
     * @param xml
     * @returns {Document}
     */
    static cloneXML(xml) {
        let newDocument = xml.implementation.createDocument(
            xml.namespaceURI, //namespace to use
            "",                     //name of the root element (or for empty document)
            null                      //doctype (null for XML)
        );
        let newNode = newDocument.importNode(
            xml.documentElement, //node to import
            true                         //clone its descendants
        );
        newDocument.appendChild(newNode);

        return newDocument;
    }

    /**
     * deep copy of a JSON data
     * @param json
     * @returns
     */
    static cloneJSON(json) {

        let newObj = {};
        for (let ky in json)
            newObj[ky] = json[ky];

        return newObj;
    }

    /**
     * check whether one array contains all elements of the other array
     * @param container
     * @param arr
     * @returns {boolean}
     */
    static arrayContains(container, arr) {
        let arrContainer = container.slice(0);

        for (let i = arr.length; i--;) {
            if (arrContainer.indexOf(arr[i]) === -1)
                return false;
            arrContainer.splice(arrContainer.indexOf(arr[i]), 1)
        }
        return true;
    }


    /**
     * move an array element from old_index to new_index
     * @param arr array of elements
     * @param old_index origin
     * @param new_index destination
     * @returns {*}
     */
    static arrayMove(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing purposes
    };


}


export default Utilities;
