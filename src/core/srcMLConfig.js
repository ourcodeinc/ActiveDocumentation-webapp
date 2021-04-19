
export const nsResolver = (prefix) => {
    let ns = {"src": "http://www.srcML.org/srcML/src"};
    return ns[prefix] || null;
}