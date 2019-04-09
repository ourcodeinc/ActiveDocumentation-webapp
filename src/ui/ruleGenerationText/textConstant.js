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
        "The Rule Generator interface allows you to specify the value of some elements directly. Values must be **quoted**.\n" +
        "For example, `@Entity` can be expresses as: \n" +
        "```\n" +
        "annotation \"Entity\"\n" +
        "``` \n" +
        "You can also use some regex-like notations in both the textual and graphical UI.\n" +
        "##### **`word`** matches value **'word'**.\n" +
        "##### **`pre...`** matches values that _start with_ the prefix **pre** and end with any sequence of characters.\n" +
        "##### **`...post`** matches values that start with any sequence of characters and _end with_ the postfix **post**.\n" +
        "##### **`...mid...`** matches values that _contain_ the sub-string **mid**.\n" +
        "##### To express negation use **!** as follows: \n" +
        "##### **`!word`** matches any value except **'word'**.\n" +
        "##### **`!pre...`** matches any value that does **NOT** start with the prefix **'pre'**.\n" +
        "##### **`!...post`** matches any value that does **NOT** end with the postfix **'post'**.\n" +
        "##### **`!...mid...`** matches any value that does **NOT** contain the sub-string **'mod'**.\n" +
        "##### Values can be mixed with `&&` (logical and) and `||` (logical or).\n" +
        "For example, **\"!pre...||...mid...\"** matches values that either do not start with 'pre' **OR** contain 'mid'"
    },
    "EXACT_CODE": {
        isTrusted: true, value:
        "##### Code\n" +
        "Write the code you want to match here.\n" +
        "For example, if a function return statement is `return obj1.foo(param1);`\n " +
        "enter `obj1.foo(param1)` in the **return value** element."
    },
    "TEXTS": {
        isTrusted: true, value:
        "You can use some regex-like notations for matching values.\n" +
        "##### **`word`** matches value **'word'**.\n" +
        "##### **`pre...`** matches values that _start with_ the prefix **'pre'** and end with any sequence of characters.\n" +
        "##### **`...post`** matches values that start with any sequence of characters and _end with_ the postfix **'post'**.\n" +
        "##### **`...mid...`** matches values that _contain_ the sub-string **'mid'**.\n" +
        "##### To express negation use **!** as follows: \n" +
        "##### **`!word`** matches any value except **'word'**.\n" +
        "##### **`!pre...`** matches any value that does **NOT** start with the prefix **'pre'**.\n" +
        "##### **`!...post`** matches any value that does **NOT** end with the postfix **'post'**.\n" +
        "##### **`!...mid...`** matches any value that does **NOT** contain the sub-string **'mid'**.\n" +
        "##### Values can be mixed with `&&` (logical and) and `||` (logical or).\n" +
        "For example, **\"!pre...||...mid...\"** matches values that either do not start with 'pre' **OR** contain 'mid'"
    },
    "AND_OR_PAREN": {
        isTrusted: true, value:
        "##### and, or, (, )\n" +
        "**and** and **or** can be used to add two or characteristics to an element.\n" +
        "For example, assume you want to match the following code:\n" +
        "```java\n" +
        "@Entity\n" +
        "class myClass extends superClass{\n" +
        "    // some logic here\n" +
        "    @Id\n" +
        "    int objectId;\n // declaration statement" +
        "}\n" +
        "```\n" +
        "You can write the design rule as:\n" +
        "```\n" +
        "class with annotation \"Entity\" and extension of \"superClass\" must have \n" +
        "declaration statement with annotation \"Id\" and type \"int\" and name \"objectId\"\n" +
        "```\n" +
        "To avoid ambiguity, parenthesis may also be used to group characteristics. " +
        "For example, assume you want to match the following code.\n" +
        "```java\n" +
        "@Entity\n" +
        "class myClass extends superClass{\n" +
        "    // some logic here\n" +
        "    @Id  // either annotation or the name objectId and type int\n" +
        "    int objectId;\n // declaration statement" +
        "}\n" +
        "```\n" +
        "```\n" +
        "class with annotation \"Entity\" and extension of \"superClass\" must have \n" +
        "declaration statement with ((annotation \"Id\") or (type \"int\" and name \"objectId\"))\n" +
        "```"
    },
    "OF": {
        isTrusted: true, value:
        "##### of\n" +
        "If you want to match an element that is a characteristic for another element (owner), you can use preposition **of**. \n" +
        "For example, consider the following snippet:\n" +
        "```java\n" +
        "@Entity\n" +
        "class myClass {\n" +
        "    public void myFunction() { // we want to match this element\n" +
        "        // some logic\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "This design rule for the above snippet is:\n" +
        "```\n" +
        "function with visibility \"public\" of class with annotation \"Entity\" must have return value \"void\"\n" +
        "```\n"
    },
    "MUST_HAVE": {
        isTrusted: true, value:
        "##### must have\n" +
        "A design rule consists of two parts: the code you want to match (quantifier) and conditions on the code that " +
        "need to hold to satisfy the rule (constraint). \n" +
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
        "An element may have several characteristics. For example, the `class` element may have **annotation**, **declaration statement**, and/or **constructor**.\n" +
        "Characteristics of an element can be listed after the name of element followed by preposition **with**. For example:\n" +
        "```java\n" +
        "// annotation \n" +
        "@Entity\n" +
        "// name of the class \n" +
        "class myClass {\n" +
        "    // declaration statement\n" +
        "    int id;\n" +
        "    // constructor \n" +
        "    public myClass (int ID) {\n" +
        "        this.id = ID;\n" +
        "    }\n" +
        "    // function (method) \n" +
        "    void setId (int ID) {\n" +
        "        this.id = ID;\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "Characteristics of an element can be listed after the name of element followed by preposition **with**. \n" +
        "For example, consider the following snippet:\n" +
        "```java\n" +
        "// annotation \n" +
        "@Entity\n" +
        "// name of the class \n" +
        "class myClass {\n" +
        "    // constructor \n" +
        "    public myClass () {\n" +
        "        // some logic\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "The design rule for matching this snippet may be: \n" +
        "```\n" +
        "class with annotation \"Entity\" and name \"myClass\" must have constructor\n" +
        "```"
    },

    "Superclass": {
        isTrusted: true, value:
        "#### Superclass\n" +
        "To match java classes that extend a Superclass, you can use the keyword *extension* followed by *of* and name of the superclass.\n" +
        "If the name of the superclass is not known or important, the word *Superclass* is used as placeholder of the superclass name\n" +
        "```java\n" +
        "class myClass extends someSuperClass{\n" +
        "    public void myFunction() {\n" +
        "        // some logic\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "class with extension of Superclass must have function with name \"myFunction\"\n" +
        "```"
    },
    "Interface": {
        isTrusted: true, value:
        "#### Interface\n" +
        "To match java classes that implement an interface, you can use the keyword *implementation* followed by *of* and name of the interface.\n" +
        "If the name of the interface is not known or important, the word *Interface* is used as placeholder of the interface name\n" +
        "```java\n" +
        "class myClass implements someInterface{\n" +
        "    public void myFunction() {\n" +
        "        // some logic\n" +
        "    }\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "class with extension of Interface must have function with name \"myFunction\"\n" +
        "```"
    },

    "name": {
        isTrusted: true, value:
        "#### name\n" +
        "Name represents the identifier of a java class, variable, method, or parameter.\n" +
        "```java\n" +
        "public class MyClass { // MyClass is the name of the class\n" +
        "    int myVariable; // myVariable is the name of variable\n" +
        "    void foo (int param1) { // foo is the name of class and param1 is the name of the parameter\n" +
        "    }\n" +
        "}\n" +
        "```"
    },
    "annotation": {
        isTrusted: true, value:
        "#### annotation\n" +
        "Some elements may have an annotation which is marked by *@*. \n" +
        "Annotations, a form of metadata, provide data about a program that is not part of the program itself. " +
        "Annotations have no direct effect on the operation of the code they annotate.\n" +
        "```java\n" +
        "@Override\n" +
        "void foo() {\n" +
        "    // ...\n" +
        "}\n" +
        "```\n" +
        "The design rule corresponding to the above code snippet is: \n" +
        "```\n" +
        "function with name \"foo\" must have annotation \"Override\"\n" +
        "```\n"
    },
    "extension": {
        isTrusted: true, value:
        "#### extension\n" +
        "To match java classes that extend a superclass, you can use the keyword *extension* followed by *of* and name of the superclass.\n" +
        "If the name of the superclass is not known or important, the word *Superclass* is used as placeholder of the superclass name\n" +
        "```java\n" +
        "class myClass extends mySuperClass {\n" +
        "    // some logic here\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "class with name \"myClass\" must have extension of \"mySuperClass\"\n" +
        "```"
    },
    "implementation": {
        isTrusted: true, value:
        "#### implementation\n" +
        "To match java classes that implement an interface, you can use the keyword *implementation* followed by *of* and name of the interface.\n" +
        "If the name of the interface is not known or important, the word *Interface* is used as placeholder of the interface name\n" +
        "```java\n" +
        "class myClass implements myInterface {\n" +
        "    // some logic here\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "class with name \"myClass\" must have interface of \"myInterface\"\n" +
        "```"
    },
    "function": {
        isTrusted: true, value:
        "#### function\n" +
        "A Function represents a Java method that is a collection of statements that are grouped together to perform an operation. \n" +
        "Functions may have several characteristics such as *specifier*, *return type*, *name*, *parameter*, etc. \n" +
        "``` java\n" +
        "public void foo (int num1, int num2) {\n" +
        "    // some logic here\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "function with name \"foo\" and parameter with type \"int\" must have visibility \"public\"\n" +
        "```"
    },
    "abstract function": {
        isTrusted: true, value:
        "#### abstract function\n" +
        "An Abstract Function represents a Java abstract method that is declared without any implementation. " +
        "Abstract methods are declared with the purpose of having the child class provide implementation. They must be declared within an abstract class.\n" +
        "```java\n" +
        "abstract class myClass{\n" +
        "   public abstract int sum(int n1, int n2);\n" +
        "}\n" +
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "abstract function with name \"sum\" must have visibility \"public\"\n" +
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
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "class with name \"myClass\" must have constructor\n" +
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
        "```\n" +
        "The following design rule matches the above code:\n" +
        "```\n" +
        "function with name \"foo\" must have parameter with type \"int\" and name \"paramName\"\n" +
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
    "initial value": {
        isTrusted: true, value:
        "#### Initial Value\n" +
        "Initial value is a value or expression assigned to a variable upon declaration.\n" +
        "```java\n" +
        "public MyClass mc = new MyClass(); // new MyClass() is the initial value\n" +
        "int i = foo(); // foo() is the initial value\n" +
        "String str = \"Hi\"; // \"Hi\" is the initial value\n" +
        "```"
    },
    "interface": {
        isTrusted: true, value:
        "#### interface\n" +
        "An interface represents a java `interface`\n" +
        "Interface is not supported currently."
    },
    "class": {
        isTrusted: true, value:
        "#### class\n" +
        "A class represents a java `class`\n" +
        "``` java\n" +
        "public class Student {\n" +
        "    String name;\n" +
        "    float grade;\n" +
        "    course[] courses;\n" +
        "}\n" +
        "```"
    },
};
