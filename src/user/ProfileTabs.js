import React, { Component } from "react";
import DefaultPost from "../images/mountains.jpg";
import {Link} from "react-router-dom";
class ProfileTabs extends Component {

    constructor() {
        super();
        this.state = {
            loading: true
        };
    }

    componentDidMount(){
            this.setState({loading:false})
    }

    render() {
        const {posts} = this.props;
        let userPost;
        if(!this.state.loading)
            {if(this.props.posts.length)
            userPost=(
                <div  className="row">
                {posts.map((post, i) => (
                    <div className="card col-md-3" key={i}>
                            <div className="card-body" style={{textAlign:'center' }}>
                                <img
                                    src={`${
                                        process.env.REACT_APP_API_URL
                                    }/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                    className="img-thumbnail mb-3"
                                    style={{ height: "200px", width: "100%" }}
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text" style={{ height: "100px", width: "100%" }}>
                                    {post.body.length>100?post.body.substring(0, 110)+' ...':post.body.substring(0, 100)}
                                </p>
                                <br />
                                <p className="font-italic mark">
                                    Posted on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )
            else{
                userPost=(<div className="jumbotron text-center" style={{fontSize:'2em'}}>
                You haven't posted anything yet...
            </div>)
            }
        }
        else{
            userPost=(<div className="jumbotron text-center" style={{fontSize:'2em'}}>
                Loading ur posts...
            </div>)
        }
        return (
                <div>
                    <div className="col-md-12" >
                        <h3 className="text-primary">Posts</h3>
                        <hr/>
                        {userPost}
                    </div>
                </div>
        );
    }
}

export default ProfileTabs;