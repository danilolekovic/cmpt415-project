import { useContext } from 'react'
import Context from '../context/Context'

function NavComponent(props) {
    const { user, setUser } = useContext(Context)

    const handleSignOut = (e) => {
        e.preventDefault()
        localStorage.removeItem('auth')
        setUser(null)
    }

    let navBarContents = (
        <div>
        </div>
    )

    if (user) {
        navBarContents = (
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">Modules</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Discussion</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Competition</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" aria-current="page" href="#">My Profile</a>
                    </li>
                </ul>
                <span className="navbar-text">
                    Signed in as <a href="#">{user.name}</a>. (<a href="#" onClick={handleSignOut}>Sign out</a>)
                </span>
            </div>
        )
    }

    return (
        <div className="container">
            <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Intro. to Python</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    {navBarContents}
                </div>
            </nav>
            <br />
            <br />
            <br />
        </div>
    );
}

export default NavComponent