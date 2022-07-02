import { useState, useEffect } from "react"
import { getDiscussionList, getDiscussionPost } from "../data/Discussion"

export default function DiscussionComponent(props) {
    const [discussions, setDiscussions] = useState([])
    const [currentDiscussion, setCurrentDiscussion] = useState(null)

    const loadDiscussions = () => {
        getDiscussionList().then(d => {
            setDiscussions(d)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            console.log("discussions loaded")
        })
    }

    const openDiscussion = (uuid) => {
        getDiscussionPost(uuid).then(p => {
            setCurrentDiscussion(p)
            console.log(p)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            console.log("discussion loaded")
        })
    }

    useEffect(() => {
        loadDiscussions()
    }, [])

    if (currentDiscussion !== null) {
        return (
            <div className="container mx-auto">
                <h3>{currentDiscussion.discussion.title}</h3>
                <p>Posted by <a href="#">{currentDiscussion.author.name}</a> on {currentDiscussion.discussion.date.toString()}.</p>
                <hr />
                <div className="container">
                    <div className="card discussion-original-post">
                        <div className="card-body">
                            <p className="card-text">
                                <span><a href="#">{currentDiscussion.author.name}</a></span>
                                <br />
                                {currentDiscussion.discussion.content}
                            </p>
                        </div>
                    </div>
                    {
                        currentDiscussion.replies.map(r => {
                            return (
                                <div className="card discussion-reply">
                                    <div className="card-body">
                                        <p className="card-text">
                                            <span><a href="#">{r.author.name}</a> &middot; {r.date.toString()}</span>
                                            <br />
                                            {r.content}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="container mx-auto">
                <h3>Discussion</h3>
                <hr />
                <div className="container">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Type to search..." aria-describedby="button-search"></input>
                    </div>
                    <br />
                    <div>
                        {
                            discussions.map(d => {
                                return (
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <a href="#" onClick={e => openDiscussion(d.uuid)}>{d.title}</a>
                                                </div>
                                                <div className="col">
                                                    <span>Posted by <a href="#">{d.author.name}</a></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}