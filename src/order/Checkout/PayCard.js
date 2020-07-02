import React, { Component } from 'react';
import { getRazorpayOrderId,pay } from "../apiPayments";

class PayCard extends Component{
  constructor(props){
    super(props);
    console.log(this.props)
    this.state={
      buttonEnabled:false,
      card_number:"",
      card_name:"",
      card_cvv:"",
      card_expiry:"",
      amount:null,
      email:"",
      contact:"",
      error:""
      // card_type:"",
      // card_valid:"",
    }
  }

    handleChange = (name,event) => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value },()=>{
            if(this.state.card_cvv && document.getElementById('card_expiry').value  && document.getElementById('card_number').value && this.state.card_name)
                this.setState({buttonEnabled:true})
            else
                this.setState({buttonEnabled:false})
        });
    };

    createOrderAndPay=async(event)=>{
        event.preventDefault()
        if(this.state.buttonEnabled){
            const sendAmount=this.props.details.amount
            await getRazorpayOrderId(sendAmount)
                .then(async(order)=>{

                    const {amount,currency,notes,id}=order
                    const {email,contact,address}=this.props.details
                    const method= 'card';
                    const methodoptions={
                        'card[name]': this.state.card_name,
                        'card[number]': document.getElementById('card_number').value,
                        'card[cvv]': this.state.card_cvv,
                        'card[expiry_month]': parseInt(document.getElementById('card_expiry').value.substring(0,2)),
                        'card[expiry_year]': parseInt(document.getElementById('card_expiry').value.substring(5,7))
                    }

                    //make the payment
                    await pay(amount, currency, email, contact, notes, address, id, method, methodoptions)
                            .then(res=>{
                                this.setState({error:""})
                                console.log(res)
                            }
                            ).catch(err=>{console.log(err);this.setState({error:err.description})})
                        
                })
                .catch(err => {console.log(err);this.setState({error:err})});
        }
        else{
        alert('Please fill valid card details')
        }

        }

    //go to stage 1
    backButton=(event)=>{
        this.props.prevStage(event)
    }
    componentDidMount(){
        const {amount, email,contact}=this.props.details
        this.setState({amount,email,contact})

        var getEl = document.getElementById.bind(document);
        // eslint-disable-next-line no-undef
        var formatter = Razorpay.setFormatter(getEl('pay-card'));
        var cvvField = getEl('card_cvv');
        
        formatter.add('card', getEl('card_number'))
          .on('network', function(o) {
        
            var type = this.type; // e.g. 'visa'
      
          // set length of cvv element based on amex card
        var cvvlen = type === 'amex' ? 4 : 3;
        cvvField.maxLength = cvvlen;
        cvvField.pattern = '^[0-9]{' + cvvlen + '}$';
    
        getEl('card_type').innerHTML = type;
        })
        .on('change', function() {
            var isValid = this.isValid();
            getEl('card_valid').innerHTML = isValid ?()=> {console.log('valid');return 'valid'} : 'invalid';
            
            // automatically focus next field if card number is valid and filled
            if (isValid && this.el.value.length === this.caretPosition) {
            getEl('card_expiry').focus();
            }
        })
        
        formatter.add('expiry', getEl('card_expiry'))
            .on('change', function() {
            var isValid = this.isValid();
            getEl('expiry_valid').innerHTML = isValid ? 'valid' : 'invalid';
            
            // automatically focus next field if card number is valid and filled
            if (isValid && this.el.value.length === this.caretPosition) {
            getEl('card_cvv').focus();
            }
        })  
    }


    render() {
        return(
        <div style={{textAlign:'center',width:'60%',margin:'auto'}}>
            <form id="pay-card">
                <h3>Card Payment</h3>
                {this.state.error?<div className="alert alert-danger">{this.state.error}</div>:null}
                <div className="form-group">
                    <div>
                    <label className="text-muted">Card Number</label>
                    <input
                        onChange={(event)=>{console.log('here');this.handleChange("card_number",event)}}
                        placeholder=""
                        type="text"
                        className="form-control"
                        // value={this.state.card_number}
                        id="card_number"
                    />
                    <span id="card_type"></span>
                    </div>
                    <label className="text-muted">Expiry</label>
                    <input
                        id="card_expiry"
                        onChange={(event)=>this.handleChange("card_expiry",event)}
                        placeholder="MM/YY"
                        type="text"
                        className="form-control"
                        // value={this.state.card_expiry}
                    />
                    <label className="text-muted">CVV</label>
                    <input
                        id="card_cvv"
                        onChange={(event)=>this.handleChange("card_cvv",event)}
                        placeholder="XXX"
                        type="password"
                        className="form-control"
                        // value={this.state.card_cvv}
                    />
                    <label className="text-muted">Cardholder's Name</label>
                    <input
                        onChange={(event)=>this.handleChange("card_name",event)}
                        placeholder="Name"
                        type="text"
                        className="form-control"
                        // value={this.state.card_name}
                        id="card_name"

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
                        onClick={this.createOrderAndPay}
                        className="btn btn-raised btn-primary"
                        style={ !this.state.buttonEnabled?{backgroundColor:'grey',cursor:'default'}:null}
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
export default PayCard;