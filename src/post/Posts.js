import React, { Component } from "react";
import { list } from "./apiPost";
import PostCard from './PostCard'

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
                this.setState({ posts: data });
            }
        });
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    return (
                        <PostCard post={post} i={i} />
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "Loading..." : "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
