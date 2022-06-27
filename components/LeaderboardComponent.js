import { useState, useEffect, useContext } from 'react'
import Context from '../context/Context'
import { getLeaderboard } from "../data/Gamification"
import { getStudentById } from "../data/Students"
import { Pages } from '../context/Pages'

export default function LeaderboardComponent() {
    const { user, setPage, setProfileView } = useContext(Context)
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

    useEffect(() => {
        getLeaderboard().then(l => {
            setLoading(false)
            setLeaderboard(l)
        })
    }, [])

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
                            <tr>
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