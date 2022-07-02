import { db } from '../firebase'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { getStudentById } from './Students'

/**
 * Represents a discussion in the system
 * 
 * @typedef {Object} Discussion
 */
 export class Discussion {
    constructor(uuid, title, author, content, date, upvoted_by) {
        this.uuid = uuid
        this.title = title
        this.author = author
        this.content = content
        this.date = date
        this.upvoted_by = upvoted_by
    }
}
/**
 * Represents a response in the system
 * 
 * @typedef {Object} response
 */
 export class Response {
    constructor(uuid, parent, author, content, date, upvoted_by) {
        this.uuid = uuid
        this.parent = parent
        this.author = author
        this.content = content
        this.date = date
        this.upvoted_by = upvoted_by
    }
}

/**
 * Converts between the Discussion class schema and
 * the firebase schema
 */
 const discussionConverter = {
    toFirestore: function (discussion) {
        return {
            uuid: discussion.uuid,
            title: discussion.title,
            author: discussion.author,
            content: discussion.content,
            date: discussion.date,
            upvoted_by: discussion.upvoted_by
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Discussion(data.uuid, data.title, data.author, data.content, dateToString(data.date.toDate()), data.upvoted_by)
    }
}

/**
 * Converts between the Response class schema and
 * the firebase schema
 */
 const responseConverter = {
    toFirestore: function (response) {
        return {
            uuid: response.uuid,
            parent: response.parent,
            author: response.author,
            content: response.content,
            date: response.date,
            upvoted_by: response.upvoted_by
        }
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options)
        return new Response(data.uuid, data.parent, data.author, data.content, dateToString(data.date.toDate()), data.upvoted_by)
    }
}

export async function getDiscussionList() {
    const q = collection(db, "discussions")

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
        return null
    }

    const discussions = []

    for (const doc of querySnapshot.docs) {
        const student = await getStudentById(doc.data().author)
        console.log(doc.data().date)
        discussions.push(new Discussion(doc.id, doc.data().title, student, doc.data().content, dateToString(doc.data().date.toDate()), doc.data().upvoted_by))
    }

    return discussions
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function dateToString(date) {
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')})`
}

export async function getDiscussionPost(uuid) {
    const q = query(collection(db, "discussions"), where("uuid", "==", uuid))

    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
        return null
    }

    const discussion = discussionConverter.fromFirestore(querySnapshot.docs[0], { idField: "uuid" })
    const author = await getStudentById(discussion.author)
    const replies = []
    const repiesQ = query(collection(db, "replies"), where("parent", "==", uuid))
    const repliesSnapshot = await getDocs(repiesQ)

    if (!repliesSnapshot.empty) {
        for (const doc of repliesSnapshot.docs) {
            const student = await getStudentById(doc.data().author)
            replies.push(new Response(doc.id, doc.data().parent, student, doc.data().content, dateToString(doc.data().date.toDate()), doc.data().upvoted_by))
        }
    }

    return {
        discussion: discussion,
        author: author,
        replies: replies
    }
}