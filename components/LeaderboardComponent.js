import { useState, useEffect } from 'react'
import { getLeaderboard } from "../data/Gamification"

export default function LeaderboardComponent() {
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        getLeaderboard().then(l => setLeaderboard(l))
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
                        leaderboard.map((data, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{data.name}</td>
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