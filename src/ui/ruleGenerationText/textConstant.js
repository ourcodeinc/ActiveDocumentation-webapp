export const grammar_keywords = [
    "name", "annotation", "extension", "implementation", "function", "abstract function", "constructor", "parameter", "type",
    "specifier", "visibility", "return value", "declaration statement", "expression statement", "class", "interface", "initial value"
];

export const grammar_connectors = ["with", "have", "must", "and", "or", "of", "(", ")"];

export const special_word = ["Superclass", "Interface"];

export const autoComplete_suggestion = {
    "name": {
        ofClause: []
    },
    "annotation": {
        ofClause: []
    },
    "extension": {
        ofClause: [],
        preWord: "of",
        placeholder: "Superclass"
    },
    "implementation": {
        ofClause: [],
        preWord: "of",
        placeholder: "Interface"
    },
    "function": {
        withClause: ["annotation", "specifier", "visibility", "type", "name", "parameter", "return value", "declaration statement",
            "expression statement"],
        ofClause: ["class"]
    },
    "abstract function": {
        withClause: ["annotation", "specifier", "visibility", "type", "name", "parameter"],
        ofClause: ["class"]
    },
    "constructor": {
        withClause: ["annotation", "specifier", "visibility", "parameter", "declaration statement", "expression statement"],
        ofClause: ["class"]
    },
    "parameter": {
        withClause: ["type", "name"],
        ofClause: []
    },
    "type": {
        ofClause: []
    },
    "specifier": {
        ofClause: []
    },
    "visibility": {
        ofClause: []
    },
    "return value": {
        ofClause: []
    },
    "declaration statement": {
        withClause: ["annotation", "specifier", "visibility", "type", "name", "initial value"],
        ofClause: ["class", "function", "constructor"]
    },
    "expression statement": {
        ofClause: []
    },
    "initial value": {
        ofClause: []
    },
    "value": {
        ofClause: []
    },
    "class": {
        withClause: ["annotation", "specifier", "visibility", "name", "extension", "function", "abstract function",
            "constructor", "declaration statement", "class", "return value", "implementation"],
        ofClause: []
    },
    "interface": {
        withClause: ["annotation", "specifier", "visibility", "name", "abstract function", "declaration statement", "interface"],
        ofClause: ["class"]
    }
};

/**
 * for each word, there are suggestions
 * @type [Array]
 */
export const sample_phrases = [
    {
        replaceWordWith: "function foo",
        value: "function with name \"foo\""
    },
    {
        replaceWordWith: "bar function",
        value: "function with name\"bar\""
    },
    {
        replaceWordWith: "Command class",
        value: "class with name \"Command\""
    }
];

export const sample_phrase_hash = {"function": [0, 1], "foo": [0], "bar": [1], "Command": [2], "class": [2]};

// IMarkdownString
export const error_messages_IMarkdownString = {
    100: {isTrusted: true, value: "**with** must be used after a valid keyword."},
    101: {isTrusted: true, value: "**have** must be used after **must**."},
    102: {isTrusted: true, value: "**must** should be used only once in the rule."},

    200: {
        isTrusted: true,
        value: "**and**/**or** must be used as valid keyword + **with (…) and/or (…)**, **with … and/or …**."
    },
    201: {isTrusted: true, value: "**)** must be used as keyword + **with (…)**, **((…) and/or (…))**."},
    202: {
        isTrusted: true,
        value: "**(** must be used as valid keyword + **with (**, **((…) and/or (…))**, **must have (**."
    },
    203: {isTrusted: true, value: "Parenthesis must be paired."},
    204: {isTrusted: true, value: "**of** must be used as keyword + **of**, keyword + **with … of**."},


    300: {isTrusted: true, value: "The word before **with** is not a valid keyword."},
    301: {isTrusted: true, value: "The keyword does not have a restriction defined by **with**."},
    302: {isTrusted: true, value: "**The keyword before the corresponding open parenthesis is not valid."},
    303: {isTrusted: true, value: "The first word in the rule is not a valid keyword."},

    400: {isTrusted: true, value: "The input text is not valid."}
};

