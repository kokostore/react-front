import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";
import { LoaderWithBackDrop } from "../styles/Loader";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            price: 0,
            redirectToProfile: false,
            photos: [],
            error: "",
            loading: false,
            fileSize: [],
            user: {},
            numbExistingPics:0,
            removeImgs:[],
            newImgs:[]
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
                    photos:data.photos,
                    numbExistingPics:data.photos.length,
                    price: data.price
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
        const { title, body, fileSize, price, photos } = this.state;
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
        if (price < 0) {
            this.setState({ error: "Price should be greater than zero", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        let value; 
        if(name === "photos"){
            if(event.target.files.length){
                let sizes=[],showSelected=[...this.state.photos],selectedNewImgs=[];
                for(let file=0; file<event.target.files.length;file++){
                        sizes.push(event.target.files[file].size)
                        selectedNewImgs.push(event.target.files[file]);
                        showSelected.push({link:URL.createObjectURL(event.target.files[file])});
                    }
                this.setState({photos:showSelected,fileSize:sizes,newImgs:selectedNewImgs})
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

        //only append imgs not removed by user (value at removed indices is null) 
        for(let img of this.state.newImgs){
            if(img)
                this.postData.append('photos',img);
        }
        this.postData.append("removeImgs",this.state.removeImgs)

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
                        photos:[],
                        fileSize:[],
                        price: 0,
                        redirectToProfile: true
                    });
                }
            });
        }
    };
    removeImgHandler=(event)=>{
        //capture the index(id) of image to be removed 
        const delIndex=event.target.parentNode.getAttribute('id')

        //if image to be removed already exists in DB, add it to 'removeImgs' to be passed to backend
        if(delIndex<this.state.numbExistingPics){
            let delImgs=[...this.state.removeImgs]
            delImgs.push(delIndex)
            this.setState({removeImgs:delImgs})
        }
        //if currently uploaded image is to be removed, simply make value at its index null
        else{
            let modifyNewImgs=[]
            modifyNewImgs=[...this.state.newImgs]
            modifyNewImgs[delIndex-this.state.numbExistingPics]=null    
            this.setState({newImgs:modifyNewImgs}) 
        }

        //remove img to be deleted from display 
        event.target.parentNode.remove()
    }
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

            <div className="form-group">
                <label className="text-muted">Price</label>
                <textarea
                    onChange={this.handleChange("price")}
                    type="number"
                    className="form-control"
                    value={this.state.price}
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
            price,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        let displayImgs=[]
        if(this.state.photos.length)
        for(let i=0;i<this.state.photos.length;i++){
            displayImgs.push(
                <div style={{display:'flex',flexFlow:'column',alignItems:'flex-end',cursor:'pointer'}} id={i} key={i}>
                    <div onClick={this.removeImgHandler}>X</div>
                    <img
                        style={{ height: "200px", width: "auto" }}
                        className="img-thumbnail"
                        src={`${this.state.photos.length?
                            this.state.photos[i].link:`${DefaultPost}`
                        }`}
                        onError={i => (i.target.src = `${DefaultPost}`)}
                        alt={title+' image '+i}
                    />
                </div>
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

                {loading ? (<LoaderWithBackDrop loading={this.state.loading} />) : null}
                <div style={{display:'flex'}}>
                    {displayImgs}
                </div>

                {this.editPostForm(title, body, price)}
            </div>
        );
    }
}

export default EditPost;
