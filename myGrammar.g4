grammar myGrammar;

inputSentence
    : (emptyLine* | designRule) end? NL* EOF
    ;

designRule
    : mustClause | mustBeEqualToClause
    ;

mustClause
    : functions SPACE must SPACE functionExpression
    | abstractFunctions SPACE must SPACE abstractFunctionExpression
    | constructors SPACE must SPACE constructorExpression
    | annotations SPACE must SPACE annotationExpression
    | parameters SPACE must SPACE parameterExpression
    | returnValues SPACE must SPACE returnValueExpression
    | declarationStatements SPACE must SPACE declarationStatementExpression
    | expressionStatements SPACE must SPACE expressionStatementExpression
    | initValues SPACE must SPACE initValueExpression
    | arguments SPACE must SPACE argumentExpression
    | callers SPACE must SPACE callerExpression
    | classes SPACE must SPACE classExpression;

mustBeEqualToClause
    : functions SPACE mustBeEqualTo SPACE functions
    | abstractFunctions SPACE mustBeEqualTo SPACE abstractFunctions
    | constructors SPACE mustBeEqualTo SPACE constructors
    | annotations SPACE mustBeEqualTo SPACE annotations
    | parameters SPACE mustBeEqualTo SPACE parameters
    | returnValues SPACE mustBeEqualTo SPACE returnValues
    | declarationStatements SPACE mustBeEqualTo SPACE declarationStatements
    | expressionStatements SPACE mustBeEqualTo SPACE expressionStatements
    | initValues SPACE mustBeEqualTo SPACE initValues
    | arguments SPACE mustBeEqualTo SPACE arguments
    | callers SPACE mustBeEqualTo SPACE callers
    | classes SPACE mustBeEqualTo SPACE classes
    ;

/*
    Constants
*/
SPACE
    : (' ' | '\t')+
    ;

words
    : Alphabet+
    ;

Alphabet
    : [a-zA-Z0-9]
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

be
    : 'be'
    ;

must
    : 'must'
    ;

mustBeEqualTo
    : 'must be equal to'
    ;

where
    : 'where'
    ;

of
    : 'of'
    ;


and
    :  'and'
    ;

or
    :  'or'
    ;

have
    : 'have'
    ;

equalsTo
    : 'equal to'
    ;

includes
    : 'include'
    ;

not
    : 'not'
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
    : 'name'
    ;

names
    : NAME nameCondition? nameOf?
    ;

nameOf
    : SPACE of SPACE (classes | functions | abstractFunctions
    | declarationStatements | parameters | annotations
    | types | constructors | arguments | extensions | implementations)
    ;

nameCondition
    : SPACE where SPACE not? SPACE? (equalsTo | includes) SPACE words Comma?
    ;


/*
    annotations
*/

ANNOTATION
    : 'annotation'
    ;

annotations
    : ANNOTATION annotationCondition? annotationOf?
    ;

annotationOf
    : SPACE of SPACE (classes | functions | constructors | abstractFunctions | declarationStatements)
    ;

annotationCondition
    : SPACE where SPACE annotationExpression Comma?
    ;

annotationExpression
    : LPAREN annotationExpression RPAREN
    | left=annotationExpression SPACE op=binary SPACE right=annotationExpression
    | SPACE? have SPACE (names | arguments) SPACE?
    ;

/*
    extensions
*/

EXTEND
    : 'extend'
    ;

EXTENSION
    : 'extension'
    ;

extensions
    : EXTENSION extensionCondition? extensionOf?
    ;

extensionOf
    : SPACE of SPACE classes
    ;

extensionCondition
    : SPACE where SPACE not? SPACE? equalsTo SPACE words Comma?
    ;


/*
    implements
*/

IMPLEMENTATION
    : 'implementation'
    ;

implementations
    : IMPLEMENTATION implementationCondition? implementationOf?
    ;

implementationOf
    : SPACE of SPACE classes
    ;

