import React from 'react';
import SyncLoader from "react-spinners/SyncLoader";

const PageLoader=(props)=>{
    const loaderStyling={
        position:'fixed',
        top:'50vh',
        left:window.innerWidth>500?'45vw':'20vw',
        width:'fit-content',
        zIndex:'99999'
    }
    return(
        <SyncLoader {...props}
            css={loaderStyling}
            size={50}
            color={"#009688"}
            /> 
    )
}
const ComponentLoader=(props)=>{
    const loaderStyling={
        position:'relative',
        top:'8vh',
        left:window.innerWidth>500?'30vw':'20vw',
        width:'fit-content',
        zIndex:'99999'
    }
    return(
        <SyncLoader {...props}
            css={loaderStyling}
            size={50}
            color={"#009688"}
            /> 
    )
}

const LoaderWithBackDrop=(props)=>{
    const loaderStyling={
        position:'fixed',
        top:'50vh',
        left:window.innerWidth>500?'45vw':'20vw',
        width:'fit-content',
        zIndex:'99999'
    }
    return (
        <div style={{height:'100vh',position:'fixed',top:'0',left:'0',width:'100vw',backgroundColor:'rgba(0,0,0,0.2)',zIndex:'9999'}}>
             <SyncLoader {...props}
            css={loaderStyling}
            size={50}
            color={"#009688"}
            /> 
        </div>
    )
}


export {PageLoader,ComponentLoader, LoaderWithBackDrop}