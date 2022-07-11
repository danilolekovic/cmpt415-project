import { db } from '../firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { getFriends } from './Students'
import { Friendship } from '../context/Friendship'

export async function getLeaderboard() {
    const q = query(collection(db, "students"), orderBy("score"), limit(3))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data()).map(data => {
        return {
            uuid: data.uuid,
            name: data.is_anonymous ? data.anonymous_name : data.name,
            achievements: data.achievements,
            level: data.level,
            score: data.score,
        }
    })
}

export async function getFriendsLeaderboard(user) {
    const [friends, leaderboard] = await Promise.all([
        getFriends(user, Friendship.ACCEPTED),
        getLeaderboard()
    ])

    const friendsIds = friends.map(friend => friend.uuid)

    const filteredLeaderboard = leaderboard.filter(leaderboardUser => {
        return friendsIds.includes(leaderboardUser.uuid) || leaderboardUser.uuid === user.uuid
    })

    return filteredLeaderboard
}