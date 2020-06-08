import React, { Component } from "react";
import { singlePost, remove } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { PageLoader } from "../styles/Loader";

class SinglePost extends Component {
    state = {
        post: "",
        redirectToHome: false
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ post: data });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                this.redirectBackHandler()
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm(
            "Are you sure you want to delete the post?"
        );
        if (answer) {
            this.deletePost();
        }
    };

    redirectBackHandler=()=>{
        if(this.props.history.length>1)
            this.props.history.goBack()
        else
            this.setState({redirectToHome:true})
    }

    renderPost = post => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
        let postImgs=[]
        let indicators=[]
        for(let i=1;i<post.photos.length;i++){
            postImgs.push(
                <div className="carousel-item" key={i}
                     style={{width:'450px',height: "500px", backgroundColor:'rgba(0,0,0,0.3)'}}>
                <img className="d-block w-100"
                        src={`${post.photos.length?
                        post.photos[i].link:`${DefaultPost}`
                        }`}
                        alt={post.title}
                        onError={i => (i.target.src = `${DefaultPost}`)}
                        style={{height: "500px"}}
                    />
            </div>)
            indicators.push(
                <li data-target="#carouselExampleIndicators" 
                    data-slide-to={i} 
                    style={{
                        cursor:'pointer',
                        height: "50px",
                        width: "50px",
                        background:`url(${post.photos.length?post.photos[i].link:DefaultPost})`,
                        backgroundRepeat:'no-repeat',
                        backgroundPosition:'center',
                        backgroundSize:'45px 45px',
                        backgroundColor:'rgba(255,255,255,0.5)'
                        }}>
                </li>
            )
        }
        let carousal=(
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-touch="true" 
                style={{width:'450px',height: "500px",margin:'auto'}}>
                <ol className="carousel-indicators" >
                    <li data-target="#carouselExampleIndicators" 
                        data-slide-to="0" 
                        className="active" 
                        style={{
                            cursor:'pointer',
                            height: "50px",
                            width: "50px",
                            background:`url(${post.photos.length?post.photos[0].link:DefaultPost})`,
                            backgroundRepeat:'no-repeat',
                            backgroundPosition:'center',
                            backgroundSize:'45px 45px',
                            backgroundColor:'rgba(255,255,255,0.5)'
                            }}>
                    </li>
                    {indicators}
                </ol>
                    <div className="carousel-inner" style={{
                        }}>
                        <div className="carousel-item active" style={{backgroundColor:'rgba(0,0,0,0.3)'}}>
                        <img className="d-block w-100"
                                src={`${post.photos.length?
                                 post.photos[0].link:`${DefaultPost}`
                                }`}
                                alt={post.title}
                                onError={i => (i.target.src = `${DefaultPost}`)}
                                style={{height: "500px"}}
                            />
                        </div>
                    {postImgs} 
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        )
        
        return (
            <div className="card-body">
                {carousal}
                <p className="card-text">{post.body}</p>
                <br />
                <p className="font-italic mark">
                    Posted by <Link to={`${posterId}`}>{posterName} </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link onClick={this.redirectBackHandler} className="btn btn-raised btn-primary btn-sm mr-5">
                        Back to posts
                    </Link>
                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && 
                    <>
                    <Link post={post} to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5">
                        Update Post
                    </Link>

                    <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                        Delete Post
                    </button>
                    </>
                    }
                </div>
            </div>
        );
    };
    
    render() {
        if (this.state.redirectToHome) {
            return <Redirect to={`/`} />;
        }
        const { post } = this.state;
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5" >{post.title}</h2>
                {!post ? (<PageLoader loading={this.state.loading}/>) : (this.renderPost(post))}
            </div>
        );
    }
}

export default SinglePost;
