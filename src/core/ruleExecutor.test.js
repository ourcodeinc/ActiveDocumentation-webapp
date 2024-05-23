import {removeSiblingFunctionBodies, removeFunctionBodies} from "./ruleExecutor";

describe("removeFunctionBodies", () => {

    /*
    public class myClass {
       @Id
       public long ID;
       public myClass() {
           // constructor body
           this.ID = 0;
       }
       public void myFunc(int param) {
           // myFunc body
       }
       @annot
       private String anotherFunc(String param) {
           // anotherFunc body
       }
    }
    */
    const xmlString =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> <block>{
               <comment type="line">// constructor body</comment>
               <expr_stmt><expr><name><name>this</name><operator>.</operator><name>ID</name></name> <operator>=</operator> <literal type="number">0</literal></expr>;</expr_stmt>
           }</block></constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// myFunc body</comment>
           }</block></function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// anotherFunc body</comment>
           }</block></function>
        }</block></class>
        </unit>`;

    /*
    public class myClass {
       @Id
       public long ID;
       public myClass() {
           // constructor body
           this.ID = 0;
       }
       public void myFunc(int param)
       @annot
       private String anotherFunc(String param) {
           // anotherFunc body
       }
    }
    */
    const removedFirstFuncBody =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> <block>{
               <comment type="line">// constructor body</comment>
               <expr_stmt><expr><name><name>this</name><operator>.</operator><name>ID</name></name> <operator>=</operator> <literal type="number">0</literal></expr>;</expr_stmt>
           }</block></constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// anotherFunc body</comment>
           }</block></function>
        }</block></class>
        </unit>`;

    /*
    public class myClass {
       @Id
       public long ID;
       public myClass()
       public void myFunc(int param) {
           // myFunc body
       }
       @annot
       private String anotherFunc(String param) {
           // anotherFunc body
       }
    }
    */
    const removedConstrBody =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> </constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// myFunc body</comment>
           }</block></function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// anotherFunc body</comment>
           }</block></function>
        }</block></class>
        </unit>`;

    /*
    public class myClass {
       @Id
       public long ID;
       public myClass()
       public void myFunc(int param)
       @annot
       private String anotherFunc(String param)
    }
     */
    const removedAllBodies =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> </constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
        }</block></class>
        </unit>`;

    /*
    public class myClass {
       @Id
       public long ID;
      public myClass()
       public void myFunc(int param) {
           // myFunc body
       }
      @annot
       private String anotherFunc(String param)
    }
    */
    const removedFirstFuncSibBodies =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> </constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> <block>{
               <comment type="line">// myFunc body</comment>
           }</block></function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
        }</block></class>
        </unit>`;

    /*
    public class myClass {
       @Id
       public long ID;
       public myClass() {
           // constructor body
           this.ID = 0;
       }
       public void myFunc(int param)
       @annot
       private String anotherFunc(String param)
    }
     */
    const removedConstrSiblingBodies =
        `<unit xmlns="http://www.srcML.org/srcML/src" revision="0.9.5" language="Java"><class><specifier>public</specifier> class <name>myClass</name> <block>{
           <decl_stmt><decl><annotation>@<name>Id</name></annotation>
           <specifier>public</specifier> <type><name>long</name></type> <name>ID</name></decl>;</decl_stmt>
           <constructor><specifier>public</specifier> <name>myClass</name><parameter_list>()</parameter_list> <block>{
               <comment type="line">// constructor body</comment>
               <expr_stmt><expr><name><name>this</name><operator>.</operator><name>ID</name></name> <operator>=</operator> <literal type="number">0</literal></expr>;</expr_stmt>
           }</block></constructor>
           <function><specifier>public</specifier> <type><name>void</name></type> <name>myFunc</name><parameter_list>(<parameter><decl><type><name>int</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
           <function><annotation>@<name>annot</name></annotation>
           <specifier>private</specifier> <type><name>String</name></type> <name>anotherFunc</name><parameter_list>(<parameter><decl><type><name>String</name></type> <name>param</name></decl></parameter>)</parameter_list> </function>
        }</block></class>
        </unit>`;

    const namespaceURI = "http://www.srcML.org/srcML/src";
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    it("should remove function body of a given function", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const functions = input.getElementsByTagNameNS(namespaceURI, 'function');
        const firstFunction = functions[0];

        removeFunctionBodies(firstFunction);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedFirstFuncBody);
    });

    it("should remove function body of a given constructor", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const constructors = input.getElementsByTagNameNS(namespaceURI, 'constructor');
        const firstConstructor = constructors[0];

        removeFunctionBodies(firstConstructor);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedConstrBody);
    });

    it("case 2 of getSurroundingNodes, class Node", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const classes = input.getElementsByTagNameNS(namespaceURI, 'class');
        let node = classes[0];

        // case 2: class, field
        // Grab all fields and function/nested class signatures
        // find the parent class
        while (node && node.tagName && node.tagName.toLowerCase() !== "class" && node.parentNode) {
            node = node.parentNode;
        }
        removeFunctionBodies(node);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedAllBodies);
    });

    it("case 2 of getSurroundingNodes, class field Node", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const decls = input.getElementsByTagNameNS(namespaceURI, 'decl_stmt');
        let node = decls[0];

        // case 2: class, field
        // Grab all fields and function/nested class signatures
        // find the parent class
        while (node && node.tagName && node.tagName.toLowerCase() !== "class" && node.parentNode) {
            node = node.parentNode;
        }
        removeFunctionBodies(node);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedAllBodies);
    });

    it("should remove function bodies of siblings of a given function", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const functions = input.getElementsByTagNameNS(namespaceURI, 'function');
        const firstFunction = functions[0];

        removeSiblingFunctionBodies(firstFunction);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedFirstFuncSibBodies);
    });

    it("should remove function bodies of siblings of a given constructor", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const constructors = input.getElementsByTagNameNS(namespaceURI, 'constructor');
        const firstConstructor = constructors[0];

        removeSiblingFunctionBodies(firstConstructor);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedConstrSiblingBodies);
    });

    it("case 3 of getSurroundingNodes, node within a function", () => {
        const input = parser.parseFromString(xmlString, "text/xml");
        const comments = input.getElementsByTagNameNS(namespaceURI, 'comment');
        let node = comments[1]; // body of the first function

        // case 3: other, statements (starting node within method or at method signature)
        // Grab all code within method and function signatures and fields adjacent/same level as method
        // find the parent function
        while (node && node.tagName && node.tagName.toLowerCase() !== "function" && node.parentNode) {
            node = node.parentNode;
        }
        removeSiblingFunctionBodies(node);
        const output = serializer.serializeToString(input);

        expect(output).toEqual(removedFirstFuncSibBodies);
    });
});
