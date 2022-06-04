import { useRef, useState } from 'react'
import validator from 'validator'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '../firebase'

function LoginComponent(props) {
    const [signUp, setSignUp] = useState(false)

    const signUpNameRef = useRef(null)
    const signUpEmailRef = useRef(null)
    const signUpPasswordRef = useRef(null)
    const signUpPasswordConfirmRef = useRef(null)

    const signInEmailRef = useRef(null)
    const signInPasswordRef = useRef(null)

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

    const handleSignUp = (e) => {
        e.preventDefault()

        const name = signUpNameRef.current.value
        const email = signUpEmailRef.current.value
        const password = signUpPasswordRef.current.value
        const passwordRepeat = signUpPasswordConfirmRef.current.value

        if (validateSignUp({ name, email, password, passwordRepeat })) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Account has been created! Please sign in.")
                    setSignUp(false)
                })
                .catch((error) => {
                    alert(error)
                    alert(error.message)
                })

        } else {
            alert('Invalid sign up')
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()

        // Do firebase login
        signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
            .then(() => {
                // login worked
            }
            )
            .catch((error) => {
                // login error
                alert(error.message)
            }
        )
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
                    <input type="email" id="inputEmail" className="form-control input-sm mb-2" placeholder="Email address" required="True" ref={signInEmailRef} />
                    <input type="password" id="inputPassword" className="form-control input-sm mb-2" placeholder="Password" required="True" ref={signInPasswordRef} />
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                </form>
            </div>
        )
    }
}

export default LoginComponent