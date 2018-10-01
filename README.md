# Active Documentation

This app is written in "React" framework.
It communicates with the server using "Web-Socket".


## ruleJson.txt

There must be a file name `ruleJson.txt` in the project folder in which all rules are stored. Here is an example for this file:

```
[
    {
        "index": 1,
        "title": "All Buttons must have a title",
        "description": "IF a JButton is created\nTHEN it should be initialized and have a title upon creating.",
        "tags": [
            "Labeling"
        ],
        "ruleType": {
            "constraint": "FOLDER",
            "checkFor": [
                "src"
            ],
            "type": "WITHIN"
        },
        "quantifier": {
            "detail": "JButtons",
            "command": "src:unit/src:class/src:block//src:decl_stmt/src:decl[src:type/src:name/text()=\"JButton\"]"
        },
        "constraint": {
            "detail": "JButtons with labels in constructor",
            "command": "src:unit/src:class/src:block//src:decl_stmt/src:decl[src:type/src:name/text()=\"JButton\" and count(src:init/src:expr/src:call/src:argument_list/src:argument)>0]"
        }
    },
    {
       "index": 6,
       "title": "Communication between artifacts should be indirected through a Command",
       "description": "IF an Artifact needs to communicate with another artifact\nTHEN it should create a Command describing the desired action to be performed.\nEach Artifact exists in a separate shard, which may execute in parallel on a separate server. An artifact may communicate with another artifact by creating a Command which describes the action that it wishes the receiving Artifact to perform.",
       "tags": [
            "Sharding",
            "Command",
            "Entity",
            "Persistence"
       ],
       "ruleType": {
            "constraint": "FOLDER",
            "checkFor": [
                "src/com/crowdcoding/commands", "src/com/crowdcoding/entities"
            ],
            "type": "MIXED"
       },
       "quantifier": {
            "type": "FIND_FROM_TEXT",
            "detail": "Calling constructors of all entity objects",
            "command1": "//src:unit/src:class[(src:annotation/src:name[text()=\"Entity\"] or src:annotation/src:name[text()=\"Subclass\"])]/src:name/text()",
            "command2": "//src:unit/src:class[src:super/src:extends/src:name/text()=\"Command\"]/src:block/src:class/src:block/descendant-or-self::src:decl_stmt/src:decl[src:init/src:expr/src:call/src:name/text()=\"<TEMP>\"]"
       },
       "constraint": {
            "type": "RETURN_TO_BASE",
            "detail": "Calling constructors of allowed entity objects",
            "command1": "//src:unit/src:class/src:block/src:function_decl[src:name/text()=\"execute\"]/src:parameter_list/src:parameter/src:decl/src:type/src:name[not(text()=\"String\")]/text()",
            "command2": "//src:unit/src:class[src:name/text()=\"<TEMP>\" or (src:super/src:extends/src:name/text()=\"<TEMP>\")]/src:name/text()",
            "command3": "//src:unit/src:class[src:super/src:extends/src:name/text()=\"Command\"]/src:block/src:class/src:block/descendant-or-self::src:decl_stmt/src:decl[src:init/src:expr/src:call/src:name/text()=\"<TEMP>\"]"
       }
    },
    {
        "index": 11,
        "title": "@Entity classes must be registered in the CrowdServlet class",
        "description": "IF a class is an Entity class or subclass \nTHEN it must be registered in 'CrowdServlet' class by ObjectifyService.\nAll entities needs to be registered with Objectify, so that Objectify knows to persist them. The registration must be done in 'CrowdServlet.java'",
        "tags": [
            "Entity", "Objectify", "Persistence"
        ],
        "ruleType": {
            "constraint": "FOLDER",
            "checkFor": [
                "src/com/crowdcoding/entities",
                "src/com/crowdcoding/servlets"
            ],
            "type": "MIXED"
        },
        "quantifier": {
            "detail": "Entity classes",
            "command": "//src:unit/src:class[(src:annotation/src:name[text()=\"Entity\"] or src:annotation/src:name[text()=\"Subclass\"])]"
        },
        "constraint": {
            "type": "FIND_FROM_TEXT",
            "detail": "Registered classes",
            "command1": "//src:unit/src:class[src:name/text()=\"CrowdServlet\"]//src:expr_stmt/src:expr/src:call[src:name/src:name/text()=\"ObjectifyService\" and src:name/src:name/text()=\"register\"]/src:argument_list/src:argument/src:expr/src:name/src:name[1]/text()",
            "command2": "//src:unit/src:class[src:name/text()=\"<TEMP>\"]"
        }
    }
]
```


## tagJson.txt

There is also another json file named `tagJson.txt`. In this file we store information about tags. Here is an example for this file:

```
[
    {
        "tagName": "Labeling",
        "detail": "Rules about labeling the items used in the application. The labeling must follows special policies."
    },
    {
        "tagName": "Objects",
        "detail": "Rules about object created in the application. For each object there might be some constraints and considerations."
    }
]
```

## Generate Rules

This system is using ANTLR4 and Simple CoreNLP.

### ANTLR
* The grammar is stored in `myGrammar.g4`
* The generated code with ANTLR is created through `gradle` script.
* The `gradle.build` file is located in the root directory of the project.
* Run `gradle generateParser`


### CoreNLP
* The CoreNLP package is a node package: [https://github.com/gerardobort/node-corenlp](https://github.com/gerardobort/node-corenlp)
* There might be an error for `request-promise-native` in `node_modules/corenlp/dist/connector/connector-server.js`. change the line for `require('request-promise-native')` to `require('<full path>/node_modules/request-promise-native/lib/rp.js')`
* Download the CoreNLP Java sourcecode from the original website: [https://stanfordnlp.github.io/CoreNLP/download.html](https://stanfordnlp.github.io/CoreNLP/download.html)
* Move the directory to `node_modules/corenlp/corenlp/` as `node_modules/corenlp/corenlp/stanford-corenlp-full-2018-*-*`
* In `node_modules/corenlp/corenlp/stanford-corenlp-full-2018-*-*` directory run `java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000` which runs the server of the CoreNLP on port 9000.
* To stop the server use `CTRL+C`

The first run of the coreNLP library takes time as it loads necessary libraries.
Demo of CoreNLP is available in [http://corenlp.run/](http://corenlp.run/)

#### Notes
! The npm package `concurrently` allows to run several scripts simultaneously.
The current script `npm run dev` is running the following scripts for `coreNLP` and 
`npm run start`.

! Note that the script is based on `stanford-corenlp-full-2018-02-27` version. If the version is different, 
the script should also be changed accordingly.


## Used Ports

Three ports are used for this application:
* 8887 for websocket
* 3000 for application server
* 9000 for CoreNLP