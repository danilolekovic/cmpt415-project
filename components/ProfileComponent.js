import { useContext, useState, useEffect } from 'react'
import Context from '../context/Context'
import AchievementComponent from '../components/AchievementComponent'
import achievementsJson from '../data/achievements.json'
import { getFriends } from '../data/Students.js'
import { Friendship } from '../context/Friendship.js'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProfileComponent(props) {
    const { user } = useContext(Context)
    const [achievements, setAchievements] = useState([])
    const [friends, setFriends] = useState(null)

    const loadAchievements = () => {
        const studentAchievements = user.achievements
        const achievements = achievementsJson.achievements.filter(a => studentAchievements.includes(a.id))

        setAchievements(achievements.map(achievement => {
            return (<AchievementComponent id={achievement.id} description={achievement.description} emoji={achievement.emoji} />)
        }))
    }

    const getFriendsList = () => {
        setFriends([])
        getFriends(user, Friendship.ACCEPTED).then(f => {
            if (f.length === 0) {
                setFriends([(<li>No friends yet.</li>)])
                return
            }

            setFriends(f.map((friend, index) => {
                return (<li key={index}><a href="#">{friend.name}</a></li>)
            })
        )})
    }

    const getFriendsElement = () => {
        if (friends === null) {
            return (<Skeleton count={3}></Skeleton>)
        } else {
            return (
                <ul>
                    {friends}
                </ul>
            )
        }
    }

    useEffect(() => {
        loadAchievements()
        getFriendsList()
    }, [])

    return (
        <div className="container mx-auto">
            <h3>My Profile</h3>
            <hr />
            <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <h4>{user.name}</h4>
                    <p>{user.anonymousName === null ? user.email : `${user.email} - Also known as "${user.anonymousName}"`}</p>
                    <a href="#">Edit Profile</a>
                    <br /><br />
                    <h5>Student</h5>
                    <ul>
                        <li>Score: {user.score}</li>
                        <li>Level: {user.level}</li>
                    </ul>
                    <br />
                    <h5>Friends</h5>
                    {
                        getFriendsElement()
                    }
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