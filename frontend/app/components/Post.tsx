import "./Post.css"
import "../globals.css"
import moment from "moment"

const Post = (props: any) => {

    const formattedTime = moment(props?.time).fromNow()

    return (
        <div className="post">
            <p className="time">{formattedTime}</p>
            <p className="name">{props?.name}</p>
            <h3 className="title">{props?.title}</h3>
            <p className="text">{props?.text}</p>
            <div className="buttons">
                <button onClick={(e) => props.edit(e, props.id)} > Edit</button>
                <button onClick={() => props.del(props.id)} > Delete</button>
            </div>
        </div>
    )
}

export default Post