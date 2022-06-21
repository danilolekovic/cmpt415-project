import { db } from '../firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export async function getLeaderboard() {
    const q = query(collection(db, "students"), orderBy("score"), limit(3))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data()).map(data => {
        return {
            uuid: data.uuid,
            name: data.isAnonymous ? data.anonymousName : data.name,
            achievements: data.achievements,
            level: data.level,
            score: data.score,
        }
    })
}