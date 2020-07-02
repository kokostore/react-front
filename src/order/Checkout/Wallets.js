import React, { Component } from 'react';
import { getRazorpayOrderId, pay } from "../apiPayments";

class Wallets extends Component{
    constructor(props){
        super(props);
        this.state={
            buttonEnabled:false,
            selectedWallet:null,
        }
    }

    selectedWallet=(event,wallet)=>{
        for(let wallet of Object.keys(this.props.wallets))
            document.getElementById(wallet).style.backgroundColor='inherit'
        this.setState({selectedWallet:wallet,buttonEnabled:true})
        event.target.style.backgroundColor='rgba(0,0,0,0.2)'
    }

    createOrderAndPay=async(event)=>{
        event.preventDefault()
        if(this.state.selectedWallet){
            const sendAmount=this.props.details.amount
            await getRazorpayOrderId(sendAmount)
                .then(async(order)=>{

                    const {amount,currency,notes,id}=order
                    const {email,contact,address}=this.props.details
                    const method= 'wallet';
                    const methodoptions={wallet:this.state.selectedWallet}
                    await pay(amount, currency, email, contact, notes, address, id, method, methodoptions)
                            .then(res=>{
                                this.setState({error:""})
                                console.log(res)
                            }
                            ).catch(err=>{console.log(err);this.setState({error:err.description})})
                    
                })
                .catch(err => this.setState({error:err}));
        }
        else{
            alert('Please select a wallet')
        }
    }

    //go to stage 1
    backButton=(event)=>{
        this.props.prevStage(event)
    }

    render() {
        return(
        <div style={{textAlign:'center',width:'60%',margin:'auto'}}>
            <form id="pay-card">
            <h3>Wallet payment</h3>
                {this.state.error?<div className="alert alert-danger">{this.state.error}</div>:null}
                <h5>Select Wallet</h5>                    
                <div class="list-group">
                    {Object.keys(this.props.wallets).map((wallet)=>
                        <button 
                            type="button" 
                            id={wallet}
                            class="list-group-item list-group-item-action" 
                            onClick={(event)=>this.selectedWallet(event,wallet)} 
                            style={{cursor:'pointer',margin:'1vh'}}
                            >
                                {wallet.toUpperCase()}
                            </button>
                    )}
                </div>
                <div>
                    <button
                        onClick={(event)=>this.backButton(event)}
                        className="btn btn-raised btn-primary"
                        style={{marginRight:'2vw'}}
                        >
                        Back
                    </button>
                    <button
                        onClick={(event)=>this.createOrderAndPay(event)}
                        className="btn btn-raised btn-primary"
                        style={!this.state.buttonEnabled?{backgroundColor:'grey',cursor:'default'}:null}
                        disabled={!this.state.buttonEnabled?true:false}
                        >
                        Pay
                    </button>
                </div>
        </form>
        </div>
        )
    }
}
export default Wallets;