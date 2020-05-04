import React, { Component } from "react";
import {Link} from "react-router-dom";
class ProfileTabs extends Component {
    
    render() {
        const {posts} = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-primary">Posts</h3>
                        <hr/>
                        {posts.map((post, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/post/${post._id}`}>
                                        <div>
                                            <p className="lead">
                                                {post.title}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;