// Generated from myGrammar.g4 by ANTLR 4.7.1
// jshint ignore: start
/* eslint-disable */
var antlr4 = require('antlr4/index');
var myGrammarListener = require('./myGrammarListener').myGrammarListener;
var grammarFileName = "myGrammar.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003)\u026e\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t",
    "\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e\t\u001e\u0004",
    "\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#\t#\u0004$\t$\u0004",
    "%\t%\u0004&\t&\u0004\'\t\'\u0004(\t(\u0004)\t)\u0004*\t*\u0004+\t+\u0004",
    ",\t,\u0004-\t-\u0004.\t.\u0004/\t/\u00040\t0\u00041\t1\u00042\t2\u0004",
    "3\t3\u00044\t4\u00045\t5\u00046\t6\u00047\t7\u00048\t8\u00049\t9\u0004",
    ":\t:\u0004;\t;\u0004<\t<\u0004=\t=\u0004>\t>\u0003\u0002\u0007\u0002",
    "~\n\u0002\f\u0002\u000e\u0002\u0081\u000b\u0002\u0003\u0002\u0005\u0002",
    "\u0084\n\u0002\u0003\u0002\u0005\u0002\u0087\n\u0002\u0003\u0002\u0007",
    "\u0002\u008a\n\u0002\f\u0002\u000e\u0002\u008d\u000b\u0002\u0003\u0002",
    "\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0005\u0003\u00af\n\u0003\u0003\u0004\u0003\u0004\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0007\u0004\u00b8",
    "\n\u0004\f\u0004\u000e\u0004\u00bb\u000b\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0005\u0006\u0005\u00c1\n\u0005\r\u0005\u000e\u0005",
    "\u00c2\u0003\u0005\u0003\u0005\u0006\u0005\u00c7\n\u0005\r\u0005\u000e",
    "\u0005\u00c8\u0003\u0005\u0003\u0005\u0006\u0005\u00cd\n\u0005\r\u0005",
    "\u000e\u0005\u00ce\u0003\u0005\u0003\u0005\u0006\u0005\u00d3\n\u0005",
    "\r\u0005\u000e\u0005\u00d4\u0003\u0005\u0006\u0005\u00d8\n\u0005\r\u0005",
    "\u000e\u0005\u00d9\u0003\u0005\u0003\u0005\u0003\u0005\u0006\u0005\u00df",
    "\n\u0005\r\u0005\u000e\u0005\u00e0\u0003\u0005\u0003\u0005\u0003\u0005",
    "\u0006\u0005\u00e6\n\u0005\r\u0005\u000e\u0005\u00e7\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0006\u0005\u00ed\n\u0005\r\u0005\u000e\u0005\u00ee",
    "\u0003\u0005\u0005\u0005\u00f2\n\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0006\u0006\u00f8\n\u0006\r\u0006\u000e\u0006\u00f9",
    "\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b\u0003\b\u0003",
    "\t\u0003\t\u0003\n\u0003\n\u0003\n\u0003\n\u0006\n\u0108\n\n\r\n\u000e",
    "\n\u0109\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\f\u0003\f\u0003",
    "\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003\u0010",
    "\u0003\u0010\u0003\u0011\u0003\u0011\u0005\u0011\u011c\n\u0011\u0003",
    "\u0012\u0003\u0012\u0005\u0012\u0120\n\u0012\u0003\u0013\u0003\u0013",
    "\u0003\u0013\u0003\u0014\u0003\u0014\u0005\u0014\u0127\n\u0014\u0003",
    "\u0015\u0003\u0015\u0003\u0015\u0003\u0016\u0003\u0016\u0003\u0016\u0003",
    "\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0005\u0017\u0134",
    "\n\u0017\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0019\u0003\u0019",
    "\u0003\u0019\u0003\u0019\u0003\u0019\u0005\u0019\u013e\n\u0019\u0003",
    "\u001a\u0003\u001a\u0005\u001a\u0142\n\u001a\u0003\u001a\u0005\u001a",
    "\u0145\n\u001a\u0003\u001b\u0003\u001b\u0003\u001b\u0003\u001c\u0003",
    "\u001c\u0003\u001c\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0005\u001d\u015c",
    "\n\u001d\u0005\u001d\u015e\n\u001d\u0003\u001d\u0003\u001d\u0003\u001d",
    "\u0003\u001d\u0003\u001d\u0003\u001d\u0007\u001d\u0166\n\u001d\f\u001d",
    "\u000e\u001d\u0169\u000b\u001d\u0003\u001e\u0003\u001e\u0005\u001e\u016d",
    "\n\u001e\u0003\u001e\u0005\u001e\u0170\n\u001e\u0003\u001f\u0003\u001f",
    "\u0003\u001f\u0003 \u0003 \u0003 \u0003!\u0003!\u0003!\u0003!\u0003",
    "!\u0003!\u0003!\u0003!\u0003!\u0003!\u0003!\u0005!\u0183\n!\u0005!\u0185",
    "\n!\u0003!\u0003!\u0003!\u0003!\u0003!\u0003!\u0007!\u018d\n!\f!\u000e",
    "!\u0190\u000b!\u0003\"\u0003\"\u0005\"\u0194\n\"\u0003\"\u0005\"\u0197",
    "\n\"\u0003#\u0003#\u0003#\u0003$\u0003$\u0003$\u0003%\u0003%\u0003%",
    "\u0003%\u0003%\u0003%\u0003%\u0003%\u0003%\u0003%\u0003%\u0003%\u0003",
    "%\u0005%\u01ac\n%\u0005%\u01ae\n%\u0003%\u0003%\u0003%\u0003%\u0003",
    "%\u0003%\u0007%\u01b6\n%\f%\u000e%\u01b9\u000b%\u0003&\u0003&\u0005",
    "&\u01bd\n&\u0003\'\u0003\'\u0003\'\u0003(\u0003(\u0003(\u0003(\u0003",
    "(\u0003(\u0003(\u0005(\u01c9\n(\u0005(\u01cb\n(\u0003(\u0003(\u0003",
    "(\u0003(\u0003(\u0003(\u0007(\u01d3\n(\f(\u000e(\u01d6\u000b(\u0003",
    ")\u0003)\u0005)\u01da\n)\u0003*\u0003*\u0003*\u0003*\u0003*\u0003*\u0005",
    "*\u01e2\n*\u0003+\u0003+\u0005+\u01e6\n+\u0003,\u0003,\u0003,\u0003",
    "-\u0003-\u0005-\u01ed\n-\u0003.\u0003.\u0003.\u0003/\u0003/\u0005/\u01f4",
    "\n/\u00030\u00030\u00030\u00031\u00031\u00051\u01fb\n1\u00031\u0005",
    "1\u01fe\n1\u00032\u00032\u00032\u00032\u00052\u0204\n2\u00033\u0003",
    "3\u00033\u00034\u00034\u00034\u00034\u00034\u00034\u00034\u00034\u0003",
    "4\u00034\u00034\u00054\u0214\n4\u00054\u0216\n4\u00034\u00034\u0003",
    "4\u00034\u00034\u00034\u00074\u021e\n4\f4\u000e4\u0221\u000b4\u0003",
    "5\u00035\u00055\u0225\n5\u00035\u00055\u0228\n5\u00036\u00036\u0003",
    "6\u00036\u00056\u022e\n6\u00037\u00037\u00037\u00038\u00038\u00058\u0235",
    "\n8\u00038\u00058\u0238\n8\u00039\u00039\u00039\u0003:\u0003:\u0003",
    ":\u0003;\u0003;\u0005;\u0242\n;\u0003;\u0005;\u0245\n;\u0003<\u0003",
    "<\u0003<\u0003=\u0003=\u0003=\u0003>\u0003>\u0003>\u0003>\u0003>\u0003",
    ">\u0003>\u0003>\u0003>\u0003>\u0003>\u0003>\u0003>\u0003>\u0003>\u0003",
    ">\u0003>\u0003>\u0005>\u025f\n>\u0005>\u0261\n>\u0003>\u0003>\u0003",
    ">\u0003>\u0003>\u0003>\u0007>\u0269\n>\f>\u000e>\u026c\u000b>\u0003",
    ">\u0002\b8@HNfz?\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016",
    "\u0018\u001a\u001c\u001e \"$&(*,.02468:<>@BDFHJLNPRTVXZ\\^`bdfhjlnp",
    "rtvxz\u0002\u0003\u0004\u0002\t\f\u0016\u0017\u0002\u02a6\u0002\u0083",
    "\u0003\u0002\u0002\u0002\u0004\u00ae\u0003\u0002\u0002\u0002\u0006\u00b0",
    "\u0003\u0002\u0002\u0002\b\u00f1\u0003\u0002\u0002\u0002\n\u00f3\u0003",
    "\u0002\u0002\u0002\f\u00fd\u0003\u0002\u0002\u0002\u000e\u00ff\u0003",
    "\u0002\u0002\u0002\u0010\u0101\u0003\u0002\u0002\u0002\u0012\u0103\u0003",
    "\u0002\u0002\u0002\u0014\u010d\u0003\u0002\u0002\u0002\u0016\u010f\u0003",
    "\u0002\u0002\u0002\u0018\u0111\u0003\u0002\u0002\u0002\u001a\u0113\u0003",
    "\u0002\u0002\u0002\u001c\u0115\u0003\u0002\u0002\u0002\u001e\u0117\u0003",
    "\u0002\u0002\u0002 \u011b\u0003\u0002\u0002\u0002\"\u011d\u0003\u0002",
    "\u0002\u0002$\u0121\u0003\u0002\u0002\u0002&\u0124\u0003\u0002\u0002",
    "\u0002(\u0128\u0003\u0002\u0002\u0002*\u012b\u0003\u0002\u0002\u0002",
    ",\u012e\u0003\u0002\u0002\u0002.\u0135\u0003\u0002\u0002\u00020\u0138",
    "\u0003\u0002\u0002\u00022\u013f\u0003\u0002\u0002\u00024\u0146\u0003",
    "\u0002\u0002\u00026\u0149\u0003\u0002\u0002\u00028\u015d\u0003\u0002",
    "\u0002\u0002:\u016a\u0003\u0002\u0002\u0002<\u0171\u0003\u0002\u0002",
    "\u0002>\u0174\u0003\u0002\u0002\u0002@\u0184\u0003\u0002\u0002\u0002",
    "B\u0191\u0003\u0002\u0002\u0002D\u0198\u0003\u0002\u0002\u0002F\u019b",
    "\u0003\u0002\u0002\u0002H\u01ad\u0003\u0002\u0002\u0002J\u01ba\u0003",
    "\u0002\u0002\u0002L\u01be\u0003\u0002\u0002\u0002N\u01ca\u0003\u0002",
    "\u0002\u0002P\u01d7\u0003\u0002\u0002\u0002R\u01e1\u0003\u0002\u0002",
    "\u0002T\u01e3\u0003\u0002\u0002\u0002V\u01e7\u0003\u0002\u0002\u0002",
    "X\u01ea\u0003\u0002\u0002\u0002Z\u01ee\u0003\u0002\u0002\u0002\\\u01f1",
    "\u0003\u0002\u0002\u0002^\u01f5\u0003\u0002\u0002\u0002`\u01f8\u0003",
    "\u0002\u0002\u0002b\u01ff\u0003\u0002\u0002\u0002d\u0205\u0003\u0002",
    "\u0002\u0002f\u0215\u0003\u0002\u0002\u0002h\u0222\u0003\u0002\u0002",
    "\u0002j\u0229\u0003\u0002\u0002\u0002l\u022f\u0003\u0002\u0002\u0002",
    "n\u0232\u0003\u0002\u0002\u0002p\u0239\u0003\u0002\u0002\u0002r\u023c",
    "\u0003\u0002\u0002\u0002t\u023f\u0003\u0002\u0002\u0002v\u0246\u0003",
    "\u0002\u0002\u0002x\u0249\u0003\u0002\u0002\u0002z\u0260\u0003\u0002",
    "\u0002\u0002|~\u0005\u0010\t\u0002}|\u0003\u0002\u0002\u0002~\u0081",
    "\u0003\u0002\u0002\u0002\u007f}\u0003\u0002\u0002\u0002\u007f\u0080",
    "\u0003\u0002\u0002\u0002\u0080\u0084\u0003\u0002\u0002\u0002\u0081\u007f",
    "\u0003\u0002\u0002\u0002\u0082\u0084\u0005\u0004\u0003\u0002\u0083\u007f",
    "\u0003\u0002\u0002\u0002\u0083\u0082\u0003\u0002\u0002\u0002\u0084\u0086",
    "\u0003\u0002\u0002\u0002\u0085\u0087\u0005\u000e\b\u0002\u0086\u0085",
    "\u0003\u0002\u0002\u0002\u0086\u0087\u0003\u0002\u0002\u0002\u0087\u008b",
    "\u0003\u0002\u0002\u0002\u0088\u008a\u0007\u0015\u0002\u0002\u0089\u0088",
    "\u0003\u0002\u0002\u0002\u008a\u008d\u0003\u0002\u0002\u0002\u008b\u0089",
    "\u0003\u0002\u0002\u0002\u008b\u008c\u0003\u0002\u0002\u0002\u008c\u008e",
    "\u0003\u0002\u0002\u0002\u008d\u008b\u0003\u0002\u0002\u0002\u008e\u008f",
    "\u0007\u0002\u0002\u0003\u008f\u0003\u0003\u0002\u0002\u0002\u0090\u0091",
    "\u00052\u001a\u0002\u0091\u0092\u0005\u0014\u000b\u0002\u0092\u0093",
    "\u0005\u001c\u000f\u0002\u0093\u0094\u00058\u001d\u0002\u0094\u00af",
    "\u0003\u0002\u0002\u0002\u0095\u0096\u0005:\u001e\u0002\u0096\u0097",
    "\u0005\u0014\u000b\u0002\u0097\u0098\u0005\u001c\u000f\u0002\u0098\u0099",
    "\u0005@!\u0002\u0099\u00af\u0003\u0002\u0002\u0002\u009a\u009b\u0005",
    "B\"\u0002\u009b\u009c\u0005\u0014\u000b\u0002\u009c\u009d\u0005\u001c",
    "\u000f\u0002\u009d\u009e\u0005H%\u0002\u009e\u00af\u0003\u0002\u0002",
    "\u0002\u009f\u00a0\u0005t;\u0002\u00a0\u00a1\u0005\u0014\u000b\u0002",
    "\u00a1\u00a2\u0005\u001c\u000f\u0002\u00a2\u00a3\u0005z>\u0002\u00a3",
    "\u00af\u0003\u0002\u0002\u0002\u00a4\u00a5\u0005J&\u0002\u00a5\u00a6",
    "\u0005\u0014\u000b\u0002\u00a6\u00a7\u0005\u001c\u000f\u0002\u00a7\u00a8",
    "\u0005N(\u0002\u00a8\u00af\u0003\u0002\u0002\u0002\u00a9\u00aa\u0005",
    "`1\u0002\u00aa\u00ab\u0005\u0014\u000b\u0002\u00ab\u00ac\u0005\u001c",
    "\u000f\u0002\u00ac\u00ad\u0005f4\u0002\u00ad\u00af\u0003\u0002\u0002",
    "\u0002\u00ae\u0090\u0003\u0002\u0002\u0002\u00ae\u0095\u0003\u0002\u0002",
    "\u0002\u00ae\u009a\u0003\u0002\u0002\u0002\u00ae\u009f\u0003\u0002\u0002",
    "\u0002\u00ae\u00a4\u0003\u0002\u0002\u0002\u00ae\u00a9\u0003\u0002\u0002",
    "\u0002\u00af\u0005\u0003\u0002\u0002\u0002\u00b0\u00b9\u0007\u0003\u0002",
    "\u0002\u00b1\u00b2\u0005\b\u0005\u0002\u00b2\u00b3\u0007\u0004\u0002",
    "\u0002\u00b3\u00b8\u0003\u0002\u0002\u0002\u00b4\u00b5\u0005\b\u0005",
    "\u0002\u00b5\u00b6\u0007\u0005\u0002\u0002\u00b6\u00b8\u0003\u0002\u0002",
    "\u0002\u00b7\u00b1\u0003\u0002\u0002\u0002\u00b7\u00b4\u0003\u0002\u0002",
    "\u0002\u00b8\u00bb\u0003\u0002\u0002\u0002\u00b9\u00b7\u0003\u0002\u0002",
    "\u0002\u00b9\u00ba\u0003\u0002\u0002\u0002\u00ba\u00bc\u0003\u0002\u0002",
    "\u0002\u00bb\u00b9\u0003\u0002\u0002\u0002\u00bc\u00bd\u0005\b\u0005",
    "\u0002\u00bd\u00be\u0007\u0003\u0002\u0002\u00be\u0007\u0003\u0002\u0002",
    "\u0002\u00bf\u00c1\u0007\u0014\u0002\u0002\u00c0\u00bf\u0003\u0002\u0002",
    "\u0002\u00c1\u00c2\u0003\u0002\u0002\u0002\u00c2\u00c0\u0003\u0002\u0002",
    "\u0002\u00c2\u00c3\u0003\u0002\u0002\u0002\u00c3\u00f2\u0003\u0002\u0002",
    "\u0002\u00c4\u00c6\u0007\u0006\u0002\u0002\u00c5\u00c7\u0007\u0014\u0002",
    "\u0002\u00c6\u00c5\u0003\u0002\u0002\u0002\u00c7\u00c8\u0003\u0002\u0002",
    "\u0002\u00c8\u00c6\u0003\u0002\u0002\u0002\u00c8\u00c9\u0003\u0002\u0002",
    "\u0002\u00c9\u00f2\u0003\u0002\u0002\u0002\u00ca\u00cc\u0007\u0007\u0002",
    "\u0002\u00cb\u00cd\u0007\u0014\u0002\u0002\u00cc\u00cb\u0003\u0002\u0002",
    "\u0002\u00cd\u00ce\u0003\u0002\u0002\u0002\u00ce\u00cc\u0003\u0002\u0002",
    "\u0002\u00ce\u00cf\u0003\u0002\u0002\u0002\u00cf\u00f2\u0003\u0002\u0002",
    "\u0002\u00d0\u00d2\u0007\b\u0002\u0002\u00d1\u00d3\u0007\u0014\u0002",
    "\u0002\u00d2\u00d1\u0003\u0002\u0002\u0002\u00d3\u00d4\u0003\u0002\u0002",
    "\u0002\u00d4\u00d2\u0003\u0002\u0002\u0002\u00d4\u00d5\u0003\u0002\u0002",
    "\u0002\u00d5\u00f2\u0003\u0002\u0002\u0002\u00d6\u00d8\u0007\u0014\u0002",
    "\u0002\u00d7\u00d6\u0003\u0002\u0002\u0002\u00d8\u00d9\u0003\u0002\u0002",
    "\u0002\u00d9\u00d7\u0003\u0002\u0002\u0002\u00d9\u00da\u0003\u0002\u0002",
    "\u0002\u00da\u00db\u0003\u0002\u0002\u0002\u00db\u00f2\u0007\u0007\u0002",
    "\u0002\u00dc\u00de\u0007\u0006\u0002\u0002\u00dd\u00df\u0007\u0014\u0002",
    "\u0002\u00de\u00dd\u0003\u0002\u0002\u0002\u00df\u00e0\u0003\u0002\u0002",
    "\u0002\u00e0\u00de\u0003\u0002\u0002\u0002\u00e0\u00e1\u0003\u0002\u0002",
    "\u0002\u00e1\u00e2\u0003\u0002\u0002\u0002\u00e2\u00f2\u0007\u0007\u0002",
    "\u0002\u00e3\u00e5\u0007\u0007\u0002\u0002\u00e4\u00e6\u0007\u0014\u0002",
    "\u0002\u00e5\u00e4\u0003\u0002\u0002\u0002\u00e6\u00e7\u0003\u0002\u0002",
    "\u0002\u00e7\u00e5\u0003\u0002\u0002\u0002\u00e7\u00e8\u0003\u0002\u0002",
    "\u0002\u00e8\u00e9\u0003\u0002\u0002\u0002\u00e9\u00f2\u0007\u0007\u0002",
    "\u0002\u00ea\u00ec\u0007\b\u0002\u0002\u00eb\u00ed\u0007\u0014\u0002",
    "\u0002\u00ec\u00eb\u0003\u0002\u0002\u0002\u00ed\u00ee\u0003\u0002\u0002",
    "\u0002\u00ee\u00ec\u0003\u0002\u0002\u0002\u00ee\u00ef\u0003\u0002\u0002",
    "\u0002\u00ef\u00f0\u0003\u0002\u0002\u0002\u00f0\u00f2\u0007\u0007\u0002",
    "\u0002\u00f1\u00c0\u0003\u0002\u0002\u0002\u00f1\u00c4\u0003\u0002\u0002",
    "\u0002\u00f1\u00ca\u0003\u0002\u0002\u0002\u00f1\u00d0\u0003\u0002\u0002",
    "\u0002\u00f1\u00d7\u0003\u0002\u0002\u0002\u00f1\u00dc\u0003\u0002\u0002",
    "\u0002\u00f1\u00e3\u0003\u0002\u0002\u0002\u00f1\u00ea\u0003\u0002\u0002",
    "\u0002\u00f2\t\u0003\u0002\u0002\u0002\u00f3\u00f7\u0007\u0003\u0002",
    "\u0002\u00f4\u00f8\u0007\u0014\u0002\u0002\u00f5\u00f8\u0005\f\u0007",
    "\u0002\u00f6\u00f8\u0007\u0013\u0002\u0002\u00f7\u00f4\u0003\u0002\u0002",
    "\u0002\u00f7\u00f5\u0003\u0002\u0002\u0002\u00f7\u00f6\u0003\u0002\u0002",
    "\u0002\u00f8\u00f9\u0003\u0002\u0002\u0002\u00f9\u00f7\u0003\u0002\u0002",
    "\u0002\u00f9\u00fa\u0003\u0002\u0002\u0002\u00fa\u00fb\u0003\u0002\u0002",
    "\u0002\u00fb\u00fc\u0007\u0003\u0002\u0002\u00fc\u000b\u0003\u0002\u0002",
    "\u0002\u00fd\u00fe\t\u0002\u0002\u0002\u00fe\r\u0003\u0002\u0002\u0002",
    "\u00ff\u0100\u0007\t\u0002\u0002\u0100\u000f\u0003\u0002\u0002\u0002",
    "\u0101\u0102\u0007\u0015\u0002\u0002\u0102\u0011\u0003\u0002\u0002\u0002",
    "\u0103\u0107\u0007\u0003\u0002\u0002\u0104\u0108\u0007\u0014\u0002\u0002",
    "\u0105\u0108\u0005\f\u0007\u0002\u0106\u0108\u0007\u0013\u0002\u0002",
    "\u0107\u0104\u0003\u0002\u0002\u0002\u0107\u0105\u0003\u0002\u0002\u0002",
    "\u0107\u0106\u0003\u0002\u0002\u0002\u0108\u0109\u0003\u0002\u0002\u0002",
    "\u0109\u0107\u0003\u0002\u0002\u0002\u0109\u010a\u0003\u0002\u0002\u0002",
    "\u010a\u010b\u0003\u0002\u0002\u0002\u010b\u010c\u0007\u0003\u0002\u0002",
    "\u010c\u0013\u0003\u0002\u0002\u0002\u010d\u010e\u0007\r\u0002\u0002",
    "\u010e\u0015\u0003\u0002\u0002\u0002\u010f\u0110\u0007\u000e\u0002\u0002",
    "\u0110\u0017\u0003\u0002\u0002\u0002\u0111\u0112\u0007\u000f\u0002\u0002",
    "\u0112\u0019\u0003\u0002\u0002\u0002\u0113\u0114\u0007\u0010\u0002\u0002",
    "\u0114\u001b\u0003\u0002\u0002\u0002\u0115\u0116\u0007\u0011\u0002\u0002",
    "\u0116\u001d\u0003\u0002\u0002\u0002\u0117\u0118\u0007\u0012\u0002\u0002",
    "\u0118\u001f\u0003\u0002\u0002\u0002\u0119\u011c\u0005\u0018\r\u0002",
    "\u011a\u011c\u0005\u001a\u000e\u0002\u011b\u0119\u0003\u0002\u0002\u0002",
    "\u011b\u011a\u0003\u0002\u0002\u0002\u011c!\u0003\u0002\u0002\u0002",
    "\u011d\u011f\u0007\u0018\u0002\u0002\u011e\u0120\u0005$\u0013\u0002",
    "\u011f\u011e\u0003\u0002\u0002\u0002\u011f\u0120\u0003\u0002\u0002\u0002",
    "\u0120#\u0003\u0002\u0002\u0002\u0121\u0122\u0005\u0006\u0004\u0002",
    "\u0122\u0123\u0007\u0013\u0002\u0002\u0123%\u0003\u0002\u0002\u0002",
    "\u0124\u0126\u0007\u0019\u0002\u0002\u0125\u0127\u0005(\u0015\u0002",
    "\u0126\u0125\u0003\u0002\u0002\u0002\u0126\u0127\u0003\u0002\u0002\u0002",
    "\u0127\'\u0003\u0002\u0002\u0002\u0128\u0129\u0005\n\u0006\u0002\u0129",
    "\u012a\u0007\u0013\u0002\u0002\u012a)\u0003\u0002\u0002\u0002\u012b",
    "\u012c\u0007\u001a\u0002\u0002\u012c\u012d\u0005,\u0017\u0002\u012d",
    "+\u0003\u0002\u0002\u0002\u012e\u0133\u0005\u0016\f\u0002\u012f\u0130",
    "\u0005\u0006\u0004\u0002\u0130\u0131\u0007\u0013\u0002\u0002\u0131\u0134",
    "\u0003\u0002\u0002\u0002\u0132\u0134\u0007\u001b\u0002\u0002\u0133\u012f",
    "\u0003\u0002\u0002\u0002\u0133\u0132\u0003\u0002\u0002\u0002\u0134-",
    "\u0003\u0002\u0002\u0002\u0135\u0136\u0007\u001c\u0002\u0002\u0136\u0137",
    "\u00050\u0019\u0002\u0137/\u0003\u0002\u0002\u0002\u0138\u013d\u0005",
    "\u0016\f\u0002\u0139\u013a\u0005\u0006\u0004\u0002\u013a\u013b\u0007",
    "\u0013\u0002\u0002\u013b\u013e\u0003\u0002\u0002\u0002\u013c\u013e\u0007",
    "\u001d\u0002\u0002\u013d\u0139\u0003\u0002\u0002\u0002\u013d\u013c\u0003",
    "\u0002\u0002\u0002\u013e1\u0003\u0002\u0002\u0002\u013f\u0141\u0007",
    "\u001e\u0002\u0002\u0140\u0142\u00056\u001c\u0002\u0141\u0140\u0003",
    "\u0002\u0002\u0002\u0141\u0142\u0003\u0002\u0002\u0002\u0142\u0144\u0003",
    "\u0002\u0002\u0002\u0143\u0145\u00054\u001b\u0002\u0144\u0143\u0003",
    "\u0002\u0002\u0002\u0144\u0145\u0003\u0002\u0002\u0002\u01453\u0003",
    "\u0002\u0002\u0002\u0146\u0147\u0005\u0016\f\u0002\u0147\u0148\u0005",
    "t;\u0002\u01485\u0003\u0002\u0002\u0002\u0149\u014a\u0005\u001e\u0010",
    "\u0002\u014a\u014b\u00058\u001d\u0002\u014b7\u0003\u0002\u0002\u0002",
    "\u014c\u014d\b\u001d\u0001\u0002\u014d\u014e\u0007\u0016\u0002\u0002",
    "\u014e\u014f\u00058\u001d\u0002\u014f\u0150\u0007\u0017\u0002\u0002",
    "\u0150\u015e\u0003\u0002\u0002\u0002\u0151\u015c\u0005&\u0014\u0002",
    "\u0152\u015c\u0005T+\u0002\u0153\u015c\u0005X-\u0002\u0154\u015c\u0005",
    "P)\u0002\u0155\u015c\u0005\"\u0012\u0002\u0156\u015c\u0005J&\u0002\u0157",
    "\u015c\u0005\\/\u0002\u0158\u015c\u0005`1\u0002\u0159\u015c\u0005h5",
    "\u0002\u015a\u015c\u0005\u0012\n\u0002\u015b\u0151\u0003\u0002\u0002",
    "\u0002\u015b\u0152\u0003\u0002\u0002\u0002\u015b\u0153\u0003\u0002\u0002",
    "\u0002\u015b\u0154\u0003\u0002\u0002\u0002\u015b\u0155\u0003\u0002\u0002",
    "\u0002\u015b\u0156\u0003\u0002\u0002\u0002\u015b\u0157\u0003\u0002\u0002",
    "\u0002\u015b\u0158\u0003\u0002\u0002\u0002\u015b\u0159\u0003\u0002\u0002",
    "\u0002\u015b\u015a\u0003\u0002\u0002\u0002\u015c\u015e\u0003\u0002\u0002",
    "\u0002\u015d\u014c\u0003\u0002\u0002\u0002\u015d\u015b\u0003\u0002\u0002",
    "\u0002\u015e\u0167\u0003\u0002\u0002\u0002\u015f\u0160\f\u0005\u0002",
    "\u0002\u0160\u0161\u0005 \u0011\u0002\u0161\u0162\u00058\u001d\u0006",
    "\u0162\u0166\u0003\u0002\u0002\u0002\u0163\u0164\f\u0003\u0002\u0002",
    "\u0164\u0166\u0007\u0013\u0002\u0002\u0165\u015f\u0003\u0002\u0002\u0002",
    "\u0165\u0163\u0003\u0002\u0002\u0002\u0166\u0169\u0003\u0002\u0002\u0002",
    "\u0167\u0165\u0003\u0002\u0002\u0002\u0167\u0168\u0003\u0002\u0002\u0002",
    "\u01689\u0003\u0002\u0002\u0002\u0169\u0167\u0003\u0002\u0002\u0002",
    "\u016a\u016c\u0007\u001f\u0002\u0002\u016b\u016d\u0005> \u0002\u016c",
    "\u016b\u0003\u0002\u0002\u0002\u016c\u016d\u0003\u0002\u0002\u0002\u016d",
    "\u016f\u0003\u0002\u0002\u0002\u016e\u0170\u0005<\u001f\u0002\u016f",
    "\u016e\u0003\u0002\u0002\u0002\u016f\u0170\u0003\u0002\u0002\u0002\u0170",
    ";\u0003\u0002\u0002\u0002\u0171\u0172\u0005\u0016\f\u0002\u0172\u0173",
    "\u0005t;\u0002\u0173=\u0003\u0002\u0002\u0002\u0174\u0175\u0005\u001e",
    "\u0010\u0002\u0175\u0176\u0005@!\u0002\u0176?\u0003\u0002\u0002\u0002",
    "\u0177\u0178\b!\u0001\u0002\u0178\u0179\u0007\u0016\u0002\u0002\u0179",
    "\u017a\u0005@!\u0002\u017a\u017b\u0007\u0017\u0002\u0002\u017b\u0185",
    "\u0003\u0002\u0002\u0002\u017c\u0183\u0005&\u0014\u0002\u017d\u0183",
    "\u0005T+\u0002\u017e\u0183\u0005X-\u0002\u017f\u0183\u0005P)\u0002\u0180",
    "\u0183\u0005\"\u0012\u0002\u0181\u0183\u0005J&\u0002\u0182\u017c\u0003",
    "\u0002\u0002\u0002\u0182\u017d\u0003\u0002\u0002\u0002\u0182\u017e\u0003",
    "\u0002\u0002\u0002\u0182\u017f\u0003\u0002\u0002\u0002\u0182\u0180\u0003",
    "\u0002\u0002\u0002\u0182\u0181\u0003\u0002\u0002\u0002\u0183\u0185\u0003",
    "\u0002\u0002\u0002\u0184\u0177\u0003\u0002\u0002\u0002\u0184\u0182\u0003",
    "\u0002\u0002\u0002\u0185\u018e\u0003\u0002\u0002\u0002\u0186\u0187\f",
    "\u0005\u0002\u0002\u0187\u0188\u0005 \u0011\u0002\u0188\u0189\u0005",
    "@!\u0006\u0189\u018d\u0003\u0002\u0002\u0002\u018a\u018b\f\u0003\u0002",
    "\u0002\u018b\u018d\u0007\u0013\u0002\u0002\u018c\u0186\u0003\u0002\u0002",
    "\u0002\u018c\u018a\u0003\u0002\u0002\u0002\u018d\u0190\u0003\u0002\u0002",
    "\u0002\u018e\u018c\u0003\u0002\u0002\u0002\u018e\u018f\u0003\u0002\u0002",
    "\u0002\u018fA\u0003\u0002\u0002\u0002\u0190\u018e\u0003\u0002\u0002",
    "\u0002\u0191\u0193\u0007 \u0002\u0002\u0192\u0194\u0005F$\u0002\u0193",
    "\u0192\u0003\u0002\u0002\u0002\u0193\u0194\u0003\u0002\u0002\u0002\u0194",
    "\u0196\u0003\u0002\u0002\u0002\u0195\u0197\u0005D#\u0002\u0196\u0195",
    "\u0003\u0002\u0002\u0002\u0196\u0197\u0003\u0002\u0002\u0002\u0197C",
    "\u0003\u0002\u0002\u0002\u0198\u0199\u0005\u0016\f\u0002\u0199\u019a",
    "\u0005t;\u0002\u019aE\u0003\u0002\u0002\u0002\u019b\u019c\u0005\u001e",
    "\u0010\u0002\u019c\u019d\u0005H%\u0002\u019dG\u0003\u0002\u0002\u0002",
    "\u019e\u019f\b%\u0001\u0002\u019f\u01a0\u0007\u0016\u0002\u0002\u01a0",
    "\u01a1\u0005H%\u0002\u01a1\u01a2\u0007\u0017\u0002\u0002\u01a2\u01ae",
    "\u0003\u0002\u0002\u0002\u01a3\u01ac\u0005&\u0014\u0002\u01a4\u01ac",
    "\u0005T+\u0002\u01a5\u01ac\u0005X-\u0002\u01a6\u01ac\u0005J&\u0002\u01a7",
    "\u01ac\u0005\\/\u0002\u01a8\u01ac\u0005`1\u0002\u01a9\u01ac\u0005h5",
    "\u0002\u01aa\u01ac\u0005\u0012\n\u0002\u01ab\u01a3\u0003\u0002\u0002",
    "\u0002\u01ab\u01a4\u0003\u0002\u0002\u0002\u01ab\u01a5\u0003\u0002\u0002",
    "\u0002\u01ab\u01a6\u0003\u0002\u0002\u0002\u01ab\u01a7\u0003\u0002\u0002",
    "\u0002\u01ab\u01a8\u0003\u0002\u0002\u0002\u01ab\u01a9\u0003\u0002\u0002",
    "\u0002\u01ab\u01aa\u0003\u0002\u0002\u0002\u01ac\u01ae\u0003\u0002\u0002",
    "\u0002\u01ad\u019e\u0003\u0002\u0002\u0002\u01ad\u01ab\u0003\u0002\u0002",
    "\u0002\u01ae\u01b7\u0003\u0002\u0002\u0002\u01af\u01b0\f\u0005\u0002",
    "\u0002\u01b0\u01b1\u0005 \u0011\u0002\u01b1\u01b2\u0005H%\u0006\u01b2",
    "\u01b6\u0003\u0002\u0002\u0002\u01b3\u01b4\f\u0003\u0002\u0002\u01b4",
    "\u01b6\u0007\u0013\u0002\u0002\u01b5\u01af\u0003\u0002\u0002\u0002\u01b5",
    "\u01b3\u0003\u0002\u0002\u0002\u01b6\u01b9\u0003\u0002\u0002\u0002\u01b7",
    "\u01b5\u0003\u0002\u0002\u0002\u01b7\u01b8\u0003\u0002\u0002\u0002\u01b8",
    "I\u0003\u0002\u0002\u0002\u01b9\u01b7\u0003\u0002\u0002\u0002\u01ba",
    "\u01bc\u0007!\u0002\u0002\u01bb\u01bd\u0005L\'\u0002\u01bc\u01bb\u0003",
    "\u0002\u0002\u0002\u01bc\u01bd\u0003\u0002\u0002\u0002\u01bdK\u0003",
    "\u0002\u0002\u0002\u01be\u01bf\u0005\u001e\u0010\u0002\u01bf\u01c0\u0005",
    "N(\u0002\u01c0M\u0003\u0002\u0002\u0002\u01c1\u01c2\b(\u0001\u0002\u01c2",
    "\u01c3\u0007\u0016\u0002\u0002\u01c3\u01c4\u0005N(\u0002\u01c4\u01c5",
    "\u0007\u0017\u0002\u0002\u01c5\u01cb\u0003\u0002\u0002\u0002\u01c6\u01c9",
    "\u0005P)\u0002\u01c7\u01c9\u0005\"\u0012\u0002\u01c8\u01c6\u0003\u0002",
    "\u0002\u0002\u01c8\u01c7\u0003\u0002\u0002\u0002\u01c9\u01cb\u0003\u0002",
    "\u0002\u0002\u01ca\u01c1\u0003\u0002\u0002\u0002\u01ca\u01c8\u0003\u0002",
    "\u0002\u0002\u01cb\u01d4\u0003\u0002\u0002\u0002\u01cc\u01cd\f\u0005",
    "\u0002\u0002\u01cd\u01ce\u0005 \u0011\u0002\u01ce\u01cf\u0005N(\u0006",
    "\u01cf\u01d3\u0003\u0002\u0002\u0002\u01d0\u01d1\f\u0003\u0002\u0002",
    "\u01d1\u01d3\u0007\u0013\u0002\u0002\u01d2\u01cc\u0003\u0002\u0002\u0002",
    "\u01d2\u01d0\u0003\u0002\u0002\u0002\u01d3\u01d6\u0003\u0002\u0002\u0002",
    "\u01d4\u01d2\u0003\u0002\u0002\u0002\u01d4\u01d5\u0003\u0002\u0002\u0002",
    "\u01d5O\u0003\u0002\u0002\u0002\u01d6\u01d4\u0003\u0002\u0002\u0002",
    "\u01d7\u01d9\u0007\"\u0002\u0002\u01d8\u01da\u0005R*\u0002\u01d9\u01d8",
    "\u0003\u0002\u0002\u0002\u01d9\u01da\u0003\u0002\u0002\u0002\u01daQ",
    "\u0003\u0002\u0002\u0002\u01db\u01dc\u0005\n\u0006\u0002\u01dc\u01dd",
    "\u0007\u0013\u0002\u0002\u01dd\u01e2\u0003\u0002\u0002\u0002\u01de\u01df",
    "\u0005\u0006\u0004\u0002\u01df\u01e0\u0007\u0013\u0002\u0002\u01e0\u01e2",
    "\u0003\u0002\u0002\u0002\u01e1\u01db\u0003\u0002\u0002\u0002\u01e1\u01de",
    "\u0003\u0002\u0002\u0002\u01e2S\u0003\u0002\u0002\u0002\u01e3\u01e5",
    "\u0007#\u0002\u0002\u01e4\u01e6\u0005V,\u0002\u01e5\u01e4\u0003\u0002",
    "\u0002\u0002\u01e5\u01e6\u0003\u0002\u0002\u0002\u01e6U\u0003\u0002",
    "\u0002\u0002\u01e7\u01e8\u0005\u0006\u0004\u0002\u01e8\u01e9\u0007\u0013",
    "\u0002\u0002\u01e9W\u0003\u0002\u0002\u0002\u01ea\u01ec\u0007$\u0002",
    "\u0002\u01eb\u01ed\u0005Z.\u0002\u01ec\u01eb\u0003\u0002\u0002\u0002",
    "\u01ec\u01ed\u0003\u0002\u0002\u0002\u01edY\u0003\u0002\u0002\u0002",
    "\u01ee\u01ef\u0005\u0006\u0004\u0002\u01ef\u01f0\u0007\u0013\u0002\u0002",
    "\u01f0[\u0003\u0002\u0002\u0002\u01f1\u01f3\u0007%\u0002\u0002\u01f2",
    "\u01f4\u0005^0\u0002\u01f3\u01f2\u0003\u0002\u0002\u0002\u01f3\u01f4",
    "\u0003\u0002\u0002\u0002\u01f4]\u0003\u0002\u0002\u0002\u01f5\u01f6",
    "\u0005\n\u0006\u0002\u01f6\u01f7\u0007\u0013\u0002\u0002\u01f7_\u0003",
    "\u0002\u0002\u0002\u01f8\u01fa\u0007&\u0002\u0002\u01f9\u01fb\u0005",
    "d3\u0002\u01fa\u01f9\u0003\u0002\u0002\u0002\u01fa\u01fb\u0003\u0002",
    "\u0002\u0002\u01fb\u01fd\u0003\u0002\u0002\u0002\u01fc\u01fe\u0005b",
    "2\u0002\u01fd\u01fc\u0003\u0002\u0002\u0002\u01fd\u01fe\u0003\u0002",
    "\u0002\u0002\u01fea\u0003\u0002\u0002\u0002\u01ff\u0203\u0005\u0016",
    "\f\u0002\u0200\u0204\u0005t;\u0002\u0201\u0204\u00052\u001a\u0002\u0202",
    "\u0204\u0005B\"\u0002\u0203\u0200\u0003\u0002\u0002\u0002\u0203\u0201",
    "\u0003\u0002\u0002\u0002\u0203\u0202\u0003\u0002\u0002\u0002\u0204c",
    "\u0003\u0002\u0002\u0002\u0205\u0206\u0005\u001e\u0010\u0002\u0206\u0207",
    "\u0005f4\u0002\u0207e\u0003\u0002\u0002\u0002\u0208\u0209\b4\u0001\u0002",
    "\u0209\u020a\u0007\u0016\u0002\u0002\u020a\u020b\u0005f4\u0002\u020b",
    "\u020c\u0007\u0017\u0002\u0002\u020c\u0216\u0003\u0002\u0002\u0002\u020d",
    "\u0214\u0005&\u0014\u0002\u020e\u0214\u0005T+\u0002\u020f\u0214\u0005",
    "X-\u0002\u0210\u0214\u0005P)\u0002\u0211\u0214\u0005\"\u0012\u0002\u0212",
    "\u0214\u0005n8\u0002\u0213\u020d\u0003\u0002\u0002\u0002\u0213\u020e",
    "\u0003\u0002\u0002\u0002\u0213\u020f\u0003\u0002\u0002\u0002\u0213\u0210",
    "\u0003\u0002\u0002\u0002\u0213\u0211\u0003\u0002\u0002\u0002\u0213\u0212",
    "\u0003\u0002\u0002\u0002\u0214\u0216\u0003\u0002\u0002\u0002\u0215\u0208",
    "\u0003\u0002\u0002\u0002\u0215\u0213\u0003\u0002\u0002\u0002\u0216\u021f",
    "\u0003\u0002\u0002\u0002\u0217\u0218\f\u0005\u0002\u0002\u0218\u0219",
    "\u0005 \u0011\u0002\u0219\u021a\u0005f4\u0006\u021a\u021e\u0003\u0002",
    "\u0002\u0002\u021b\u021c\f\u0003\u0002\u0002\u021c\u021e\u0007\u0013",
    "\u0002\u0002\u021d\u0217\u0003\u0002\u0002\u0002\u021d\u021b\u0003\u0002",
    "\u0002\u0002\u021e\u0221\u0003\u0002\u0002\u0002\u021f\u021d\u0003\u0002",
    "\u0002\u0002\u021f\u0220\u0003\u0002\u0002\u0002\u0220g\u0003\u0002",
    "\u0002\u0002\u0221\u021f\u0003\u0002\u0002\u0002\u0222\u0224\u0007\'",
    "\u0002\u0002\u0223\u0225\u0005l7\u0002\u0224\u0223\u0003\u0002\u0002",
    "\u0002\u0224\u0225\u0003\u0002\u0002\u0002\u0225\u0227\u0003\u0002\u0002",
    "\u0002\u0226\u0228\u0005j6\u0002\u0227\u0226\u0003\u0002\u0002\u0002",
    "\u0227\u0228\u0003\u0002\u0002\u0002\u0228i\u0003\u0002\u0002\u0002",
    "\u0229\u022d\u0005\u0016\f\u0002\u022a\u022e\u00052\u001a\u0002\u022b",
    "\u022e\u0005B\"\u0002\u022c\u022e\u0005B\"\u0002\u022d\u022a\u0003\u0002",
    "\u0002\u0002\u022d\u022b\u0003\u0002\u0002\u0002\u022d\u022c\u0003\u0002",
    "\u0002\u0002\u022ek\u0003\u0002\u0002\u0002\u022f\u0230\u0005\n\u0006",
    "\u0002\u0230\u0231\u0007\u0013\u0002\u0002\u0231m\u0003\u0002\u0002",
    "\u0002\u0232\u0234\u0007(\u0002\u0002\u0233\u0235\u0005r:\u0002\u0234",
    "\u0233\u0003\u0002\u0002\u0002\u0234\u0235\u0003\u0002\u0002\u0002\u0235",
    "\u0237\u0003\u0002\u0002\u0002\u0236\u0238\u0005p9\u0002\u0237\u0236",
    "\u0003\u0002\u0002\u0002\u0237\u0238\u0003\u0002\u0002\u0002\u0238o",
    "\u0003\u0002\u0002\u0002\u0239\u023a\u0005\u0016\f\u0002\u023a\u023b",
    "\u0005`1\u0002\u023bq\u0003\u0002\u0002\u0002\u023c\u023d\u0005\n\u0006",
    "\u0002\u023d\u023e\u0007\u0013\u0002\u0002\u023es\u0003\u0002\u0002",
    "\u0002\u023f\u0241\u0007)\u0002\u0002\u0240\u0242\u0005x=\u0002\u0241",
    "\u0240\u0003\u0002\u0002\u0002\u0241\u0242\u0003\u0002\u0002\u0002\u0242",
    "\u0244\u0003\u0002\u0002\u0002\u0243\u0245\u0005v<\u0002\u0244\u0243",
    "\u0003\u0002\u0002\u0002\u0244\u0245\u0003\u0002\u0002\u0002\u0245u",
    "\u0003\u0002\u0002\u0002\u0246\u0247\u0005\u0016\f\u0002\u0247\u0248",
    "\u0005t;\u0002\u0248w\u0003\u0002\u0002\u0002\u0249\u024a\u0005\u001e",
    "\u0010\u0002\u024a\u024b\u0005z>\u0002\u024by\u0003\u0002\u0002\u0002",
    "\u024c\u024d\b>\u0001\u0002\u024d\u024e\u0007\u0016\u0002\u0002\u024e",
    "\u024f\u0005z>\u0002\u024f\u0250\u0007\u0017\u0002\u0002\u0250\u0261",
    "\u0003\u0002\u0002\u0002\u0251\u025f\u0005&\u0014\u0002\u0252\u025f",
    "\u0005T+\u0002\u0253\u025f\u0005X-\u0002\u0254\u025f\u0005\"\u0012\u0002",
    "\u0255\u025f\u0005*\u0016\u0002\u0256\u025f\u0005.\u0018\u0002\u0257",
    "\u025f\u00052\u001a\u0002\u0258\u025f\u0005:\u001e\u0002\u0259\u025f",
    "\u0005B\"\u0002\u025a\u025f\u0005`1\u0002\u025b\u025f\u0005t;\u0002",
    "\u025c\u025f\u0005\\/\u0002\u025d\u025f\u0005\u0012\n\u0002\u025e\u0251",
    "\u0003\u0002\u0002\u0002\u025e\u0252\u0003\u0002\u0002\u0002\u025e\u0253",
    "\u0003\u0002\u0002\u0002\u025e\u0254\u0003\u0002\u0002\u0002\u025e\u0255",
    "\u0003\u0002\u0002\u0002\u025e\u0256\u0003\u0002\u0002\u0002\u025e\u0257",
    "\u0003\u0002\u0002\u0002\u025e\u0258\u0003\u0002\u0002\u0002\u025e\u0259",
    "\u0003\u0002\u0002\u0002\u025e\u025a\u0003\u0002\u0002\u0002\u025e\u025b",
    "\u0003\u0002\u0002\u0002\u025e\u025c\u0003\u0002\u0002\u0002\u025e\u025d",
    "\u0003\u0002\u0002\u0002\u025f\u0261\u0003\u0002\u0002\u0002\u0260\u024c",
    "\u0003\u0002\u0002\u0002\u0260\u025e\u0003\u0002\u0002\u0002\u0261\u026a",
    "\u0003\u0002\u0002\u0002\u0262\u0263\f\u0005\u0002\u0002\u0263\u0264",
    "\u0005 \u0011\u0002\u0264\u0265\u0005z>\u0006\u0265\u0269\u0003\u0002",
    "\u0002\u0002\u0266\u0267\f\u0003\u0002\u0002\u0267\u0269\u0007\u0013",
    "\u0002\u0002\u0268\u0262\u0003\u0002\u0002\u0002\u0268\u0266\u0003\u0002",
    "\u0002\u0002\u0269\u026c\u0003\u0002\u0002\u0002\u026a\u0268\u0003\u0002",
    "\u0002\u0002\u026a\u026b\u0003\u0002\u0002\u0002\u026b{\u0003\u0002",
    "\u0002\u0002\u026c\u026a\u0003\u0002\u0002\u0002I\u007f\u0083\u0086",
    "\u008b\u00ae\u00b7\u00b9\u00c2\u00c8\u00ce\u00d4\u00d9\u00e0\u00e7\u00ee",
    "\u00f1\u00f7\u00f9\u0107\u0109\u011b\u011f\u0126\u0133\u013d\u0141\u0144",
    "\u015b\u015d\u0165\u0167\u016c\u016f\u0182\u0184\u018c\u018e\u0193\u0196",
    "\u01ab\u01ad\u01b5\u01b7\u01bc\u01c8\u01ca\u01d2\u01d4\u01d9\u01e1\u01e5",
    "\u01ec\u01f3\u01fa\u01fd\u0203\u0213\u0215\u021d\u021f\u0224\u0227\u022d",
    "\u0234\u0237\u0241\u0244\u025e\u0260\u0268\u026a"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'\"'", "'||'", "'&&'", "'!'", "'...'", "'!...'", 
                     "'.'", "'='", "'>'", "'<'", "'must '", "'of '", "'and '", 
                     "'or '", "'have '", "'with '", null, null, null, "'('", 
                     "')'", "'name '", "'annotation '", "'extension '", 
                     "'Superclass'", "'implementation '", "'Interface '", 
                     "'function '", "'abstract function '", "'constructor '", 
                     "'parameter '", "'type '", "'specifier '", "'visibility '", 
                     "'return value '", "'declaration statement '", "'expression statement '", 
                     "'initial value '" ];

