import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";
import { LoaderWithBackDrop } from "../styles/Loader";

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photos: [],
            error: "",
            user: {},
            fileSize: [],
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
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
            let sizes=[],showSelected=[];
            this.postData.delete('photos');
            for(let file=0; file<event.target.files.length;file++){
                    sizes.push(event.target.files[file].size)
                    this.postData.append('photos', event.target.files[file]);
                    showSelected[file]={link:URL.createObjectURL(event.target.files[file])};
                }
            this.setState({photos:showSelected,fileSize:sizes})
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
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData).then(data => {
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

    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photos</label>
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
                Create Post
            </button>
        </form>
    );

    render() {
        const {
            title,
            body,
            user,
            error,
            loading,
            redirectToProfile
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        let displayImgs=[]
        for(let i in this.state.photos){
            displayImgs.push(
                <img
                    style={{ height: "200px", width: "auto" }}
                    className="img-thumbnail"
                    src={`${
                        this.state.photos[i].link
                    }`}
                    alt={title+' image '+i}
                    key={i}
                />
            )
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new post</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? (<LoaderWithBackDrop loading={this.state.loading}/>) : null}
                {displayImgs}
                {this.newPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;
