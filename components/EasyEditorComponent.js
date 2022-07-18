import { useEffect, useState, useContext } from 'react'
import { useFormik } from 'formik'
import { Personalization, changePersonalization } from '../data/Personalization'
import Context from '../context/Context'
import SyntaxHighlighter from 'react-syntax-highlighter'

export default function EasyEditorComponent(props) {
    const { user, setEditorState, setToast, challengeData, setChallengeData, personalization, setPersonalization } = useContext(Context)
    const [prompt, setPrompt] = useState([])
    const [code, setCode] = useState(challengeData.code + "")
    const [list, setList] = useState([])
    const [answers, setAnswers] = useState([])
    const [completed, setCompleted] = useState(false)
    const [formikJson, setFormikJson] = useState({})

    const formik = useFormik({
        initialValues: formikJson,
        onSubmit: values => {
            const valuesAsArray = Object.keys(values).map(key => values[key])

            if (valuesAsArray.length !== answers.length) {
                alert("Error occurred.")
                return
            }

            const newCode = code + ""
            let wrongAnswers = []

            for (let i = 0; i < valuesAsArray.length; i++) {
                if (valuesAsArray[i] !== answers[i]) {
                    wrongAnswers.push(i)
                } else {
                    newCode = newCode.replaceAll('""" Input ' + (i + 1) + ' here """', valuesAsArray[i])
                }
            }

            setCode(newCode)

            if (wrongAnswers.length > 0) {
                setToast({
                    title: "Wrong Answer",
                    message: "Incorrect answer(s): " + wrongAnswers.map(i => (i + 1)).join(', ')
                })

                return
            }

            setToast({
                title: "Correct!",
                message: "You have completed the exercise. ⭐ +100 score"
            })

            // Update personalization
            const newChallenges = [...personalization.challenges, challengeData.id]
            const newPersonalization = new Personalization(personalization.uuid, personalization.leaderboards, newChallenges)
            setPersonalization(newPersonalization)
            changePersonalization(user.uuid, newPersonalization)

            setCompleted(true)
        },
    })

    useEffect(() => {
        setCode(challengeData.code)
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
        convertPromptIntoList(challengeData.question)
    }, [])

    const convertCodeToSyntaxArea = () => {
        // match all the {{#:x}}
        const regex = /{{(\d+):(.*?)}}/g

        // get all the matches
        const allMatches = challengeData.code.match(regex)

        const newList = []
        const newJson = { ...formikJson }
        const newAnswers = [ ...answers ]

        // loop through the matches
        for (let i = 0; i < allMatches.length; i++) {
            newList.push(
                <input
                    name={`input${i}`}
                    id={`input${i}`}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values[`input${i}`]}
                />
            )

            // get the text between the {{#:x}}
            const text = allMatches[i].match(/{{(\d+):(.*?)}}/)[2]

            newAnswers.push(text)

            // add key to formikJson
            newJson[`input${i}`] = ''
        }

        const newCode = code.replace(regex, '""" Input $1 here """')

        setCode(newCode)
        setList(newList)
        setFormikJson(newJson)
        setAnswers(newAnswers)
    }

    useEffect(() => {
        convertCodeToSyntaxArea()
    }, [])

    const checkAnswersBtn = () => {
        if (completed) {
            return (
                <></>
            )
        }

        return (
            <button type="submit" className="btn btn-primary">Check Answers</button>
        )
    }

    return (
        <div>
            <h2>Coding Challenge</h2>
            <ul>
                {prompt}
            </ul>
            <SyntaxHighlighter language="python">
                {code}
            </SyntaxHighlighter>
            <form onSubmit={formik.handleSubmit}>
                <ol>
                    {list.map((item, index) => {
                        return <>
                            <li key={index}>{item}</li>
                            <br />
                        </>
                    })}
                </ol>
                <div class="btn-group" role="group">
                    {checkAnswersBtn()}
                    <button type="button" className="btn btn-light" href="#" role="button" onClick={closeCodingChallenge}>Close Coding Challenge</button>
                </div>
            </form>
        </div>
    )
}