var symbolicNames = [ null, null, null, null, null, null, null, null, null, 
                      null, null, null, null, null, null, null, null, "SPACE", 
                      "Alphabet", "NL", "LPAREN", "RPAREN", "NAME", "ANNOTATION", 
                      "EXTENSION", "SUPERCLASS", "IMPLEMENTATION", "INTERFACE", 
                      "FUNCTION", "AbstractFunctions", "CONSTRUCTOR", "PARAMETER", 
                      "TYPES", "SPECIFIER", "VISIBILITY", "ReturnValue", 
                      "DeclarationStatement", "ExpressionStatement", "InitialValue", 
                      "CLASSES" ];

var ruleNames =  [ "inputSentence", "mustClause", "words", "word", "combinatorialWords", 
                   "symbols", "end", "emptyLine", "comments", "must", "of", 
                   "and", "or", "have", "withWord", "binary", "names", "nameCondition", 
                   "annotations", "annotationCondition", "extensions", "extensionCondition", 
                   "implementations", "implementationCondition", "functions", 
                   "functionOf", "functionCondition", "functionExpression", 
                   "abstractFunctions", "abstractFunctionOf", "abstractFunctionCondition", 
                   "abstractFunctionExpression", "constructors", "constructorOf", 
                   "constructorCondition", "constructorExpression", "parameters", 
                   "parameterCondition", "parameterExpression", "types", 
                   "typeCondition", "specifiers", "specifierCondition", 
                   "visibilities", "visibilityCondition", "returnValues", 
                   "returnValueCondition", "declarationStatements", "declarationStatementOf", 
                   "declarationStatementCondition", "declarationStatementExpression", 
                   "expressionStatements", "expressionStatementOf", "expressionStatementCondition", 
                   "initialValues", "initialValueOf", "initialValueCondition", 
                   "classes", "classOf", "classCondition", "classExpression" ];

function myGrammarParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

myGrammarParser.prototype = Object.create(antlr4.Parser.prototype);
myGrammarParser.prototype.constructor = myGrammarParser;

Object.defineProperty(myGrammarParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

myGrammarParser.EOF = antlr4.Token.EOF;
myGrammarParser.T__0 = 1;
myGrammarParser.T__1 = 2;
myGrammarParser.T__2 = 3;
myGrammarParser.T__3 = 4;
myGrammarParser.T__4 = 5;
myGrammarParser.T__5 = 6;
myGrammarParser.T__6 = 7;
myGrammarParser.T__7 = 8;
myGrammarParser.T__8 = 9;
myGrammarParser.T__9 = 10;
myGrammarParser.T__10 = 11;
myGrammarParser.T__11 = 12;
myGrammarParser.T__12 = 13;
myGrammarParser.T__13 = 14;
myGrammarParser.T__14 = 15;
myGrammarParser.T__15 = 16;
myGrammarParser.SPACE = 17;
myGrammarParser.Alphabet = 18;
myGrammarParser.NL = 19;
myGrammarParser.LPAREN = 20;
myGrammarParser.RPAREN = 21;
myGrammarParser.NAME = 22;
myGrammarParser.ANNOTATION = 23;
myGrammarParser.EXTENSION = 24;
myGrammarParser.SUPERCLASS = 25;
myGrammarParser.IMPLEMENTATION = 26;
myGrammarParser.INTERFACE = 27;
myGrammarParser.FUNCTION = 28;
myGrammarParser.AbstractFunctions = 29;
myGrammarParser.CONSTRUCTOR = 30;
myGrammarParser.PARAMETER = 31;
myGrammarParser.TYPES = 32;
myGrammarParser.SPECIFIER = 33;
myGrammarParser.VISIBILITY = 34;
myGrammarParser.ReturnValue = 35;
myGrammarParser.DeclarationStatement = 36;
myGrammarParser.ExpressionStatement = 37;
myGrammarParser.InitialValue = 38;
myGrammarParser.CLASSES = 39;

myGrammarParser.RULE_inputSentence = 0;
myGrammarParser.RULE_mustClause = 1;
myGrammarParser.RULE_words = 2;
myGrammarParser.RULE_word = 3;
myGrammarParser.RULE_combinatorialWords = 4;
myGrammarParser.RULE_symbols = 5;
myGrammarParser.RULE_end = 6;
myGrammarParser.RULE_emptyLine = 7;
myGrammarParser.RULE_comments = 8;
myGrammarParser.RULE_must = 9;
myGrammarParser.RULE_of = 10;
myGrammarParser.RULE_and = 11;
myGrammarParser.RULE_or = 12;
myGrammarParser.RULE_have = 13;
myGrammarParser.RULE_withWord = 14;
myGrammarParser.RULE_binary = 15;
myGrammarParser.RULE_names = 16;
myGrammarParser.RULE_nameCondition = 17;
myGrammarParser.RULE_annotations = 18;
myGrammarParser.RULE_annotationCondition = 19;
myGrammarParser.RULE_extensions = 20;
myGrammarParser.RULE_extensionCondition = 21;
myGrammarParser.RULE_implementations = 22;
myGrammarParser.RULE_implementationCondition = 23;
myGrammarParser.RULE_functions = 24;
myGrammarParser.RULE_functionOf = 25;
myGrammarParser.RULE_functionCondition = 26;
myGrammarParser.RULE_functionExpression = 27;
myGrammarParser.RULE_abstractFunctions = 28;
myGrammarParser.RULE_abstractFunctionOf = 29;
myGrammarParser.RULE_abstractFunctionCondition = 30;
myGrammarParser.RULE_abstractFunctionExpression = 31;
myGrammarParser.RULE_constructors = 32;
myGrammarParser.RULE_constructorOf = 33;
myGrammarParser.RULE_constructorCondition = 34;
myGrammarParser.RULE_constructorExpression = 35;
myGrammarParser.RULE_parameters = 36;
myGrammarParser.RULE_parameterCondition = 37;
myGrammarParser.RULE_parameterExpression = 38;
myGrammarParser.RULE_types = 39;
myGrammarParser.RULE_typeCondition = 40;
myGrammarParser.RULE_specifiers = 41;
myGrammarParser.RULE_specifierCondition = 42;
myGrammarParser.RULE_visibilities = 43;
myGrammarParser.RULE_visibilityCondition = 44;
myGrammarParser.RULE_returnValues = 45;
myGrammarParser.RULE_returnValueCondition = 46;
myGrammarParser.RULE_declarationStatements = 47;
myGrammarParser.RULE_declarationStatementOf = 48;
myGrammarParser.RULE_declarationStatementCondition = 49;
myGrammarParser.RULE_declarationStatementExpression = 50;
myGrammarParser.RULE_expressionStatements = 51;
myGrammarParser.RULE_expressionStatementOf = 52;
myGrammarParser.RULE_expressionStatementCondition = 53;
myGrammarParser.RULE_initialValues = 54;
myGrammarParser.RULE_initialValueOf = 55;
myGrammarParser.RULE_initialValueCondition = 56;
myGrammarParser.RULE_classes = 57;
myGrammarParser.RULE_classOf = 58;
myGrammarParser.RULE_classCondition = 59;
myGrammarParser.RULE_classExpression = 60;

function InputSentenceContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_inputSentence;
    return this;
}

InputSentenceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InputSentenceContext.prototype.constructor = InputSentenceContext;

InputSentenceContext.prototype.EOF = function() {
    return this.getToken(myGrammarParser.EOF, 0);
};

InputSentenceContext.prototype.mustClause = function() {
    return this.getTypedRuleContext(MustClauseContext,0);
};

InputSentenceContext.prototype.end = function() {
    return this.getTypedRuleContext(EndContext,0);
};

InputSentenceContext.prototype.NL = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.NL);
    } else {
        return this.getToken(myGrammarParser.NL, i);
    }
};


InputSentenceContext.prototype.emptyLine = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(EmptyLineContext);
    } else {
        return this.getTypedRuleContext(EmptyLineContext,i);
    }
};

InputSentenceContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterInputSentence(this);
	}
};

InputSentenceContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitInputSentence(this);
	}
};




myGrammarParser.InputSentenceContext = InputSentenceContext;

myGrammarParser.prototype.inputSentence = function() {

    var localctx = new InputSentenceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, myGrammarParser.RULE_inputSentence);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 129;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.EOF:
        case myGrammarParser.T__6:
        case myGrammarParser.NL:
            this.state = 125;
            this._errHandler.sync(this);
            var _alt = this._interp.adaptivePredict(this._input,0,this._ctx)
            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
                if(_alt===1) {
                    this.state = 122;
                    this.emptyLine(); 
                }
                this.state = 127;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input,0,this._ctx);
            }

            break;
        case myGrammarParser.FUNCTION:
        case myGrammarParser.AbstractFunctions:
        case myGrammarParser.CONSTRUCTOR:
        case myGrammarParser.PARAMETER:
        case myGrammarParser.DeclarationStatement:
        case myGrammarParser.CLASSES:
            this.state = 128;
            this.mustClause();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 132;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===myGrammarParser.T__6) {
            this.state = 131;
            this.end();
        }

        this.state = 137;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===myGrammarParser.NL) {
            this.state = 134;
            this.match(myGrammarParser.NL);
            this.state = 139;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 140;
        this.match(myGrammarParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function MustClauseContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_mustClause;
    return this;
}

MustClauseContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MustClauseContext.prototype.constructor = MustClauseContext;

MustClauseContext.prototype.functions = function() {
    return this.getTypedRuleContext(FunctionsContext,0);
};

MustClauseContext.prototype.must = function() {
    return this.getTypedRuleContext(MustContext,0);
};

MustClauseContext.prototype.have = function() {
    return this.getTypedRuleContext(HaveContext,0);
};

MustClauseContext.prototype.functionExpression = function() {
    return this.getTypedRuleContext(FunctionExpressionContext,0);
};

MustClauseContext.prototype.abstractFunctions = function() {
    return this.getTypedRuleContext(AbstractFunctionsContext,0);
};

MustClauseContext.prototype.abstractFunctionExpression = function() {
    return this.getTypedRuleContext(AbstractFunctionExpressionContext,0);
};

MustClauseContext.prototype.constructors = function() {
    return this.getTypedRuleContext(ConstructorsContext,0);
};

MustClauseContext.prototype.constructorExpression = function() {
    return this.getTypedRuleContext(ConstructorExpressionContext,0);
};

MustClauseContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

MustClauseContext.prototype.classExpression = function() {
    return this.getTypedRuleContext(ClassExpressionContext,0);
};

MustClauseContext.prototype.parameters = function() {
    return this.getTypedRuleContext(ParametersContext,0);
};

MustClauseContext.prototype.parameterExpression = function() {
    return this.getTypedRuleContext(ParameterExpressionContext,0);
};

MustClauseContext.prototype.declarationStatements = function() {
    return this.getTypedRuleContext(DeclarationStatementsContext,0);
};

MustClauseContext.prototype.declarationStatementExpression = function() {
    return this.getTypedRuleContext(DeclarationStatementExpressionContext,0);
};

MustClauseContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterMustClause(this);
	}
};

MustClauseContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitMustClause(this);
	}
};




myGrammarParser.MustClauseContext = MustClauseContext;

myGrammarParser.prototype.mustClause = function() {

    var localctx = new MustClauseContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, myGrammarParser.RULE_mustClause);
    try {
        this.state = 172;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.FUNCTION:
            this.enterOuterAlt(localctx, 1);
            this.state = 142;
            this.functions();
            this.state = 143;
            this.must();
            this.state = 144;
            this.have();
            this.state = 145;
            this.functionExpression(0);
            break;
        case myGrammarParser.AbstractFunctions:
            this.enterOuterAlt(localctx, 2);
            this.state = 147;
            this.abstractFunctions();
            this.state = 148;
            this.must();
            this.state = 149;
            this.have();
            this.state = 150;
            this.abstractFunctionExpression(0);
            break;
        case myGrammarParser.CONSTRUCTOR:
            this.enterOuterAlt(localctx, 3);
            this.state = 152;
            this.constructors();
            this.state = 153;
            this.must();
            this.state = 154;
            this.have();
            this.state = 155;
            this.constructorExpression(0);
            break;
        case myGrammarParser.CLASSES:
            this.enterOuterAlt(localctx, 4);
            this.state = 157;
            this.classes();
            this.state = 158;
            this.must();
            this.state = 159;
            this.have();
            this.state = 160;
            this.classExpression(0);
            break;
        case myGrammarParser.PARAMETER:
            this.enterOuterAlt(localctx, 5);
            this.state = 162;
            this.parameters();
            this.state = 163;
            this.must();
            this.state = 164;
            this.have();
            this.state = 165;
            this.parameterExpression(0);
            break;
        case myGrammarParser.DeclarationStatement:
            this.enterOuterAlt(localctx, 6);
            this.state = 167;
            this.declarationStatements();
            this.state = 168;
            this.must();
            this.state = 169;
            this.have();
            this.state = 170;
            this.declarationStatementExpression(0);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function WordsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_words;
    return this;
}

WordsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
WordsContext.prototype.constructor = WordsContext;

WordsContext.prototype.word = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(WordContext);
    } else {
        return this.getTypedRuleContext(WordContext,i);
    }
};

WordsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterWords(this);
	}
};

WordsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitWords(this);
	}
};




myGrammarParser.WordsContext = WordsContext;

myGrammarParser.prototype.words = function() {

    var localctx = new WordsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, myGrammarParser.RULE_words);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 174;
        this.match(myGrammarParser.T__0);
        this.state = 183;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,6,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 181;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
                switch(la_) {
                case 1:
                    this.state = 175;
                    this.word();
                    this.state = 176;
                    this.match(myGrammarParser.T__1);
                    break;

                case 2:
                    this.state = 178;
                    this.word();
                    this.state = 179;
                    this.match(myGrammarParser.T__2);
                    break;

                } 
            }
            this.state = 185;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,6,this._ctx);
        }

        this.state = 186;
        this.word();
        this.state = 187;
        this.match(myGrammarParser.T__0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function WordContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_word;
    return this;
}

WordContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
WordContext.prototype.constructor = WordContext;

WordContext.prototype.Alphabet = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.Alphabet);
    } else {
        return this.getToken(myGrammarParser.Alphabet, i);
    }
};


WordContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterWord(this);
	}
};

WordContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitWord(this);
	}
};




myGrammarParser.WordContext = WordContext;

