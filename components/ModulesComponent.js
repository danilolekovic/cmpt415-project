import { useContext } from 'react'
import Context from '../context/Context'
import RecentActivityComponent from './RecentActivityComponent'
import conditionalStatementsJson from '../modules/conditional_statements.json'
import OpenModuleComponent from './OpenModuleComponent'
import EditorComponent from './EditorComponent'
import EasyEditorComponent from './EasyEditorComponent'
import LeaderboardComponent from './LeaderboardComponent'
import ToastComponent from './ToastComponent'

export default function ModulesComponent() {
    const { openedModule, setOpenedModule, editorState } = useContext(Context)

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

    const getEditor = () => {
        if (editorState === 0) {
            return (<></>)
        } else if (editorState === 1) {
            return (
                <div className="col-5 position-fixed b-r" style={{right: 0}}>
                    <EditorComponent />
                </div>
            )
        } else if (editorState === 2) {
            return (
                <div className="col-5 position-fixed b-r" style={{right: 0}}>
                    <EasyEditorComponent />
                </div>
            )
        }
    }

    if (openedModule) {
        return (
            <div className="container mx-auto">
                <div className="row">
                    <div className={editorState === 0 ? "col-100" : "col-7"}>
                        <OpenModuleComponent file={openedModule} />
                    </div>
                    {getEditor()}
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
                        <LeaderboardComponent />
                    </div>
                </div>
            </div>
        )
    }
}