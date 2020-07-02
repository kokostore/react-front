import React, { Component } from 'react';
import { getRazorpayOrderId, pay} from "../apiPayments";
class NetBanking extends Component{
    constructor(props){
        super(props);
        this.state={
            buttonEnabled:false,
            selectedBank:null,
            order:null,
            contact:this.props.phone,
            error:"",
            razorpayDetails:null
        }
    }
    bankSelected=(event)=>{
        const{banks}=this.props
        const selectedBank=Object.keys(banks).find(key => banks[key] === event.target.innerText);
        this.setState({selectedBank:selectedBank,buttonEnabled:true})
    }

    createOrderAndPay=async(event)=>{
        event.preventDefault()
        if(this.state.selectedBank){
            const sendAmount=this.props.details.amount
            await getRazorpayOrderId(sendAmount)
                .then(async(order)=>{

                    const {amount,currency,notes,id}=order
                    const {email,contact,address}=this.props.details
                    const method= 'netbanking';
                    const methodoptions={bank:this.state.selectedBank}
                    await pay(amount, currency, email, contact, notes, address, id, method, methodoptions)
                            .then(res=>{
                                this.setState({error:""})
                                console.log(res)
                            }
                            ).catch(err=>{console.log(err);this.setState({error:err.description})})
                    })
                .catch(err => {console.log(err);this.setState({error:err.description})});
            }
        else{
            alert('Please select a bank')
        }
    }

    //go to stage 1
    backButton=(event)=>{
        this.props.prevStage(event)
    }
    
    render() {
        const {banks}=this.props
        return(
        <div style={{textAlign:'center'}}>
            <form >
                <h3>Net Banking</h3>
                    {this.state.error?<div className="alert alert-danger">{this.state.error}</div>:null}
                    <h6>Select Bank</h6>
                    <div style={{display:'flex',flexWrap:'wrap'}}>
                      {
                        this.props.majorBanks.map(bank=>(
                          <div  className="card col-lg-3" style={{margin:'1vh 1vw',textAlign:'center'}}>
                            <div className="card-body">
                              {bank}
                            </div>
                          </div>
                        ))
                      }              
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-secondary btn-lg dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.selectedBank?banks[Object.keys(banks).find(key => key === this.state.selectedBank)]:'Select a different bank'}
                        </button>
                        <div className="dropdown-menu" style={{height:'60vh',overflow:'hidden scroll'}}>
                            {
                            Object.values(banks).map((bank)=>(
                                // <li class="list-group-item">{bank}</li>
                                <button className="dropdown-item" id={bank} type="button" onClick={(event)=>this.bankSelected(event)}>{bank}</button>
                            ))
                            }

                        </div>
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
export default NetBanking;