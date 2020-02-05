
/*
 * This code is written by Genni Mansi.
 * Edited by Sahar Mehrpour
 * Nov 2019
 */
/* eslint-disable */

export const findClassAnnotations = (subCL, attributeList, id_start, queryMap) => {

  // Now we look for other attributes in the class
  // First we will output all the annotations on a class
  let clsAnnotCandidate = subCL.findall('annotation');
  if (clsAnnotCandidate.length > 0){

    for(let k = 0 ; k < clsAnnotCandidate.length; k++){

      let clsAnnot = clsAnnotCandidate[k];

      let annotArgs = clsAnnot.findall('.//argument/expr');

      let clsAnnotName = "class conttaining annotation of \"@"
                          + (clsAnnot.find('name').text)
                          + "\"";

      let command = "src:annotation[src:name/text()=\""
                    + (clsAnnot.find('name').text) +"\"]";

      if(annotArgs.length > 0){
        clsAnnotName += " with ";
        for(let q = 0; q < annotArgs.length; q++){

          let node = annotArgs[q];

          for(let u = 0; u < (node._children).length; u++){

            let ch = (node._children)[u];

            if(ch.text != null){
              clsAnnotName += ch.text;
            }
            else{
              for(let v = 0; v < (ch._children).length; v++){
                let c = (ch._children)[v];
                if(c.text != null){
                  clsAnnotName += c.text;
                }
              }
            }

          }

          clsAnnotName += "\n";
        }
        // Remove trailing newline
        clsAnnotName = clsAnnotName.slice(0, -1);
      }

      command = command + "]";

      if(!attributeList.has(clsAnnotName)){

        attributeList.set(clsAnnotName, id_start.id);
        queryMap.set(command, id_start.id);

        id_start.id += 1;

      }
    }
  }

};

