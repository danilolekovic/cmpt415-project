import { useEffect, useState, useContext } from 'react'
import Context from '../context/Context'
import SyntaxHighlighter from 'react-syntax-highlighter'

export default function EasyEditorComponent(props) {
    const inputCode = "x = 10\ny = 10\n\nif {{1:x<y}}:\n    print(\"x is less than y\")\nelse:\n    if {{2:x>y}}:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"
    const [prompt, setPrompt] = useState([])
    const [code, setCode] = useState('')
    const [list, setList] = useState([])
    const [inputs, setInputs] = useState([])
    const { setEditorState } = useContext(Context)

    useEffect(() => {
        setCode(inputCode)
    }, [])

    const convertPromptIntoList = (questionPrompt) => {
        // break questionPrompt into lines
        const lines = questionPrompt.split('\n')
        const newList = []

        // for each line, create a list item
        lines.forEach(line => {
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

    const onInputChange = (i, e) => {
        const newInputs = [...inputs]
        
        if (newInputs.length < i + 1) {
            for (let j = newInputs.length; j < i + 1; j++) {
                newInputs.push('')
            }
        }

        newInputs[i] = e.target.value
    }

    const convertCodeToSyntaxArea = () => {
        // match all the {{#:x}}
        const regex = /{{(\d+):(.*?)}}/g

        // get all the matches
        const allMatches = inputCode.match(regex)

        const newList = []

        // loop through the matches
        for (let i = 0; i < allMatches.length; i++) {
            newList.push(
                <li key={i}><input type="text" onChange={e => onInputChange(i, e)}></input></li>
            )
        }

        const newCode = inputCode.replace(regex, '""" Input $1 here """')

        setCode(newCode)
        setList(newList)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        alert(inputs)
    }

    useEffect(() => {
        convertCodeToSyntaxArea()
    }, [])

    return (
        <div>
            <h2>Coding Challenge</h2>
            <ul>
                {prompt}
            </ul>
            <SyntaxHighlighter language="python">
                {code}
            </SyntaxHighlighter>
            <ol>
                {list}
            </ol>
            <div class="btn-group" role="group">
                <button type="button" className="btn btn-primary" onClick={e => handleSubmit(e)}>Check Answers</button>
                <button type="button" className="btn btn-light" href="#" role="button" onClick={closeCodingChallenge}>Close Coding Challenge</button>
            </div>
        </div>
    )
}