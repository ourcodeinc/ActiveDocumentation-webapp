// Generated from rulePadGrammar.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by rulePadGrammarParser.
function rulePadGrammarListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

rulePadGrammarListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
rulePadGrammarListener.prototype.constructor = rulePadGrammarListener;

// Enter a parse tree produced by rulePadGrammarParser#inputSentence.
rulePadGrammarListener.prototype.enterInputSentence = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#inputSentence.
rulePadGrammarListener.prototype.exitInputSentence = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#partialClause.
rulePadGrammarListener.prototype.enterPartialClause = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#partialClause.
rulePadGrammarListener.prototype.exitPartialClause = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#mustClause.
rulePadGrammarListener.prototype.enterMustClause = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#mustClause.
rulePadGrammarListener.prototype.exitMustClause = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#words.
rulePadGrammarListener.prototype.enterWords = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#words.
rulePadGrammarListener.prototype.exitWords = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#word.
rulePadGrammarListener.prototype.enterWord = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#word.
rulePadGrammarListener.prototype.exitWord = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#combinatorialWords.
rulePadGrammarListener.prototype.enterCombinatorialWords = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#combinatorialWords.
rulePadGrammarListener.prototype.exitCombinatorialWords = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#symbols.
rulePadGrammarListener.prototype.enterSymbols = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#symbols.
rulePadGrammarListener.prototype.exitSymbols = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#end.
rulePadGrammarListener.prototype.enterEnd = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#end.
rulePadGrammarListener.prototype.exitEnd = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#emptyLine.
rulePadGrammarListener.prototype.enterEmptyLine = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#emptyLine.
rulePadGrammarListener.prototype.exitEmptyLine = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#identifier.
rulePadGrammarListener.prototype.enterIdentifier = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#identifier.
rulePadGrammarListener.prototype.exitIdentifier = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#identifiers.
rulePadGrammarListener.prototype.enterIdentifiers = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#identifiers.
rulePadGrammarListener.prototype.exitIdentifiers = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#commentPrefix.
rulePadGrammarListener.prototype.enterCommentPrefix = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#commentPrefix.
rulePadGrammarListener.prototype.exitCommentPrefix = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#comments.
rulePadGrammarListener.prototype.enterComments = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#comments.
rulePadGrammarListener.prototype.exitComments = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#must.
rulePadGrammarListener.prototype.enterMust = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#must.
rulePadGrammarListener.prototype.exitMust = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#of.
rulePadGrammarListener.prototype.enterOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#of.
rulePadGrammarListener.prototype.exitOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#and.
rulePadGrammarListener.prototype.enterAnd = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#and.
rulePadGrammarListener.prototype.exitAnd = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#or.
rulePadGrammarListener.prototype.enterOr = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#or.
rulePadGrammarListener.prototype.exitOr = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#have.
rulePadGrammarListener.prototype.enterHave = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#have.
rulePadGrammarListener.prototype.exitHave = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#withWord.
rulePadGrammarListener.prototype.enterWithWord = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#withWord.
rulePadGrammarListener.prototype.exitWithWord = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#binary.
rulePadGrammarListener.prototype.enterBinary = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#binary.
rulePadGrammarListener.prototype.exitBinary = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#names.
rulePadGrammarListener.prototype.enterNames = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#names.
rulePadGrammarListener.prototype.exitNames = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#nameCondition.
rulePadGrammarListener.prototype.enterNameCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#nameCondition.
rulePadGrammarListener.prototype.exitNameCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#classNames.
rulePadGrammarListener.prototype.enterClassNames = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#classNames.
rulePadGrammarListener.prototype.exitClassNames = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#classNameCondition.
rulePadGrammarListener.prototype.enterClassNameCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#classNameCondition.
rulePadGrammarListener.prototype.exitClassNameCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#annotations.
rulePadGrammarListener.prototype.enterAnnotations = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#annotations.
rulePadGrammarListener.prototype.exitAnnotations = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#annotationCondition.
rulePadGrammarListener.prototype.enterAnnotationCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#annotationCondition.
rulePadGrammarListener.prototype.exitAnnotationCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#extensions.
rulePadGrammarListener.prototype.enterExtensions = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#extensions.
rulePadGrammarListener.prototype.exitExtensions = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#extensionCondition.
rulePadGrammarListener.prototype.enterExtensionCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#extensionCondition.
rulePadGrammarListener.prototype.exitExtensionCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#implementations.
rulePadGrammarListener.prototype.enterImplementations = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#implementations.
rulePadGrammarListener.prototype.exitImplementations = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#implementationCondition.
rulePadGrammarListener.prototype.enterImplementationCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#implementationCondition.
rulePadGrammarListener.prototype.exitImplementationCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#functions.
rulePadGrammarListener.prototype.enterFunctions = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#functions.
rulePadGrammarListener.prototype.exitFunctions = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#functionOf.
rulePadGrammarListener.prototype.enterFunctionOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#functionOf.
rulePadGrammarListener.prototype.exitFunctionOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#functionCondition.
rulePadGrammarListener.prototype.enterFunctionCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#functionCondition.
rulePadGrammarListener.prototype.exitFunctionCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#functionExpression.
rulePadGrammarListener.prototype.enterFunctionExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#functionExpression.
rulePadGrammarListener.prototype.exitFunctionExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#abstractFunctions.
rulePadGrammarListener.prototype.enterAbstractFunctions = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#abstractFunctions.
rulePadGrammarListener.prototype.exitAbstractFunctions = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#abstractFunctionOf.
rulePadGrammarListener.prototype.enterAbstractFunctionOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#abstractFunctionOf.
rulePadGrammarListener.prototype.exitAbstractFunctionOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#abstractFunctionCondition.
rulePadGrammarListener.prototype.enterAbstractFunctionCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#abstractFunctionCondition.
rulePadGrammarListener.prototype.exitAbstractFunctionCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#abstractFunctionExpression.
rulePadGrammarListener.prototype.enterAbstractFunctionExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#abstractFunctionExpression.
rulePadGrammarListener.prototype.exitAbstractFunctionExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#constructors.
rulePadGrammarListener.prototype.enterConstructors = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#constructors.
rulePadGrammarListener.prototype.exitConstructors = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#constructorOf.
rulePadGrammarListener.prototype.enterConstructorOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#constructorOf.
rulePadGrammarListener.prototype.exitConstructorOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#constructorCondition.
rulePadGrammarListener.prototype.enterConstructorCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#constructorCondition.
rulePadGrammarListener.prototype.exitConstructorCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#constructorExpression.
rulePadGrammarListener.prototype.enterConstructorExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#constructorExpression.
rulePadGrammarListener.prototype.exitConstructorExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#parameters.
rulePadGrammarListener.prototype.enterParameters = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#parameters.
rulePadGrammarListener.prototype.exitParameters = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#parameterCondition.
rulePadGrammarListener.prototype.enterParameterCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#parameterCondition.
rulePadGrammarListener.prototype.exitParameterCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#parameterExpression.
rulePadGrammarListener.prototype.enterParameterExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#parameterExpression.
rulePadGrammarListener.prototype.exitParameterExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#types.
rulePadGrammarListener.prototype.enterTypes = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#types.
rulePadGrammarListener.prototype.exitTypes = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#typeCondition.
rulePadGrammarListener.prototype.enterTypeCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#typeCondition.
rulePadGrammarListener.prototype.exitTypeCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#specifiers.
rulePadGrammarListener.prototype.enterSpecifiers = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#specifiers.
rulePadGrammarListener.prototype.exitSpecifiers = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#specifierCondition.
rulePadGrammarListener.prototype.enterSpecifierCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#specifierCondition.
rulePadGrammarListener.prototype.exitSpecifierCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#visibilities.
rulePadGrammarListener.prototype.enterVisibilities = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#visibilities.
rulePadGrammarListener.prototype.exitVisibilities = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#visibilityCondition.
rulePadGrammarListener.prototype.enterVisibilityCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#visibilityCondition.
rulePadGrammarListener.prototype.exitVisibilityCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#returnValues.
rulePadGrammarListener.prototype.enterReturnValues = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#returnValues.
rulePadGrammarListener.prototype.exitReturnValues = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#returnValueCondition.
rulePadGrammarListener.prototype.enterReturnValueCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#returnValueCondition.
rulePadGrammarListener.prototype.exitReturnValueCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#declarationStatements.
rulePadGrammarListener.prototype.enterDeclarationStatements = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#declarationStatements.
rulePadGrammarListener.prototype.exitDeclarationStatements = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#declarationStatementOf.
rulePadGrammarListener.prototype.enterDeclarationStatementOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#declarationStatementOf.
rulePadGrammarListener.prototype.exitDeclarationStatementOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#declarationStatementCondition.
rulePadGrammarListener.prototype.enterDeclarationStatementCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#declarationStatementCondition.
rulePadGrammarListener.prototype.exitDeclarationStatementCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#declarationStatementExpression.
rulePadGrammarListener.prototype.enterDeclarationStatementExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#declarationStatementExpression.
rulePadGrammarListener.prototype.exitDeclarationStatementExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#expressionStatements.
rulePadGrammarListener.prototype.enterExpressionStatements = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#expressionStatements.
rulePadGrammarListener.prototype.exitExpressionStatements = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#expressionStatementOf.
rulePadGrammarListener.prototype.enterExpressionStatementOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#expressionStatementOf.
rulePadGrammarListener.prototype.exitExpressionStatementOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#expressionStatementCondition.
rulePadGrammarListener.prototype.enterExpressionStatementCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#expressionStatementCondition.
rulePadGrammarListener.prototype.exitExpressionStatementCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#expressionStatementExpression.
rulePadGrammarListener.prototype.enterExpressionStatementExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#expressionStatementExpression.
rulePadGrammarListener.prototype.exitExpressionStatementExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#value.
rulePadGrammarListener.prototype.enterValue = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#value.
rulePadGrammarListener.prototype.exitValue = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#valueCondition.
rulePadGrammarListener.prototype.enterValueCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#valueCondition.
rulePadGrammarListener.prototype.exitValueCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#initialValues.
rulePadGrammarListener.prototype.enterInitialValues = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#initialValues.
rulePadGrammarListener.prototype.exitInitialValues = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#initialValueOf.
rulePadGrammarListener.prototype.enterInitialValueOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#initialValueOf.
rulePadGrammarListener.prototype.exitInitialValueOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#initialValueCondition.
rulePadGrammarListener.prototype.enterInitialValueCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#initialValueCondition.
rulePadGrammarListener.prototype.exitInitialValueCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#classes.
rulePadGrammarListener.prototype.enterClasses = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#classes.
rulePadGrammarListener.prototype.exitClasses = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#classCondition.
rulePadGrammarListener.prototype.enterClassCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#classCondition.
rulePadGrammarListener.prototype.exitClassCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#classExpression.
rulePadGrammarListener.prototype.enterClassExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#classExpression.
rulePadGrammarListener.prototype.exitClassExpression = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#subclasses.
rulePadGrammarListener.prototype.enterSubclasses = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#subclasses.
rulePadGrammarListener.prototype.exitSubclasses = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#subclassOf.
rulePadGrammarListener.prototype.enterSubclassOf = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#subclassOf.
rulePadGrammarListener.prototype.exitSubclassOf = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#subclassCondition.
rulePadGrammarListener.prototype.enterSubclassCondition = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#subclassCondition.
rulePadGrammarListener.prototype.exitSubclassCondition = function(ctx) {
};


// Enter a parse tree produced by rulePadGrammarParser#subclassExpression.
rulePadGrammarListener.prototype.enterSubclassExpression = function(ctx) {
};

// Exit a parse tree produced by rulePadGrammarParser#subclassExpression.
rulePadGrammarListener.prototype.exitSubclassExpression = function(ctx) {
};



exports.rulePadGrammarListener = rulePadGrammarListener;