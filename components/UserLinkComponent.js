import { useState, useContext, useEffect } from 'react'
import Context from '../context/Context'
import { Pages } from '../context/Pages'
import { getStudentById } from "../data/Students"

/**
 * Component for a link to a user's profile.
 * @param {name, uuid, showOwnName} props 
 * @returns HTML representing a link to a user's profile
 */
export default function UserLinkComponent(props) {
    const { user, setPage, setProfileView } = useContext(Context)
    const [displayName, setDisplayName] = useState('')

    const openUser = (e) => {
        e.preventDefault()

        if (user.uuid === props.uuid) {
            setPage(Pages.PROFILE)
            return
        }

        getStudentById(props.uuid).then(student => {
            setProfileView(student)
            setPage(Pages.STUDENT_PROFILE)
        })
    }

    useEffect(() => {
        setDisplayName(props.name)

        if (user.uuid === props.uuid && !props.showOwnName) {
            setDisplayName('You')
        }
    }, [])

    return (
        <a href="#" onClick={e => openUser(e)}>{displayName}</a>
    )
}