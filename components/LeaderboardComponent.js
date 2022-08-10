import { useState, useEffect, useContext } from 'react'
import Context from '../context/Context'
import { getFriendsLeaderboard } from "../data/Gamification"
import { Personalization, getPersonalization, changePersonalization } from "../data/Personalization"
import { PersonalizationSetting } from '../context/PersonalizationSetting'
import PersonalizationComponent from './PersonalizationComponent'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import UserLinkComponent from './UserLinkComponent'

export default function LeaderboardComponent() {
    const { user, personalization, setPersonalization } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [leaderboard, setLeaderboard] = useState([])

    const loadPersonalization = () => {
        if (personalization === null) {
            getPersonalization(user.uuid).then(p => {
                setPersonalization(p)
            })
        }
    }

    const setLeaderboardPersonalization = (show) => {
        const value = show ? PersonalizationSetting.YES : PersonalizationSetting.NO
        const newPersonalization = new Personalization(user.uuid, value, personalization.challenges || [], personalization.shownModules || [])

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
                                    <td><UserLinkComponent uuid={data.uuid} name={data.name} /></td>
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

    return (<Skeleton count={5}></Skeleton>)
}