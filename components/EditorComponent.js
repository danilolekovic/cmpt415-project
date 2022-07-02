import Editor from "@monaco-editor/react"
import { useRef, useState, useContext, useEffect } from 'react'
import Context from '../context/Context'
import axios from 'axios'

export default function EditorComponent(props) {
    const options = {
        fontSize: "14px",
        minimap: { enabled: false }
    }
    
    const [output, setOutput] = useState([])
    const [runEnabled, setRunEnabled] = useState(true)
    const [prompt, setPrompt] = useState([])
    const { setEditorState } = useContext(Context)
    const editorRef = useRef()

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    const convertPromptIntoList = (questionPrompt) => {
        // break questionPrompt into lines
        const lines = questionPrompt.split('\n')
        const newList = []

        // for each line, create a list item
        lines.forEach((line) => {
            newList.push(<li>{line}</li>)
        })

        setPrompt(newList)
    }

    const closeCodingChallenge = () => {
        setEditorState(0)
    }

    useEffect(() => {
        const questionPrompt = "Using nested conditionals, write a program that prints out the following pattern:\nIf x is less than y, print \"x is less than y\"\nIf x is greater than y, print \"x is greater than y\"\nIf x and y are equal, print \"x and y must be equal\""

        convertPromptIntoList(questionPrompt)
    }, [])

    const runCode = (e) => {
        e.preventDefault()
        setRunEnabled(false)

        // For now, clearing output
        setOutput([])
        
        const editorText = editorRef.current.getValue()

        var b = Buffer.from(editorText)
        var s = b.toString('base64')   

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {base64_encoded: 'true', fields: '*'},
            headers: {
              'content-type': 'application/json',
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: '{"language_id":71,"source_code":"' + s + '","stdin":"SnVkZ2Uw"}'
          }

          axios.request(options).then(function (response) {
              const token = response.data.token

              const getOptions = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
                params: {base64_encoded: 'true', fields: '*'},
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
              }
              
              axios.request(getOptions).then(function (response2) {
                const out = response2.data.stdout
                const b = Buffer.from(out, 'base64')
                const s = b.toString('ascii')
                setOutput([...output, s])
                setRunEnabled(true)
              }).catch(function (error) {
                alert("Error: " + error)
                setRunEnabled(true)
              })

          }).catch(function (error) {
              alert("Error: " + error)
              setRunEnabled(true)
          })
    }

    return (
        <div>
            <h2>Coding Challenge</h2>
            <ul>
                {prompt}
            </ul>
            <Editor
                height="40vh"
                defaultLanguage="python"
                defaultValue="# Write your code here"
                options={options}
                onMount={handleEditorDidMount}
            />
            <div className="editor-output">
                <div className="output">
                    <h3>Output</h3>
                    <ul>
                        {output.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })}
                    </ul>
                </div>
                <div class="btn-group btn-group-editor-run" role="group">
                    <button type="button" className={"btn btn-primary" + (runEnabled ? "" : " disabled" )} onClick={e => runCode(e)}>Run Code</button>
                    <button type="button" className="btn btn-light" href="#" role="button" onClick={closeCodingChallenge}>Close Coding Challenge</button>
                </div>
            </div>
        </div>
    )
}