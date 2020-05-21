import React, { Component } from "react";
import PostCard from '../post/PostCard'

class ProfileTabs extends Component {
    
    render(){
        const {posts, loadingPosts} = this.props;
        let userPosts=null;
        
        if(!loadingPosts){          //first check loading status
            if(posts.length)        //then check if user has any posts
            userPosts=( 
                <div className="row">
                    {posts.map((post, i) => {
                        return (
                            <PostCard post={post} i={i} />
                        );
                    })}
                </div>
            );
            else{
            userPosts=( <div className="jumbotron text-center" style={{fontSize:'2em'}}>
                            You haven't posted anything yet...
                        </div>)
            }
        }
        else{
            userPosts=( <div className="jumbotron text-center" style={{fontSize:'2em'}}>
                            Loading ur posts...
                        </div>)
        }
        return (
                <div>
                    <div className="col-md-12" >
                        <h3 className="text-primary">Posts</h3>
                        <hr/>
                        {userPosts}
                    </div>
                </div>
        );
    }
}

export default ProfileTabs;