implementationCondition
    : SPACE where SPACE not? SPACE? equalsTo SPACE words Comma?
    ;


/*
    functions
*/

FUNCTION
    : 'function'
    ;

functions
    : FUNCTION functionCondition? functionOf?
    ;

functionOf
    : SPACE of SPACE classes
    ;

functionCondition
    : SPACE where SPACE functionExpression Comma?
    ;

functionExpression
    : LPAREN functionExpression RPAREN
    | left=functionExpression SPACE op=binary SPACE right=functionExpression
    | SPACE? have SPACE (
              annotations | specifiers | names | parameters | returnValues
              | declarationStatements | expressionStatements
              ) SPACE?
    ;

/*
    abstractFunctions
*/

AbstractFunctions
    : 'abstract function'
    ;

abstractFunctions
    : AbstractFunctions abstractFunctionCondition? abstractFunctionOf?
    ;

abstractFunctionOf
    : SPACE of SPACE classes
    ;

abstractFunctionCondition
    : SPACE where SPACE abstractFunctionExpression Comma?
    ;

abstractFunctionExpression
    : LPAREN abstractFunctionExpression RPAREN
    | left=abstractFunctionExpression SPACE op=binary SPACE right=abstractFunctionExpression
    | SPACE? have SPACE (
              annotations | specifiers | names | parameters
              ) SPACE?
    ;


/*
    constructors
*/

CONSTRUCTOR
    : 'constructor'
    ;

constructors
    : CONSTRUCTOR constructorCondition? constructorOf?
    ;

constructorOf
    : SPACE of SPACE classes
    ;

constructorCondition
    : SPACE where SPACE constructorExpression Comma?
    ;

constructorExpression
    : LPAREN constructorExpression RPAREN
    | left=constructorExpression SPACE op=binary SPACE right=constructorExpression
    | SPACE? have SPACE (
              annotations | specifiers | parameters | returnValues
              | declarationStatements | expressionStatements
              ) SPACE?
    ;

/*
    parameters
*/

PARAMETER
    :  'parameter'
    ;

parameters
    : PARAMETER parameterCondition? parameterOf?
    ;

parameterOf
    : SPACE of SPACE (functions | constructors | abstractFunctions)
    ;

parameterCondition
    : SPACE where SPACE parameterExpression Comma?
    ;

parameterExpression
    : LPAREN parameterExpression RPAREN
    | left=parameterExpression SPACE op=binary SPACE right=parameterExpression
    | SPACE? have SPACE (names | types) SPACE?
    ;

/*
    types
*/

TYPES
    : 'type'
    ;

types
    : TYPES typeCondition? typeOf?
    ;

typeOf
    : SPACE of SPACE (parameters | declarationStatements)
    ;

typeCondition
    : SPACE where SPACE not? SPACE? equalsTo SPACE words Comma?
    ;


/*
    specifiers
*/

SPECIFIER
    :  'specifier'
    ;

specifiers
    : SPECIFIER specifierCondition? specifierOf?
    ;

specifierOf
    : SPACE of SPACE (functions | constructors | abstractFunctions | declarationStatements | classes)
    ;

specifierCondition
    : SPACE where SPACE not? SPACE? equalsTo SPACE words Comma?
    ;


/*
    return values
    // call or name or literal like expr_stmt/expr
*/

ReturnValue
    :  'return value'
    ;

returnValues
    : ReturnValue returnValueCondition? returnValueOf?
    ;

returnValueOf
    : SPACE of SPACE functions
    ;

returnValueCondition
    : SPACE where SPACE returnValueExpression Comma?
    ;

returnValueExpression
    : LPAREN returnValueExpression RPAREN
    | left=returnValueExpression SPACE op=binary SPACE right=returnValueExpression
    | SPACE? have SPACE (calls | names) SPACE?
    ;


/*
    declarationStatements
*/

DeclarationStatement
    : 'declaration statement'
    ;

declarationStatements
    : DeclarationStatement declarationStatementCondition? declarationStatementOf?
    ;

