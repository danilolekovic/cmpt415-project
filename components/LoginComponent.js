import { useRef, useState, useContext } from 'react'
import Context from '../context/Context'
import { Student, getStudent, createStudent } from '../data/Students'
import validator from 'validator'
import { v4 as uuidv4 } from "uuid"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { auth } from '../firebase'
import { v4 } from 'uuid'

/**
 * The login and signup component
 * @param {*} props 
 * @returns HTML for login/signup components
 */
function LoginComponent(props) {
    const [signUp, setSignUp] = useState(false)

    const signUpNameRef = useRef(null)
    const signUpEmailRef = useRef(null)
    const signUpPasswordRef = useRef(null)
    const signUpPasswordConfirmRef = useRef(null)

    const signInEmailRef = useRef(null)
    const signInPasswordRef = useRef(null)

    const { setUser } = useContext(Context)

    /**
     * Validates the input contents for the sign up form
     * 
     * @param { name, email, password, passwordRepeat } formData 
     * @returns boolean
     */
    const validateSignUp = ({ name, email, password, passwordRepeat }) => {
        if (!name || !email || !password || !passwordRepeat) {
            return false
        }

        if (!validator.isEmail(email)) {
            return false
        }

        if (password !== passwordRepeat) {
            return false
        }

        if (password.length < 6) {
            return false
        }

        if (!email.endsWith('@sfu.ca')) {
            return false
        }

        return true
    }

    /**
     * Validates the input contents for the sign in form
     * @param { email, password } inputs
     * @returns True if valid, false if invalid
     */
    const validateSignIn = ({ email, password }) => {
        if (!email || !password) {
            return false
        }

        if (!validator.isEmail(email)) {
            return false
        }

        if (!email.endsWith('@sfu.ca')) {
            return false
        }

        return true
    }

    /**
     * Handles the sign up form submission
     * 
     * @param {e} e 
     */
    const handleSignUp = (e) => {
        e.preventDefault()

        const name = signUpNameRef.current.value
        const email = signUpEmailRef.current.value
        const password = signUpPasswordRef.current.value
        const passwordRepeat = signUpPasswordConfirmRef.current.value

        if (validateSignUp({ name, email, password, passwordRepeat })) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // ToDo: create anonymous name generation
                    const student = new Student(uuidv4(), name, email, null, false, [], 1, [], 0)

                    // ToDo: if student already exists, do not create new student
                    createStudent(student).then((result) => {
                        if (result == false) {
                            alert('Student already exists. Please use your own email address.')
                        } else {
                            localStorage.setItem('auth', JSON.stringify(student))
                            setUser(student)
                            alert("Account has been created! You are now signed in.")
                            setSignUp(false)
                        }
                    })
                })
                .catch((error) => {
                    alert(error.message)
                })

        } else {
            alert('Please ensure that your email is @sfu.ca and that your password is at least 6 characters long.')
        }
    }

    /**
     * Handles the sign in form submission
     * @param {Event} e 
     */
    const handleSignIn = (e) => {
        e.preventDefault()

        const email = signInEmailRef.current.value
        const password = signInPasswordRef.current.value

        if (validateSignIn({ email, password })) {
            // Do firebase login
            signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                getStudent(email).then((student) => {
                    localStorage.setItem('auth', JSON.stringify(student))
                    setUser(student)
                })
            })
            .catch((error) => {
                // login error
                // ToDo: handle error message
                alert(error.message)
            })
        } else {
            alert('Please ensure that your email is @sfu.ca.')
        }
    }

    /**
     * Sends an email to the user with a link to reset their password
     * @param {Event} e 
     */
    const handleForgotPassword = (e) => {
        e.preventDefault()

        sendPasswordResetEmail(auth, signInEmailRef.current.value).then(() => {
            alert("Password reset email sent. Please check your email.")
        })
    }

    if (signUp) {
        return (
            <div className="signup text-center">
                <form className="form-signin">
                    <h1 className="h3 font-weight-normal">Please Sign Up</h1>
                    <p className="mb-3 text-muted">
                        Already have an account? <a href="#" onClick={() => setSignUp(false)}>Sign in</a>.
                    </p>
                    <input type="text" id="inputName" className="form-control input-sm mb-2" placeholder="Name" required="True" ref={signUpNameRef} />
                    <input type="email" id="inputEmail" className="form-control input-sm mb-2" placeholder="Email address" required="True" ref={signUpEmailRef} />
                    <input type="password" id="inputPassword" className="form-control input-sm mb-2" placeholder="Password" required="True" ref={signUpPasswordRef} />
                    <input type="password" id="inputPasswordRepeated" className="form-control input-sm mb-2" placeholder="Repeat password" required="True" ref={signUpPasswordConfirmRef} />
                    <label for="expertiseRange" className="form-label">What is your expertise level in <b>conditional statements</b>?</label>
                    <input type="range" className="form-range" id="expertiseRange"></input>
                    <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handleSignUp}>Sign up</button>
                </form>
            </div>
        )
    } else {
        return (
            <div className="signin text-center">
                <form className="form-signin">
                    <h1 className="h3 font-weight-normal">Please Sign In</h1>
                    <p className="mb-3 text-muted">
                        Don't have an account? <a href="#" onClick={() => setSignUp(true)}>Sign up</a>.
                    </p>
                    <p className="mb-3 text-muted">
                        Forgot password? Type your email below and click <a href="#" onClick={handleForgotPassword}>here</a>.
                    </p>
                    <input type="email" id="inputEmail" className="form-control input-sm mb-2" placeholder="Email address" required="True" ref={signInEmailRef} />
                    <input type="password" id="inputPassword" className="form-control input-sm mb-2" placeholder="Password" required="True" ref={signInPasswordRef} />
                    <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={handleSignIn}>Sign in</button>
                </form>
            </div>
        )
    }
}

export default LoginComponent