myGrammarParser.prototype.word = function() {

    var localctx = new WordContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, myGrammarParser.RULE_word);
    var _la = 0; // Token type
    try {
        this.state = 239;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 190; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 189;
                this.match(myGrammarParser.Alphabet);
                this.state = 192; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 194;
            this.match(myGrammarParser.T__3);
            this.state = 196; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 195;
                this.match(myGrammarParser.Alphabet);
                this.state = 198; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 200;
            this.match(myGrammarParser.T__4);
            this.state = 202; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 201;
                this.match(myGrammarParser.Alphabet);
                this.state = 204; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 206;
            this.match(myGrammarParser.T__5);
            this.state = 208; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 207;
                this.match(myGrammarParser.Alphabet);
                this.state = 210; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            break;

        case 5:
            this.enterOuterAlt(localctx, 5);
            this.state = 213; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 212;
                this.match(myGrammarParser.Alphabet);
                this.state = 215; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            this.state = 217;
            this.match(myGrammarParser.T__4);
            break;

        case 6:
            this.enterOuterAlt(localctx, 6);
            this.state = 218;
            this.match(myGrammarParser.T__3);
            this.state = 220; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 219;
                this.match(myGrammarParser.Alphabet);
                this.state = 222; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            this.state = 224;
            this.match(myGrammarParser.T__4);
            break;

        case 7:
            this.enterOuterAlt(localctx, 7);
            this.state = 225;
            this.match(myGrammarParser.T__4);
            this.state = 227; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 226;
                this.match(myGrammarParser.Alphabet);
                this.state = 229; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            this.state = 231;
            this.match(myGrammarParser.T__4);
            break;

        case 8:
            this.enterOuterAlt(localctx, 8);
            this.state = 232;
            this.match(myGrammarParser.T__5);
            this.state = 234; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            do {
                this.state = 233;
                this.match(myGrammarParser.Alphabet);
                this.state = 236; 
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            } while(_la===myGrammarParser.Alphabet);
            this.state = 238;
            this.match(myGrammarParser.T__4);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function CombinatorialWordsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_combinatorialWords;
    return this;
}

CombinatorialWordsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CombinatorialWordsContext.prototype.constructor = CombinatorialWordsContext;

CombinatorialWordsContext.prototype.Alphabet = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.Alphabet);
    } else {
        return this.getToken(myGrammarParser.Alphabet, i);
    }
};


CombinatorialWordsContext.prototype.symbols = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(SymbolsContext);
    } else {
        return this.getTypedRuleContext(SymbolsContext,i);
    }
};

CombinatorialWordsContext.prototype.SPACE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.SPACE);
    } else {
        return this.getToken(myGrammarParser.SPACE, i);
    }
};


CombinatorialWordsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterCombinatorialWords(this);
	}
};

CombinatorialWordsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitCombinatorialWords(this);
	}
};




myGrammarParser.CombinatorialWordsContext = CombinatorialWordsContext;

myGrammarParser.prototype.combinatorialWords = function() {

    var localctx = new CombinatorialWordsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, myGrammarParser.RULE_combinatorialWords);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 241;
        this.match(myGrammarParser.T__0);
        this.state = 245; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 245;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.Alphabet:
                this.state = 242;
                this.match(myGrammarParser.Alphabet);
                break;
            case myGrammarParser.T__6:
            case myGrammarParser.T__7:
            case myGrammarParser.T__8:
            case myGrammarParser.T__9:
            case myGrammarParser.LPAREN:
            case myGrammarParser.RPAREN:
                this.state = 243;
                this.symbols();
                break;
            case myGrammarParser.SPACE:
                this.state = 244;
                this.match(myGrammarParser.SPACE);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            this.state = 247; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << myGrammarParser.T__6) | (1 << myGrammarParser.T__7) | (1 << myGrammarParser.T__8) | (1 << myGrammarParser.T__9) | (1 << myGrammarParser.SPACE) | (1 << myGrammarParser.Alphabet) | (1 << myGrammarParser.LPAREN) | (1 << myGrammarParser.RPAREN))) !== 0));
        this.state = 249;
        this.match(myGrammarParser.T__0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SymbolsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_symbols;
    return this;
}

SymbolsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SymbolsContext.prototype.constructor = SymbolsContext;


SymbolsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterSymbols(this);
	}
};

SymbolsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitSymbols(this);
	}
};




myGrammarParser.SymbolsContext = SymbolsContext;

myGrammarParser.prototype.symbols = function() {

    var localctx = new SymbolsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, myGrammarParser.RULE_symbols);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 251;
        _la = this._input.LA(1);
        if(!((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << myGrammarParser.T__6) | (1 << myGrammarParser.T__7) | (1 << myGrammarParser.T__8) | (1 << myGrammarParser.T__9) | (1 << myGrammarParser.LPAREN) | (1 << myGrammarParser.RPAREN))) !== 0))) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EndContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_end;
    return this;
}

EndContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EndContext.prototype.constructor = EndContext;


EndContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterEnd(this);
	}
};

EndContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitEnd(this);
	}
};




myGrammarParser.EndContext = EndContext;

myGrammarParser.prototype.end = function() {

    var localctx = new EndContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, myGrammarParser.RULE_end);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 253;
        this.match(myGrammarParser.T__6);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function EmptyLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_emptyLine;
    return this;
}

EmptyLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EmptyLineContext.prototype.constructor = EmptyLineContext;

EmptyLineContext.prototype.NL = function() {
    return this.getToken(myGrammarParser.NL, 0);
};

EmptyLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterEmptyLine(this);
	}
};

EmptyLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitEmptyLine(this);
	}
};




myGrammarParser.EmptyLineContext = EmptyLineContext;

myGrammarParser.prototype.emptyLine = function() {

    var localctx = new EmptyLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, myGrammarParser.RULE_emptyLine);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 255;
        this.match(myGrammarParser.NL);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function CommentsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_comments;
    return this;
}

CommentsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CommentsContext.prototype.constructor = CommentsContext;

CommentsContext.prototype.Alphabet = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.Alphabet);
    } else {
        return this.getToken(myGrammarParser.Alphabet, i);
    }
};


CommentsContext.prototype.symbols = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(SymbolsContext);
    } else {
        return this.getTypedRuleContext(SymbolsContext,i);
    }
};

CommentsContext.prototype.SPACE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(myGrammarParser.SPACE);
    } else {
        return this.getToken(myGrammarParser.SPACE, i);
    }
};


CommentsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterComments(this);
	}
};

CommentsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitComments(this);
	}
};




myGrammarParser.CommentsContext = CommentsContext;

myGrammarParser.prototype.comments = function() {

    var localctx = new CommentsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, myGrammarParser.RULE_comments);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 257;
        this.match(myGrammarParser.T__0);
        this.state = 261; 
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        do {
            this.state = 261;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.Alphabet:
                this.state = 258;
                this.match(myGrammarParser.Alphabet);
                break;
            case myGrammarParser.T__6:
            case myGrammarParser.T__7:
            case myGrammarParser.T__8:
            case myGrammarParser.T__9:
            case myGrammarParser.LPAREN:
            case myGrammarParser.RPAREN:
                this.state = 259;
                this.symbols();
                break;
            case myGrammarParser.SPACE:
                this.state = 260;
                this.match(myGrammarParser.SPACE);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            this.state = 263; 
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        } while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << myGrammarParser.T__6) | (1 << myGrammarParser.T__7) | (1 << myGrammarParser.T__8) | (1 << myGrammarParser.T__9) | (1 << myGrammarParser.SPACE) | (1 << myGrammarParser.Alphabet) | (1 << myGrammarParser.LPAREN) | (1 << myGrammarParser.RPAREN))) !== 0));
        this.state = 265;
        this.match(myGrammarParser.T__0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function MustContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_must;
    return this;
}

MustContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MustContext.prototype.constructor = MustContext;


MustContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterMust(this);
	}
};

MustContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitMust(this);
	}
};




myGrammarParser.MustContext = MustContext;

myGrammarParser.prototype.must = function() {

    var localctx = new MustContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, myGrammarParser.RULE_must);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 267;
        this.match(myGrammarParser.T__10);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function OfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_of;
    return this;
}

OfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OfContext.prototype.constructor = OfContext;


OfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterOf(this);
	}
};

OfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitOf(this);
	}
};




myGrammarParser.OfContext = OfContext;

myGrammarParser.prototype.of = function() {

    var localctx = new OfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, myGrammarParser.RULE_of);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 269;
        this.match(myGrammarParser.T__11);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AndContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_and;
    return this;
}

AndContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AndContext.prototype.constructor = AndContext;


AndContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAnd(this);
	}
};

AndContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAnd(this);
	}
};




myGrammarParser.AndContext = AndContext;

myGrammarParser.prototype.and = function() {

    var localctx = new AndContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, myGrammarParser.RULE_and);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 271;
        this.match(myGrammarParser.T__12);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function OrContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_or;
    return this;
}

OrContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
OrContext.prototype.constructor = OrContext;


OrContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterOr(this);
	}
};

OrContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitOr(this);
	}
};




myGrammarParser.OrContext = OrContext;

myGrammarParser.prototype.or = function() {

    var localctx = new OrContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, myGrammarParser.RULE_or);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 273;
        this.match(myGrammarParser.T__13);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function HaveContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_have;
    return this;
}

HaveContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
HaveContext.prototype.constructor = HaveContext;


HaveContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterHave(this);
	}
};

HaveContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitHave(this);
	}
};




myGrammarParser.HaveContext = HaveContext;

myGrammarParser.prototype.have = function() {

    var localctx = new HaveContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, myGrammarParser.RULE_have);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 275;
        this.match(myGrammarParser.T__14);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function WithWordContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_withWord;
    return this;
}

WithWordContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
WithWordContext.prototype.constructor = WithWordContext;


WithWordContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterWithWord(this);
	}
};

WithWordContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitWithWord(this);
	}
};




myGrammarParser.WithWordContext = WithWordContext;

myGrammarParser.prototype.withWord = function() {

    var localctx = new WithWordContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, myGrammarParser.RULE_withWord);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 277;
        this.match(myGrammarParser.T__15);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function BinaryContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_binary;
    return this;
}

BinaryContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
BinaryContext.prototype.constructor = BinaryContext;

BinaryContext.prototype.and = function() {
    return this.getTypedRuleContext(AndContext,0);
};

BinaryContext.prototype.or = function() {
    return this.getTypedRuleContext(OrContext,0);
};

BinaryContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterBinary(this);
	}
};

BinaryContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitBinary(this);
	}
};




myGrammarParser.BinaryContext = BinaryContext;

myGrammarParser.prototype.binary = function() {

    var localctx = new BinaryContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, myGrammarParser.RULE_binary);
    try {
        this.state = 281;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.T__12:
            this.enterOuterAlt(localctx, 1);
            this.state = 279;
            this.and();
            break;
        case myGrammarParser.T__13:
            this.enterOuterAlt(localctx, 2);
            this.state = 280;
            this.or();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function NamesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_names;
    return this;
}

NamesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NamesContext.prototype.constructor = NamesContext;

NamesContext.prototype.NAME = function() {
    return this.getToken(myGrammarParser.NAME, 0);
};

NamesContext.prototype.nameCondition = function() {
    return this.getTypedRuleContext(NameConditionContext,0);
};

NamesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterNames(this);
	}
};

NamesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitNames(this);
	}
};




myGrammarParser.NamesContext = NamesContext;

myGrammarParser.prototype.names = function() {

    var localctx = new NamesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, myGrammarParser.RULE_names);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 283;
        this.match(myGrammarParser.NAME);
        this.state = 285;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
        if(la_===1) {
            this.state = 284;
            this.nameCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function NameConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_nameCondition;
    return this;
}

NameConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NameConditionContext.prototype.constructor = NameConditionContext;

NameConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

NameConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

NameConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterNameCondition(this);
	}
};

NameConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitNameCondition(this);
	}
};




myGrammarParser.NameConditionContext = NameConditionContext;

myGrammarParser.prototype.nameCondition = function() {

    var localctx = new NameConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, myGrammarParser.RULE_nameCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 287;
        this.words();
        this.state = 288;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AnnotationsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_annotations;
    return this;
}

AnnotationsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AnnotationsContext.prototype.constructor = AnnotationsContext;

AnnotationsContext.prototype.ANNOTATION = function() {
    return this.getToken(myGrammarParser.ANNOTATION, 0);
};

AnnotationsContext.prototype.annotationCondition = function() {
    return this.getTypedRuleContext(AnnotationConditionContext,0);
};

AnnotationsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAnnotations(this);
	}
};

AnnotationsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAnnotations(this);
	}
};




myGrammarParser.AnnotationsContext = AnnotationsContext;

myGrammarParser.prototype.annotations = function() {

    var localctx = new AnnotationsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, myGrammarParser.RULE_annotations);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 290;
        this.match(myGrammarParser.ANNOTATION);
        this.state = 292;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,22,this._ctx);
        if(la_===1) {
            this.state = 291;
            this.annotationCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AnnotationConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_annotationCondition;
    return this;
}

AnnotationConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AnnotationConditionContext.prototype.constructor = AnnotationConditionContext;

AnnotationConditionContext.prototype.combinatorialWords = function() {
    return this.getTypedRuleContext(CombinatorialWordsContext,0);
};

AnnotationConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

AnnotationConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAnnotationCondition(this);
	}
};

AnnotationConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAnnotationCondition(this);
	}
};




myGrammarParser.AnnotationConditionContext = AnnotationConditionContext;

myGrammarParser.prototype.annotationCondition = function() {

    var localctx = new AnnotationConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, myGrammarParser.RULE_annotationCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 294;
        this.combinatorialWords();
        this.state = 295;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExtensionsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_extensions;
    return this;
}

ExtensionsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExtensionsContext.prototype.constructor = ExtensionsContext;

ExtensionsContext.prototype.EXTENSION = function() {
    return this.getToken(myGrammarParser.EXTENSION, 0);
};

ExtensionsContext.prototype.extensionCondition = function() {
    return this.getTypedRuleContext(ExtensionConditionContext,0);
};

ExtensionsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterExtensions(this);
	}
};

ExtensionsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitExtensions(this);
	}
};




myGrammarParser.ExtensionsContext = ExtensionsContext;

myGrammarParser.prototype.extensions = function() {

    var localctx = new ExtensionsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, myGrammarParser.RULE_extensions);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 297;
        this.match(myGrammarParser.EXTENSION);
        this.state = 298;
        this.extensionCondition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExtensionConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_extensionCondition;
    return this;
}

ExtensionConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExtensionConditionContext.prototype.constructor = ExtensionConditionContext;

ExtensionConditionContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

ExtensionConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

ExtensionConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ExtensionConditionContext.prototype.SUPERCLASS = function() {
    return this.getToken(myGrammarParser.SUPERCLASS, 0);
};

ExtensionConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterExtensionCondition(this);
	}
};

ExtensionConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitExtensionCondition(this);
	}
};




myGrammarParser.ExtensionConditionContext = ExtensionConditionContext;

myGrammarParser.prototype.extensionCondition = function() {

    var localctx = new ExtensionConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, myGrammarParser.RULE_extensionCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 300;
        this.of();
        this.state = 305;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.T__0:
            this.state = 301;
            this.words();
            this.state = 302;
            this.match(myGrammarParser.SPACE);
            break;
        case myGrammarParser.SUPERCLASS:
            this.state = 304;
            this.match(myGrammarParser.SUPERCLASS);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ImplementationsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_implementations;
    return this;
}

ImplementationsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImplementationsContext.prototype.constructor = ImplementationsContext;

ImplementationsContext.prototype.IMPLEMENTATION = function() {
    return this.getToken(myGrammarParser.IMPLEMENTATION, 0);
};

ImplementationsContext.prototype.implementationCondition = function() {
    return this.getTypedRuleContext(ImplementationConditionContext,0);
};

ImplementationsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterImplementations(this);
	}
};

ImplementationsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitImplementations(this);
	}
};




myGrammarParser.ImplementationsContext = ImplementationsContext;

myGrammarParser.prototype.implementations = function() {

    var localctx = new ImplementationsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, myGrammarParser.RULE_implementations);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 307;
        this.match(myGrammarParser.IMPLEMENTATION);
        this.state = 308;
        this.implementationCondition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ImplementationConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_implementationCondition;
    return this;
}

ImplementationConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImplementationConditionContext.prototype.constructor = ImplementationConditionContext;

ImplementationConditionContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

ImplementationConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

ImplementationConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ImplementationConditionContext.prototype.INTERFACE = function() {
    return this.getToken(myGrammarParser.INTERFACE, 0);
};

ImplementationConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterImplementationCondition(this);
	}
};

ImplementationConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitImplementationCondition(this);
	}
};




myGrammarParser.ImplementationConditionContext = ImplementationConditionContext;

