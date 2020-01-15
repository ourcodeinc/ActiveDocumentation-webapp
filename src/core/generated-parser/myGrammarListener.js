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


// Enter a parse tree produced by myGrammarParser#mustClause.
myGrammarListener.prototype.enterMustClause = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#mustClause.
myGrammarListener.prototype.exitMustClause = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#words.
myGrammarListener.prototype.enterWords = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#words.
myGrammarListener.prototype.exitWords = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#word.
myGrammarListener.prototype.enterWord = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#word.
myGrammarListener.prototype.exitWord = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#oldWords.
myGrammarListener.prototype.enterOldWords = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#oldWords.
myGrammarListener.prototype.exitOldWords = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#combinatorialWords.
myGrammarListener.prototype.enterCombinatorialWords = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#combinatorialWords.
myGrammarListener.prototype.exitCombinatorialWords = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#symbols.
myGrammarListener.prototype.enterSymbols = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#symbols.
myGrammarListener.prototype.exitSymbols = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#must.
myGrammarListener.prototype.enterMust = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#must.
myGrammarListener.prototype.exitMust = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#withWord.
myGrammarListener.prototype.enterWithWord = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#withWord.
myGrammarListener.prototype.exitWithWord = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#implementations.
myGrammarListener.prototype.enterImplementations = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#implementations.
myGrammarListener.prototype.exitImplementations = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#implementationOf.
myGrammarListener.prototype.enterImplementationOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#implementationOf.
myGrammarListener.prototype.exitImplementationOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#implementationCondition.
myGrammarListener.prototype.enterImplementationCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#implementationCondition.
myGrammarListener.prototype.exitImplementationCondition = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#visibilities.
myGrammarListener.prototype.enterVisibilities = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#visibilities.
myGrammarListener.prototype.exitVisibilities = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#visibilityOf.
myGrammarListener.prototype.enterVisibilityOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#visibilityOf.
myGrammarListener.prototype.exitVisibilityOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#visibilityCondition.
myGrammarListener.prototype.enterVisibilityCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#visibilityCondition.
myGrammarListener.prototype.exitVisibilityCondition = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#initialValues.
myGrammarListener.prototype.enterInitialValues = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initialValues.
myGrammarListener.prototype.exitInitialValues = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initialValueOf.
myGrammarListener.prototype.enterInitialValueOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initialValueOf.
myGrammarListener.prototype.exitInitialValueOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#initialValueCondition.
myGrammarListener.prototype.enterInitialValueCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#initialValueCondition.
myGrammarListener.prototype.exitInitialValueCondition = function(ctx) {
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


// Enter a parse tree produced by myGrammarParser#interfaces.
myGrammarListener.prototype.enterInterfaces = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#interfaces.
myGrammarListener.prototype.exitInterfaces = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#interfaceOf.
myGrammarListener.prototype.enterInterfaceOf = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#interfaceOf.
myGrammarListener.prototype.exitInterfaceOf = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#interfaceCondition.
myGrammarListener.prototype.enterInterfaceCondition = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#interfaceCondition.
myGrammarListener.prototype.exitInterfaceCondition = function(ctx) {
};


// Enter a parse tree produced by myGrammarParser#interfaceExpression.
myGrammarListener.prototype.enterInterfaceExpression = function(ctx) {
};

// Exit a parse tree produced by myGrammarParser#interfaceExpression.
myGrammarListener.prototype.exitInterfaceExpression = function(ctx) {
};



exports.myGrammarListener = myGrammarListener;