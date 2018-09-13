// Generated from myGrammar.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by myGrammarParser.
function myGrammarListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

myGrammarListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
myGrammarListener.prototype.constructor = myGrammarListener;

// Enter a parse tree produced by myGrammarParser#inputSentence.
myGrammarListener.prototype.enterInputSentence = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#inputSentence.
myGrammarListener.prototype.exitInputSentence = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#designRule.
myGrammarListener.prototype.enterDesignRule = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#designRule.
myGrammarListener.prototype.exitDesignRule = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#mustClause.
myGrammarListener.prototype.enterMustClause = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#mustClause.
myGrammarListener.prototype.exitMustClause = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#mustBeEqualToClause.
myGrammarListener.prototype.enterMustBeEqualToClause = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#mustBeEqualToClause.
myGrammarListener.prototype.exitMustBeEqualToClause = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#words.
myGrammarListener.prototype.enterWords = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#words.
myGrammarListener.prototype.exitWords = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#end.
myGrammarListener.prototype.enterEnd = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#end.
myGrammarListener.prototype.exitEnd = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#emptyLine.
myGrammarListener.prototype.enterEmptyLine = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#emptyLine.
myGrammarListener.prototype.exitEmptyLine = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#be.
myGrammarListener.prototype.enterBe = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#be.
myGrammarListener.prototype.exitBe = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#must.
myGrammarListener.prototype.enterMust = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#must.
myGrammarListener.prototype.exitMust = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#mustBeEqualTo.
myGrammarListener.prototype.enterMustBeEqualTo = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#mustBeEqualTo.
myGrammarListener.prototype.exitMustBeEqualTo = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#where.
myGrammarListener.prototype.enterWhere = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#where.
myGrammarListener.prototype.exitWhere = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#of.
myGrammarListener.prototype.enterOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#of.
myGrammarListener.prototype.exitOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#and.
myGrammarListener.prototype.enterAnd = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#and.
myGrammarListener.prototype.exitAnd = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#or.
myGrammarListener.prototype.enterOr = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#or.
myGrammarListener.prototype.exitOr = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#have.
myGrammarListener.prototype.enterHave = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#have.
myGrammarListener.prototype.exitHave = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#equalsTo.
myGrammarListener.prototype.enterEqualsTo = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#equalsTo.
myGrammarListener.prototype.exitEqualsTo = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#includes.
myGrammarListener.prototype.enterIncludes = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#includes.
myGrammarListener.prototype.exitIncludes = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#not.
myGrammarListener.prototype.enterNot = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#not.
myGrammarListener.prototype.exitNot = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#binary.
myGrammarListener.prototype.enterBinary = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#binary.
myGrammarListener.prototype.exitBinary = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#names.
myGrammarListener.prototype.enterNames = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#names.
myGrammarListener.prototype.exitNames = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#nameOf.
myGrammarListener.prototype.enterNameOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#nameOf.
myGrammarListener.prototype.exitNameOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#nameCondition.
myGrammarListener.prototype.enterNameCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#nameCondition.
myGrammarListener.prototype.exitNameCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#annotations.
myGrammarListener.prototype.enterAnnotations = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#annotations.
myGrammarListener.prototype.exitAnnotations = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#annotationOf.
myGrammarListener.prototype.enterAnnotationOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#annotationOf.
myGrammarListener.prototype.exitAnnotationOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#annotationCondition.
myGrammarListener.prototype.enterAnnotationCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#annotationCondition.
myGrammarListener.prototype.exitAnnotationCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#annotationExpression.
myGrammarListener.prototype.enterAnnotationExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#annotationExpression.
myGrammarListener.prototype.exitAnnotationExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#extensions.
myGrammarListener.prototype.enterExtensions = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#extensions.
myGrammarListener.prototype.exitExtensions = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#extensionOf.
myGrammarListener.prototype.enterExtensionOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#extensionOf.
myGrammarListener.prototype.exitExtensionOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#extensionCondition.
myGrammarListener.prototype.enterExtensionCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#extensionCondition.
myGrammarListener.prototype.exitExtensionCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#functions.
myGrammarListener.prototype.enterFunctions = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#functions.
myGrammarListener.prototype.exitFunctions = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#functionOf.
myGrammarListener.prototype.enterFunctionOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#functionOf.
myGrammarListener.prototype.exitFunctionOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#functionCondition.
myGrammarListener.prototype.enterFunctionCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#functionCondition.
myGrammarListener.prototype.exitFunctionCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#functionExpression.
myGrammarListener.prototype.enterFunctionExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#functionExpression.
myGrammarListener.prototype.exitFunctionExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#abstractFunctions.
myGrammarListener.prototype.enterAbstractFunctions = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#abstractFunctions.
myGrammarListener.prototype.exitAbstractFunctions = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#abstractFunctionOf.
myGrammarListener.prototype.enterAbstractFunctionOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#abstractFunctionOf.
myGrammarListener.prototype.exitAbstractFunctionOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#abstractFunctionCondition.
myGrammarListener.prototype.enterAbstractFunctionCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#abstractFunctionCondition.
myGrammarListener.prototype.exitAbstractFunctionCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#abstractFunctionExpression.
myGrammarListener.prototype.enterAbstractFunctionExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#abstractFunctionExpression.
myGrammarListener.prototype.exitAbstractFunctionExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#constructors.
myGrammarListener.prototype.enterConstructors = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#constructors.
myGrammarListener.prototype.exitConstructors = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#constructorOf.
myGrammarListener.prototype.enterConstructorOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#constructorOf.
myGrammarListener.prototype.exitConstructorOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#constructorCondition.
myGrammarListener.prototype.enterConstructorCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#constructorCondition.
myGrammarListener.prototype.exitConstructorCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#constructorExpression.
myGrammarListener.prototype.enterConstructorExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#constructorExpression.
myGrammarListener.prototype.exitConstructorExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#parameters.
myGrammarListener.prototype.enterParameters = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#parameters.
myGrammarListener.prototype.exitParameters = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#parameterOf.
myGrammarListener.prototype.enterParameterOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#parameterOf.
myGrammarListener.prototype.exitParameterOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#parameterCondition.
myGrammarListener.prototype.enterParameterCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#parameterCondition.
myGrammarListener.prototype.exitParameterCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#parameterExpression.
myGrammarListener.prototype.enterParameterExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#parameterExpression.
myGrammarListener.prototype.exitParameterExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#types.
myGrammarListener.prototype.enterTypes = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#types.
myGrammarListener.prototype.exitTypes = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#typeOf.
myGrammarListener.prototype.enterTypeOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#typeOf.
myGrammarListener.prototype.exitTypeOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#typeCondition.
myGrammarListener.prototype.enterTypeCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#typeCondition.
myGrammarListener.prototype.exitTypeCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#specifiers.
myGrammarListener.prototype.enterSpecifiers = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#specifiers.
myGrammarListener.prototype.exitSpecifiers = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#specifierOf.
myGrammarListener.prototype.enterSpecifierOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#specifierOf.
myGrammarListener.prototype.exitSpecifierOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#specifierCondition.
myGrammarListener.prototype.enterSpecifierCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#specifierCondition.
myGrammarListener.prototype.exitSpecifierCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#returnValues.
myGrammarListener.prototype.enterReturnValues = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#returnValues.
myGrammarListener.prototype.exitReturnValues = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#returnValueOf.
myGrammarListener.prototype.enterReturnValueOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#returnValueOf.
myGrammarListener.prototype.exitReturnValueOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#returnValueCondition.
myGrammarListener.prototype.enterReturnValueCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#returnValueCondition.
myGrammarListener.prototype.exitReturnValueCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#returnValueExpression.
myGrammarListener.prototype.enterReturnValueExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#returnValueExpression.
myGrammarListener.prototype.exitReturnValueExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#declarationStatements.
myGrammarListener.prototype.enterDeclarationStatements = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#declarationStatements.
myGrammarListener.prototype.exitDeclarationStatements = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#declarationStatementOf.
myGrammarListener.prototype.enterDeclarationStatementOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#declarationStatementOf.
myGrammarListener.prototype.exitDeclarationStatementOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#declarationStatementCondition.
myGrammarListener.prototype.enterDeclarationStatementCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#declarationStatementCondition.
myGrammarListener.prototype.exitDeclarationStatementCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#declarationStatementExpression.
myGrammarListener.prototype.enterDeclarationStatementExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#declarationStatementExpression.
myGrammarListener.prototype.exitDeclarationStatementExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#expressionStatements.
myGrammarListener.prototype.enterExpressionStatements = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#expressionStatements.
myGrammarListener.prototype.exitExpressionStatements = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#expressionStatementOf.
myGrammarListener.prototype.enterExpressionStatementOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#expressionStatementOf.
myGrammarListener.prototype.exitExpressionStatementOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#expressionStatementCondition.
myGrammarListener.prototype.enterExpressionStatementCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#expressionStatementCondition.
myGrammarListener.prototype.exitExpressionStatementCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#expressionStatementExpression.
myGrammarListener.prototype.enterExpressionStatementExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#expressionStatementExpression.
myGrammarListener.prototype.exitExpressionStatementExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initValues.
myGrammarListener.prototype.enterInitValues = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initValues.
myGrammarListener.prototype.exitInitValues = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initValueOf.
myGrammarListener.prototype.enterInitValueOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initValueOf.
myGrammarListener.prototype.exitInitValueOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initValueCondition.
myGrammarListener.prototype.enterInitValueCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initValueCondition.
myGrammarListener.prototype.exitInitValueCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initValueExpression.
myGrammarListener.prototype.enterInitValueExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initValueExpression.
myGrammarListener.prototype.exitInitValueExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#arguments.
myGrammarListener.prototype.enterArguments = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#arguments.
myGrammarListener.prototype.exitArguments = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#argumentOf.
myGrammarListener.prototype.enterArgumentOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#argumentOf.
myGrammarListener.prototype.exitArgumentOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#argumentCondition.
myGrammarListener.prototype.enterArgumentCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#argumentCondition.
myGrammarListener.prototype.exitArgumentCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#argumentExpression.
myGrammarListener.prototype.enterArgumentExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#argumentExpression.
myGrammarListener.prototype.exitArgumentExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#calls.
myGrammarListener.prototype.enterCalls = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#calls.
myGrammarListener.prototype.exitCalls = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callOf.
myGrammarListener.prototype.enterCallOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callOf.
myGrammarListener.prototype.exitCallOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callCondition.
myGrammarListener.prototype.enterCallCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callCondition.
myGrammarListener.prototype.exitCallCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callerExpression.
myGrammarListener.prototype.enterCallerExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callerExpression.
myGrammarListener.prototype.exitCallerExpression = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callers.
myGrammarListener.prototype.enterCallers = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callers.
myGrammarListener.prototype.exitCallers = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callerOf.
myGrammarListener.prototype.enterCallerOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callerOf.
myGrammarListener.prototype.exitCallerOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#callerCondition.
myGrammarListener.prototype.enterCallerCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#callerCondition.
myGrammarListener.prototype.exitCallerCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#values.
myGrammarListener.prototype.enterValues = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#values.
myGrammarListener.prototype.exitValues = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#valueOf.
myGrammarListener.prototype.enterValueOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#valueOf.
myGrammarListener.prototype.exitValueOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#valueCondition.
myGrammarListener.prototype.enterValueCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#valueCondition.
myGrammarListener.prototype.exitValueCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#classes.
myGrammarListener.prototype.enterClasses = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#classes.
myGrammarListener.prototype.exitClasses = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#classOf.
myGrammarListener.prototype.enterClassOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#classOf.
myGrammarListener.prototype.exitClassOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#classCondition.
myGrammarListener.prototype.enterClassCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#classCondition.
myGrammarListener.prototype.exitClassCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#classExpression.
myGrammarListener.prototype.enterClassExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#classExpression.
myGrammarListener.prototype.exitClassExpression = function(ctx) {
};



exports.myGrammarListener = myGrammarListener;