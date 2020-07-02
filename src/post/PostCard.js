import React, {useState} from 'react';
import DefaultPost from "../images/mountains.jpg";
import {Link, Redirect} from 'react-router-dom';
import {addItem, updateItem, removeItem} from '../order/cartHelpers';
import * as Icon from 'react-feather';


const PostCard=(props)=> {
    const { post ,i, showAddToCartButton, cartUpdate, showRemoveProductButton}= props;
    const posterId = post.postedBy
                    ? `/user/${post.postedBy._id}`
                    : "";
    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(post.count);


    const addToCart = () => {
        addItem(post, () => {
           setRedirect(true);

        });
    };

    const shouldRedirect = redirect => {
        if(redirect) {
            return <Redirect to="/cart" />
        }
    };   

    const showAddToCartBtn = showAddToCartButton => {
    return (
        showAddToCartButton && (
            <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1 ">
            Add to cart
            </button>
            )
        );
    };

    const showRemoveProductBtn = showRemoveProductButton => {
    return (
        showRemoveProductButton && (
            <button onClick={() => removeItem(post._id)} className="btn btn-outline-warning mt-2 mb-2 card-btn-1 ">
            <Icon.Trash2 />
            </button>
            )
        );
    };

    const handleChange = (postId,operation) => event => {
        let quantity=event.target.parentNode.children[1].innerText
        operation==='add'?quantity++:quantity--
        setCount(quantity < 1 ? 1 : quantity);
        if(quantity >=1) {
            updateItem(postId, quantity);
        }
    };

    const showCartUpdateOptions = cartUpdate => {
        const buttonStyles={
            height:'fit-content',
            width:'5vh',
            cursor:'pointer',
            padding:'0.5vh',
            fontSize:'5vh',
            textAlign:'center',
            lineHeight:'5vh'
        }
        const buttonContainerStyles={
            display:'flex',
            boxSizing:'border-box',
            alignItems:'center',
            fontSize:'3vh',
            maxHeight:'fit-content',
            margin:'auto',
            maxWidth:'fit-content',
            textAlign:'center',
            border:'2px solid black',
            borderRadius:'50px',
        }
        return (
        cartUpdate && (
            <>
                <div >
                    <span className="input-group-text"> Adjust Quantity </span>
                </div> 
                <div style={{...buttonContainerStyles}} >
                    <div style={{...buttonStyles,borderRight:'1px solid black'}} onClick={handleChange(post._id,'reduce')}> - </div>
                        <div style={{width:'5vh'}} id={props.i}>{count}</div>
                    <div style={{...buttonStyles,borderLeft:'1px solid black'}} onClick={handleChange(post._id,'add')}> + </div>
                </div>
            </>
            )
        );
    };

    return(
        <div className={props.parent==='cart'?"card col-md-6":"card col-md-4"} key={i}>
            <div className="card-body">
            {shouldRedirect}
                <img
                    src={post.photos.length?`${post.photos[0].link}`:`${DefaultPost}`}
                    alt={post.title}
                    onError={i =>
                    (i.target.src = `${DefaultPost}`)
                    }
                    className="img-thumbnail mb-3"
                    style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                    {post.body.substring(0, 100)}
                </p>
                <br />
                <p>
                    {post.price}
                </p>
                <br />
                <p className="font-italic mark">
                    Posted by{" "}
                    <Link to={`${posterId}`}>
                        {posterName}{" "}
                    </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <Link
                    to={`/post/${post._id}`}
                    className="btn btn-raised btn-primary btn-sm"
                >
                    Read more  </Link>
                    {showAddToCartBtn(showAddToCartButton)}
                    {showCartUpdateOptions(cartUpdate)}
                    {showRemoveProductBtn(showRemoveProductButton)}
            </div>
        </div>
    )
}

export default PostCard;
