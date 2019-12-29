/*
   Copied from SeeCodeRun/blob/master/scr-app/src/configureMonaco.js
   Slightly modified
   Credit to David Gonzalez Samudio
 */

const defaultMonacoConf = {
    publicURL: process.env.PUBLIC_URL,// set in index.html's head
    basePath: "",
    isCdn: false,// load from external site, uncomment script in index.html
    builtType: process.env.NODE_ENV === "production" ? "min" : "dev",
    monacoUrl: null,
    monacoBuild: "0.12.0",
};


//from MDN
const importScript = (sSrc, onloadFunc, onerrorFunc) => {
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    if (onloadFunc) {
        oScript.onload = onloadFunc;
    }
    if (onerrorFunc) {
        oScript.onerror = onerrorFunc;
    }
    document.currentScript.parentNode.insertBefore(oScript, document.currentScript);
    oScript.src = sSrc;
};

const loadMonaco = (monacoConf) => {
    window.require.config({paths: {"vs": monacoConf.monacoUrl}});
    window.require(["vs/editor/editor.main"]);
};

const initMonacoLoader = (monacoConf = defaultMonacoConf) => { // uses window.monacoConf defined in
// can be loaded from CDN. Not enabled, see index.html.
    if (monacoConf.isCdn) { // loading monaco from CDN
        // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
        // the default worker url location (used when creating WebWorkers). The problem here is that
        // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
        // a web worker through a same-domain script
        window.MonacoEnvironment = {
            getWorkerUrl: function (/* workerId, label */) {
                if (monacoConf.builtType === "min") {
                    return `${monacoConf.publicURL + monacoConf.basePath}/monaco-worker-loader-proxy.js`;
                } else {
                    return `${monacoConf.publicURL + monacoConf.basePath}/monaco-worker-loader-proxy.dev.js`;
                }
            }
        };
        monacoConf.monacoUrl = `https://cdn.jsdelivr.net/npm/monaco-editor@${monacoConf.monacoBuild}/${monacoConf.builtType}/vs`;
        return loadMonaco(monacoConf);
    } else {// loading monaco locally
        monacoConf.monacoUrl = `${monacoConf.publicURL + monacoConf.basePath}/monaco-editor/${monacoConf.builtType}/vs`;
        //window.require is MS/monaco's custom AMD loader
        if (window.require) {
            loadMonaco(monacoConf);
        } else {
            importScript(`${monacoConf.monacoUrl}/loader.js`
                , () => loadMonaco(monacoConf)
                , error => {});
        }
    }
    return true;
};


const configureMonaco = (monacoConf) => {
    try {
        if (!window.monaco) initMonacoLoader(monacoConf);
    } catch (e) {console.log("configureMonaco Error:", e)}
};

export default configureMonaco;