/**
 * Skeleton for a personalization prompt.
 * @param {message, onClickYes, onClickNo} props 
 * @returns HTML for a personalization prompt.
 */
export default function PersonalizationComponent(props) {
    const message = props.message || ''

    const onClickYes = () => props.onClickYes()
    const onClickNo = () => props.onClickNo()

    return (
        <div className="personalization-box">
            <h3>{message}</h3>
            <p>If you wish to change this preference later, please visit your profile.</p>
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-success" onClick={onClickYes}>Yes</button>
                <button type="button" className="btn btn-outline-danger" onClick={onClickNo}>No</button>
            </div>
        </div>
    )
}