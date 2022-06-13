import { useContext, useState } from 'react'
import Context from '../context/Context'
import RecentActivityComponent from './RecentActivityComponent'
import conditionalStatementsJson from '../modules/conditional_statements.json'
import OpenModuleComponent from './OpenModuleComponent'
import AchievementsListComponent from './AchievementsListComponent'
import EditorComponent from './EditorComponent'

function ModulesComponent() {
    const [moduleContents, setModuleContents] = useState(null)
    const { openedModule, setOpenedModule } = useContext(Context)

    const handleModuleStart = (e) => {
        const module = e.currentTarget.getAttribute('module')
        let content;

        if (module === 'conditional_statements') {
            content = conditionalStatementsJson
        } else {
            return
        }

        setOpenedModule({
            id: module,
            json: content
        })
    }

    if (openedModule) {
        return (
            <div className="container mx-auto">
                <div className="row">
                    <div className="col-7">
                        <OpenModuleComponent file={openedModule} />
                    </div>
                    <div className="col-5 position-fixed" style={{right: 0}}>
                        <EditorComponent />
                        <a href="#" className="btn btn-primary btn-module-run-code">Run Code</a>
                    </div>
                </div>
            </div>
        )
    } else {
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
                                            <a href="#" className="btn btn-primary" module="conditional_statements" onClick={handleModuleStart}>Start</a>
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
}

export default ModulesComponent