myGrammarParser.prototype.implementationCondition = function() {

    var localctx = new ImplementationConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, myGrammarParser.RULE_implementationCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 310;
        this.of();
        this.state = 315;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.T__0:
            this.state = 311;
            this.words();
            this.state = 312;
            this.match(myGrammarParser.SPACE);
            break;
        case myGrammarParser.INTERFACE:
            this.state = 314;
            this.match(myGrammarParser.INTERFACE);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FunctionsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_functions;
    return this;
}

FunctionsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FunctionsContext.prototype.constructor = FunctionsContext;

FunctionsContext.prototype.FUNCTION = function() {
    return this.getToken(myGrammarParser.FUNCTION, 0);
};

FunctionsContext.prototype.functionCondition = function() {
    return this.getTypedRuleContext(FunctionConditionContext,0);
};

FunctionsContext.prototype.functionOf = function() {
    return this.getTypedRuleContext(FunctionOfContext,0);
};

FunctionsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterFunctions(this);
	}
};

FunctionsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitFunctions(this);
	}
};




myGrammarParser.FunctionsContext = FunctionsContext;

myGrammarParser.prototype.functions = function() {

    var localctx = new FunctionsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, myGrammarParser.RULE_functions);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 317;
        this.match(myGrammarParser.FUNCTION);
        this.state = 319;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
        if(la_===1) {
            this.state = 318;
            this.functionCondition();

        }
        this.state = 322;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,26,this._ctx);
        if(la_===1) {
            this.state = 321;
            this.functionOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FunctionOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_functionOf;
    return this;
}

FunctionOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FunctionOfContext.prototype.constructor = FunctionOfContext;

FunctionOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

FunctionOfContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

FunctionOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterFunctionOf(this);
	}
};

FunctionOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitFunctionOf(this);
	}
};




myGrammarParser.FunctionOfContext = FunctionOfContext;

myGrammarParser.prototype.functionOf = function() {

    var localctx = new FunctionOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, myGrammarParser.RULE_functionOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 324;
        this.of();
        this.state = 325;
        this.classes();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FunctionConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_functionCondition;
    return this;
}

FunctionConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FunctionConditionContext.prototype.constructor = FunctionConditionContext;

FunctionConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

FunctionConditionContext.prototype.functionExpression = function() {
    return this.getTypedRuleContext(FunctionExpressionContext,0);
};

FunctionConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterFunctionCondition(this);
	}
};

FunctionConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitFunctionCondition(this);
	}
};




myGrammarParser.FunctionConditionContext = FunctionConditionContext;

myGrammarParser.prototype.functionCondition = function() {

    var localctx = new FunctionConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, myGrammarParser.RULE_functionCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 327;
        this.withWord();
        this.state = 328;
        this.functionExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function FunctionExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_functionExpression;
    this.left = null; // FunctionExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // FunctionExpressionContext
    return this;
}

FunctionExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FunctionExpressionContext.prototype.constructor = FunctionExpressionContext;

FunctionExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

FunctionExpressionContext.prototype.functionExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(FunctionExpressionContext);
    } else {
        return this.getTypedRuleContext(FunctionExpressionContext,i);
    }
};

FunctionExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

FunctionExpressionContext.prototype.annotations = function() {
    return this.getTypedRuleContext(AnnotationsContext,0);
};

FunctionExpressionContext.prototype.specifiers = function() {
    return this.getTypedRuleContext(SpecifiersContext,0);
};

FunctionExpressionContext.prototype.visibilities = function() {
    return this.getTypedRuleContext(VisibilitiesContext,0);
};

FunctionExpressionContext.prototype.types = function() {
    return this.getTypedRuleContext(TypesContext,0);
};

FunctionExpressionContext.prototype.names = function() {
    return this.getTypedRuleContext(NamesContext,0);
};

FunctionExpressionContext.prototype.parameters = function() {
    return this.getTypedRuleContext(ParametersContext,0);
};

FunctionExpressionContext.prototype.returnValues = function() {
    return this.getTypedRuleContext(ReturnValuesContext,0);
};

FunctionExpressionContext.prototype.declarationStatements = function() {
    return this.getTypedRuleContext(DeclarationStatementsContext,0);
};

FunctionExpressionContext.prototype.expressionStatements = function() {
    return this.getTypedRuleContext(ExpressionStatementsContext,0);
};

FunctionExpressionContext.prototype.comments = function() {
    return this.getTypedRuleContext(CommentsContext,0);
};

FunctionExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

FunctionExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

FunctionExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterFunctionExpression(this);
	}
};

FunctionExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitFunctionExpression(this);
	}
};



myGrammarParser.prototype.functionExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new FunctionExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 54;
    this.enterRecursionRule(localctx, 54, myGrammarParser.RULE_functionExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 347;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 331;
            this.match(myGrammarParser.LPAREN);
            this.state = 332;
            this.functionExpression(0);
            this.state = 333;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.T__0:
        case myGrammarParser.NAME:
        case myGrammarParser.ANNOTATION:
        case myGrammarParser.PARAMETER:
        case myGrammarParser.TYPES:
        case myGrammarParser.SPECIFIER:
        case myGrammarParser.VISIBILITY:
        case myGrammarParser.ReturnValue:
        case myGrammarParser.DeclarationStatement:
        case myGrammarParser.ExpressionStatement:
            this.state = 345;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.ANNOTATION:
                this.state = 335;
                this.annotations();
                break;
            case myGrammarParser.SPECIFIER:
                this.state = 336;
                this.specifiers();
                break;
            case myGrammarParser.VISIBILITY:
                this.state = 337;
                this.visibilities();
                break;
            case myGrammarParser.TYPES:
                this.state = 338;
                this.types();
                break;
            case myGrammarParser.NAME:
                this.state = 339;
                this.names();
                break;
            case myGrammarParser.PARAMETER:
                this.state = 340;
                this.parameters();
                break;
            case myGrammarParser.ReturnValue:
                this.state = 341;
                this.returnValues();
                break;
            case myGrammarParser.DeclarationStatement:
                this.state = 342;
                this.declarationStatements();
                break;
            case myGrammarParser.ExpressionStatement:
                this.state = 343;
                this.expressionStatements();
                break;
            case myGrammarParser.T__0:
                this.state = 344;
                this.comments();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 357;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,30,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 355;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,29,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new FunctionExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_functionExpression);
                    this.state = 349;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 350;
                    localctx.op = this.binary();
                    this.state = 351;
                    localctx.right = this.functionExpression(4);
                    break;

                case 2:
                    localctx = new FunctionExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_functionExpression);
                    this.state = 353;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 354;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 359;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,30,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function AbstractFunctionsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_abstractFunctions;
    return this;
}

AbstractFunctionsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AbstractFunctionsContext.prototype.constructor = AbstractFunctionsContext;

AbstractFunctionsContext.prototype.AbstractFunctions = function() {
    return this.getToken(myGrammarParser.AbstractFunctions, 0);
};

AbstractFunctionsContext.prototype.abstractFunctionCondition = function() {
    return this.getTypedRuleContext(AbstractFunctionConditionContext,0);
};

AbstractFunctionsContext.prototype.abstractFunctionOf = function() {
    return this.getTypedRuleContext(AbstractFunctionOfContext,0);
};

AbstractFunctionsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAbstractFunctions(this);
	}
};

AbstractFunctionsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAbstractFunctions(this);
	}
};




myGrammarParser.AbstractFunctionsContext = AbstractFunctionsContext;

myGrammarParser.prototype.abstractFunctions = function() {

    var localctx = new AbstractFunctionsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 56, myGrammarParser.RULE_abstractFunctions);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 360;
        this.match(myGrammarParser.AbstractFunctions);
        this.state = 362;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,31,this._ctx);
        if(la_===1) {
            this.state = 361;
            this.abstractFunctionCondition();

        }
        this.state = 365;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,32,this._ctx);
        if(la_===1) {
            this.state = 364;
            this.abstractFunctionOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AbstractFunctionOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_abstractFunctionOf;
    return this;
}

AbstractFunctionOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AbstractFunctionOfContext.prototype.constructor = AbstractFunctionOfContext;

AbstractFunctionOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

AbstractFunctionOfContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

AbstractFunctionOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAbstractFunctionOf(this);
	}
};

AbstractFunctionOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAbstractFunctionOf(this);
	}
};




myGrammarParser.AbstractFunctionOfContext = AbstractFunctionOfContext;

myGrammarParser.prototype.abstractFunctionOf = function() {

    var localctx = new AbstractFunctionOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 58, myGrammarParser.RULE_abstractFunctionOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 367;
        this.of();
        this.state = 368;
        this.classes();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AbstractFunctionConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_abstractFunctionCondition;
    return this;
}

AbstractFunctionConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AbstractFunctionConditionContext.prototype.constructor = AbstractFunctionConditionContext;

AbstractFunctionConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

AbstractFunctionConditionContext.prototype.abstractFunctionExpression = function() {
    return this.getTypedRuleContext(AbstractFunctionExpressionContext,0);
};

AbstractFunctionConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAbstractFunctionCondition(this);
	}
};

AbstractFunctionConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAbstractFunctionCondition(this);
	}
};




myGrammarParser.AbstractFunctionConditionContext = AbstractFunctionConditionContext;

myGrammarParser.prototype.abstractFunctionCondition = function() {

    var localctx = new AbstractFunctionConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 60, myGrammarParser.RULE_abstractFunctionCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 370;
        this.withWord();
        this.state = 371;
        this.abstractFunctionExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function AbstractFunctionExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_abstractFunctionExpression;
    this.left = null; // AbstractFunctionExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // AbstractFunctionExpressionContext
    return this;
}

AbstractFunctionExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
AbstractFunctionExpressionContext.prototype.constructor = AbstractFunctionExpressionContext;

AbstractFunctionExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

AbstractFunctionExpressionContext.prototype.abstractFunctionExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(AbstractFunctionExpressionContext);
    } else {
        return this.getTypedRuleContext(AbstractFunctionExpressionContext,i);
    }
};

AbstractFunctionExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

AbstractFunctionExpressionContext.prototype.annotations = function() {
    return this.getTypedRuleContext(AnnotationsContext,0);
};

AbstractFunctionExpressionContext.prototype.specifiers = function() {
    return this.getTypedRuleContext(SpecifiersContext,0);
};

AbstractFunctionExpressionContext.prototype.visibilities = function() {
    return this.getTypedRuleContext(VisibilitiesContext,0);
};

AbstractFunctionExpressionContext.prototype.types = function() {
    return this.getTypedRuleContext(TypesContext,0);
};

AbstractFunctionExpressionContext.prototype.names = function() {
    return this.getTypedRuleContext(NamesContext,0);
};

AbstractFunctionExpressionContext.prototype.parameters = function() {
    return this.getTypedRuleContext(ParametersContext,0);
};

AbstractFunctionExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

AbstractFunctionExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

AbstractFunctionExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterAbstractFunctionExpression(this);
	}
};

AbstractFunctionExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitAbstractFunctionExpression(this);
	}
};



myGrammarParser.prototype.abstractFunctionExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new AbstractFunctionExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 62;
    this.enterRecursionRule(localctx, 62, myGrammarParser.RULE_abstractFunctionExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 386;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 374;
            this.match(myGrammarParser.LPAREN);
            this.state = 375;
            this.abstractFunctionExpression(0);
            this.state = 376;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.NAME:
        case myGrammarParser.ANNOTATION:
        case myGrammarParser.PARAMETER:
        case myGrammarParser.TYPES:
        case myGrammarParser.SPECIFIER:
        case myGrammarParser.VISIBILITY:
            this.state = 384;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.ANNOTATION:
                this.state = 378;
                this.annotations();
                break;
            case myGrammarParser.SPECIFIER:
                this.state = 379;
                this.specifiers();
                break;
            case myGrammarParser.VISIBILITY:
                this.state = 380;
                this.visibilities();
                break;
            case myGrammarParser.TYPES:
                this.state = 381;
                this.types();
                break;
            case myGrammarParser.NAME:
                this.state = 382;
                this.names();
                break;
            case myGrammarParser.PARAMETER:
                this.state = 383;
                this.parameters();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 396;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,36,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 394;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,35,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new AbstractFunctionExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_abstractFunctionExpression);
                    this.state = 388;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 389;
                    localctx.op = this.binary();
                    this.state = 390;
                    localctx.right = this.abstractFunctionExpression(4);
                    break;

                case 2:
                    localctx = new AbstractFunctionExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_abstractFunctionExpression);
                    this.state = 392;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 393;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 398;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,36,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function ConstructorsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_constructors;
    return this;
}

ConstructorsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConstructorsContext.prototype.constructor = ConstructorsContext;

ConstructorsContext.prototype.CONSTRUCTOR = function() {
    return this.getToken(myGrammarParser.CONSTRUCTOR, 0);
};

ConstructorsContext.prototype.constructorCondition = function() {
    return this.getTypedRuleContext(ConstructorConditionContext,0);
};

ConstructorsContext.prototype.constructorOf = function() {
    return this.getTypedRuleContext(ConstructorOfContext,0);
};

ConstructorsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterConstructors(this);
	}
};

ConstructorsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitConstructors(this);
	}
};




myGrammarParser.ConstructorsContext = ConstructorsContext;

myGrammarParser.prototype.constructors = function() {

    var localctx = new ConstructorsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 64, myGrammarParser.RULE_constructors);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 399;
        this.match(myGrammarParser.CONSTRUCTOR);
        this.state = 401;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,37,this._ctx);
        if(la_===1) {
            this.state = 400;
            this.constructorCondition();

        }
        this.state = 404;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,38,this._ctx);
        if(la_===1) {
            this.state = 403;
            this.constructorOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ConstructorOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_constructorOf;
    return this;
}

ConstructorOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConstructorOfContext.prototype.constructor = ConstructorOfContext;

ConstructorOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

ConstructorOfContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

ConstructorOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterConstructorOf(this);
	}
};

ConstructorOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitConstructorOf(this);
	}
};




myGrammarParser.ConstructorOfContext = ConstructorOfContext;

myGrammarParser.prototype.constructorOf = function() {

    var localctx = new ConstructorOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 66, myGrammarParser.RULE_constructorOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 406;
        this.of();
        this.state = 407;
        this.classes();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ConstructorConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_constructorCondition;
    return this;
}

ConstructorConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConstructorConditionContext.prototype.constructor = ConstructorConditionContext;

ConstructorConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

ConstructorConditionContext.prototype.constructorExpression = function() {
    return this.getTypedRuleContext(ConstructorExpressionContext,0);
};

ConstructorConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterConstructorCondition(this);
	}
};

ConstructorConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitConstructorCondition(this);
	}
};




myGrammarParser.ConstructorConditionContext = ConstructorConditionContext;

myGrammarParser.prototype.constructorCondition = function() {

    var localctx = new ConstructorConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 68, myGrammarParser.RULE_constructorCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 409;
        this.withWord();
        this.state = 410;
        this.constructorExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ConstructorExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_constructorExpression;
    this.left = null; // ConstructorExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // ConstructorExpressionContext
    return this;
}

ConstructorExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ConstructorExpressionContext.prototype.constructor = ConstructorExpressionContext;

ConstructorExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

ConstructorExpressionContext.prototype.constructorExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ConstructorExpressionContext);
    } else {
        return this.getTypedRuleContext(ConstructorExpressionContext,i);
    }
};

ConstructorExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

ConstructorExpressionContext.prototype.annotations = function() {
    return this.getTypedRuleContext(AnnotationsContext,0);
};

ConstructorExpressionContext.prototype.specifiers = function() {
    return this.getTypedRuleContext(SpecifiersContext,0);
};

ConstructorExpressionContext.prototype.visibilities = function() {
    return this.getTypedRuleContext(VisibilitiesContext,0);
};

ConstructorExpressionContext.prototype.parameters = function() {
    return this.getTypedRuleContext(ParametersContext,0);
};

ConstructorExpressionContext.prototype.returnValues = function() {
    return this.getTypedRuleContext(ReturnValuesContext,0);
};

ConstructorExpressionContext.prototype.declarationStatements = function() {
    return this.getTypedRuleContext(DeclarationStatementsContext,0);
};

ConstructorExpressionContext.prototype.expressionStatements = function() {
    return this.getTypedRuleContext(ExpressionStatementsContext,0);
};

ConstructorExpressionContext.prototype.comments = function() {
    return this.getTypedRuleContext(CommentsContext,0);
};

ConstructorExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

ConstructorExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ConstructorExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterConstructorExpression(this);
	}
};

ConstructorExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitConstructorExpression(this);
	}
};



myGrammarParser.prototype.constructorExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ConstructorExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 70;
    this.enterRecursionRule(localctx, 70, myGrammarParser.RULE_constructorExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 427;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 413;
            this.match(myGrammarParser.LPAREN);
            this.state = 414;
            this.constructorExpression(0);
            this.state = 415;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.T__0:
        case myGrammarParser.ANNOTATION:
        case myGrammarParser.PARAMETER:
        case myGrammarParser.SPECIFIER:
        case myGrammarParser.VISIBILITY:
        case myGrammarParser.ReturnValue:
        case myGrammarParser.DeclarationStatement:
        case myGrammarParser.ExpressionStatement:
            this.state = 425;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.ANNOTATION:
                this.state = 417;
                this.annotations();
                break;
            case myGrammarParser.SPECIFIER:
                this.state = 418;
                this.specifiers();
                break;
            case myGrammarParser.VISIBILITY:
                this.state = 419;
                this.visibilities();
                break;
            case myGrammarParser.PARAMETER:
                this.state = 420;
                this.parameters();
                break;
            case myGrammarParser.ReturnValue:
                this.state = 421;
                this.returnValues();
                break;
            case myGrammarParser.DeclarationStatement:
                this.state = 422;
                this.declarationStatements();
                break;
            case myGrammarParser.ExpressionStatement:
                this.state = 423;
                this.expressionStatements();
                break;
            case myGrammarParser.T__0:
                this.state = 424;
                this.comments();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 437;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,42,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 435;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,41,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ConstructorExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_constructorExpression);
                    this.state = 429;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 430;
                    localctx.op = this.binary();
                    this.state = 431;
                    localctx.right = this.constructorExpression(4);
                    break;

                case 2:
                    localctx = new ConstructorExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_constructorExpression);
                    this.state = 433;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 434;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 439;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,42,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function ParametersContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_parameters;
    return this;
}

ParametersContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParametersContext.prototype.constructor = ParametersContext;

ParametersContext.prototype.PARAMETER = function() {
    return this.getToken(myGrammarParser.PARAMETER, 0);
};

ParametersContext.prototype.parameterCondition = function() {
    return this.getTypedRuleContext(ParameterConditionContext,0);
};

ParametersContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterParameters(this);
	}
};

ParametersContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitParameters(this);
	}
};




myGrammarParser.ParametersContext = ParametersContext;

myGrammarParser.prototype.parameters = function() {

    var localctx = new ParametersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 72, myGrammarParser.RULE_parameters);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 440;
        this.match(myGrammarParser.PARAMETER);
        this.state = 442;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,43,this._ctx);
        if(la_===1) {
            this.state = 441;
            this.parameterCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_parameterCondition;
    return this;
}

ParameterConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterConditionContext.prototype.constructor = ParameterConditionContext;

ParameterConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

ParameterConditionContext.prototype.parameterExpression = function() {
    return this.getTypedRuleContext(ParameterExpressionContext,0);
};

ParameterConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterParameterCondition(this);
	}
};

ParameterConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitParameterCondition(this);
	}
};




myGrammarParser.ParameterConditionContext = ParameterConditionContext;

myGrammarParser.prototype.parameterCondition = function() {

    var localctx = new ParameterConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 74, myGrammarParser.RULE_parameterCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 444;
        this.withWord();
        this.state = 445;
        this.parameterExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ParameterExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_parameterExpression;
    this.left = null; // ParameterExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // ParameterExpressionContext
    return this;
}

ParameterExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParameterExpressionContext.prototype.constructor = ParameterExpressionContext;

ParameterExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

ParameterExpressionContext.prototype.parameterExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ParameterExpressionContext);
    } else {
        return this.getTypedRuleContext(ParameterExpressionContext,i);
    }
};

ParameterExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

ParameterExpressionContext.prototype.types = function() {
    return this.getTypedRuleContext(TypesContext,0);
};

ParameterExpressionContext.prototype.names = function() {
    return this.getTypedRuleContext(NamesContext,0);
};

ParameterExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

ParameterExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ParameterExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterParameterExpression(this);
	}
};

ParameterExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitParameterExpression(this);
	}
};



myGrammarParser.prototype.parameterExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ParameterExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 76;
    this.enterRecursionRule(localctx, 76, myGrammarParser.RULE_parameterExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 456;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 448;
            this.match(myGrammarParser.LPAREN);
            this.state = 449;
            this.parameterExpression(0);
            this.state = 450;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.NAME:
        case myGrammarParser.TYPES:
            this.state = 454;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.TYPES:
                this.state = 452;
                this.types();
                break;
            case myGrammarParser.NAME:
                this.state = 453;
                this.names();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 466;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,47,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 464;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,46,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ParameterExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_parameterExpression);
                    this.state = 458;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 459;
                    localctx.op = this.binary();
                    this.state = 460;
                    localctx.right = this.parameterExpression(4);
                    break;

                case 2:
                    localctx = new ParameterExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_parameterExpression);
                    this.state = 462;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 463;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 468;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,47,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function TypesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_types;
    return this;
}

TypesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TypesContext.prototype.constructor = TypesContext;

TypesContext.prototype.TYPES = function() {
    return this.getToken(myGrammarParser.TYPES, 0);
};

TypesContext.prototype.typeCondition = function() {
    return this.getTypedRuleContext(TypeConditionContext,0);
};

TypesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterTypes(this);
	}
};

TypesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitTypes(this);
	}
};




myGrammarParser.TypesContext = TypesContext;

myGrammarParser.prototype.types = function() {

    var localctx = new TypesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 78, myGrammarParser.RULE_types);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 469;
        this.match(myGrammarParser.TYPES);
        this.state = 471;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,48,this._ctx);
        if(la_===1) {
            this.state = 470;
            this.typeCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function TypeConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_typeCondition;
    return this;
}

TypeConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TypeConditionContext.prototype.constructor = TypeConditionContext;

TypeConditionContext.prototype.combinatorialWords = function() {
    return this.getTypedRuleContext(CombinatorialWordsContext,0);
};

TypeConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

TypeConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

TypeConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterTypeCondition(this);
	}
};

TypeConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitTypeCondition(this);
	}
};




myGrammarParser.TypeConditionContext = TypeConditionContext;

myGrammarParser.prototype.typeCondition = function() {

    var localctx = new TypeConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 80, myGrammarParser.RULE_typeCondition);
    try {
        this.state = 479;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,49,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 473;
            this.combinatorialWords();
            this.state = 474;
            this.match(myGrammarParser.SPACE);
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 476;
            this.words();
            this.state = 477;
            this.match(myGrammarParser.SPACE);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SpecifiersContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_specifiers;
    return this;
}

SpecifiersContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SpecifiersContext.prototype.constructor = SpecifiersContext;

SpecifiersContext.prototype.SPECIFIER = function() {
    return this.getToken(myGrammarParser.SPECIFIER, 0);
};

SpecifiersContext.prototype.specifierCondition = function() {
    return this.getTypedRuleContext(SpecifierConditionContext,0);
};

SpecifiersContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterSpecifiers(this);
	}
};

SpecifiersContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitSpecifiers(this);
	}
};




myGrammarParser.SpecifiersContext = SpecifiersContext;

myGrammarParser.prototype.specifiers = function() {

    var localctx = new SpecifiersContext(this, this._ctx, this.state);
    this.enterRule(localctx, 82, myGrammarParser.RULE_specifiers);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 481;
        this.match(myGrammarParser.SPECIFIER);
        this.state = 483;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,50,this._ctx);
        if(la_===1) {
            this.state = 482;
            this.specifierCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function SpecifierConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_specifierCondition;
    return this;
}

SpecifierConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SpecifierConditionContext.prototype.constructor = SpecifierConditionContext;

SpecifierConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

SpecifierConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

SpecifierConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterSpecifierCondition(this);
	}
};

SpecifierConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitSpecifierCondition(this);
	}
};




myGrammarParser.SpecifierConditionContext = SpecifierConditionContext;

myGrammarParser.prototype.specifierCondition = function() {

    var localctx = new SpecifierConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 84, myGrammarParser.RULE_specifierCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 485;
        this.words();
        this.state = 486;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function VisibilitiesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_visibilities;
    return this;
}

VisibilitiesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VisibilitiesContext.prototype.constructor = VisibilitiesContext;

VisibilitiesContext.prototype.VISIBILITY = function() {
    return this.getToken(myGrammarParser.VISIBILITY, 0);
};

VisibilitiesContext.prototype.visibilityCondition = function() {
    return this.getTypedRuleContext(VisibilityConditionContext,0);
};

VisibilitiesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterVisibilities(this);
	}
};

VisibilitiesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitVisibilities(this);
	}
};




myGrammarParser.VisibilitiesContext = VisibilitiesContext;

myGrammarParser.prototype.visibilities = function() {

    var localctx = new VisibilitiesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 86, myGrammarParser.RULE_visibilities);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 488;
        this.match(myGrammarParser.VISIBILITY);
        this.state = 490;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,51,this._ctx);
        if(la_===1) {
            this.state = 489;
            this.visibilityCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function VisibilityConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_visibilityCondition;
    return this;
}

VisibilityConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
VisibilityConditionContext.prototype.constructor = VisibilityConditionContext;

VisibilityConditionContext.prototype.words = function() {
    return this.getTypedRuleContext(WordsContext,0);
};

VisibilityConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

VisibilityConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterVisibilityCondition(this);
	}
};

VisibilityConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitVisibilityCondition(this);
	}
};




myGrammarParser.VisibilityConditionContext = VisibilityConditionContext;

myGrammarParser.prototype.visibilityCondition = function() {

    var localctx = new VisibilityConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 88, myGrammarParser.RULE_visibilityCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 492;
        this.words();
        this.state = 493;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ReturnValuesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_returnValues;
    return this;
}

ReturnValuesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ReturnValuesContext.prototype.constructor = ReturnValuesContext;

ReturnValuesContext.prototype.ReturnValue = function() {
    return this.getToken(myGrammarParser.ReturnValue, 0);
};

ReturnValuesContext.prototype.returnValueCondition = function() {
    return this.getTypedRuleContext(ReturnValueConditionContext,0);
};

ReturnValuesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterReturnValues(this);
	}
};

ReturnValuesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitReturnValues(this);
	}
};




myGrammarParser.ReturnValuesContext = ReturnValuesContext;

myGrammarParser.prototype.returnValues = function() {

    var localctx = new ReturnValuesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 90, myGrammarParser.RULE_returnValues);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 495;
        this.match(myGrammarParser.ReturnValue);
        this.state = 497;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,52,this._ctx);
        if(la_===1) {
            this.state = 496;
            this.returnValueCondition();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ReturnValueConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_returnValueCondition;
    return this;
}

ReturnValueConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ReturnValueConditionContext.prototype.constructor = ReturnValueConditionContext;

ReturnValueConditionContext.prototype.combinatorialWords = function() {
    return this.getTypedRuleContext(CombinatorialWordsContext,0);
};

ReturnValueConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ReturnValueConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterReturnValueCondition(this);
	}
};

ReturnValueConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitReturnValueCondition(this);
	}
};




myGrammarParser.ReturnValueConditionContext = ReturnValueConditionContext;

myGrammarParser.prototype.returnValueCondition = function() {

    var localctx = new ReturnValueConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 92, myGrammarParser.RULE_returnValueCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 499;
        this.combinatorialWords();
        this.state = 500;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DeclarationStatementsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_declarationStatements;
    return this;
}

DeclarationStatementsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DeclarationStatementsContext.prototype.constructor = DeclarationStatementsContext;

DeclarationStatementsContext.prototype.DeclarationStatement = function() {
    return this.getToken(myGrammarParser.DeclarationStatement, 0);
};

DeclarationStatementsContext.prototype.declarationStatementCondition = function() {
    return this.getTypedRuleContext(DeclarationStatementConditionContext,0);
};

DeclarationStatementsContext.prototype.declarationStatementOf = function() {
    return this.getTypedRuleContext(DeclarationStatementOfContext,0);
};

DeclarationStatementsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterDeclarationStatements(this);
	}
};

DeclarationStatementsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitDeclarationStatements(this);
	}
};




myGrammarParser.DeclarationStatementsContext = DeclarationStatementsContext;

myGrammarParser.prototype.declarationStatements = function() {

    var localctx = new DeclarationStatementsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 94, myGrammarParser.RULE_declarationStatements);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 502;
        this.match(myGrammarParser.DeclarationStatement);
        this.state = 504;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,53,this._ctx);
        if(la_===1) {
            this.state = 503;
            this.declarationStatementCondition();

        }
        this.state = 507;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,54,this._ctx);
        if(la_===1) {
            this.state = 506;
            this.declarationStatementOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DeclarationStatementOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_declarationStatementOf;
    return this;
}

DeclarationStatementOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DeclarationStatementOfContext.prototype.constructor = DeclarationStatementOfContext;

DeclarationStatementOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

DeclarationStatementOfContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

DeclarationStatementOfContext.prototype.functions = function() {
    return this.getTypedRuleContext(FunctionsContext,0);
};

DeclarationStatementOfContext.prototype.constructors = function() {
    return this.getTypedRuleContext(ConstructorsContext,0);
};

DeclarationStatementOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterDeclarationStatementOf(this);
	}
};

DeclarationStatementOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitDeclarationStatementOf(this);
	}
};




myGrammarParser.DeclarationStatementOfContext = DeclarationStatementOfContext;

myGrammarParser.prototype.declarationStatementOf = function() {

    var localctx = new DeclarationStatementOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 96, myGrammarParser.RULE_declarationStatementOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 509;
        this.of();
        this.state = 513;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.CLASSES:
            this.state = 510;
            this.classes();
            break;
        case myGrammarParser.FUNCTION:
            this.state = 511;
            this.functions();
            break;
        case myGrammarParser.CONSTRUCTOR:
            this.state = 512;
            this.constructors();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DeclarationStatementConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_declarationStatementCondition;
    return this;
}

DeclarationStatementConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DeclarationStatementConditionContext.prototype.constructor = DeclarationStatementConditionContext;

DeclarationStatementConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

DeclarationStatementConditionContext.prototype.declarationStatementExpression = function() {
    return this.getTypedRuleContext(DeclarationStatementExpressionContext,0);
};

DeclarationStatementConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterDeclarationStatementCondition(this);
	}
};

DeclarationStatementConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitDeclarationStatementCondition(this);
	}
};




myGrammarParser.DeclarationStatementConditionContext = DeclarationStatementConditionContext;

myGrammarParser.prototype.declarationStatementCondition = function() {

    var localctx = new DeclarationStatementConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 98, myGrammarParser.RULE_declarationStatementCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 515;
        this.withWord();
        this.state = 516;
        this.declarationStatementExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function DeclarationStatementExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_declarationStatementExpression;
    this.left = null; // DeclarationStatementExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // DeclarationStatementExpressionContext
    return this;
}

DeclarationStatementExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
DeclarationStatementExpressionContext.prototype.constructor = DeclarationStatementExpressionContext;

DeclarationStatementExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

DeclarationStatementExpressionContext.prototype.declarationStatementExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(DeclarationStatementExpressionContext);
    } else {
        return this.getTypedRuleContext(DeclarationStatementExpressionContext,i);
    }
};

DeclarationStatementExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

DeclarationStatementExpressionContext.prototype.annotations = function() {
    return this.getTypedRuleContext(AnnotationsContext,0);
};

DeclarationStatementExpressionContext.prototype.specifiers = function() {
    return this.getTypedRuleContext(SpecifiersContext,0);
};

DeclarationStatementExpressionContext.prototype.visibilities = function() {
    return this.getTypedRuleContext(VisibilitiesContext,0);
};

DeclarationStatementExpressionContext.prototype.types = function() {
    return this.getTypedRuleContext(TypesContext,0);
};

DeclarationStatementExpressionContext.prototype.names = function() {
    return this.getTypedRuleContext(NamesContext,0);
};

DeclarationStatementExpressionContext.prototype.initialValues = function() {
    return this.getTypedRuleContext(InitialValuesContext,0);
};

DeclarationStatementExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

DeclarationStatementExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

DeclarationStatementExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterDeclarationStatementExpression(this);
	}
};

DeclarationStatementExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitDeclarationStatementExpression(this);
	}
};



