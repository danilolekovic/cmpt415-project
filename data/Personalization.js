import { db } from '../firebase'
import { collection, getDocs, query } from 'firebase/firestore'

/**
 * Represents a personalization set in the system
 * 
 * @typedef {Object} Personalization
 */
 export class Personalization {
    constructor(uuid, leaderboard) {
        this.uuid = uuid
        this.leaderboard = leaderboard
    }
}

/**
 * Converts between the Personalization class schema and
 * the firebase schema
 */
const personalizationConverter = {
    toFirestore: function (p) {
        return {
            uuid: p.uuid,
            leaderboard: p.leaderboard
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Personalization(data.uuid, data.leaderboard)
    }
}

/**
 * Returns a student's preferences by uuid
 * @param {string} uuid 
 * @returns Personalization
 */
 export async function getPersonalization(uuid) {
    const q = query(collection(db, "personalization"), where("uuid", "==", uuid))

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
        return null
    }

    return personalizationConverter.fromFirestore(querySnapshot.docs[0], { idField: "uuid" })
}