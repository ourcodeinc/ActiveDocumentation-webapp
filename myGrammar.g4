grammar myGrammar;

inputSentence
    : (emptyLine* | mustClause) end? NL* EOF
    ;

mustClause
    : functions must have functionExpression
    | abstractFunctions must have abstractFunctionExpression
    | constructors must have constructorExpression
    | classes must have classExpression
    | interfaces must have interfaceExpression
    | parameters must have parameterExpression
    | declarationStatements must have declarationStatementExpression
    ;

/*
    Constants
*/
SPACE
    : (' ' | '\t')+
    ;


words
    : '"' (word '||' | word '&&')* word '"'
    ;

word
    :  Alphabet+
    |  '!' Alphabet+
    |  '...' Alphabet+
    |  '!...' Alphabet+
    |  Alphabet+ '...'
    |  '!' Alphabet+ '...'
    |  '...' Alphabet+ '...'
    |  '!...' Alphabet+ '...'
    ;


oldWords
    : '"' Alphabet+ '"'
    | '"' '!' Alphabet+ '"'
    | '"' '...' Alphabet+ '"'
    | '"' '!...' Alphabet+ '"'
    | '"' Alphabet+ '...' '"'
    | '"' '!' Alphabet+ '...' '"'
    | '"' '...' Alphabet+ '...' '"'
    | '"' '!...' Alphabet+ '...' '"'
    ;

combinatorialWords
    : '"' (Alphabet | symbols | SPACE)+ '"'
    ;

symbols
    : '.' | '=' | '>' | '<' | '(' | ')'
    ;

Alphabet
    : [a-zA-Z0-9_-]
    ;
end
    : '.'
    ;

NL
    : '\r' | '\n'
    ;

emptyLine
    : NL
    ;


/*
    connectors
*/

must
    : 'must '
    ;

of
    : 'of '
    ;


and
    :  'and '
    ;

or
    :  'or '
    ;

have
    : 'have '
    ;

withWord
    : 'with '
    ;


binary
    : and | or
    ;

LPAREN
    : '('
    ;

RPAREN
    : ')'
    ;

/*
    ------------------
*/

/*
    names
*/

NAME
    : 'name '
    ;

names
    : NAME nameCondition?
    ;

nameOf
    : of (classes | functions | abstractFunctions | declarationStatements | parameters | annotations
            | types | constructors | extensions | implementations)
    ;

nameCondition
    : words SPACE
    ;


/*
    annotations
*/

ANNOTATION
    : 'annotation '
    ;

annotations
    : ANNOTATION annotationCondition?
    ;

annotationOf
    : of (classes | functions | constructors | abstractFunctions | declarationStatements)
    ;

annotationCondition
    : combinatorialWords SPACE
    ;


/*
    extensions
*/

EXTENSION
    : 'extension '
    ;

SUPERCLASS
    : 'Superclass'
    ;

extensions
    : EXTENSION extensionCondition
    ;

extensionOf
    : of classes
    ;

extensionCondition
    : of ( words SPACE | SUPERCLASS)
    ;


/*
    implements
*/

IMPLEMENTATION
    : 'implementation '
    ;

INTERFACE
    : 'Interface '
    ;

implementations
    : IMPLEMENTATION implementationCondition
    ;

implementationOf
    : of classes
    ;

implementationCondition
    : of ( words SPACE | INTERFACE )
    ;


/*
    functions
*/

FUNCTION
    : 'function '
    ;

functions
    : FUNCTION functionCondition? functionOf?
    ;

functionOf
    : of classes
    ;

functionCondition
    : withWord functionExpression
    ;

functionExpression
    : LPAREN functionExpression RPAREN
    | left=functionExpression op=binary right=functionExpression
    | ( annotations | specifiers | visibilities | types | names | parameters | returnValues | declarationStatements | expressionStatements )
    | functionExpression SPACE
    ;

/*
    abstractFunctions
*/

AbstractFunctions
    : 'abstract function '
    ;

abstractFunctions
    : AbstractFunctions abstractFunctionCondition? abstractFunctionOf?
    ;

abstractFunctionOf
    : of classes
    ;

abstractFunctionCondition
    : withWord abstractFunctionExpression
    ;

abstractFunctionExpression
    : LPAREN abstractFunctionExpression RPAREN
    | left=abstractFunctionExpression op=binary right=abstractFunctionExpression
    | ( annotations | specifiers | visibilities | types | names | parameters )
    | abstractFunctionExpression SPACE
    ;


