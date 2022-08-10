import { useState, useEffect, useContext } from 'react'
import Context from '../context/Context'
import AchievementComponent from '../components/AchievementComponent'
import achievementsJson from '../data/achievements.json'
import { checkFriendship, setRelationshipStatus, getFriends } from '../data/Students.js'
import { Friendship } from '../context/Friendship.js'

/**
 * Component for a user's profile.
 * @param {*} props 
 * @returns HTML representing a user's profile
 */
export default function StudentProfileComponent(props) {
    // Using context: user, profile view, toast
    const { user, profileView, setToast } = useContext(Context)

    // State for the user's achievements
    const [achievements, setAchievements] = useState([])

    // State for the user's relationship with the student
    const [relationship, setRelationship] = useState((<></>))

    // State for the user's friends
    const [friends, setFriends] = useState([])

    /**
     * Loads user's achievements.
     */
    const loadAchievements = () => {
        const studentAchievements = profileView.achievements
        const achievements = achievementsJson.achievements.filter(a => studentAchievements.includes(a.id))

        setAchievements(achievements.map(achievement => {
            return (<AchievementComponent id={achievement.id} description={achievement.description} emoji={achievement.emoji} />)
        }))
    }

    /**
     * Updates the user's relationship with the student.
     * @param {Number} newStatus 
     */
    const changeFriendship = (newStatus) => {
        setRelationshipStatus(user.uuid, profileView.uuid, newStatus).then(() => {
            loadRelationship()
            getFriendsList()
            setToast({ title: "Success", message: "Friendship status updated." })
        })
    }

    /**
     * Loads the user's relationship with the student.
     */
    const loadRelationship = () => {
        let friendshipHasUpdated = false
        
        checkFriendship(user, profileView.uuid, Friendship.NONE).then(result => {
            if (result) {
                setRelationship((<div>
                    You are not friends with {profileView.name}. <a href="#" onClick={() => changeFriendship(Friendship.REQUESTED)}>Send a friend request.</a>
                </div>))

                friendshipHasUpdated = true
            }
        })

        if (friendshipHasUpdated) return

        checkFriendship(user, profileView.uuid, Friendship.ACCEPTED).then(result => {
            if (result) {
                setRelationship((<div>
                    You are friends with {profileView.name}. <a href="#" onClick={() => changeFriendship(Friendship.NONE)}>Unfriend.</a>
                    </div>))

                friendshipHasUpdated = true
            }
        })

        if (friendshipHasUpdated) return

        checkFriendship(user, profileView.uuid, Friendship.REQUESTED).then(result => {
            if (result) {
                setRelationship((<div>
                    You have sent a friend request to {profileView.name}. <a href="#" onClick={() => changeFriendship(Friendship.NONE)}>Cancel request.</a>
                    </div>))

                friendshipHasUpdated = true
            }
        })
    }

    /**
     * Gets a list of the user's friends.
     */
    const getFriendsList = () => {
        getFriends(profileView, Friendship.ACCEPTED).then(f => {
            if (f.length === 0) {
                setFriends([(<li>No friends yet.</li>)])
                return
            }

            setFriends(f.map((friend, index) => {
                return (<li key={index}><a href="#">{friend.name}</a></li>)
            })
        )})
    }

    // loadAchievements only once, as well as the friendship status
    useEffect(() => {
        loadAchievements()
        loadRelationship()
        getFriendsList()
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
                    </ul>
                    <br />
                    <h5>Friends</h5>
                    <ul>
                        {friends}
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