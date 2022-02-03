
export const relatives = {
    smaller: "smaller",
    greater: "greater",
    none: "none"
}

export const fileFolderConstraints = {
    include: "INCLUDE",
    exclude: "EXCLUDE",
    none: "NONE"
}

export const processFileFolder = {
    within: "WITHIN",
    between: "BETWEEN",
    mixed: "MIXED"
}

export const queryType = {
    next_file: "NEXT", //  two queries, two separate files
    first_file: "FIRST" //  three queries, the third query is ran against the first file again.
}

export const ruleProperties = {
    xPathQueryResult: "xPathQueryResult",
    quantifierQueryType: "quantifierQueryType",
    constraintQueryType: "constraintQueryType"
}