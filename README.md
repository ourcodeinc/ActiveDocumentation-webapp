# Active Documentation

This app is written in "React" framework.
It communicates with the server using "Web-Socket".

## spmf.jar

This file is required for FPMax algorithm (for mining design rules) to execute. It can be downloaded from this repository or [here](http://www.philippe-fournier-viger.com/spmf/index.php?link=download.php).
**The file should be copied/moved to the root directory of the project.**


## ruleTable.json

There must be a file name `ruleTable.json` in the project folder in which all rules are stored. `grammar` field is recently added for each rule. 
It is mandatory but is generated for newly added rules. Here is an example for this file:

```javascript
[
    {
        "index": "1",
        "title": "All Buttons must have a title",
        "description": "IF a JButton is created\nTHEN it should be initialized and have a title upon creating.",
        "tags": [
            "Labeling"
        ],
        "checkForFilesFolders": [
            "src"
        ],
        "checkForFilesFoldersConstraints": "INCLUDE",
        "processFilesFolders": "WITHIN",
        // JButtons
        "quantifierXPathQuery": ["src:unit/src:class/src:block//src:decl_stmt/src:decl[src:type/src:name/text()=\"JButton\"]"],
        // JButtons with labels in constructor
        "constraintXPathQuery": ["src:unit/src:class/src:block//src:decl_stmt/src:decl[src:type/src:name/text()=\"JButton\" and count(src:init/src:expr/src:call/src:argument_list/src:argument)>0]"]
    },
    {
       "index": "6",
       "title": "Communication between artifacts should be indirected through a Command",
       "description": "IF an Artifact needs to communicate with another artifact\nTHEN it should create a Command describing the desired action to be performed.\nEach Artifact exists in a separate shard, which may execute in parallel on a separate server. An artifact may communicate with another artifact by creating a Command which describes the action that it wishes the receiving Artifact to perform.",
       "tags": [
            "Sharding",
            "Command",
            "Entity",
            "Persistence"
       ],
       "checkForFilesFolders": [
           "src/com/crowdcoding/commands", "src/com/crowdcoding/entities"
       ],
       "checkForFilesFoldersConstraints": "INCLUDE",
       "processFilesFolders": "MIXED",       
       "quantifierQueryType": "FIND_FROM_TEXT",
       // Calling constructors of all entity objects
       "quantifierXPathQuery": ["//src:unit/src:class[(src:annotation/src:name[text()=\"Entity\"] or src:annotation/src:name[text()=\"Subclass\"])]/src:name/text()",
                "//src:unit/src:class[src:super/src:extends/src:name/text()=\"Command\"]/src:block/src:class/src:block/descendant-or-self::src:decl_stmt/src:decl[src:init/src:expr/src:call/src:name/text()=\"<TEMP>\"]"]
       "constraintQueryType": "RETURN_TO_BASE",
       // Calling constructors of allowed entity objects",
       "constraintXPathQuery": ["//src:unit/src:class/src:block/src:function_decl[src:name/text()=\"execute\"]/src:parameter_list/src:parameter/src:decl/src:type/src:name[not(text()=\"String\")]/text()",
                "//src:unit/src:class[src:name/text()=\"<TEMP>\" or (src:super/src:extends/src:name/text()=\"<TEMP>\")]/src:name/text()",
                "//src:unit/src:class[src:super/src:extends/src:name/text()=\"Command\"]/src:block/src:class/src:block/descendant-or-self::src:decl_stmt/src:decl[src:init/src:expr/src:call/src:name/text()=\"<TEMP>\"]"]
    },
    {
        "index": "11",
        "title": "@Entity classes must be registered in the CrowdServlet class",
        "description": "IF a class is an Entity class or subclass \nTHEN it must be registered in 'CrowdServlet' class by ObjectifyService.\nAll entities needs to be registered with Objectify, so that Objectify knows to persist them. The registration must be done in 'CrowdServlet.java'",
        "tags": [
            "Entity", "Objectify", "Persistence"
        ],
        "checkForFilesFolders": [
           "src/com/crowdcoding/entities", "src/com/crowdcoding/servlets"
        ],
        "checkForFilesFoldersConstraints": "INCLUDE",
        "processFilesFolders": "MIXED",              
        // Entity classes
        "quantifierXPathQuery": ["//src:unit/src:class[(src:annotation/src:name[text()=\"Entity\"] or src:annotation/src:name[text()=\"Subclass\"])]"]
        "constraintQueryType": "FIND_FROM_TEXT",
        // Registered classes
        "constraintXPathQuery": ["//src:unit/src:class[src:name/text()=\"CrowdServlet\"]//src:expr_stmt/src:expr/src:call[src:name/src:name/text()=\"ObjectifyService\" and src:name/src:name/text()=\"register\"]/src:argument_list/src:argument/src:expr/src:name/src:name[1]/text()",
                "//src:unit/src:class[src:name/text()=\"<TEMP>\"]"]
    }
]
```


## tagTable.json

There is also another json file named `tagTable.json`. In this file we store information about tags. Here is an example for this file:

```javascript
[
    {
        "ID": "0",
        "tagName": "Labeling",
        "detail": "Rules about labeling the items used in the application. The labeling must follows special policies."
    },
    {
        "ID": "1",
        "tagName": "Objects",
        "detail": "Rules about object created in the application. For each object there might be some constraints and considerations."
    }
]
```

## Generate Rules

This system is using ANTLR4.

* The grammar is stored in `myGrammar.g4`
* The generated code with ANTLR is created through `gradle` script.
* The `gradle.build` file is located in the root directory of the project.
* Run `gradle generateParser`


## Used Ports

Three ports are used for this application:
* 8887 for websocket
* 3000 for application server (Changing Frequently, check package.json for the active port)
