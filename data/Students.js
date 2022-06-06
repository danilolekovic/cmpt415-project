import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export class Student {
    constructor(uuid, name, email, anonymousName, isAnonymous, achievements, level, friends) {
        this.uuid = uuid
        this.name = name
        this.email = email
        this.anonymousName = anonymousName
        this.isAnonymous = isAnonymous
        this.achievements = achievements
        this.level = level
        this.friends = friends
    }
}

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
            friends: student.friends
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Student(data.uuid, data.name, data.email, data.anonymous_name, data.is_anonymous, data.achievements, data.level, data.friends)
    }
}

export async function getStudent(email) {
    const q = query(collection(db, "students"), where("email", "==", email))

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
        return null
    }

    return studentConverter.fromFirestore(querySnapshot.docs[0], { idField: "uuid" })
}

export async function createStudent(student) {
    const q = query(collection(db, "students"), where("email", "==", student.email))

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return collection(db, "students").add(studentConverter.toFirestore(student))
    } else {
        return false
    }
}