import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToProfile: false,
            photos: [],
            error: "",
            loading: false,
            fileSize: [],
            user: {},
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: "",
                    photos:data.photos
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize, photos } = this.state;
        if(photos.length>10){
            this.setState({ error: "Max 10 images can be uploaded in a post. Please select fewer files." , loading: false});
            return false;
        }
        for(let file in fileSize){
            if (fileSize[file] > 100000){
                this.setState({
                    error: "Each file size should be less than 100kb",
                    loading: false
                });
                return false;
            }
        }
        if (title.length === 0) {
            this.setState({ error: "Title is required" , loading: false});
            return false;
        }
        if (body.length === 0) {
            this.setState({ error: "Body is required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        let value; 
        if(name === "photos"){
            if(event.target.files.length){
                let sizes=[],showSelected=[];
                this.postData.delete('photos');
                for(let file=0; file<event.target.files.length;file++){
                        sizes.push(event.target.files[file].size)
                        this.postData.append('photos', event.target.files[file]);
                        showSelected[file]=URL.createObjectURL(event.target.files[file]);
                    }
                this.setState({photos:showSelected,fileSize:sizes})
            }
        }
        else{
            value=event.target.value;
            this.setState({ [name]: value });
            this.postData.set(name, value);
        }
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input
                    onChange={this.handleChange("photos")}
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            title,
            body,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        let displayImgs=[]
        for(let i=0;i<this.state.photos.length;i++){
            displayImgs.push(
                <img
                    style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={`${
                        this.state.photos[i]
                    }`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title+' image '+i}
                    key={i}
                />
            )
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ""
                )}

                {displayImgs}

                {this.editPostForm(title, body)}
            </div>
        );
    }
}

export default EditPost;
