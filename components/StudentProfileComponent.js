import { useState, useEffect, useContext } from 'react'
import Context from '../context/Context'
import AchievementComponent from '../components/AchievementComponent'
import achievementsJson from '../data/achievements.json'
import { checkFriendship } from '../data/Students.js'
import { Friendship } from '../context/Friendship.js'

export default function StudentProfileComponent(props) {
    const { user, profileView } = useContext(Context)
    const [achievements, setAchievements] = useState([])
    const [relationship, setRelationship] = useState((<></>))

    const loadAchievements = () => {
        const studentAchievements = profileView.achievements
        const achievements = achievementsJson.achievements.filter(a => studentAchievements.includes(a.id))

        setAchievements(achievements.map(achievement => {
            return (<AchievementComponent id={achievement.id} description={achievement.description} emoji={achievement.emoji} />)
        }))
    }

    const loadRelationship = () => {
        const checkAcceptance = checkFriendship(user, profileView.uuid, Friendship.ACCEPTED)
        const checkRequested = checkFriendship(user, profileView.uuid, Friendship.REQUESTED)

        Promise.allSettled([checkAcceptance, checkRequested]).then(results => {
            const accepted = results[0]
            const requested = results[1]

            if (accepted)
                setRelationship((<div>You are friends with {profileView.name}.</div>))
            else if (requested)
                setRelationship((<div>You have requested to be friends with {profileView.name}.</div>))
            else
                setRelationship((<div>You are not friends with {profileView.name}.</div>))
        })
    }

    // loadAchievements only once, as well as the friendship status
    useEffect(() => {
        loadAchievements()
        loadRelationship()
    }, [])

    return (
        <div className="container mx-auto">
            <h3>Student Profile</h3>
            <hr />
            <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <h4>{profileView.isAnonymous ? profileView.anonymousName : profileView.name}</h4>
                    {relationship}
                    <br /><br />
                    <h5>Student</h5>
                    <ul>
                        <li>Score: {profileView.score}</li>
                        <li>Level: {profileView.level}</li>
                        <li>Streak: ...</li>
                    </ul>
                    <br />
                    <h5>Friends</h5>
                    <ul>
                        <li>...</li>
                    </ul>
                  </div>
                  <div className="col-sm">
                    <h4>Modules</h4>
                    <ul className="profile-modules-list">
                        <li>
                            <span className="profile-modules-title">Conditional Statements</span>
                            <span className="profile-modules-progress">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </span>
                        </li>
                    </ul>
                  </div>
                  <div className="col-sm">
                    <h4>Achievements</h4>
                    <ul className="achievement-list">
                        {
                            achievements.length === 0 ? <p>No achievements yet.</p> : achievements.map(achievement => {
                                return (
                                    <li>
                                        {achievement}
                                    </li>
                                )
                            })
                        }
                    </ul>
                  </div>
                </div>
            </div>
        </div>
    )
}