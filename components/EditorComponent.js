import Editor from "@monaco-editor/react"
import { useRef, useState, useContext, useEffect } from 'react'
import Context from '../context/Context'
import axios from 'axios'

/**
 * The editor component for coding challenges.
 * @param {*} props 
 * @returns HTML for the editor
 */
export default function EditorComponent(props) {
    const options = {
        fontSize: "14px",
        minimap: { enabled: false }
    }
    
    // State for the code's output
    const [output, setOutput] = useState([])

    // State for if the code can be ran right now
    const [runEnabled, setRunEnabled] = useState(true)

    // State for the prompt
    const [prompt, setPrompt] = useState([])

    // Context used: editor state
    const { setEditorState } = useContext(Context)

    // Ref for the editor element
    const editorRef = useRef()

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    /**
     * Converts the prompt into a list of tasks
     * @param {*} questionPrompt 
     */
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

    /**
     * Closes the editor.
     */
    const closeCodingChallenge = () => {
        setEditorState(0)
    }

    useEffect(() => {
        const questionPrompt = "Using nested conditionals, write a program that prints out the following pattern:\nIf x is less than y, print \"x is less than y\"\nIf x is greater than y, print \"x is greater than y\"\nIf x and y are equal, print \"x and y must be equal\""

        convertPromptIntoList(questionPrompt)
    }, [])

    /**
     * Runs the code and updates the output.
     */
    const runCode = (e) => {
        e.preventDefault()
        setRunEnabled(false)

        // For now, clearing output
        setOutput([])
        
        const editorText = editorRef.current.getValue()

        var b = Buffer.from(editorText)
        var s = b.toString('base64')   

        // Code is sent to the Rapid API server to be run
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {base64_encoded: 'true', fields: '*'},
            headers: {
              'content-type': 'application/json',
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: '{"language_id":71,"source_code":"' + s + '","stdin":"SnVkZ2Uw"}'
          }

          // Send the code to the server

          axios.request(options).then(function (response) {
              const token = response.data.token

              const getOptions = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
                params: {base64_encoded: 'true', fields: '*'},
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
              }
              
              axios.request(getOptions).then(function (response2) {
                // Receive output and update state
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