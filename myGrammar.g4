grammar myGrammar;

inputSentence
    : (emptyLine* | designRule) end? NL* EOF
    ;

designRule
    : mustClause | mustBeEqualToClause
    ;

mustClause
    : functions must functionExpression
    | abstractFunctions must abstractFunctionExpression
    | constructors must constructorExpression
    | annotations must annotationExpression
    | parameters must parameterExpression
    | returnValues must returnValueExpression
    | declarationStatements must declarationStatementExpression
    | expressionStatements must expressionStatementExpression
    | initValues must initValueExpression
    | arguments must argumentExpression
    | calls must callExpression
    | classes must classExpression;

mustBeEqualToClause
    : functions mustBeEqualTo functions
    | abstractFunctions mustBeEqualTo abstractFunctions
    | constructors mustBeEqualTo constructors
    | annotations mustBeEqualTo annotations
    | parameters mustBeEqualTo parameters
    | returnValues mustBeEqualTo returnValues
    | declarationStatements mustBeEqualTo declarationStatements
    | expressionStatements mustBeEqualTo expressionStatements
    | initValues mustBeEqualTo initValues
    | arguments mustBeEqualTo arguments
    | calls mustBeEqualTo calls
    | classes mustBeEqualTo classes
    ;

/*
    Constants
*/
SPACE
    : (' ' | '\t')+
    ;

words
    : '"' Alphabet+ '"'
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

Comma
    : ','
    ;

/*
    Keywords
*/

must
    : 'must '
    ;

mustBeEqualTo
    : 'must be equal to '
    ;

where
    : 'where '
    ;

of
    : 'of '
    ;


and
    :  ' and '
    ;

or
    :  ' or '
    ;

have
    : 'have '
    ;

equalsTo
    : 'equal to '
    ;

includes
    : 'include '
    ;

startsWith
    : 'start with '
    ;

endsWith
    : 'end with '
    ;

not
    : 'not '
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
    : NAME nameCondition? nameOf?
    ;

nameOf
    : of (classes | functions | abstractFunctions
    | declarationStatements | parameters | annotations
    | types | constructors | arguments | extensions | implementations)
    ;

nameCondition
    : where not? (equalsTo | includes | startsWith | endsWith) words Comma?
    ;


/*
    annotations
*/

ANNOTATION
    : 'annotation '
    ;

annotations
    : ANNOTATION annotationCondition? annotationOf?
    ;

annotationOf
    : of (classes | functions | constructors | abstractFunctions | declarationStatements)
    ;

annotationCondition
    : where annotationExpression Comma?
    ;

annotationExpression
    : LPAREN annotationExpression RPAREN
    | left=annotationExpression op=binary right=annotationExpression
    | have (names | arguments) SPACE?
    ;

/*
    extensions
*/

EXTEND
    : 'extend '
    ;

EXTENSION
    : 'extension '
    ;

extensions
    : EXTENSION extensionCondition? extensionOf?
    ;

extensionOf
    : of classes
    ;

extensionCondition
    : where not? equalsTo words Comma?
    ;


/*
    implements
*/

IMPLEMENTATION
    : 'implementation '
    ;

implementations
    : IMPLEMENTATION implementationCondition? implementationOf?
    ;

implementationOf
    : of classes
    ;

implementationCondition
    : where not? equalsTo words Comma?
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
    : where functionExpression Comma?
    ;

functionExpression
    : LPAREN functionExpression RPAREN
    | left=functionExpression op=binary right=functionExpression
    | have (
              annotations | specifiers | names | parameters | returnValues
              | declarationStatements | expressionStatements
              ) SPACE?
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
    : where abstractFunctionExpression Comma?
    ;

abstractFunctionExpression
    : LPAREN abstractFunctionExpression RPAREN
    | left=abstractFunctionExpression op=binary right=abstractFunctionExpression
    | have (
              annotations | specifiers | names | parameters
              ) SPACE?
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
    : where constructorExpression Comma?
    ;

