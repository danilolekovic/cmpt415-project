import { useRef, useContext } from 'react'
import auth from '../firebase'

function Login(props) {
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleLogin = (e) => {
        e.preventDefault()

        // Do firebase login
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={emailRef} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordRef} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login