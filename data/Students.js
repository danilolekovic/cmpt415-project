import { db } from '../firebase'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Friendship } from '../context/Friendship'

/**
 * Represents a student in the system
 * 
 * @typedef {Object} Student
 */
export class Student {
    constructor(uuid, name, email, anonymousName, isAnonymous, achievements, level, friends, score) {
        this.uuid = uuid
        this.name = name
        this.email = email
        this.anonymousName = anonymousName
        this.isAnonymous = isAnonymous
        this.achievements = achievements
        this.level = level
        this.friends = friends
        this.score = score
    }
}

/**
 * Converts between the Student class schema and
 * the firebase schema
 */
const studentConverter = {
    toFirestore: function (student) {
        return {
            uuid: student.uuid,
            name: student.name,
            email: student.email,
            anonymous_name: student.anonymousName,
            is_anonymous: student.isAnonymous,
            achievements: student.achievements,
            level: student.level,
            friends: student.friends,
            score: student.score
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Student(data.uuid, data.name, data.email, data.anonymous_name, data.is_anonymous, data.achievements, data.level, data.friends, data.score)
    }
}

/**
 * Returns a student by email
 * @param {string} email 
 * @returns Student
 */
export async function getStudent(email) {
    const q = query(collection(db, "students"), where("email", "==", email))

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
        return null
    }

    return studentConverter.fromFirestore(querySnapshot.docs[0], { idField: "uuid" })
}

/**
 * Returns a student by uuid
 * @param {string} uuid 
 * @returns Student
 */
 export async function getStudentById(uuid) {
    const q = query(collection(db, "students"), where("uuid", "==", uuid))

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
        return null
    }

    return studentConverter.fromFirestore(querySnapshot.docs[0], { idField: "uuid" })
}

/**
 * Creates a new student
 * @param {Student} student 
 * @returns Student if created, false if already exists
 */
export async function createStudent(student) {
    const q = query(collection(db, "students"), where("email", "==", student.email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        await setDoc(doc(db, "students", student.uuid), studentConverter.toFirestore(student))
        return student
    }

    return false
}

/**
 * Checks if a student has an achievement
 * @param {Student} student 
 * @param {Achievement ID} achievement 
 * @returns true if the student has the achievement, false otherwise
 */
export async function checkStudentHasAchievement(student, achievement) {
    const q = query(collection(db, "students"), where("email", "==", student.email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return false
    }

    const studentDoc = querySnapshot.docs[0]

    const studentData = studentDoc.data()

    return studentData.achievements.includes(achievement)
}

/**
 * Awards an achievement to a student
 * @param {Student} student 
 * @param {Achievement ID} achievement 
 * @returns false if the student has the achievement or does not exist, true otherwise
 */
export async function giveStudentAchievement(student, achievement) {
    const q = query(collection(db, "students"), where("email", "==", student.email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return false
    }

    const studentDoc = querySnapshot.docs[0]

    const studentData = studentDoc.data()
    const achievements = studentData.achievements

    if (!achievements.includes(achievement)) {
        achievements.push(achievement)
        await updateDoc(studentDoc.ref, { achievements: achievements })

        return true
    }
    
    return false
}

export async function giveStudentScore(student, score) {
    const q = query(collection(db, "students"), where("email", "==", student.email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return false
    }

    const studentDoc = querySnapshot.docs[0]

    const studentData = studentDoc.data()
    const currentScore = studentData.score

    await updateDoc(studentDoc.ref, { score: currentScore + score })

    return true
}

export async function getFriendsIds(student, status) {
    if (status < Friendship.NONE || status > Friendship.REJECTED) {
        return []
    }

    const oneWayQ = query(collection(db, "relationships"), where("from", "==", student.uuid), where("status", "==", status))
    const twoWayQ = query(collection(db, "relationships"), where("to", "==", student.uuid), where("status", "==", status))

    const oneWaySnapshot = await getDocs(oneWayQ)
    const twoWaySnapshot = await getDocs(twoWayQ)

    const oneWayData = oneWaySnapshot.docs.map(doc => doc.data())
    const twoWayData = twoWaySnapshot.docs.map(doc => doc.data())

    const friendsOneWay = oneWayData.map(data => data.to)
    const friendsTwoWay = twoWayData.map(data => data.from)

    const friends = friendsOneWay.concat(friendsTwoWay)

    return friends
}

export async function getFriends(student, status) {
    const friendsIds = await getFriendsIds(student, status)

    const friends = []

    for (const id of friendsIds) {
        const friend = await getStudentById(id)
        friends.push(friend)
    }

    return friends
}

export async function checkFriendship(student, friendId, status) {
    const friendIds = await getFriendsIds(student, status)

    if (friendIds.length === 0) return false

    return friendIds.includes(friendId)
}

export async function setRelationshipStatus(student1, student2, status) {
    const firstQ = query(collection(db, "relationships"), where("from", "==", student1), where("to", "==", student2))
    const secondQ = query(collection(db, "relationships"), where("from", "==", student2), where("to", "==", student1))

    const firstSnapshot = await getDocs(firstQ)
    const secondSnapshot = await getDocs(secondQ)

    if (firstSnapshot.empty && secondSnapshot.empty) {
        await setDoc(doc(db, "relationships", uuid()), {
            from: student1,
            to: student2,
            sent: serverTimestamp,
            responded: serverTimestamp,
            status: status
        })

        return
    }

    if (firstSnapshot.empty) {
        const secondDoc = secondSnapshot.docs[0].ref
        await updateDoc(secondDoc, { status: status })
        return
    }

    if (secondSnapshot.empty) {
        const firstDoc = firstSnapshot.docs[0].ref
        await updateDoc(firstDoc, { status: status })
        return
    }
}