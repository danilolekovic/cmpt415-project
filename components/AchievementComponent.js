/**
 * An achievement component.
 * @param {id, description, emoji} props 
 * @returns HTML representation of an achievement
 */
export default function AchievementComponent(props) {
    const id = props.id
    const description = props.description
    const emoji = props.emoji

    return (
        <div className='achievement' achievementId={id}>
            <span className='achievement-emoji'>{emoji}</span>
            <span className='achievement-description'>{description}</span>
        </div>
    )
} 