export const findConstructors = (subCL, attributeList, id_start, queryMap) => {
    // What kind of constructor the class has
    // Choose last constructor because sometimes a default is defined and
    // then re-defined by another constructor (see Microtask.java)
    let constructor = subCL.findall('block/constructor');
    let name;

    if(constructor.length > 0){
      for(let q = 0; q < constructor.length; q++){

        let constr = constructor[q];
        let constructorBody = constr.find('block');

        let memVarSet = [];
        let setTo = [];

        let constrBodyList = constructorBody.find(".*");
        if(constrBodyList != undefined){

          name = "class containing non-empty constructor";

          // Check if attribute has been seen globally
          if(!attributeList.has(name)){

            let command = "count(src:block/src:constructor/src:block/*)>0";

            attributeList.set(name, id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;

          }
          name = "";

          // Constructor sets member variables
          let constructorExpr = constructorBody.findall('expr_stmt/expr');

          // If member variables are set...
          for(let v = 0; v < constructorExpr.length; v++){

            let expr = constructorExpr[v];
            name = expr.find('name/name');
            let op = expr.find('operator');

            // If there exists some expr of the form this.field = _____
            if( ((name != null) && (name.text == "this")) && ((op != null) && (op.text == "="))){

              // Store the names of the member variables that are set
              let memVar = ((expr._children[0])._children[2]).text;
              memVarSet.push(memVar);

              // Store names of things that member variables are set to
              let setToName = expr._children[2];

              // Double check that it's not set to a literal
              if (setToName == null){
                setToName = expr.find('literal');
              }
              if (setToName == null){
                setTo.push("something other than null or variable name");
              }
              else{
                setTo.push(setToName.text);
              }

            }
          }
          // Output something like "constructor sets member variables x,y,z"
          if(memVarSet.length > 0){
            memVarSet.sort();

            let augmentedMemVarSet = memVarSet.slice(0);

            for(let x = 0; x < memVarSet.length; x++){
              augmentedMemVarSet[x] = " declaration statement with name \"" + memVarSet[x] + "\"";
            }

            // Previous name
            //name = "constructor must set " + augmentedMemVarSet.join(" and ");

            // New name
            name = "class with constructor with ( "
                    + augmentedMemVarSet.join(" and ") + " )";

            // Check if attribute has been seen globally
            if(!attributeList.has(name)){

              let command = "src:block/src:constructor[(src:parameter_list/src:parameter/src:decl[src:name[text()=\""
                            + memVarSet[0] + "\"]";
              for (let x = 1; x < memVarSet.length; x++){
                command = command + " and " + "src:block/src:constructor[(src:parameter_list/src:parameter/src:decl[src:name[text()=\""
                              + memVarSet[x] + "\"]";
              }

              attributeList.set(name, id_start.id);
              queryMap.set(command, id_start.id);

              id_start.id += 1;
            }
            name = "";
          }

          // Check for calls to constructor
          let allExpr = constructorBody.findall('.//expr');
          for (let u = 0; u < allExpr.length; u++){

            let exp = allExpr[u];
            let op = exp.find('operator');
            let call = exp.find('call/name');

            if ((op != null) && (op.text == "new") && (call != null) && (call.text != null)){
              // Old Name
              //name = "constructor must call constructor of class \"" + call.text + "\" ";
              // New Name
              name = "class with constructor with expression statement \"new "
                     + call.text + "\"";

              if(!attributeList.has(name)){
                // src:expr[src:call/src:name/text()="constructor_name" and src:operator[text()=\"new\" and position()=1]]
                // Old command
                /*
                let command = "//src:constructor[src:block/src:expr_stmt/src:expr/"
                              + "src:call/src:name/text()=\"" + call.text
                              + "\" or "
                              + "src:block/src:decl_stmt/src:decl/scr:init/src:expr"
                              + "/src:call/src:name/text()=\"" + call.text + "\"]";
                */
                // New Command
                let command = "//src:constructor[src:block/src:expr_stmt/src:expr/"
                              + "src:call/src:name/text()=\"" + call.text
                              + "\" and src:operator[text()=\"new\" and position()=1]]";

                attributeList.set(name, id_start.id);
                queryMap.set(command, id_start.id);

                id_start.id += 1;
              }
              name = "";
            }
          }
        }
        // If the constructor didn't have a body, then we create an
        // attribute saying so
        else{
          name = "class containing empty-body constructor";
          // Check if this attribute has been seen globally
          if(!attributeList.has(name)){

            let command = "count(src:block/src:constructor/src:block/*)=0";

            attributeList.set(name, id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;
          }
          name = "";
        }

        // Assume all parameters passed to the constructor are stored
        // as member variables
        // Assume that all parameters are stored as member variables
        let allParamsStored = true;
        let allParamTypes = "";
        let constrParamTypes = [];

        let paramsList = constr.findall('parameter_list/parameter/decl');

        for(let u = 0; u < paramsList.length; u++){

          let p = paramsList[u];
          let paramName = p.find('name');

          if(paramName.text != null && !setTo.includes(paramName.text)){
            allParamsStored = false;
          }

          let paramType = p.find('type/name');
          if(paramType.text == null){
            paramType = paramType.find('name');
          }

          if(!constrParamTypes.includes(paramType.text) && paramType.text != ""){
            constrParamTypes.push(paramType.text);
          }
        }

        constrParamTypes.sort();

        for(let u = 0; u < constrParamTypes.length; u++){

          let t = constrParamTypes[u];
          allParamTypes = allParamTypes + " parameter with type \"" + t + "\"";

          if (u < constrParamTypes.length - 1){
            allParamTypes += " and ";
          }
        }

        if(allParamTypes != ""){
          name = "class with constructor with ( " + allParamTypes + " )";
          // Check if this attribute has been seen globally
          if(!attributeList.has(name)){

            // Make query
            let command = "src:block/src:constructor[(src:parameter_list/src:parameter/src:decl[src:type['"
                          + constrParamTypes[0] + "']";

            for(let u = 1; u < constrParamTypes.length; u++){
              command = command + " and "
                        + "src:block/src:constructor[(src:parameter_list/src:parameter/src:decl[src:type['"
                        + constrParamTypes[u] + "']";
            }

            attributeList.set(name, id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;
          }
          name = "";
        }
        else{
          // If the constructor has parameters and all of them were stored
          if(allParamsStored == true){
            name = "class containing constructor that stores all parameters as member variables";
            // Check if this attribute has been seen globally
            if(!attributeList.has(name)){
              // logic: class[count(argument in statements) = count(arguments)]
              let command = "count(src:block/src:constructor/src:parameter_list/src:parameter/"
                            + "src:decl/src:name[text()=ancestor::src:constructor/src:block//src:expr_stmt/"
                            + "src:expr[src:name[1]/src:name/text()=\"this\" and src:operator/text()=\"=\"]/"
                            + "src:name[2]/text()])=count(src:block/src:constructor/src:parameter_list/"
                            + "src:parameter)";

              attributeList.set(name, id_start.id);
              queryMap.set(command, id_start.id);

              id_start.id += 1;
            }
            name = "";
          }
        }
      }
    }
    // If the class doesn't define a constructor, then we add that as an
    // attribute
    else{
      name = "class not containing defined constructor";
      // Check if this attribute has been seen globally
      if(!attributeList.has(name)){

        let command = "count(src:block/src:constructor)=0";

        attributeList.set(name, id_start.id);
        queryMap.set(command, id_start.id);

        id_start.id += 1;
      }
      name = "";
    }
};

export const findMemberVars = (subCL, attributeList, id_start, queryMap) => {
  // The way we output information about member variables here impacts the
  // interpretations of associated attributes. If there is a member field
  // that has an annotation, two attributes will be output. For example,
  // both class has member field called projectId AND
  // class has member field called projectId with annotation @Index
  // are output for a member field projectId that has annotation @Index.
  // However, if the member field does not have an annotation, only the
  // attribute class has member field called projectId will be output.
  // Later, when attributes are output for other related classes, if both
  // attributes are associated together, then it is the case that the class
  // has a member field with that name and annotation. On the other hand,
  // if only the member field without annotation version of the attribute
  // is frequently associated, then we know that that member field was
  // frequent but not the annotation itself.
  let name;
  let declarations = subCL.findall('block/decl_stmt/decl');
  if (declarations != null){

    for(let x = 0; x < declarations.length; x++){

      let decl = declarations[x];
      let memberVarName = decl.find('name');

      if(memberVarName.text != null){

        // New name
        name = "class with declaration statement with name \""
              + memberVarName.text + "\"";
        // Old Name
        //name = "class has member field with name \"" + memberVarName.text + "\"";


        // Check if this attribute has been seen globally
        if(!attributeList.has(name)){

          let command = "src:block/src:decl_stmt/src:decl/src:name[text()=\""
                        + memberVarName.text + "\"";

          attributeList.set(name, id_start.id);
          queryMap.set(command, id_start.id);

          id_start.id += 1;
        }
        name = "";
      }

      // Generate feature for all member variable names with annotations
      let memberVarAnnotations = decl.findall('annotation');

      if(memberVarAnnotations != null){

        for(let q = 0; q < memberVarAnnotations.length; q++){

          let annot = memberVarAnnotations[q];
          let annotName = annot.find('name');
          // New name
          let memberVarAnnotAttr = "class with declaration statement with ( "
           + "annotation \"" + annotName.text + " and name \"" + memberVarName.text + " )";

          // Check if this attribute has been seen globally
          if(!attributeList.has(memberVarAnnotAttr)){

            let command = "src:annotation/src:name/text()=\""
                          + annotName.text
                          + "\" and src:block/src:decl_stmt/src:decl/src:name/text()=\""
                          + memberVarName.text + "\"";

            attributeList.set(memberVarAnnotAttr , id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;
          }
        }
      }

      // Generate feature for all member variable types
      let memberVarType = decl.find('type/name');

      // Check for nesting
      if(memberVarType != null){
        if(memberVarType.text == null){
          memberVarType = memberVarType.find('name');
        }

        // New name
        name = "class with declaration statement with type \""
               + memberVarType.text + "\"";

        // Check whether this attribute has been seen globally
        if(!attributeList.has(name) && memberVarType.text != ""){

          let command = "descendant-or-self::src:decl_stmt/src:decl[src:type['"
                        + memberVarType.text + "']]";

          attributeList.set(name, id_start.id);
          queryMap.set(command, id_start.id);

          id_start.id += 1;
        }
        name = "";

        // Generate feature for all member variable names with types
        if(memberVarName.text != null && memberVarType.text != null){

          if(memberVarType.text == ""){
            memberVarType = memberVarType.find('name');
          }

          // New name
          name  = "class with declaration statement with ( type \""
          + memberVarType.text + "\" and name \"" + memberVarName.text + "\" )";

            // Check whether attribute has been seen globally
            if(!attributeList.has(name)){

              let command = "descendant-or-self::src:decl_stmt/src:decl[src:type['"
                            + memberVarType.text + "']]]" + " and src:name[text()=\""
                            + memberVarName.text + "\"])]";

              attributeList.set(name, id_start.id);
              queryMap.set(command, id_start.id);

              id_start.id += 1;
            }
            name = "";
        }
      }
    }
  }
};


export const findImplements = (subCL, attributeList, id_start, queryMap) => {

  // What a class implements
  let name;
  let classImplements = subCL.find('super/implements');
  if (classImplements != null){
    // New name
    name = "class with implementation of \""
           + (classImplements.find('name')).text + "\"";

     // Check whether attribute has been seen globally
     if(!attributeList.has(name)){

       let command = "src:super/src:implements/src:name[text()=\""
                     + (classImplements.find('name')).text + "\"]";

       attributeList.set(name, id_start.id);
       queryMap.set(command, id_start.id);

       id_start.id += 1;
    }
    name = "";
  }

};

export const findClsFunctions = (subCL, attributeList, id_start, queryMap) => {

  // Attribute name
    let name = "";

    // Class visibility specifier
    let clsSpecificity = subCL.find('specifier');
    // If the class does not have an explicit visitbilit specifier
    // then it is public by default
    if(clsSpecificity == null){
      clsSpecificity = "public";
    }
    else{
      clsSpecificity = clsSpecificity.text;
    }

    // New name
    name = "class with visibility \"" + clsSpecificity + "\"";

    // Check wether attribute has been seen globally
    if(!attributeList.has(name)){

      let command = "src:specifier[text()=\"" + clsSpecificity + "\"]";

      attributeList.set(name, id_start.id);
      queryMap.set(command, id_start.id);

      id_start.id += 1;

   }
   // Clear the contents of the variable
   name = "";

    // Stuff with functions
    // NOTE: This database is generated by first finding all classes (subclasses,
    // inner classes, outer classes), then finding all top-level functions in each
    // class. We do so to avoid generating duplicate functions/transactions, but
    // one consideration to note is that we may want to know that a function is in
    // a class that is a subclass of X, or that it is in a class that extends Y, etc.

    let funcList = subCL.findall('block/function');

    for(let x = 0; x < funcList.length; x++){

      let fnc = funcList[x];

      // Get the function name
      let fncName = fnc.find('name');

      // First attribute we search for is if the function calls a particular
      // constructor
      let allExpr = fnc.findall('.//expr');
      for(let g = 0; g < allExpr.length; g++){

        let expr = allExpr[g];
        let op = expr.find('operator');
        let call = expr.find('call/name');

        if( op!=null && op.text == "new" && call!=null && call.text!=null){

          if(call.text == ""){
            call = call.find('name');
          }

        name = "class with function with ( name \""
              + fncName.text + "\" and expression statement \"new "
              + call.text + "\" )";

         // Check whether attribute has been seen globally
         if(!attributeList.has(name)){

            let command = "//src:function[src:name/text()=\"" + fncName.text
                         + "\" and (src:block/src:expr_stmt/src:expr/src:call"
                         + "/src:name/text()=\"" + call.text +
                         + "\" or src:block/src:decl_stmt/src:decl/src:init/"
                         + "src:expr/src:call/src:name/text()=\"" + call.text + "\")]";

            attributeList.set(name, id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;
         }
         name = "";
       }
     }

    // Combine searches for (1) constructor call and (2) function call in
    // return statement (combined for efficiency)
    let fncReturnInfo = fnc.find('.//block/return/expr');
    // Function return info exists: search for constructor or call
    if(fncReturnInfo != null){

      // (1) Calls constructor
      let constructorCall = fncReturnInfo.find('operator');

       if (constructorCall != null && constructorCall.text == "new"){

        let call = constructorCall.find('call/name');

        if(call!=null && call.text!=null){

          if(call.text == ""){
            call = call.find('name');
          }

          name = "class with function with ( name \""
                 + fncName.text + "\" and return value \"new "
                 + call.text + "\" )";

           // Check whether attribute has been seen globally
           if(!attributeList.has(name)){

             let command = "//src:function[src:name/text()=\"" + fncName.text
                          +"\" and src:block//src:return/src:expr/src:call//"
                          + "src:name/text()=\"" + call.text +"\"]";

             attributeList.set(name, id_start.id);
             queryMap.set(command, id_start.id);

             id_start.id += 1;
           }
           name = "";

        }
      }

      // (2) Returns output from function call
      let retOutputFromFncCall = fncReturnInfo.find('call');

        if (retOutputFromFncCall != null){

          let callName = retOutputFromFncCall.find('name');

          if (callName != null && callName.text != null){

            if(callName.text == ""){
              callName = callName.find('name');
            }

            name = "class with function with ( name \""
                    + fncName.text + "\" and return value \""
                    + callName.text + "()\" )";


            // Check whether attribute has been seen globally
            if(!attributeList.has(name)){

              let command =  "//src:function[src:name/text()=\"" + fncName.text
                          +"\" and src:block//src:return/src:expr/src:call//"
                          + "src:name/[text()=\"" + callName.text +"\"]]";

              attributeList.set(name, id_start.id);
              queryMap.set(command, id_start.id);

              id_start.id += 1;
           }
            name = "";
         }
       }
     }

    // Modifies member variable with specific name
    let modifiesMemberVar = fnc.findall('block/expr_stmt/expr');
    if (modifiesMemberVar != null){
      for (let n = 0; n < modifiesMemberVar.length; n++){

        let mod = modifiesMemberVar[n];
        let attrName = mod.find('name/name');
        let op = mod.find('operator');
        let call = mod.find('call/name/name');

        if (attrName!= null && attrName.text == "this" && op != null && op.text == "="
            && call != null){

          name = "class containing function of name \""
                + fncName.text
                + "\" that modifies member variable of name \""
                + call.text + "\"";

          // Check whether attribute has been seen globally
          if(!attributeList.has(name)){

            let command = "//src:function[src:name/text()=\"" + fncName.text
                           + "\" and src:block//src:expr_stmt/src:expr[src:name[1]"
                           + "/src:name[1]=\"this\" and src:name[1]/src:name[2]=\""
                           + call.text +"\" and src:operator/text()=\"=\"]]";

            attributeList.set(name, id_start.id);
            queryMap.set(command, id_start.id);

            id_start.id += 1;

          }
          name = "";
        }
      }
    }

    // Has annotation
    let fncAnnotCandidate = fnc.findall('annotation');
    if (fncAnnotCandidate != null){

      for (let g = 0; g < fncAnnotCandidate.length; g++){

        let fncAnnot = fncAnnotCandidate[g];
        name = "class with function with ( annotation \""
                + (fncAnnot.find('name')).text + "\" and name \""
                + fncName.text + "\" )";

        // Check if this attribute has been seen globally
        if(!attributeList.has(name)){

          let command = "src:annotation/src:name/text()=\""
                        + (fncAnnot.find('name')).text
                        + "\" and src:block/src:function/src:name/text()=\""
                        + fncName.text + "\"";

          attributeList.set(name, id_start.id);
          queryMap.set(command, id_start.id);

          id_start.id += 1;
        }
        name = "";
     }
    }

    // This is one really long attribute. It has four parts:
    // (1) function name (found previously),
    // (2) function visibility
    // (3) function return value
    // (4) function parameter types

    // Get visibility specifiers for the functions
    // This will capture visibility specifiers, static, and abstract
    // functions
    let fncSpec = fnc.findall('specifier');
    let fncSpecType = "";

    // If the function didn't have a visibility specifier then we
    // default to the class' visibility
    if(fncSpec.length == 0){
      fncSpecType = clsSpecificity;
    }
    else if(fncSpec.length > 0){
      // If the function had some kind of specifier (public, private
      // or protected, abstract, or static) then we need to check at
      // at least one is a visibility specifier; visibility specifiers
      // will be listed/found first
      if(fncSpec[0].text != "public" &&
         fncSpec[0].text != "private" &&
         fncSpec[0].text != "protected"){
           fncSpecType = "\"" + clsSpecificity + "\"";
         }
      // If the visibielity specifier is listed for this function, that is
      // what we use
      else{
        fncSpecType = "\"" + fncSpec[0].text + "\"";
      }

      if(fncSpecType == ""){
        fncSpecType = "\"public\"";
      }

      // Check for other keywords such as abstract or static
      for(let n = 1; n < fncSpec.length; n++){
        let spec = fncSpec[n];
        // If statement here to avoid adding the visbility specifier
        // twice
        if (spec.text != fncSpecType){
          fncSpecType = fncSpecType + " and specifier \"" + spec.text + "\"";
        }
      }
    }

    // Return type
    // Combines searches for (1) is void and (2) returns type
    // Default to "void" type
    let finalReturnVal = "type \"void\"";
    let returnType = fnc.find('type/name');

    if(returnType != null){

      // Check for list: when the return type is a list, the function's
      // type nests the list name with other arguments.
      if (returnType.text == ""){
        returnType = returnType.find('name');
      }
      // If the function actually has a non-void return then...
      if (returnType.text != "void"){
          finalReturnVal = "type \"" + returnType.text + "\"";
      }
    }

    // Has parameters (expandable)

    let fncParams = fnc.findall('parameter_list/parameter');
    let fncTypes = [];

    // If there are no parameters, then we output two attributes:
    // (1) An attribute that says there are no parameters
    // (2) An attribute containing informatnio  about the function return type, name,
    //     and visibility
    if (fncParams == null){
     name = " class containing function of name \"" + fncName.text + "\" with no parameters";
     // Check whether attribute has been seen globally
     if(!attributeList.has(name)){

       let command = "//src:function[count(src:parameter_list/src:parameter)=0 and src:name/text()=\""
                      + fncName.text + "\"]";

       attributeList.set(name, id_start.id);
       queryMap.set(command, id_start.id);

       id_start.id += 1;
     }

      // New combined attribute
      name =  "class with function with ( visibility " + fncSpecType
                +" and " + finalReturnVal
                + "\" and name \"" + fncName.text + ")";

      if(!attributeList.has(name)){
        // Make the query/command
        // First portion is the portion of the command having to do with the name
        let command = "src:block/src:function[(src:name[text()=\""
                  + fncName.text + "\"]";
        // Next we add to it the part of the command having to do with visibility
        command = command + " and src:specifier[text()=\"" + fncSpecType + "\"]";
        // Next we add the part about the  return type
        if(finalReturnVal == "type \"void\""){
          command = command + " and src:type['void']";
        }
        else{
          command = command + " and src:type['" + returnType.text + "']";
        }
        // Finally close off the parentheses and brackets
        command = command + ")]";

        attributeList.set(name, id_start.id);
        queryMap.set(command, id_start.id);

        id_start.id += 1;

        attributeList.set(name, id_start.id);
        queryMap.set(command, id_start.id);

        id_start.id += 1;
      }
      name = "";

    }
    else{
      // Parameter types
      for (let m = 0; m < fncParams.length; m++){

         let p = fncParams[m];
         let paramType = p.find('decl/type/name');

         // Check for nesting
         if (paramType.text == null){
           paramType = paramType.find('name');
         }

         if (!fncTypes.includes(paramType.text) && paramType.text != ""){
           fncTypes.push(paramType.text);
         }
      }

      fncTypes.sort();
      let allFncParamTypes = "";
      for (let m = 0; m < fncTypes.length; m++){

       allFncParamTypes = allFncParamTypes
                              + "parameter with type \""
                              + fncTypes[m] + "\"";

        if (m != fncTypes.length - 1){
          allFncParamTypes += " and ";
        }
      }

     if (allFncParamTypes != ""){
       // New combined attribute
       name =  "class with function with ( visibility " + fncSpecType
                 +" and " + finalReturnVal
                 + " and name \"" + fncName.text
                 + "\" and " + allFncParamTypes + ")";

       if(!attributeList.has(name)){

        // Make the query/command
        // First portion is the portion of the command having to do with the name
        let command = "src:block/src:function[(src:name[text()=\""
                  + fncName.text + "\"]";
        // Next we add to it the part of the command having to do with parameterTypes
        for (let m = 0; m < fncTypes.length; m++){
          command = command + " and src:parameter_list/src:parameter/src:decl[src:type['"
                      + fncTypes[m] +"']]";
        }
        // Next we add to it the part of the command having to do with visibility
        command = command + " and src:specifier[text()=\"" + fncSpecType + "\"]";
        // Next we add the part about the  return type
        if(finalReturnVal == "type \"void\""){
          command = command + " and src:type['void']";
        }
        else{
          command = command + " and src:type['" + returnType.text + "']";
        }
        // Finally close off the parentheses and brackets
        command = command + ")]";

        attributeList.set(name, id_start.id);
        queryMap.set(command, id_start.id);

        id_start.id += 1;
       }
       name = "";

     }

      fncTypes.length = 0;
      fncTypes = [];

    }
  }
};


export const addClassAnnotations = (subCL, attributes, allAttributes) => {
    // Now we look for other attributes in the class
    //if(childName == "CrowdServlet" ) {console.log(childName);}
    // First we will output all the annotations on a class
    let name;
    let clsAnnotCandidate = subCL.findall('annotation');
    if (clsAnnotCandidate.length > 0) {

        for (let k = 0; k < clsAnnotCandidate.length; k++) {

            let clsAnnot = clsAnnotCandidate[k];
            //console.log(clsAnnot);
            let annotArgs = clsAnnot.findall('.//argument/expr');
            //console.log(annotArgs);
            name = "class containing annotation of \"@"
                + (clsAnnot.find('name').text)
                + "\"";

            if (annotArgs.length > 0) {
                name += " with ";
                for (let q = 0; q < annotArgs.length; q++) {

                    let node = annotArgs[q];

                    for (let u = 0; u < (node._children).length; u++) {

                        let ch = (node._children)[u];

                        if (ch.text != null) {
                            name += ch.text;
                        } else {
                            for (let v = 0; v < (ch._children).length; v++) {
                                let c = (ch._children)[v];
                                if (c.text != null) {
                                    name += c.text;
                                }
                            }
                        }

                    }
                    name += "\n";
                }
                // Remove trailing newline
                name = name.slice(0, -1);
            }

            if (allAttributes.has(name)) {
                attributes.push(allAttributes.get(name));
            }
            name = "";
        }
    }
};

export const addConstructors = (subCL, attributes, allAttributes) => {

    let name;
    // Choose last constructor because sometimes a default is defined and
    // then re-defined by another constructor (see Microtask.java)
    let constructor = subCL.findall('block/constructor');

    if(constructor.length > 0){
      for(let q = 0; q < constructor.length; q++){

        let constr = constructor[q];
        let constructorBody = constr.find('block');

        let memVarSet = [];
        let setTo = [];

        let constrBodyList = constructorBody.find(".*");
        if(constrBodyList != undefined){

          name = "class containing non-empty constructor";

          if(allAttributes.has(name)){
            attributes.push(allAttributes.get(name));
          }

          name = "";

          // Constructor sets member variables
          let constructorExpr = constructorBody.findall('expr_stmt/expr');

          // If member variables are set...
          for(let v = 0; v < constructorExpr.length; v++){

            let expr = constructorExpr[v];
            name = expr.find('name/name');
            let op = expr.find('operator');

            // If there exists some expr of the form this.field = _____
            if( ((name != null) && (name.text == "this")) && ((op != null) && (op.text == "="))){

              // Store the names of the member variables that are set
              let memVar = ((expr._children[0])._children[2]).text;
              memVarSet.push(memVar);

              // Store names of things that member variables are set to
              let setToName = expr._children[2];

              // Double check that it's not set to a literal
              if (setToName == null){
                setToName = expr.find('literal');
              }
              if (setToName == null){
                setTo.push("something other than null or variable name");
              }
              else{
                setTo.push(setToName.text);
              }

            }
          }
          // Output something like "constructor sets member variables x,y,z"
          if(memVarSet.length > 0){

            memVarSet.sort();

            let augmentedMemVarSet = memVarSet.slice(0);

            for(let x = 0; x < memVarSet.length; x++){
              augmentedMemVarSet[x] = " declaration statement with name \"" + memVarSet[x] + "\"";
            }

            // Previous name
            //name = "constructor must set " + augmentedMemVarSet.join(" and ");

            // New name
            name = "class with constructor with ( "
                    + augmentedMemVarSet.join(" and ") + " )";

            // Check if attribute has been seen globally
            if(allAttributes.has(name)){
              attributes.push(allAttributes.get(name));
            }
            name = "";
          }

          // Check for calls to constructor
          let allExpr = constructorBody.findall('.//expr');
          for (let u = 0; u < allExpr.length; u++){

            let exp = allExpr[u];
            let op = exp.find('operator');
            let call = exp.find('call/name');

            if ((op != null) && (op.text == "new") && (call != null) && (call.text != null)){
              // Old Name
              //name = "constructor must call constructor of class \"" + call.text + "\" ";
              // New Name
              name = "class with constructor with expression statement \"new "
                     + call.text + "\"";

              if(allAttributes.has(name)){
                attributes.push(allAttributes.get(name));
              }
              name = "";
            }
          }
        }
        // If the constructor didn't have a body, then we create an
        // attribute saying so
        else{
          name = "class containing empty-body constructor";

          // Check if this attribute has been seen globally
          if(allAttributes.has(name)){
            attributes.push(allAttributes.get(name));
          }
          name = "";
        }

        // Assume all parameters passed to the constructor are stored
        // as member variables
        // Assume that all parameters are stored as member variables
        let allParamsStored = true;
        let allParamTypes = "";
        let constrParamTypes = [];

        let paramsList = constr.findall('parameter_list/parameter/decl');

        for(let u = 0; u < paramsList.length; u++){

          let p = paramsList[u];
          let paramName = p.find('name');

          if(paramName.text != null && !setTo.includes(paramName.text)){
            allParamsStored = false;
          }

          let paramType = p.find('type/name');
          if(paramType.text == null){
            paramType = paramType.find('name');
          }

          if(!constrParamTypes.includes(paramType.text) && paramType.text != ""){
            constrParamTypes.push(paramType.text);
          }
        }

        constrParamTypes.sort();

        for(let u = 0; u < constrParamTypes.length; u++){

          let t = constrParamTypes[u];
          allParamTypes = allParamTypes + " parameter with type \"" + t + "\"";

          if (u < constrParamTypes.length - 1){
            allParamTypes += " and ";
          }
        }


        if(allParamTypes != ""){
          name = "class containing constructor with parameters of type " + allParamTypes;
          // Check if this attribute has been seen globally
          if(allAttributes.has(name)){
            attributes.push(allAttributes.get(name));
          }
          name = "";
        }
        else{
          // If the constructor has parameters and all of them were stored
          if(allParamsStored == true){
            name = "class containing constructor that stores all parameters as member variables";
            // Check if this attribute has been seen globally
            if(allAttributes.has(name)){
              attributes.push(allAttributes.get(name));
            }
            name = "";
          }
        }
      }
    }
    // If the class doesn't define a constructor, then we add that as an
    // attribute
    else{
      name = "class not containing defined constructor";
      // Check if this attribute has been seen globally
      if(allAttributes.has(name)){
        attributes.push(allAttributes.get(name));
      }
      name = "";
    }

};

export const addMemberVars = (subCL, attributes, allAttributes) => {

    // Output all member fields of a particular type
    // The way we output information about member variables here impacts the
    // interpretations of associated attributes. If there is a member field
    // that has an annotation, two attributes will be output. For example,
    // both class has member field called projectId AND
    // class has member field called projectId with annotation @Index
    // are output for a member field projectId that has annotation @Index.
    // However, if the member field does not have an annotation, only the
    // attribute class has member field called projectId will be output.
    // Later, when attributes are output for other related classes, if both
    // attributes are associated together, then it is the case that the class
    // has a member field with that name and annotation. On the other hand,
    // if only the member field without annotation version of the attribute
    // is frequently associated, then we know that that member field was
    // frequent but not the annotation itself.
    let name;
    let declarations = subCL.findall('block/decl_stmt/decl');
    if (declarations != null){

      for(let x = 0; x < declarations.length; x++){

        let decl = declarations[x];
        let memberVarName = decl.find('name');

        if(memberVarName.text != null){

          // New name
          name = "class with declaration statement with name \""
                + memberVarName.text + "\"";
          // Old Name
          //name = "class has member field with name \"" + memberVarName.text + "\"";

          // Check if this attribute has been seen globally
          if(allAttributes.has(name)){
            attributes.push(allAttributes.get(name));
          }
          name = "";
        }

        // Generate feature for all member variable names with annotations
        let memberVarAnnotations = decl.findall('annotation');

        if(memberVarAnnotations != null){

          for(let q = 0; q < memberVarAnnotations.length; q++){

            let annot = memberVarAnnotations[q];
            let annotName = annot.find('name');
            // New name
            let memberVarAnnotAttr = "class with declaration statement with ( "
             + "annotation \"" + annotName.text + " and name \"" + memberVarName.text + " )";

            // Check if this attribute has been seen globally
            if(!allAttributes.has(memberVarAnnotAttr )){
              attributes.push(allAttributes.get(memberVarAnnotAttr));
            }
          }
        }

          // Generate feature for all member variable types
          let memberVarType = decl.find('type/name');

          // Check for nesting
          if(memberVarType != null){
            if(memberVarType.text == null){
              memberVarType = memberVarType.find('name');
            }

            // New name
            name = "class with declaration statement with type \""
                   + memberVarType.text + "\"";

            // Check whether this attribute has been seen globally
            // Check if this attribute has been seen globally
            if(allAttributes.has(name)){
              attributes.push(allAttributes.get(name));
            }
            name = "";

            // Generate feature for all member variable names with types
            if(memberVarName.text != null && memberVarType.text != null){

              if(memberVarType.text == ""){
                memberVarType = memberVarType.find('name');
              }
              // New name
              name  = "class with declaration statement with ( type \""
              + memberVarType.text + "\" and name \"" + memberVarName.text + "\" )";

              // Check whether attribute has been seen globally
              if(allAttributes.has(name)){
                attributes.push(allAttributes.get(name));
              }
              name = "";
            }
          }
        }
      }
};


export const addImplementations = (subCL, attributes, allAttributes) => {
  // Outside of declaration stuff
  // What a class implements
  let classImplements = subCL.find('super/implements');
  if (classImplements != null){
      // New name
      let name = "class with implementation of \""
             + (classImplements.find('name')).text + "\"";

     // Check whether attribute has been seen globally

     if(allAttributes.has(name)){
       attributes.push(allAttributes.get(name));
     }
  }
};

export const addClsFunctions = (subCL, attributes, allAttributes) => {

  // Attribute name
  let name = "";

  // Class visibility specifier
  let clsSpecificity = subCL.find('specifier');
  // If the class does not have an explicit visitbilit specifier
  // then it is public by default
  if(clsSpecificity == null){
    clsSpecificity = "public";
  }
  else{
    clsSpecificity = clsSpecificity.text;
  }

  // New name
  name = "class with visibility \"" + clsSpecificity + "\"";

  // Check wether attribute has been seen globally
  if(allAttributes.has(name)){
         attributes.push(allAttributes.get(name));
  }
  // Clear the contents of the variable
  name = "";

  // Stuff with functions
  // NOTE: This database is generated by first finding all classes (subclasses,
  // inner classes, outer classes), then finding all top-level functions in each
  // class. We do so to avoid generating duplicate functions/transactions, but
  // one consideration to note is that we may want to know that a function is in
  // a class that is a subclass of X, or that it is in a class that extends Y, etc.

  let funcList = subCL.findall('block/function');

  for(let x = 0; x < funcList.length; x++){

    let fnc = funcList[x];

    // Get the function name
    let fncName = fnc.find('name');

    // First attribute we search for is if the function calls a particular
    // constructor
    let allExpr = fnc.findall('.//expr');
    for(let g = 0; g < allExpr.length; g++){

      let expr = allExpr[g];
      let op = expr.find('operator');
      let call = expr.find('call/name');

      if( op!=null && op.text == "new" && call!=null && call.text!=null){

        if(call.text == ""){
          call = call.find('name');
        }

        name = "class with function with ( name \""
              + fncName.text + "\" and expression statement \"new "
              + call.text + "\" )";

       // Check whether attribute has been seen globally
       if(allAttributes.has(name)){
          attributes.push(allAttributes.get(name));
        }
       name = "";
     }
   }

    // Combine searches for (1) constructor call and (2) function call in
    // return statement (combined for efficiency)
    let fncReturnInfo = fnc.find('.//block/return/expr');
    // Function return info exists: search for constructor or call
    if(fncReturnInfo != null){

      // (1) Calls constructor
      let constructorCall = fncReturnInfo.find('operator');

       if (constructorCall != null && constructorCall.text == "new"){

        let call = constructorCall.find('call/name');

        if(call!=null && call.text!=null){

          if(call.text == ""){
            call = call.find('name');
          }

          name = "class with function with ( name \""
                 + fncName.text + "\" and return value \"new "
                 + call.text + "\" )";

           // Check whether attribute has been seen globally
           if(allAttributes.has(name)){
           attributes.push(allAttributes.get(name));
           }
           name = "";

        }
      }

      // (2) Returns output from function call
      let retOutputFromFncCall = fncReturnInfo.find('call');

        if (retOutputFromFncCall != null){

          let callName = retOutputFromFncCall.find('name');

          if (callName != null && callName.text != null){

            if(callName.text == ""){
              callName = callName.find('name');
            }

            name = "class with function with ( name \""
                    + fncName.text + "\" and return value \""
                    + callName.text + "()\" )";


            // Check whether attribute has been seen globally
            if(allAttributes.has(name)){
                attributes.push(allAttributes.get(name));
            }
            name = "";
         }
       }
     }

    // Modifies member variable with specific name
    let modifiesMemberVar = fnc.findall('block/expr_stmt/expr');
    if (modifiesMemberVar != null){
      for (let n = 0; n < modifiesMemberVar.length; n++){

        let mod = modifiesMemberVar[n];
        let attrName = mod.find('name/name');
        let op = mod.find('operator');
        let call = mod.find('call/name/name');

        if (attrName!= null && attrName.text == "this" && op != null && op.text == "="
            && call != null){

          name = "class containing function of name \""
                + fncName.text
                + "\" that modifies member variable of name \""
                + call.text + "\"";

          // Check whether attribute has been seen globally
          if(allAttributes.has(name)){
            attributes.push(allAttributes.get(name));
          }
          name = "";
        }
      }
    }

    // Has annotation
    let fncAnnotCandidate = fnc.findall('annotation');
    if (fncAnnotCandidate != null){

      for (let g = 0; g < fncAnnotCandidate.length; g++){

        let fncAnnot = fncAnnotCandidate[g];
        name = "class with function with ( annotation \""
                + (fncAnnot.find('name')).text + "\" and name \""
                + fncName.text + "\" )";

        // Check if this attribute has been seen globally
        if(allAttributes.has(name)){
           attributes.push(allAttributes.get(name));
        }
        name = "";
     }
    }

    // This is one really long attribute. It has four parts:
    // (1) function name (found previously),
    // (2) function visibility
    // (3) function return value
    // (4) function parameter types

    // Get visibility specifiers for the functions
    // This will capture visibility specifiers, static, and abstract
    // functions
    let fncSpec = fnc.findall('specifier');
    let fncSpecType = "";

    // If the function didn't have a visibility specifier then we
    // default to the class' visibility
    if(fncSpec.length == 0){
      fncSpecType = clsSpecificity;
    }
    else if(fncSpec.length > 0){
      // If the function had some kind of specifier (public, private
      // or protected, abstract, or static) then we need to check at
      // at least one is a visibility specifier; visibility specifiers
      // will be listed/found first
      if(fncSpec[0].text != "public" &&
         fncSpec[0].text != "private" &&
         fncSpec[0].text != "protected"){
           fncSpecType = "\"" + clsSpecificity + "\"";
         }
      // If the visibielity specifier is listed for this function, that is
      // what we use
      else{
        fncSpecType = "\"" + fncSpec[0].text + "\"";
      }

      if(fncSpecType == ""){
        fncSpecType = "\"public\"";
      }

      // Check for other keywords such as abstract or static
      for(let n = 1; n < fncSpec.length; n++){
        let spec = fncSpec[n];
        // If statement here to avoid adding the visbility specifier
        // twice
        if (spec.text != fncSpecType){
          fncSpecType = fncSpecType + " and specifier \"" + spec.text + "\"";
        }
      }
    }

    // Return type
    // Combines searches for (1) is void and (2) returns type
    // Default to "void" type
    let finalReturnVal = "type \"void\"";
    let returnType = fnc.find('type/name');

    if(returnType != null){

      // Check for list: when the return type is a list, the function's
      // type nests the list name with other arguments.
      if (returnType.text == ""){
        returnType = returnType.find('name');
      }
      // If the function actually has a non-void return then...
      if (returnType.text != "void"){
          finalReturnVal = "type \"" + returnType.text + "\"";
      }
    }

    // Has parameters (expandable)

    let fncParams = fnc.findall('parameter_list/parameter');
    let fncTypes = [];

    // If there are no parameters, then we output two attributes:
    // (1) An attribute that says there are no parameters
    // (2) An attribute containing informatnio  about the function return type, name,
    //     and visibility
    if (fncParams == null){
     name = " class containing function of name \"" + fncName.text + "\" with no parameters";
     // Check whether attribute has been seen globally
     if(allAttributes.has(name)){
        attributes.push(allAttributes.get(name));
      }

      // New combined attribute
      name =  "class with function with ( visibility " + fncSpecType
                +" and " + finalReturnVal
                + "\" and name \"" + fncName.text + ")";

      // Check if this attribute has been seen globally
      if(allAttributes.has(name)){
         attributes.push(allAttributes.get(name));
      }
      name = "";

    }
    else{
      // Parameter types
      for (let m = 0; m < fncParams.length; m++){

         let p = fncParams[m];
         let paramType = p.find('decl/type/name');

         // Check for nesting
         if (paramType.text == null){
           paramType = paramType.find('name');
         }

         if (!fncTypes.includes(paramType.text) && paramType.text != ""){
           fncTypes.push(paramType.text);
         }
      }

      fncTypes.sort();
      let allFncParamTypes = "";
      for (let m = 0; m < fncTypes.length; m++){

       allFncParamTypes = allFncParamTypes
                              + "parameter with type \""
                              + fncTypes[m] + "\"";

        if (m != fncTypes.length - 1){
          allFncParamTypes += " and ";
        }
      }

     if (allFncParamTypes != ""){
       // New combined attribute
       name =  "class with function with ( visibility " + fncSpecType
                 +" and " + finalReturnVal
                 + " and name \"" + fncName.text
                 + "\" and " + allFncParamTypes + ")";

       if(allAttributes.has(name)){
          attributes.push(allAttributes.get(name));

       }
       name = "";

     }

      fncTypes.length = 0;
      fncTypes = [];

    } // Bracket for else
  } // End of for loop for functions
};
