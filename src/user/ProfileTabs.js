import React, { Component } from "react";
import PostCard from '../post/PostCard'
import LazyLoad from 'react-lazyload';
import { ComponentLoader } from "../styles/Loader";

class ProfileTabs extends Component {
    
    render(){
        const {posts, loadingPosts} = this.props;
        let userPosts=null;
        
        if(!loadingPosts){          //first check loading status
            if(posts.length)        //then check if user has any posts
            userPosts=( 
                <LazyLoad>
                    <div className="row">
                        {posts.map((post, i) => {
                            return (
                                <PostCard post={post} i={i} showAddToCartButton={true} cartUpdate={false} showRemoveProductButton={false}/>
                                );
                            })}
                    </div>
                </LazyLoad>
            );
            else{
            userPosts=( <div className="jumbotron text-center" style={{fontSize:'2em'}}>
                            No items yet...
                        </div>)
            }
        }
        else{
            userPosts=( <ComponentLoader loading={true}/>)
        }
        return (
                <div>
                    <div className="col-md-12" >
                        <h3 className="text-primary">Items</h3>
                        <hr/>
                        {userPosts}
                    </div>
                </div>
        );
    }
}

export default ProfileTabs;
