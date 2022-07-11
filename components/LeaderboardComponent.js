import { useState, useEffect, useContext } from 'react'
import Context from '../context/Context'
import { getFriendsLeaderboard } from "../data/Gamification"
import { getStudentById } from "../data/Students"
import { Personalization, getPersonalization, changePersonalization } from "../data/Personalization"
import { PersonalizationSetting } from '../context/PersonalizationSetting'
import { Pages } from '../context/Pages'
import PersonalizationComponent from './PersonalizationComponent'

export default function LeaderboardComponent() {
    const { user, setPage, setProfileView, personalization, setPersonalization } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [leaderboard, setLeaderboard] = useState([])

    const openProfile = (uuid) => {
        if (user.uuid === uuid) {
            setPage(Pages.PROFILE)
            return
        }

        getStudentById(uuid).then(student => {
            setProfileView(student)
            setPage(Pages.STUDENT_PROFILE)
        })
    }

    const loadPersonalization = () => {
        if (personalization === null) {
            getPersonalization(user.uuid).then(p => {
                setPersonalization(p)
            })
        }
    }

    const setLeaderboardPersonalization = (show) => {
        const value = show ? PersonalizationSetting.YES : PersonalizationSetting.NO
        const newPersonalization = new Personalization(user.uuid, value)

        setPersonalization(newPersonalization)
        changePersonalization(user.uuid, newPersonalization)
    }

    useEffect(() => {
        loadPersonalization()
    }, [])

    useEffect(() => {
        getFriendsLeaderboard(user).then(l => {
            setLoading(false)
            setLeaderboard(l)
        })
    }, [])

    if (personalization !== null && personalization.leaderboards === PersonalizationSetting.NONE) {
        return <PersonalizationComponent onClickYes={_ => setLeaderboardPersonalization(true)} onClickNo={_ => setLeaderboardPersonalization(false)} message="Do you want to see your friends' leaderboard?" />
    } else if (personalization !== null && personalization.leaderboards === PersonalizationSetting.YES) {
        return (
            <div>
                <h3>Leaderboard</h3>
                <hr />
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Student</th>
                        <th scope="col">Score</th>
                        <th scope="col">Level</th>
                        <th scope="col">Achievements</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? <tr><td colSpan="5">Loading...</td></tr> : leaderboard.sort(function (left, right) {
                                return right.score - left.score
                            }).map((data, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td><a href="#" onClick={() => openProfile(data.uuid)}>{data.uuid === user.uuid ? "You" : data.name}</a></td>
                                    <td>{data.score}</td>
                                    <td>{data.level}</td>
                                    <td>{data.achievements.length}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    return (<></>)
}