myGrammarParser.prototype.declarationStatementExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new DeclarationStatementExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 100;
    this.enterRecursionRule(localctx, 100, myGrammarParser.RULE_declarationStatementExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 531;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 519;
            this.match(myGrammarParser.LPAREN);
            this.state = 520;
            this.declarationStatementExpression(0);
            this.state = 521;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.NAME:
        case myGrammarParser.ANNOTATION:
        case myGrammarParser.TYPES:
        case myGrammarParser.SPECIFIER:
        case myGrammarParser.VISIBILITY:
        case myGrammarParser.InitialValue:
            this.state = 529;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.ANNOTATION:
                this.state = 523;
                this.annotations();
                break;
            case myGrammarParser.SPECIFIER:
                this.state = 524;
                this.specifiers();
                break;
            case myGrammarParser.VISIBILITY:
                this.state = 525;
                this.visibilities();
                break;
            case myGrammarParser.TYPES:
                this.state = 526;
                this.types();
                break;
            case myGrammarParser.NAME:
                this.state = 527;
                this.names();
                break;
            case myGrammarParser.InitialValue:
                this.state = 528;
                this.initialValues();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 541;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,59,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 539;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,58,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new DeclarationStatementExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_declarationStatementExpression);
                    this.state = 533;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 534;
                    localctx.op = this.binary();
                    this.state = 535;
                    localctx.right = this.declarationStatementExpression(4);
                    break;

                case 2:
                    localctx = new DeclarationStatementExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_declarationStatementExpression);
                    this.state = 537;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 538;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 543;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,59,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function ExpressionStatementsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_expressionStatements;
    return this;
}

ExpressionStatementsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExpressionStatementsContext.prototype.constructor = ExpressionStatementsContext;

ExpressionStatementsContext.prototype.ExpressionStatement = function() {
    return this.getToken(myGrammarParser.ExpressionStatement, 0);
};

ExpressionStatementsContext.prototype.expressionStatementCondition = function() {
    return this.getTypedRuleContext(ExpressionStatementConditionContext,0);
};

ExpressionStatementsContext.prototype.expressionStatementOf = function() {
    return this.getTypedRuleContext(ExpressionStatementOfContext,0);
};

ExpressionStatementsContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterExpressionStatements(this);
	}
};

ExpressionStatementsContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitExpressionStatements(this);
	}
};




myGrammarParser.ExpressionStatementsContext = ExpressionStatementsContext;

myGrammarParser.prototype.expressionStatements = function() {

    var localctx = new ExpressionStatementsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 102, myGrammarParser.RULE_expressionStatements);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 544;
        this.match(myGrammarParser.ExpressionStatement);
        this.state = 546;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,60,this._ctx);
        if(la_===1) {
            this.state = 545;
            this.expressionStatementCondition();

        }
        this.state = 549;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,61,this._ctx);
        if(la_===1) {
            this.state = 548;
            this.expressionStatementOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExpressionStatementOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_expressionStatementOf;
    return this;
}

ExpressionStatementOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExpressionStatementOfContext.prototype.constructor = ExpressionStatementOfContext;

ExpressionStatementOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

ExpressionStatementOfContext.prototype.functions = function() {
    return this.getTypedRuleContext(FunctionsContext,0);
};

ExpressionStatementOfContext.prototype.constructors = function() {
    return this.getTypedRuleContext(ConstructorsContext,0);
};

ExpressionStatementOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterExpressionStatementOf(this);
	}
};

ExpressionStatementOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitExpressionStatementOf(this);
	}
};




myGrammarParser.ExpressionStatementOfContext = ExpressionStatementOfContext;

myGrammarParser.prototype.expressionStatementOf = function() {

    var localctx = new ExpressionStatementOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 104, myGrammarParser.RULE_expressionStatementOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 551;
        this.of();
        this.state = 555;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,62,this._ctx);
        switch(la_) {
        case 1:
            this.state = 552;
            this.functions();
            break;

        case 2:
            this.state = 553;
            this.constructors();
            break;

        case 3:
            this.state = 554;
            this.constructors();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExpressionStatementConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_expressionStatementCondition;
    return this;
}

ExpressionStatementConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExpressionStatementConditionContext.prototype.constructor = ExpressionStatementConditionContext;

ExpressionStatementConditionContext.prototype.combinatorialWords = function() {
    return this.getTypedRuleContext(CombinatorialWordsContext,0);
};

ExpressionStatementConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ExpressionStatementConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterExpressionStatementCondition(this);
	}
};

ExpressionStatementConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitExpressionStatementCondition(this);
	}
};




myGrammarParser.ExpressionStatementConditionContext = ExpressionStatementConditionContext;

myGrammarParser.prototype.expressionStatementCondition = function() {

    var localctx = new ExpressionStatementConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 106, myGrammarParser.RULE_expressionStatementCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 557;
        this.combinatorialWords();
        this.state = 558;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function InitialValuesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_initialValues;
    return this;
}

InitialValuesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InitialValuesContext.prototype.constructor = InitialValuesContext;

InitialValuesContext.prototype.InitialValue = function() {
    return this.getToken(myGrammarParser.InitialValue, 0);
};

InitialValuesContext.prototype.initialValueCondition = function() {
    return this.getTypedRuleContext(InitialValueConditionContext,0);
};

InitialValuesContext.prototype.initialValueOf = function() {
    return this.getTypedRuleContext(InitialValueOfContext,0);
};

InitialValuesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterInitialValues(this);
	}
};

InitialValuesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitInitialValues(this);
	}
};




myGrammarParser.InitialValuesContext = InitialValuesContext;

myGrammarParser.prototype.initialValues = function() {

    var localctx = new InitialValuesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 108, myGrammarParser.RULE_initialValues);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 560;
        this.match(myGrammarParser.InitialValue);
        this.state = 562;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,63,this._ctx);
        if(la_===1) {
            this.state = 561;
            this.initialValueCondition();

        }
        this.state = 565;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,64,this._ctx);
        if(la_===1) {
            this.state = 564;
            this.initialValueOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function InitialValueOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_initialValueOf;
    return this;
}

InitialValueOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InitialValueOfContext.prototype.constructor = InitialValueOfContext;

InitialValueOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

InitialValueOfContext.prototype.declarationStatements = function() {
    return this.getTypedRuleContext(DeclarationStatementsContext,0);
};

InitialValueOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterInitialValueOf(this);
	}
};

InitialValueOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitInitialValueOf(this);
	}
};




myGrammarParser.InitialValueOfContext = InitialValueOfContext;

myGrammarParser.prototype.initialValueOf = function() {

    var localctx = new InitialValueOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 110, myGrammarParser.RULE_initialValueOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 567;
        this.of();
        this.state = 568;
        this.declarationStatements();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function InitialValueConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_initialValueCondition;
    return this;
}

InitialValueConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InitialValueConditionContext.prototype.constructor = InitialValueConditionContext;

InitialValueConditionContext.prototype.combinatorialWords = function() {
    return this.getTypedRuleContext(CombinatorialWordsContext,0);
};

InitialValueConditionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

InitialValueConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterInitialValueCondition(this);
	}
};

InitialValueConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitInitialValueCondition(this);
	}
};




myGrammarParser.InitialValueConditionContext = InitialValueConditionContext;

myGrammarParser.prototype.initialValueCondition = function() {

    var localctx = new InitialValueConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 112, myGrammarParser.RULE_initialValueCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 570;
        this.combinatorialWords();
        this.state = 571;
        this.match(myGrammarParser.SPACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ClassesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_classes;
    return this;
}

ClassesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ClassesContext.prototype.constructor = ClassesContext;

ClassesContext.prototype.CLASSES = function() {
    return this.getToken(myGrammarParser.CLASSES, 0);
};

ClassesContext.prototype.classCondition = function() {
    return this.getTypedRuleContext(ClassConditionContext,0);
};

ClassesContext.prototype.classOf = function() {
    return this.getTypedRuleContext(ClassOfContext,0);
};

ClassesContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterClasses(this);
	}
};

ClassesContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitClasses(this);
	}
};




myGrammarParser.ClassesContext = ClassesContext;

myGrammarParser.prototype.classes = function() {

    var localctx = new ClassesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 114, myGrammarParser.RULE_classes);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 573;
        this.match(myGrammarParser.CLASSES);
        this.state = 575;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,65,this._ctx);
        if(la_===1) {
            this.state = 574;
            this.classCondition();

        }
        this.state = 578;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,66,this._ctx);
        if(la_===1) {
            this.state = 577;
            this.classOf();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ClassOfContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_classOf;
    return this;
}

ClassOfContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ClassOfContext.prototype.constructor = ClassOfContext;

ClassOfContext.prototype.of = function() {
    return this.getTypedRuleContext(OfContext,0);
};

ClassOfContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

ClassOfContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterClassOf(this);
	}
};

ClassOfContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitClassOf(this);
	}
};




myGrammarParser.ClassOfContext = ClassOfContext;

myGrammarParser.prototype.classOf = function() {

    var localctx = new ClassOfContext(this, this._ctx, this.state);
    this.enterRule(localctx, 116, myGrammarParser.RULE_classOf);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 580;
        this.of();
        this.state = 581;
        this.classes();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ClassConditionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_classCondition;
    return this;
}

ClassConditionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ClassConditionContext.prototype.constructor = ClassConditionContext;

ClassConditionContext.prototype.withWord = function() {
    return this.getTypedRuleContext(WithWordContext,0);
};

ClassConditionContext.prototype.classExpression = function() {
    return this.getTypedRuleContext(ClassExpressionContext,0);
};

ClassConditionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterClassCondition(this);
	}
};

ClassConditionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitClassCondition(this);
	}
};




myGrammarParser.ClassConditionContext = ClassConditionContext;

myGrammarParser.prototype.classCondition = function() {

    var localctx = new ClassConditionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 118, myGrammarParser.RULE_classCondition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 583;
        this.withWord();
        this.state = 584;
        this.classExpression(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ClassExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = myGrammarParser.RULE_classExpression;
    this.left = null; // ClassExpressionContext
    this.op = null; // BinaryContext
    this.right = null; // ClassExpressionContext
    return this;
}

ClassExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ClassExpressionContext.prototype.constructor = ClassExpressionContext;

ClassExpressionContext.prototype.LPAREN = function() {
    return this.getToken(myGrammarParser.LPAREN, 0);
};

ClassExpressionContext.prototype.classExpression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ClassExpressionContext);
    } else {
        return this.getTypedRuleContext(ClassExpressionContext,i);
    }
};

ClassExpressionContext.prototype.RPAREN = function() {
    return this.getToken(myGrammarParser.RPAREN, 0);
};

ClassExpressionContext.prototype.annotations = function() {
    return this.getTypedRuleContext(AnnotationsContext,0);
};

ClassExpressionContext.prototype.specifiers = function() {
    return this.getTypedRuleContext(SpecifiersContext,0);
};

ClassExpressionContext.prototype.visibilities = function() {
    return this.getTypedRuleContext(VisibilitiesContext,0);
};

ClassExpressionContext.prototype.names = function() {
    return this.getTypedRuleContext(NamesContext,0);
};

ClassExpressionContext.prototype.extensions = function() {
    return this.getTypedRuleContext(ExtensionsContext,0);
};

ClassExpressionContext.prototype.implementations = function() {
    return this.getTypedRuleContext(ImplementationsContext,0);
};

ClassExpressionContext.prototype.functions = function() {
    return this.getTypedRuleContext(FunctionsContext,0);
};

ClassExpressionContext.prototype.abstractFunctions = function() {
    return this.getTypedRuleContext(AbstractFunctionsContext,0);
};

ClassExpressionContext.prototype.constructors = function() {
    return this.getTypedRuleContext(ConstructorsContext,0);
};

ClassExpressionContext.prototype.declarationStatements = function() {
    return this.getTypedRuleContext(DeclarationStatementsContext,0);
};

ClassExpressionContext.prototype.classes = function() {
    return this.getTypedRuleContext(ClassesContext,0);
};

ClassExpressionContext.prototype.returnValues = function() {
    return this.getTypedRuleContext(ReturnValuesContext,0);
};

ClassExpressionContext.prototype.comments = function() {
    return this.getTypedRuleContext(CommentsContext,0);
};

ClassExpressionContext.prototype.binary = function() {
    return this.getTypedRuleContext(BinaryContext,0);
};

ClassExpressionContext.prototype.SPACE = function() {
    return this.getToken(myGrammarParser.SPACE, 0);
};

ClassExpressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.enterClassExpression(this);
	}
};

ClassExpressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof myGrammarListener ) {
        listener.exitClassExpression(this);
	}
};



myGrammarParser.prototype.classExpression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ClassExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 120;
    this.enterRecursionRule(localctx, 120, myGrammarParser.RULE_classExpression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 606;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case myGrammarParser.LPAREN:
            this.state = 587;
            this.match(myGrammarParser.LPAREN);
            this.state = 588;
            this.classExpression(0);
            this.state = 589;
            this.match(myGrammarParser.RPAREN);
            break;
        case myGrammarParser.T__0:
        case myGrammarParser.NAME:
        case myGrammarParser.ANNOTATION:
        case myGrammarParser.EXTENSION:
        case myGrammarParser.IMPLEMENTATION:
        case myGrammarParser.FUNCTION:
        case myGrammarParser.AbstractFunctions:
        case myGrammarParser.CONSTRUCTOR:
        case myGrammarParser.SPECIFIER:
        case myGrammarParser.VISIBILITY:
        case myGrammarParser.ReturnValue:
        case myGrammarParser.DeclarationStatement:
        case myGrammarParser.CLASSES:
            this.state = 604;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case myGrammarParser.ANNOTATION:
                this.state = 591;
                this.annotations();
                break;
            case myGrammarParser.SPECIFIER:
                this.state = 592;
                this.specifiers();
                break;
            case myGrammarParser.VISIBILITY:
                this.state = 593;
                this.visibilities();
                break;
            case myGrammarParser.NAME:
                this.state = 594;
                this.names();
                break;
            case myGrammarParser.EXTENSION:
                this.state = 595;
                this.extensions();
                break;
            case myGrammarParser.IMPLEMENTATION:
                this.state = 596;
                this.implementations();
                break;
            case myGrammarParser.FUNCTION:
                this.state = 597;
                this.functions();
                break;
            case myGrammarParser.AbstractFunctions:
                this.state = 598;
                this.abstractFunctions();
                break;
            case myGrammarParser.CONSTRUCTOR:
                this.state = 599;
                this.constructors();
                break;
            case myGrammarParser.DeclarationStatement:
                this.state = 600;
                this.declarationStatements();
                break;
            case myGrammarParser.CLASSES:
                this.state = 601;
                this.classes();
                break;
            case myGrammarParser.ReturnValue:
                this.state = 602;
                this.returnValues();
                break;
            case myGrammarParser.T__0:
                this.state = 603;
                this.comments();
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 616;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,70,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 614;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,69,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new ClassExpressionContext(this, _parentctx, _parentState);
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_classExpression);
                    this.state = 608;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 609;
                    localctx.op = this.binary();
                    this.state = 610;
                    localctx.right = this.classExpression(4);
                    break;

                case 2:
                    localctx = new ClassExpressionContext(this, _parentctx, _parentState);
                    this.pushNewRecursionContext(localctx, _startState, myGrammarParser.RULE_classExpression);
                    this.state = 612;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 613;
                    this.match(myGrammarParser.SPACE);
                    break;

                } 
            }
            this.state = 618;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,70,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


myGrammarParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 27:
			return this.functionExpression_sempred(localctx, predIndex);
	case 31:
			return this.abstractFunctionExpression_sempred(localctx, predIndex);
	case 35:
			return this.constructorExpression_sempred(localctx, predIndex);
	case 38:
			return this.parameterExpression_sempred(localctx, predIndex);
	case 50:
			return this.declarationStatementExpression_sempred(localctx, predIndex);
	case 60:
			return this.classExpression_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

myGrammarParser.prototype.functionExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);
		case 1:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

myGrammarParser.prototype.abstractFunctionExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 2:
			return this.precpred(this._ctx, 3);
		case 3:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

myGrammarParser.prototype.constructorExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 4:
			return this.precpred(this._ctx, 3);
		case 5:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

myGrammarParser.prototype.parameterExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 6:
			return this.precpred(this._ctx, 3);
		case 7:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

myGrammarParser.prototype.declarationStatementExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 8:
			return this.precpred(this._ctx, 3);
		case 9:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};

myGrammarParser.prototype.classExpression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 10:
			return this.precpred(this._ctx, 3);
		case 11:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.myGrammarParser = myGrammarParser;