/*
    constructors
*/

CONSTRUCTOR
    : 'constructor '
    ;

constructors
    : CONSTRUCTOR constructorCondition? constructorOf?
    ;

constructorOf
    : of classes
    ;

constructorCondition
    : withWord constructorExpression
    ;

constructorExpression
    : LPAREN constructorExpression RPAREN
    | left=constructorExpression op=binary right=constructorExpression
    | ( annotations | specifiers | visibilities | parameters | returnValues | declarationStatements | expressionStatements )
    | constructorExpression SPACE
    ;

/*
    parameters
*/

PARAMETER
    :  'parameter '
    ;

parameters
    : PARAMETER parameterCondition?
    ;

parameterOf
    : of (functions | constructors | abstractFunctions)
    ;

parameterCondition
    : withWord parameterExpression
    ;

parameterExpression
    : LPAREN parameterExpression RPAREN
    | left=parameterExpression op=binary right=parameterExpression
    | ( types | names )
    | parameterExpression SPACE
    ;


/*
    types
*/

TYPES
    : 'type '
    ;

types
    : TYPES typeCondition?
    ;

typeOf
    : of (parameters | declarationStatements)
    ;

typeCondition
    : combinatorialWords SPACE
    | words SPACE
    ;


/*
    specifiers only static
*/

SPECIFIER
    :  'specifier '
    ;

specifiers
    : SPECIFIER specifierCondition?
    ;

specifierOf
    : of (functions | constructors | abstractFunctions | declarationStatements | classes)
    ;

specifierCondition
    : words SPACE
    ;

/*
    visibility (also specifier) public/protected/private
*/

VISIBILITY
    :  'visibility '
    ;

visibilities
    : VISIBILITY visibilityCondition?
    ;

visibilityOf
    : of (functions | constructors | abstractFunctions | declarationStatements | classes)
    ;

visibilityCondition
    : words SPACE
    ;


/*
    return values
*/

ReturnValue
    :  'return value '
    ;

returnValues
    : ReturnValue returnValueCondition?
    ;

returnValueOf
    : of functions
    ;

returnValueCondition
    : combinatorialWords SPACE
    ;


/*
    declarationStatements
*/

DeclarationStatement
    : 'declaration statement '
    ;

declarationStatements
    : DeclarationStatement declarationStatementCondition? declarationStatementOf?
    ;

declarationStatementOf
    : of (classes | functions | constructors)
    ;

declarationStatementCondition
    : withWord declarationStatementExpression
    ;

declarationStatementExpression
    : LPAREN declarationStatementExpression RPAREN
    | left=declarationStatementExpression op=binary right=declarationStatementExpression
    | ( annotations | specifiers | visibilities | types | names | initialValues )
    | declarationStatementExpression SPACE
    ;


/*
    expressions
*/

ExpressionStatement
    :  'expression statement '
    ;

expressionStatements
    : ExpressionStatement expressionStatementCondition? expressionStatementOf?
    ;

expressionStatementOf
    : of (functions | constructors | constructors)
    ;

expressionStatementCondition
    : combinatorialWords SPACE
    ;


/*
    init values
*/

InitialValue
    :  'initial value '
    ;

initialValues
    : InitialValue initialValueCondition? initialValueOf?
    ;

initialValueOf
    : of declarationStatements
    ;

initialValueCondition
    : combinatorialWords SPACE
    ;


/*
    classes
*/

CLASSES
    : 'class ' | 'subclass '
    ;

classes
    : CLASSES classCondition? classOf?
    ;

classOf
    : of classes
    ;

classCondition
    : withWord classExpression
    ;

classExpression
    : LPAREN classExpression RPAREN
    | left=classExpression op=binary right=classExpression
    | ( annotations | specifiers | visibilities | names | extensions | implementations | functions | interfaces
            | abstractFunctions | constructors | declarationStatements | classes | returnValues )
    | classExpression SPACE
    ;

/*
    classes
*/

INTERFACES
    : 'interface '
    ;

interfaces
    : INTERFACES interfaceCondition? interfaceOf?
    ;

interfaceOf
    : of (interfaces | classes)
    ;

interfaceCondition
    : withWord interfaceExpression
    ;

interfaceExpression
    : LPAREN interfaceExpression RPAREN
    | left=interfaceExpression op=binary right=interfaceExpression
    | (annotations | specifiers | visibilities | names | abstractFunctions | declarationStatements | interfaces)
    | interfaceExpression SPACE
    ;
