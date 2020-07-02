import React, { Component } from 'react';
import { getRazorpayOrderId,pay } from "../apiPayments";

class UPI extends Component{
    constructor(props){
        super(props);
        this.state={
        buttonEnabled:false,
        vpa:"",
        error:""
        }
    }

    handleChange = (name, event) => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value },async()=>{
        
        // eslint-disable-next-line no-undef
        console.log(this.state.vpa)
        // eslint-disable-next-line no-undef
        await this.razorpay.verifyVpa(this.state.vpa)
        .then(() => {
               this.setState({buttonEnabled:true})
            // VPA is valid
            })
        .catch(() => {
               this.setState({buttonEnabled:false})
            // VPA is invalid
        });
        });
    };
    
    componentDidMount(){
        // eslint-disable-next-line no-undef
        this.razorpay = new Razorpay({
            key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
          });

    }

    createOrderAndPay=async(event)=>{
        event.preventDefault()
        if(this.state.vpa){
            const sendAmount=this.props.details.amount
            await getRazorpayOrderId(sendAmount)
                .then(async(order)=>{

                    const {amount,currency,notes,id}=order
                    const {email,contact,address}=this.props.details
                    const method= 'upi';
                    const methodoptions={
                        upi:
                        {
                        vpa: this.state.vpa,
                        flow: 'collect'
                        }
                    }
                    await pay(amount, currency, email, contact, notes, address, id, method, methodoptions)
                            .then(res=>{
                                this.setState({error:""})
                                console.log(res)
                            }
                            ).catch(err=>{console.log(err);this.setState({error:err.description})})
                })
                .catch(err=>{console.log(err);this.setState({error:err.description})})
            }
    }

    backButton=(event)=>{
        this.props.prevStage(event)
    }
    render() {
        return(
        <div style={{textAlign:'center',width:'60%',margin:'auto'}}>
            <form id="pay-card">
                <h3>Pay using UPI</h3>
                {this.state.error?<div className="alert alert-danger">{this.state.error}</div>:null}
                <div className="form-group">
                <label className="text-muted">Please enter your UPI ID</label>
                    <input
                        onChange={(event)=>{console.log('here');this.handleChange("vpa",event)}}
                        placeholder="username@bank"
                        type="text"
                        className="form-control"
                        value={this.state.vpa}
                        id="card_number"
                    />
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
                        style={!this.state.buttonEnabled?{backgroundColor:'grey'}:null}
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
export default UPI;