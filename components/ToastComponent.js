import { useContext } from 'react'
import Context from '../context/Context'

/**
 * Component for a singular toast notification.
 * @param {title, message} props 
 * @returns HTML for a toast notification
 */
export default function ToastComponent(props) {
    const { setToast } = useContext(Context)

    return (
        <div className="toast">
            <div className="toast-header">
                <strong className="mr-auto">{props.title}</strong>
                <button type="button" className="ml-2 mb-1 close toast-close" onClick={e => setToast(null)}>
                <span>&times;</span>
                </button>
            </div>
            <div className="toast-body">
                {props.message}
            </div>
        </div>
    )
}