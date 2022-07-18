import { db } from '../firebase'
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore'

/**
 * Represents a personalization set in the system
 * 
 * @typedef {Object} Personalization
 */
 export class Personalization {
    constructor(uuid, leaderboards, challenges) {
        this.uuid = uuid
        this.leaderboards = leaderboards
        this.challenges = challenges
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
            leaderboards: p.leaderboards,
            challenges: p.challenges
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Personalization(data.uuid, data.leaderboards, data.challenges)
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

export async function changePersonalization(uuid, value) {
    const q = query(collection(db, "personalization"), where("uuid", "==", uuid))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return false
    }

    const doc = querySnapshot.docs[0]

    await updateDoc(doc.ref, personalizationConverter.toFirestore(value))

    return true
}