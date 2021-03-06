import { useState, useEffect, useContext } from "react"
import Context from '../context/Context'
import { useFormik } from 'formik'
import { getDiscussionList, getDiscussionPost, addDiscussionPost, addDiscussionReply } from "../data/Discussion"
import UserLinkComponent from "./UserLinkComponent"

export default function DiscussionComponent(props) {
    const { user, setToast} = useContext(Context)
    const [discussions, setDiscussions] = useState([])
    const [currentDiscussion, setCurrentDiscussion] = useState(null)
    const [posting, setPosting] = useState(false)

    const loadDiscussions = () => {
        getDiscussionList().then(d => {
            setDiscussions(d)
        }).catch(e => {
            console.log(e)
        })
    }

    const openDiscussion = (uuid) => {
        getDiscussionPost(uuid).then(p => {
            setCurrentDiscussion(p)
        }).catch(e => {
            console.log(e)
        })
    }

    const togglePostForm = () => {
        setPosting(!posting)
    }

    useEffect(() => {
        loadDiscussions()
    }, [])

    const postFormik = useFormik({
        initialValues: {
            title: "",
            content: "",
        },
        validate: values => {
            const errors = {}

            if (!values.content) {
                errors.content = "Required"
            }

            if (!values.title) {
                errors.title = "Required"
            }

            return errors
        },
        onSubmit: values => {
            addDiscussionPost(values.title, values.content, user).then(() => {
                loadDiscussions()
                togglePostForm()

                setToast({
                    title: "Posted!",
                    message: "Discussion posted successfully."
                })
            })
        }
    })

    const responseFormik = useFormik({
        initialValues: {
            content: "",
        },
        validate: values => {
            const errors = {}

            if (!values.content) {
                errors.content = "Required"
            }

            return errors
        },
        onSubmit: values => {
            addDiscussionReply(currentDiscussion.uuid, values.content, user).then(() => {
                openDiscussion(currentDiscussion.uuid)

                setToast({
                    title: "Posted!",
                    message: "Reply posted successfully."
                })

                values.content = ""
            })
        }
    })

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