constructorExpression
    : LPAREN constructorExpression RPAREN
    | left=constructorExpression op=binary right=constructorExpression
    | have (
              annotations | specifiers | parameters | returnValues
              | declarationStatements | expressionStatements
              ) SPACE?
    ;

/*
    parameters
*/

PARAMETER
    :  'parameter '
    ;

parameters
    : PARAMETER parameterCondition? parameterOf?
    ;

parameterOf
    : of (functions | constructors | abstractFunctions)
    ;

parameterCondition
    : where parameterExpression Comma?
    ;

parameterExpression
    : LPAREN parameterExpression RPAREN
    | left=parameterExpression op=binary right=parameterExpression
    | have (names | types) SPACE?
    ;

/*
    types
*/

TYPES
    : 'type '
    ;

types
    : TYPES typeCondition? typeOf?
    ;

typeOf
    : of (parameters | declarationStatements)
    ;

typeCondition
    : where not? equalsTo words Comma?
    ;


/*
    specifiers
*/

SPECIFIER
    :  'specifier '
    ;

specifiers
    : SPECIFIER specifierCondition? specifierOf?
    ;

specifierOf
    : of (functions | constructors | abstractFunctions | declarationStatements | classes)
    ;

specifierCondition
    : where not? equalsTo words Comma?
    ;


/*
    return values
    // call or name or literal like expr_stmt/expr
*/

ReturnValue
    :  'return value '
    ;

returnValues
    : ReturnValue returnValueCondition? returnValueOf?
    ;

returnValueOf
    : of functions
    ;

returnValueCondition
    : where returnValueExpression Comma?
    ;

returnValueExpression
    : LPAREN returnValueExpression RPAREN
    | left=returnValueExpression op=binary right=returnValueExpression
    | have (calls | names) SPACE?
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
    : where declarationStatementExpression Comma?
    ;

declarationStatementExpression
    : LPAREN declarationStatementExpression RPAREN
    | left=declarationStatementExpression op=binary right=declarationStatementExpression
    | have (
              annotations | specifiers | types | names | initValues
              ) SPACE?
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
    : where expressionStatementExpression Comma?
    ;

expressionStatementExpression
    : LPAREN expressionStatementExpression RPAREN
    | left=expressionStatementExpression op=binary right=expressionStatementExpression
    | have (calls | names) SPACE?
    ;

/*
    init values
*/

InitValue
    :  'initial value '
    ;

initValues
    : InitValue initValueCondition? initValueOf?
    ;

initValueOf
    : of declarationStatements
    ;

initValueCondition
    : where initValueExpression Comma?
    ;

initValueExpression
    : LPAREN initValueExpression RPAREN
    | left=initValueExpression op=binary right=initValueExpression
    | have (calls | names) SPACE?
    ;

/*
    arguments
*/

ARGUMENT
    :  'argument '
    ;

arguments
    : ARGUMENT argumentCondition? argumentOf?
    ;

argumentOf
    : of calls
    ;

argumentCondition
    : where argumentExpression Comma?
    ;

argumentExpression
    : LPAREN argumentExpression RPAREN
    | left=argumentExpression op=binary right=argumentExpression
    | have (calls | names) SPACE?
    ;

/*
    calls
*/

CALL
    : 'call '
    ;

calls
    : CALL callCondition? callOf?
    ;

callOf
    : of (arguments | returnValues | expressionStatements | initValues)
    ;

callCondition
    : where callExpression Comma?
    ;

callExpression
    : LPAREN callExpression RPAREN
    | left=callExpression op=binary right=callExpression
    | have (callers | arguments) SPACE?
    ;


/*
    callers
*/

CALLER
    : 'caller '
    ;

callers
    : CALLER callerCondition? callerOf?
    ;

callerOf
    : of calls
    ;

callerCondition
    : where have NAME not? equalsTo words Comma?
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
    : where classExpression Comma?
    ;

classExpression
    : LPAREN classExpression RPAREN
    | left=classExpression op=binary right=classExpression
    | have (
              annotations | specifiers | names | extensions | implementations | functions
              | abstractFunctions | constructors | declarationStatements | classes | returnValues
              ) SPACE?
    ;
