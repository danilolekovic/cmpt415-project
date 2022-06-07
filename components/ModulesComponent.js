import { useContext } from 'react'
import Context from '../context/Context'
import RecentActivityComponent from './RecentActivityComponent'

function ModulesComponent() {
    const { user, setUser } = useContext(Context)

    return (
        <div className="container mx-auto">
            <div className="row">
                <div className="col">
                    <h3>Modules</h3>
                    <hr />
                    <div className="container">
                        <ul className="profile-modules-list">
                            <li>
                                <div className="row">
                                    <div className="col-8">
                                        <span className="profile-modules-title">Conditional Statements</span>
                                        <span className="profile-modules-description">This module covers conditional statements.</span>
                                        <span className="profile-modules-progress">
                                            <div className="progress">
                                                <div className="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="col modules-buttons">
                                        <br />
                                        <a href="#" className="btn btn-primary">Start</a>
                                        <a href="#" className="btn btn-primary disabled">Review</a>
                                        <a href="#" className="btn btn-primary disabled">Compete</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-3">
                    <RecentActivityComponent />
                </div>
            </div>
        </div>
    )
}

export default ModulesComponent