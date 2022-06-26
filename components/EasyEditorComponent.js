import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

export default function EasyEditorComponent(props) {
    const inputCode = "x = 10\ny = 10\n\nif ({{1:x<y}}):\n    print(\"x is less than y\")\nelse:\n    if {{2:x<y}}:\n        print(\"x is greater than y\")\n    else:\n        print(\"x and y must be equal\")"

    const [code, setCode] = useState('')
    const [list, setList] = useState([])

    const convertCodeToSyntaxArea = () => {
        // match all the {{#:x}}
        const regex = /{{(\d+):(.*?)}}/g

        // get the matches
        const matches = inputCode.match(regex)

        const newList = []

        // loop through the matches
        for (let i = 0; i < matches.length; i++) {
            // get the match
            const match = matches[i]

            // get each group
            const [, number, text] = match.match(/{{(\d+):(.*?)}}/)

            newList.push(
                <li><input type="text"></input></li>
            )
        }
        const newCode = inputCode.replace(regex, '($1)')

        setCode(newCode)
        setList(newList)
    }

    useEffect(() => {
        convertCodeToSyntaxArea()
    }, [])

    return (
        <div>
            <SyntaxHighlighter language="python">
                {code}
            </SyntaxHighlighter>
            <ol>
                {list}
            </ol>
            <a href="#" className="btn btn-primary">Check Answers</a>
        </div>
    )
}