// IMarkdownString
export const documentations_IMarkdownString = {
    "QUOTES": {
        isTrusted: true, value:
        "##### Quoted words\n" +
        "The Rule Generator interface allows to specify the exact value of some elements directly. Values must be **quoted**.\n" +
        "For example, `@Entity` can be expresses as: \n" +
        "```\n" +
        "annotation \"Entity\"\n" +
        "``` \n" +
        "There are some regex-like notations that can be used in both the textual anad graphical UI.\n" +
        "##### **`...`**  \n" +
        "Equals to any sequance of characters. It is equivalent to `.*` in regex. For example:\n" +
        " **\"pre...\"** equals to values that _start with_ the prefix **pre** and end with any sequance of characters.\n" +
        " **\"...post\"** equals to values that start with any sequance of characters and _end with_ the postfix **post**.\n" +
        "##### **`!`** \n" +
        "Equals to _NOT_. For example:\n" +
        "**\"!word\"** equals to any value except **'word'**.\n" +
        " **\"!pre...\"** equals to any value that does **NOT** start with the prefix **'pre'**.\n" +
        " **\"!...post\"** equals to any value that does **NOT** end with the postfix **'post'**."
    },
    "AND_OR_PAREN": {
        isTrusted: true, value:
        "##### and, or, (, )\n" +
        "An element may have several children. For example, the `class` element may have several children ; **annotation**, **declaration statement**, and **constructor**.\n" +
        "Children of an element can be listed after the name of element followed by preposition **with**. For example:\n" +
        "```\n" +
        "class with annotation\n" +
        "```\n" +
        "**and** and **or** can be used to add more children.\n" +
        "```\n" +
        "class with annotation and declaration statement or constructor\n" +
        "```\n" +
        "To avoid ambiguity, parenthesis may also be used to group children. For example, the following example concern `classes` that have either `annotation and declaration statement` or `constructor`.\n" +
        "```\n" +
        "class with ( annotation and declaration statement) or constructor\n" +
        "```"
    },
    "OF": {
        isTrusted: true, value:
        "##### of\n" +
        "If the parent of the element is important, it can be specify after preposition **of**. For example, consider public functions of annotated classes.\n" +
        "```java\n" +
        "@annot\n" +
        "class myClass {\n" +
        "    public void myFunc() {\n" +
        "        // some logic\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "This can be expresses as:\n" +
        "```\n" +
        "function with visibility \"public\" of class with annotation\n" +
        "```\n" +
        "Note to list children first (if exist), then the parent."
    },
    "MUST_HAVE": {
        isTrusted: true, value:
        "##### must have\n" +
        "The rule consists of two parts, the code you want to match (quantifier), and conditions on the code that " +
        "needs to hold to satisfy the rule (constraint). \n" +
        "These parts are connected by **must have**.\n" +
        "For example, consider the following rule: \n" +
        "```\n" +
        "All classes need to be annotated.\n" +
        "```\n" +
        "\n" +
        "This rule can be expressed as:\n" +
        "```\n" +
        "class must have annotation\n" +
        "```"
    },
    "WITH": {
        isTrusted: true, value:
        "##### with\n" +
        "An element may have several children. In the following example, for the element `class`, " +
        "several children can be specified; **annotation**, **name**, **declaration statement**, and **constructor**.\n" +
        "```java\n" +
        "@ Entity\n" +
        "class myClass {\n" +
        "    int id;   // declarartion statement\n" +
        "    public myClass (int ID) {\n" +
        "        this.id = ID;\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "Children of an element can be listed after the name of element followed by preposition **with**. For example:\n" +
        "```\n" +
        "class with annotation\n" +
        "```"
    },

    "name": {
        isTrusted: true, value:
            ""
    },
    "annotation": {
        isTrusted: true, value:
        "#### annotation\n" +
        "Annotations, a form of metadata, provide data about a program that is not part of the program itself. " +
        "Annotations have no direct effect on the operation of the code they annotate.\n" +
        "```java\n" +
        "@Override\n" +
        "void foo() {\n" +
        "    // ...\n" +
        "}\n" +
        "```"
    },
    "extension": {
        isTrusted: true, value:
        "#### extesion\n" +
        "To create a sub class (child) from a Java super class (parent), the keyword extends is used. " +
        "You then follow the `extends` keyword with the parent class you want to extend. \n" +
        "```java\n" +
        "class dogs extends animals {\n" +
        "    \\\\ ...\n" +
        "}\n" +
        "```"
    },
    "implementation": {
        isTrusted: true, value:
        "#### implementation\n" +
        "Interfaces specify what a class must do and not how. It is the blueprint of the class. " +
        "A class that implement interface must implement all the methods declared in the interface. To implement interface use `implements` keyword.\n" +
        "```java\n" +
        "class english implements language {\n" +
        "    \\\\ ...\n" +
        "}\n" +
        "```"
    },
    "function": {
        isTrusted: true, value:
        "#### function\n" +
        "Function is a collection of statements that are grouped together to perform an operation. " +
        "All function definitions must be inside classes. \n" +
        "``` java\n" +
        "public void foo (int num1, int num2) {\n" +
        "    // some logic here\n" +
        "}\n" +
        "```"
    },
    "abstract function": {
        isTrusted: true, value:
        "#### abstract function\n" +
        "Abstract methods are declared without any implementation. " +
        "They are declared with the purpose of having the child class provide implementation. They must be declared within an abstract class.\n" +
        "```java\n" +
        "abstract class myClass{\n" +
        "   public abstract int sum(int n1, int n2);\n" +
        "}\n" +
        "```"
    },
    "constructor": {
        isTrusted: true, value:
        "#### constructor\n" +
        "A constructor initializes an object when it is created. It has the same name as its class " +
        "and is syntactically similar to a method. However, constructors have no explicit return type.\n" +
        "``` java\n" +
        "class MyClass {\n" +
        "    int ID;\n" +
        "    // constructor \n" +
        "    MyClass(id) {\n" +
        "        ID = id;\n" +
        "    }\n" +
        "} \n" +
        "```"
    },
    "parameter": {
        isTrusted: true, value:
        "#### parameter\n" +
        "A parameter of a function is like a placeholder. When a method is invoked, a value is passed to the\n" +
        "parameter. Parameters are optional; that is, a method may contain no parameters.\n" +
        "```java\n" +
        "public void foo(int paramName) {\n" +
        "    // some logic here\n" +
        "}\n" +
        "```"
    },
    "type": {
        isTrusted: true, value: "" +
        "#### type\n" +
        "Every piece of data has a type which defines its structure, namely how much memory it takes up, how it is laid out, and more importantly, how you can interact with it.\n" +
        "There are two distinct categories of types. primitive types such as byte, short, int, long, etc. and reference types. A variable of reference type always holds the value of a reference to an object.\n" +
        "``` java\n" +
        "int num = 0;  // type:  int\n" +
        "MyClass[] list;  // type:  MyClass[]\n" +
        "public int bar () {    // type:  int\n" +
        "    // ...\n" +
        "}\n" +
        "```"
    },
    "specifier": {
        isTrusted: true, value: "" +
        "#### specifier\n" +
        "A specifier, which is optional, tells the compiler how to call the method\n" +
        "- **static** object belongs specifically to the class, instead of instances of that class. " +
        "Variables, methods, and nested classes can be static. \n" +
        "- **final** specifier is used for finalizing the implementations of classes, methods, and variables.\n" +
        "- **abstract** is a non-access modifier in java applicable for classes, methods but not variables.\n"
    },
    "visibility": {
        isTrusted: true, value:
        "#### visibility\n" +
        "Visibility modifiers define the access type of the element. There are 4 levels of accessibility.\n" +
        "- When no access modifier is specified for a class , method or data member\n" +
        "- The private access modifier is specified using the keyword **private**. Private methods or data members " +
        "are accessible only within the class in which they are declared.\n" +
        "Any other class of same package will not be able to access these members.\n" +
        "- The protected access modifier is specified using the keyword **protected**.\n" +
        "Protected methods orvariables are accessible within same package or sub classes in different package.\n" +
        "- The public access modifier is specified using the keyword **public**. Public classes, methods or variables " +
        "are accessible from every where in the program."
    },
    "return value": {
        isTrusted: true, value:
        "#### return value\n" +
        "If a function has a non-void type, a value or statement must be returned using **return** keyword.\n" +
        "```java\n" +
        "public int sum (int num1, int num2) {\n" +
        "    return num1 + num2; // return value:  'num1 + num2'\n" +
        "}\n" +
        "```"
    },
    "declaration statement": {
        isTrusted: true, value:
        "#### declaration statement\n" +
        "**declaration statement** is a statement in which a variable is declared by specifying its data type and name. The variable can also be initialized. \n" +
        "```java\n" +
        "@Id private static int ID = 0; // declaration statement\n" +
        "```"
    },
    "expression statement": {
        isTrusted: true, value:
        "**expression statement** is made up of variables, operators, and method invocations, " +
        "which are constructed according to the syntax of the language, that evaluates to a single value. \n" +
        "```java\n" +
        "void myFunc() {\n" +
        "    int counter = 0; // declaration statement\n" +
        "    counter ++;                 // expression statement\n" +
        "    counter = A.func(counter);  // expression statement\n" +
        "    C.stop();                   // expression statement\n" +
        "}\n" +
        "```"
    },
    "class": {
        isTrusted: true, value:
        "#### class\n" +
        "A class is a template from which individual objects are created.\n" +
        "``` java\n" +
        "public class Student {\n" +
        "    String name;\n" +
        "    float grade;\n" +
        "    course[] courses;\n" +
        "}\n" +
        "```"
    },
};
