import { useEffect, useState, useContext, memo } from 'react'
import { giveStudentScore, getStudentAnswers } from '../data/Students'
import { getPersonalization } from "../data/Personalization"
import PersonalizationComponent from './PersonalizationComponent'
import { useFormik } from 'formik'
import Context from '../context/Context'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Component for a module's contents and multiple choice questions.
 * @param {*} props 
 * @returns HTML for a module's contents.
 */
function OpenModuleComponent(props) {
    const moduleJson = props.file.json

    // Context: user, editor state, challenge data, personalization, toast
    const { user, setEditorState, setChallengeData, personalization, setPersonalization, setToast } = useContext(Context)

    // State for the module's contents
    const [elements, setElements] = useState([])

    // State for the current page of the module
    const [currentPage, setCurrentPage] = useState(0)

    // State for pagination HTML
    const [pagination, setPagination] = useState([])

    // State for estimated lesson time
    const [lessonTime, setLessonTime] = useState('')

    // State for lecture visibility
    const [showLecture, setShowLecture] = useState(false)

    // State for multiple choice questions
    const [questions, setQuestions] = useState([])

    // State for the currently open multiple choice question
    const [currentQuestion, setCurrentQuestion] = useState(0)

    // State for the current explanation for the multiple choice question
    const [currentExplanation, setCurrentExplanation] = useState('')

    // State for incorrect questions
    const [wrongQuestions, setWrongQuestions] = useState(0)

    // State for personalization (lecture visibility, etc.)
    const [showPersonalization, setShowPersonalization] = useState(null)

    // Load personalization
    useEffect(() => {
        getPersonalization(user.uuid).then(p => {
            setPersonalization(p)
        })
    }, [])

    // Load module contents
    useEffect(() => {
        handleModuleStart()
        calculateLessonTime()
        handlePagination()
    }, [currentPage])

    useEffect(() => {
        handleModuleStart()
        calculateLessonTime()
        handlePagination()
    }, [showLecture])

    useEffect(() => {
        retrieveStudentAnswers()
    }, [currentQuestion])

    // Formik form for multiple choice questions
    const formik = useFormik({
        initialValues: {
            prompt: '',
            options: [],
            picked: '',
            explanation: '',
        },
        onSubmit: values => {
            const pick = values.picked

            if (pick === String(questions[currentQuestion].correctAnswerIndex)) {
                setCurrentExplanation("✓ " + questions[currentQuestion].explanation)

                setToast({
                    title: "Correct!",
                    message: "⭐ +50 score"
                })

                giveStudentScore(user, 50)
                values.picked = ''
            } else {
                if (values.options.length > 2) {
                    formik.setSubmitting(false)
                }

                setCurrentExplanation("❌ " + questions[currentQuestion].explanation)
                setWrongQuestions(wrongQuestions + 1)

                if (wrongQuestions + 1 >= questions.length && showPersonalization === null) {
                    setShowPersonalization(true)
                }
            }
        },
    })

    /**
     * Returns the current page's module contents.
     * @returns HTML for the module's contents.
     */
    const getCurrentPageBody = () => {
        const currentPageBody = moduleJson.body.find(body => body.page === currentPage)

        if (currentPageBody) {
            return currentPageBody.content
        }

        return []
    }

    /**
     * Returns the current page's multiple choice questions
     * @returns Multiple choice questions HTML
     */
    const getCurrentPageMcqs = () => {
        const currentPageObject = moduleJson.body.find(body => body.page === currentPage)

        if (currentPageObject) {
            return currentPageObject.mcqs
        }

        return []
    }

    /**
     * @param {Number} page 
     * @returns {String} title of page
     */
    const getPageTitle = (page) => {
        const pageTitle = moduleJson.body.find(body => body.page === page)

        if (pageTitle) {
            return pageTitle.name
        }

        return '...'
    }

    /**
     * Handles a page change.
     * @param {Number} page 
     */
    const handlePageChange = (page) => {
        if (page < 0) {
            page = 0
        }

        if (page >= moduleJson.body.length) {
            page = moduleJson.body.length - 1
        }

        setShowLecture(false)
        setWrongQuestions(0)
        setCurrentQuestion(0)
        refreshFormik()
        setCurrentPage(page)
    }

    /**
     * Refreshes the Formik form.
     */
    const refreshFormik = () => {
        formik.resetForm()
        formik.setFieldValue('picked', '')
        setCurrentExplanation('')
    }

    /**
     * Handles the pagination.
     */
    const handlePagination = () => {
        const pageList = []

        if (currentPage !== 0) {
            pageList.push(
                <li class="page-item">
                    <a class="page-link" href="#" tabindex="-1" onClick={() => handlePageChange(currentPage - 1)}>Previous</a>
                </li>
            )
        }

        for (let i = 0; i < moduleJson.body.length; i++) {
            
            if (i === currentPage) {
                pageList.push(
                    <li className="page-item active" key={i}>
                        <a className="page-link" href="#" onClick={() => handlePageChange(i)}>
                            Current Page
                        </a>
                    </li>
                )

                continue
            }

            if (i === moduleJson.body.length - 1) {
                pageList.push(
                    <li className="page-item" key={i}>
                        <a className="page-link" href="#" onClick={() => handlePageChange(i)}>
                            {getPageTitle(i)}
                        </a>
                    </li>
                )

                continue
            }
        }

        if (currentPage !== moduleJson.body.length - 1) {
            pageList.push(
                <li class="page-item">
                    <a class="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>Next</a>
                </li>
            )
        }

        setPagination(pageList)
    }

    /**
     * Handles a module being started.
     */
    const handleModuleStart = () => {
        // Parse the module's body
        const moduleBody = getCurrentPageBody()
        let divs = []
        let incompleteChallenges = []

        if (personalization === null) {
            getPersonalization(user.uuid).then(p => {
                setPersonalization(p)
            })
        }

        // get all id's from personalization
        const personalizationIds = personalization.challenges || []

        // loop through each element in the module body
        for (let i = 0; i < moduleBody.length; i++) {
            const getChallenge = loadAllChallenges(moduleBody, i)

            if (getChallenge !== null) {
                if (!personalizationIds.includes(getChallenge.id)) {
                    incompleteChallenges.push(getChallenge)
                }
            }

            divs.push(transformJsonToHtml(moduleBody, i, showLecture))
        }

        const mcqs = getCurrentPageMcqs()
        const tempQuestions = []

        for (let i = 0; i < mcqs.length; i++) {
            const mcq = mcqs[i]
            const question = {
                id: mcq.id,
                question: mcq.question,
                answers: mcq.answers,
                correctAnswerIndex: mcq.correctAnswerIndex,
                explanation: mcq.explanation,
            }

            tempQuestions.push(question)
        }

        setQuestions(tempQuestions)
        setElements(divs)

        const randomChallenge = incompleteChallenges[Math.floor(Math.random() * incompleteChallenges.length)]

        setChallengeData({
            id: randomChallenge.id,
            code: randomChallenge.code,
            question: randomChallenge.value
        })
    }

    /**
     * Opens a coding challenge. Can be easy or hard.
     * @param {Number} editorType 
     */
    const openCodingChallenge = (editorType) => {
        if (editorType < 0)
            editorType = 0

        if (editorType > 2)
            editorType = 2
        
        setEditorState(editorType)
    }

    /**
     * Estimates the time it takes to read the lecture notes.
     */
    const calculateLessonTime = () => {
        let text = ''

        for (let i = 0; i < elements.length; i++) {
            text += elements[i].innerText
        }

        text = text.replace(/<[^>]+>/g, '')

        // Average adult is 225wpm; since this is coding, we will go
        // with a lower wpm
        const wpm = 185
        const words = text.trim().split(/\s+/).length
        const time = Math.ceil(words / wpm)
        setLessonTime(time + " minute(s)")
    }
    
    /**
     * Returns all challenges in the module.
     * @param {[String]} moduleBody 
     * @param {Number} index 
     * @returns Challenges object
     */
    const loadAllChallenges = (moduleBody, index) => {
        const element = moduleBody[index]

        if (element['type'] === 'challenge') {
            const c = {
                id: element['id'],
                value: element['value'],
                code: element['code'],
            }

            return c
        }

        return null
    }

    /**
     * Sets the module's personalization
     * @param {*} value 
     */
    const setModulePersonalization = (value) => {
        if (value) {
            setShowLecture(value)
            setShowPersonalization(false)
            handleModuleStart()
            setCurrentPage(currentPage)
        } else {
            setShowPersonalization(false)
        }
    }

    /**
     * Retrieves student answers (INCOMPLETE)
     */
    const retrieveStudentAnswers = () => {
        const q = questions[currentQuestion]

        if (!q) {
            return
        }

        console.log("Getting q: " + q.id)

        getStudentAnswers(user, q.id).then(answers => {
            console.log(answers)
            // ToDo: Load saved answers into Formik
            //formik.picked = answers.answers[0] | ''
            //formik.isSubmitting = true
        })
    }

    /**
     * Transforms the module json to html.
     * @param {Object} moduleBody 
     * @param {Number} index 
     * @param {Boolean} addContent 
     * @returns HTML representation of JSON elements in module.
     */
    const transformJsonToHtml = (moduleBody, index, addContent) => {
        let divs = []

        const element = moduleBody[index]

        // If the element is a header element, add it to the html
        if (element['type'] === 'header' && addContent) {
            divs.push(
                <h3>{element['value']}</h3>
            )
        }

        // If the element is a html element, add it to the html
        if (element['type'] === 'html' && addContent) {
            divs.push((
                <span>{element['value']}<br /></span>
            ))
        }

        // If the element is a code element, add it to the html
        if (element['type'] === 'code' && addContent) {
            const value = element['value']

            divs.push(
                <div id="code-editor-box">
                    <SyntaxHighlighter language="python">
                        {value}
                    </SyntaxHighlighter>
                </div>
            )
        }

        // If the element is a image element, add it to the html
        if (element['type'] === 'image' && addContent) {
            divs.push(
                <div className="module-image">
                    <img src={element['value']} />
                </div>
            )
        }

        return divs
    }

    /**
     * Goes to the next multiple choice question.
     */
    const nextQuestion = () => {
        if (currentQuestion + 1 > questions.length) {
            return
        }

        setCurrentQuestion(currentQuestion + 1)
        refreshFormik()
    }

    if (elements.length === 0) {
        return (<Skeleton count={5}></Skeleton>)
    }

    let questionsForm = null

    if (questions.length > 0 && currentQuestion < questions.length) {
        questionsForm = (
            <div id="mc-question-box">
                <h3>Multiple-Choice Question</h3>
                <button className="btn btn-primary" hidden={!formik.isSubmitting || currentQuestion + 1 >= questions.length} onClick={nextQuestion}>Next question</button>
                <form onSubmit={formik.handleSubmit}>
                    {
                        questions[currentQuestion].question.map((q, index) => {
                            if (q.type === "code") {
                                return (
                                    <SyntaxHighlighter language="python">
                                        {q.value}
                                    </SyntaxHighlighter>
                                )
                            } else {
                                return (
                                    <p>{q.value}</p>
                                )
                            }
                        })
                    }
                    <br />
                    <div className="row">
                        <div className="col">
                            <div role="group">
                            {
                                questions[currentQuestion].answers.map((q, index) => {
                                    return (
                                        <div key={index} className="radio-group">
                                            <input type="radio" className="form-check-input" disabled={formik.isSubmitting} name="picked" value={index} onChange={formik.handleChange} />
                                            <span className="form-check-label">{q}</span>
                                        </div>
                                    )
                                })
                            }
                            </div>
                            <br />
                            <button className="btn btn-success btn-lg btn-block" type="submit" disabled={formik.isSubmitting}>Submit</button>
                        </div>
                        <div className="col">
                            <p>{currentExplanation !== "" ? currentExplanation : ""}</p>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>{getPageTitle(currentPage)}</h2>
            <h6>Lesson {currentPage + 1}/{moduleJson.body.length} &middot; Estimated time to complete lesson: {lessonTime}</h6>
            {showPersonalization ? <PersonalizationComponent onClickYes={_ => setModulePersonalization(true)} onClickNo={_ => setModulePersonalization(false)} message="Do you want to see some lecture material on this topic?" /> : <></>}
            {elements}
            {questionsForm}
            <div className="code-challenge-box">
                    <h3>Coding Challenge</h3>
                    <p>Would you like to start a coding challenge? Completing a coding challenge is optional, but can earn you achievements and/or points.</p>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-success" onClick={() => openCodingChallenge(2)}>Easier (Fill-in-the-Blanks)</button>
                        <button type="button" class="btn btn-warning" onClick={() => openCodingChallenge(1)}>Harder (Code Everything)</button>
                    </div>
                </div>
            <nav>
                <ul className="pagination justify-content-center">
                    {pagination}
                </ul>
            </nav>
        </div>
    )
}

export default memo(OpenModuleComponent)