declarationStatementOf
    : SPACE of SPACE (classes | functions | constructors)
    ;

declarationStatementCondition
    : SPACE where SPACE declarationStatementExpression Comma?
    ;

declarationStatementExpression
    : LPAREN declarationStatementExpression RPAREN
    | left=declarationStatementExpression SPACE op=binary SPACE right=declarationStatementExpression
    | SPACE? have SPACE (
              annotations | specifiers | types | names | initValues
              ) SPACE?
    ;


/*
    expressions
*/

ExpressionStatement
    :  'expression statement'
    ;

expressionStatements
    : ExpressionStatement expressionStatementCondition? expressionStatementOf?
    ;

expressionStatementOf
    : SPACE of SPACE (functions | constructors | constructors)
    ;

expressionStatementCondition
    : SPACE where SPACE expressionStatementExpression Comma?
    ;

expressionStatementExpression
    : LPAREN expressionStatementExpression RPAREN
    | left=expressionStatementExpression SPACE op=binary SPACE right=expressionStatementExpression
    | SPACE? have SPACE (calls | names) SPACE?
    ;

/*
    init values
*/

InitValue
    :  'initial value'
    ;

initValues
    : InitValue initValueCondition? initValueOf?
    ;

initValueOf
    : SPACE of SPACE declarationStatements
    ;

initValueCondition
    : SPACE where SPACE initValueExpression Comma?
    ;

initValueExpression
    : LPAREN initValueExpression RPAREN
    | left=initValueExpression SPACE op=binary SPACE right=initValueExpression
    | SPACE? have SPACE (calls | names) SPACE?
    ;

/*
    arguments
*/

ARGUMENT
    :  'argument'
    ;

arguments
    : ARGUMENT argumentCondition? argumentOf?
    ;

argumentOf
    : SPACE of SPACE calls
    ;

argumentCondition
    : SPACE where SPACE argumentExpression Comma?
    ;

argumentExpression
    : LPAREN argumentExpression RPAREN
    | left=argumentExpression SPACE op=binary SPACE right=argumentExpression
    | SPACE? have SPACE (calls | names) SPACE?
    ;

/*
    calls
*/

CALL
    : 'call'
    ;

calls
    : CALL callCondition? callOf?
    ;

callOf
    : SPACE of SPACE (arguments | returnValues | expressionStatements | initValues)
    ;

callCondition
    : SPACE where SPACE callerExpression Comma?
    ;

callerExpression
    : LPAREN callerExpression RPAREN
    | left=callerExpression SPACE op=binary SPACE right=callerExpression
    | SPACE? have SPACE (callers | names) SPACE?
    ;


/*
    callers
*/

CALLER
    : 'caller'
    ;

callers
    : CALLER callerCondition? callerOf?
    ;

callerOf
    : SPACE of SPACE calls
    ;

callerCondition
    : SPACE where SPACE have SPACE NAME SPACE not? SPACE? equalsTo SPACE words Comma?
    ;


/*
    values = expr
*/

VALUE
    : 'value'
    ;

values
    : VALUE valueCondition? valueOf?
    ;

valueOf
    : SPACE of SPACE (arguments | returnValues | expressionStatements | initValues)
    ;

valueCondition
    : SPACE where SPACE not? SPACE? equalsTo words Comma?
    ;


/*
    classes
*/

CLASSES
    : 'class' | 'subclass'
    ;

classes
    : CLASSES classCondition? classOf?
    ;

classOf
    : SPACE of SPACE classes
    ;

classCondition
    : SPACE where SPACE classExpression Comma?
    ;

classExpression
    : LPAREN classExpression RPAREN
    | left=classExpression SPACE op=binary SPACE right=classExpression
    | SPACE? have SPACE (
              annotations | specifiers | names | extensions | implementations | functions
              | abstractFunctions | constructors | declarationStatements | classes | returnValues
              ) SPACE?
    ;
