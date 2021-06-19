import './App.css';
import { useState, useRef, useEffect } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools"
import day from './assets/day.png';
import night from './assets/night.png';

function App() {

  const [mode, setmode] = useState("html");
  const [code, setcode] = useState({ html: "<p>Write your code</p>", css: "", js: "" });
  const [compile, setcompile] = useState(false);
  const [fullcode, setfullcode] = useState("");
  const [dark, setdark] = useState(false)

  const myframe = useRef();

  function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' +

      encodeURIComponent(text));
    pom.setAttribute('download', filename);

    pom.style.display = 'none';
    document.body.appendChild(pom);

    pom.click();

    document.body.removeChild(pom);
  }

  useEffect(() => {
    if (!compile) return;
    setfullcode(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
            ${code.css}
          </style>
      </head>
      <body>
          ${code.html}
      </body>
      <script>
          ${code.js}
      </script>
      </html>`);
      const iframe = myframe.current.contentWindow.document;
      iframe.open();
      setTimeout(() =>{
        iframe.write(fullcode)
        iframe.close();
        setcompile(false);
      },20)
  }, [code, compile, mode, fullcode]);

  return (
    <div className="App">
      <div className="left">
        <div className="btn-list">
          <button onClick={() => setmode("html")} className={`${mode === "html" ? "active" : ""} btn btn-style`}>HTML</button>
          <button onClick={() => setmode("css")} className={`${mode === "css" ? "active" : ""} btn btn-style`}>CSS</button>
          <button onClick={() => setmode("javascript")} className={`${mode === "javascript" ? "active" : ""} btn btn-style`}>JavaScript</button>
        </div>
        <img onClick={() => setdark(prev=>!prev)} alt="darkmode" src={`${!dark?night:day}`}/>
        <AceEditor
          mode={mode}
          theme={dark?"dracula":"github"}
          value={mode === "html" ? code.html : mode === "css" ? code.css : code.js}
          onChange={(e) => mode === "html" ? setcode({ html: e, css: code.css, js: code.js }) : mode === "css" ? setcode({ html: code.html, css: e, js: code.js }) : setcode({ html: code.html, css: code.css, js: e })}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
          }}
        />
        <div className="btn-list">
          <button className="btn btn-style" onClick={() => { setcompile(true) }}>Run Code</button>
          <button className="btn btn-style" onClick={() => { download("download.txt", fullcode) }}>Save</button>
        </div>
      </div>
      <div className="right">
        <h4 className="output-text">Output</h4>
        <iframe ref={myframe} className="preview" id="iframe" frameborder="0" title="code preview"></iframe>
      </div>
    </div>
  );
}

export default App;
