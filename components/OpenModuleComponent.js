import { useEffect, useState, useContext, memo } from 'react'
import { checkStudentHasAchievement, giveStudentAchievement } from '../data/Students'
import Context from '../context/Context'
import SyntaxHighlighter from 'react-syntax-highlighter'

function OpenModuleComponent(props) {
    const moduleJson = props.file.json
    const { user, setUser, setToast } = useContext(Context)
    const [elements, setElements] = useState([])
    const [mcQuestionNumber, setMcQuestionNumber] = useState(0)
    const [answeredMcQuestions, setAnsweredMcQuestions] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [pagination, setPagination] = useState([])
    const [lessonTime, setLessonTime] = useState('')

    const getCurrentPageBody = () => {
        const currentPageBody = moduleJson.body.find(body => body.page === currentPage)

        if (currentPageBody) {
            return currentPageBody.content
        }

        return []
    }

    const getPageTitle = (page) => {
        const pageTitle = moduleJson.body.find(body => body.page === page)

        if (pageTitle) {
            return pageTitle.name
        }

        return '...'
    }

    const handlePageChange = (page) => {
        if (page < 0) {
            page = 0
        }

        if (page >= moduleJson.body.length) {
            page = moduleJson.body.length - 1
        }

        setCurrentPage(page)
    }

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

    const handleModuleStart = () => {
        // Parse the module's body
        const moduleBody = getCurrentPageBody()
        let divs = []

        // loop through each element in the module body
        for (let i = 0; i < moduleBody.length; i++) {
            divs.push(transformJsonToHtml(moduleBody, i))
        }

        setElements(divs)
    }

    const handleMcAnswer = (e, index, correctAnswerIndex, explanation) => {
        if (e.target.checked) {
            const name = e.target.name

            if (answeredMcQuestions.includes(name)) {
                return
            }

            if (index === correctAnswerIndex) {
                e.target.style = 'background-color: green'
                e.target.nextSibling.innerHTML = e.target.nextSibling.innerHTML + ' -- correct! ' + explanation

                checkStudentHasAchievement(user, 1).then(res => {
                    if (!res && !user.achievements.includes(1)) {
                        giveStudentAchievement(user, 1).then(res => {
                            // Temporary
                            // ToDo: actually give the student the achievement
                            setUser({
                                ...user,
                                achievements: [...user.achievements, 1]
                            })

                            setToast({
                                title: 'Achievement unlocked',
                                message: 'You answered a MC question correctly!'
                            })
                        })
                    }
                })
            } else {
                e.target.style = 'background-color: red'
                e.target.nextSibling.innerHTML = e.target.nextSibling.innerHTML + ' -- incorrect! ' + explanation
            }

            setAnsweredMcQuestions([...answeredMcQuestions, name])
        }
    }

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

    const transformJsonToHtml = (moduleBody, index) => {
        let divs = []

        const element = moduleBody[index]

        // If the element is a header element, add it to the html
        if (element['type'] === 'header') {
            divs.push(
                <h3>{element['value']}</h3>
            )
        }

        // If the element is a html element, add it to the html
        if (element['type'] === 'html') {
            divs.push((
                <span>{element['value']}<br /></span>
            ))
        }

        // If the element is a code element, add it to the html
        if (element['type'] === 'code') {
            const value = element['value']

            divs.push(
                <div id="code-editor-box">
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
            const explanation = element['explanation']
            const mcDivs = []
            const mcAnswerDivs = []

            for (let i = 0; i < mcBody.length; i++) {
                mcDivs.push(transformJsonToHtml(mcBody, i))
            }

            setMcQuestionNumber(mcQuestionNumber + 1)

            for (let i = 0; i < mcAnswers.length; i++) {
                const checkBoxCombo = []

                checkBoxCombo.push(
                    <input type="radio" className="form-check-input" name={`mcq-${mcQuestionNumber}-${i}`} value={i} onChange={e => handleMcAnswer(e, i, correctAnswer, explanation)} />
                )

                checkBoxCombo.push(
                    <label className="form-check-label" for={`mcq-${mcQuestionNumber}-${i}`}>{mcAnswers[i]}</label>
                )

                mcAnswerDivs.push(
                    <div className="form-check">
                        {checkBoxCombo}
                    </div>
                )
            }
            
            divs.push(
                <div id="mc-question-box">
                    <h3>Multiple-Choice Question</h3>
                    {mcDivs}
                    <div>
                        {mcAnswerDivs}
                    </div>
                </div>
            )
        }

        // If the element is a image element, add it to the html
        if (element['type'] === 'image') {
            divs.push(
                <div className="module-image">
                    <img src={element['value']} />
                </div>
            )
        }

        divs.push(
            <br />
        )

        return divs
    }

    useEffect(() => {
        handleModuleStart()
        calculateLessonTime()
        handlePagination()
    }, [currentPage])

    return (
        <div>
            <h2>{getPageTitle(currentPage)}</h2>
            <h6>Lesson {currentPage + 1}/{pagination.length} &middot; Estimated time to complete lesson: {lessonTime}</h6>
            {elements}
            <nav>
                <ul className="pagination justify-content-center">
                    {pagination}
                </ul>
            </nav>
        </div>
    )
}

export default memo(OpenModuleComponent)