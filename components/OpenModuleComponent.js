import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

function OpenModuleComponent(props) {
    const moduleJson = props.file.json
    const [elements, setElements] = useState([])
    const [mcQuestionNumber, setMcQuestionNumber] = useState(0)

    const handleModuleStart = (e) => {
        // Parse the module's body
        const moduleBody = moduleJson['body']
        let divs = []

        // loop through each element in the module body
        for (let i = 0; i < moduleBody.length; i++) {
            divs.push(transformJsonToHtml(moduleBody, i))
        }

        setElements(divs)
    }

    const handleMcAnswer = (e, questionNumber, correctAnswerIndex) => {
        // ToDo: Handle answer
    }

    const transformJsonToHtml = (moduleBody, index) => {
        let divs = []

        const element = moduleBody[index]

        // If the element is a header element, add it to the html
        if (element['type'] === 'header') {
            divs.push(
                <h2>{element['value']}</h2>
            )
        }

        // If the element is a html element, add it to the html
        if (element['type'] === 'html') {
            divs.push((
                <span>{element['value']}</span>
            ))
        }

        // If the element is a code element, add it to the html
        if (element['type'] === 'code') {
            const value = element['value']

            divs.push(
                <div id="code-editor-box">
                    <br />
                    <SyntaxHighlighter language="python">
                        {value}
                    </SyntaxHighlighter>
                </div>
            )
        }

        if (element['type'] === 'mc') {
            const mcBody = element['question']
            const mcAnswers = element['answers']
            const correctAnswer = element['correctAnswerIndex']
            const mcDivs = []
            const mcAnswerDivs = []

            for (let i = 0; i < mcBody.length; i++) {
                mcDivs.push(transformJsonToHtml(mcBody, i))
            }

            setMcQuestionNumber(mcQuestionNumber + 1)

            for (let i = 0; i < mcAnswers.length; i++) {
                const checkBoxCombo = []

                checkBoxCombo.push(
                    <input type="radio" className="form-check-input" name={`mcq-${mcQuestionNumber}-${i}`} value={i} />
                )

                checkBoxCombo.push(
                    <label className="form-check-label" for={`mcq-${mcQuestionNumber}-${i}`}>{mcAnswers[i]}</label>
                )

                mcAnswerDivs.push(
                    <div className="form-check" onChange={e => handleMcAnswer(e, mcQuestionNumber, correctAnswer)}>
                        {checkBoxCombo}
                    </div>
                )
            }

            divs.push(
                <div id={"mc-question-box " + `mcq-${mcQuestionNumber}`}>
                    <h3>Multiple-Choice Question</h3>
                    {mcDivs}
                    <br />
                    <div>
                        {mcAnswerDivs}
                    </div>
                </div>
            )
        }

        // If the element is a image element, add it to the html
        if (element['type'] === 'image') {
            divs.push(
                <img src={element['value']} />
            )
        }

        divs.push(
            <br />
        )

        return divs
    }

    useEffect(() => {
        handleModuleStart()
    }, [])

    return (
        elements
    )
}

export default OpenModuleComponent