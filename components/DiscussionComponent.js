import { useState, useEffect, useContext } from "react"
import Context from '../context/Context'
import { useFormik } from 'formik'
import { getDiscussionList, getDiscussionPost, addDiscussionPost, addDiscussionReply } from "../data/Discussion"
import UserLinkComponent from "./UserLinkComponent"

/**
 * A discussion component. Contains a list of discussions, an open
 * discussion and a form to add a new discussion.
 * @param {*} props 
 * @returns HTML representation of a discussion list, or an open discussion
 */
export default function DiscussionComponent(props) {
    // Context used: user, toast
    const { user, setToast} = useContext(Context)

    // State representing the list of discussions
    const [discussions, setDiscussions] = useState([])

    // State representing the open discussion, if there is one
    const [currentDiscussion, setCurrentDiscussion] = useState(null)

    // State representing the form for adding a new discussion
    const [posting, setPosting] = useState(false)

    /**
     * Loads and sets the list of discussions
     */
    const loadDiscussions = () => {
        getDiscussionList().then(d => {
            setDiscussions(d)
        }).catch(e => {
            console.log(e)
        })
    }

    /**
     * Opens a discussion based on its id
     * @param {*} uuid 
     */
    const openDiscussion = (uuid) => {
        getDiscussionPost(uuid).then(p => {
            setCurrentDiscussion(p)
        }).catch(e => {
            console.log(e)
        })
    }

    /**
     * Toggles the form for adding a new post
     */
    const togglePostForm = () => {
        setPosting(!posting)
    }

    /**
     * Load the discussions
     */
    useEffect(() => {
        loadDiscussions()
    }, [])

    // Formik form for adding a new discussion
    const postFormik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        validate: values => {
            const errors = {}

            // Check if content is empty
            if (!values.content) {
                errors.content = "Required"
            }

            // Check if title is empty
            if (!values.title) {
                errors.title = "Required"
            }

            return errors
        },
        onSubmit: values => {
            addDiscussionPost(values.title, values.content, user).then(() => {
                // Reload the discussions
                loadDiscussions()

                // Close the form
                togglePostForm()

                setToast({
                    title: "Posted!",
                    message: "Discussion posted successfully."
                })
            })
        }
    })

    // Formik form for adding a new reply
    const responseFormik = useFormik({
        initialValues: {
            content: "",
        },
        validate: values => {
            const errors = {}

            // Check if content is empty
            if (!values.content) {
                errors.content = "Required"
            }

            return errors
        },
        onSubmit: values => {
            // Add the reply
            addDiscussionReply(currentDiscussion.uuid, values.content, user).then(() => {
                // Reload the discussion
                openDiscussion(currentDiscussion.uuid)

                setToast({
                    title: "Posted!",
                    message: "Reply posted successfully."
                })

                values.content = ""
            })
        }
    })

    // Render the list of discussions
    if (currentDiscussion !== null) {
        return (
            <div className="container mx-auto">
                <h3>{currentDiscussion.discussion.title}</h3>
                <p>Posted by <UserLinkComponent uuid={currentDiscussion.author.uuid} name={currentDiscussion.author.name} /> on {currentDiscussion.discussion.date.toString()}. <a href="#" onClick={() => openDiscussion(null)}>Return to discussions.</a></p>
                <hr />
                <div className="container">
                    <div className="card discussion-original-post">
                        <div className="card-body">
                            <p className="card-text">
                                <span><UserLinkComponent uuid={currentDiscussion.author.uuid} name={currentDiscussion.author.name} /></span>
                                <br />
                                {currentDiscussion.discussion.content}
                            </p>
                        </div>
                    </div>
                    {
                        currentDiscussion.replies.map((r, index) => {
                            return (
                                <div className="card discussion-reply" key={index}>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <span><UserLinkComponent uuid={r.author.uuid} name={r.author.name} /> &middot; {r.date.toString()}</span>
                                            <br />
                                            {r.content}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="card discussion-reply">
                        <div className="card-body">
                            <form onSubmit={responseFormik.handleSubmit}>
                                <br />
                                <div className="form-group">
                                    <textarea className="form-control" id="content" name="content" placeholder="Content" value={responseFormik.values.content} onChange={responseFormik.handleChange} />
                                    <div className="text-danger">{responseFormik.errors.content}</div>
                                </div>
                                <br />
                                <div className="button-group" role="group">
                                    <button type="submit" className="btn btn-primary">Post</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        // Render the "new post" form
        let form = (<div className="col-md-12 text-center">
            <button className="btn btn-primary" onClick={togglePostForm}>New Post</button>
        </div>)

        if (posting) {
            form = (
                <div className="container mx-auto">
                    <h3>Discussion</h3>
                    <hr />
                    <div className="container col-md-4 col-md-offset-4">
                        <form onSubmit={postFormik.handleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" id="title" name="title" placeholder="Title" value={postFormik.values.title} onChange={postFormik.handleChange} />
                                <div className="text-danger">{postFormik.errors.title}</div>
                            </div>
                            <br />
                            <div className="form-group">
                                <textarea className="form-control" id="content" name="content" placeholder="Content" value={postFormik.values.content} onChange={postFormik.handleChange} />
                                <div className="text-danger">{postFormik.errors.content}</div>
                            </div>
                            <br />
                            <div className="button-group" role="group">
                                <button type="submit" className="btn btn-primary">Post</button>
                                <button type="button" className="btn btn-secondary" onClick={togglePostForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )

            return form
        }

        // Render the opened discussion
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
                            discussions.map((d, index) => {
                                return (
                                    <div className="card mb-4" key={index}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col">
                                                    <a href="#" onClick={e => openDiscussion(d.uuid)}>{d.title}</a>
                                                </div>
                                                <div className="col">
                                                    <span>Posted by <UserLinkComponent uuid={d.author.uuid} name={d.author.name} /></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <br />
                    {form}
                </div>
            </div>
        )
    }
}