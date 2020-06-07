import React, { Component } from "react";
import { list } from "./apiPost";
import PostCard from './PostCard'
import LazyLoad from 'react-lazyload';
import {PageLoader} from "../styles/Loader";

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                console.log(data)
                this.setState({ posts: data });
            }
        });
    }

    renderPosts = posts => {
        return (
            <LazyLoad>
                <div className="row">
                    {posts.map((post, i) => {
                        return (
                            <PostCard post={post} i={i} />
                            );
                        })}
                </div>
            </LazyLoad>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ?<PageLoader loading={this.state.loading}/>
                                    : "Recent Items"}
                </h2>
                
                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
