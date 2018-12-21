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
    | classes must classExpression
    | interfaces must interfaceExpression
    ;

mustBeEqualToClause
    : functions mustBeEqualTo functions
    | abstractFunctions mustBeEqualTo abstractFunctions
    | constructors mustBeEqualTo constructors
    | annotations mustBeEqualTo annotations
    | parameters mustBeEqualTo parameters
    | returnValues mustBeEqualTo returnValues
    | declarationStatements mustBeEqualTo declarationStatements
    | expressionStatements mustBeEqualTo expressionStatements
    | classes mustBeEqualTo classes
    | interfaces mustBeEqualTo interfaces
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

combinatorialWords
    : '"' (Alphabet | symbols)+ '"'
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
    | types | constructors | extensions | implementations)
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
    : where not? equalsTo combinatorialWords Comma?
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
    : where not? equalsTo combinatorialWords Comma?
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
    : where not? equalsTo combinatorialWords Comma?
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
              annotations | specifiers | types | names | initialValues
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
    : where not? equalsTo combinatorialWords Comma?
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
    :where not? equalsTo combinatorialWords Comma?
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
              annotations | specifiers | names | extensions | implementations | functions | interfaces
              | abstractFunctions | constructors | declarationStatements | classes | returnValues
              ) SPACE?
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
    : where interfaceExpression Comma?
    ;

interfaceExpression
    : LPAREN interfaceExpression RPAREN
    | left=interfaceExpression op=binary right=interfaceExpression
    | have (annotations | specifiers | names | abstractFunctions | declarationStatements | interfaces) SPACE?
    ;
