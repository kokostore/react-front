import React,{Component} from 'react';
import {isAuthenticated} from '../../auth/index'
import NetBanking from './NetBanking';
import PayCard from './PayCard';
import Wallets from './Wallets';
import UPI from './UPI';

class Pay extends Component {
    constructor() {
        super();
        this.state = {
            contact: null,
            email:"",
            address:"",
            amount:null,
            error: "",
            payOptions:null,
            selectedPayOption:null,
            stage:1,
            buttonEnabled:false,
            paymethod:null
        };
}  
    componentDidMount(){
        // eslint-disable-next-line no-undef
        const razorpay = new Razorpay({
            key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
        });
        razorpay.once('ready', (response)=>{
            console.log(response.methods);
            this.setState({payOptions:response.methods})
        })
    
        const user=isAuthenticated().user
        this.setState({amount:this.props.details.amount,email:user.email})
        
        }
    
    prevStage=event=>{
        event.preventDefault()
        this.setState({stage:this.state.stage-1})
    }

    //go to stage 2
    nextStage=(event)=>{
        event.preventDefault()
        if(this.state.buttonEnabled)
            this.setState({stage:this.state.stage+1}) 
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value },()=>{
            if(this.state.selectedPayOption && this.state.contact && this.state.address)
            {this.setState({buttonEnabled:true}); }
            else{
                if(this.state.buttonEnabled)
                    this.setState({buttonEnabled:false})
            }
        });        
    };

    backButton=(event)=>{
        event.preventDefault()
        this.setState({stage:this.state.stage-1})
        }
    
    //Render the payment options
    paymentMethods=()=>{
        const methodOptions=(mthd)=>{
            if(this.state.contact && this.state.address)
                {this.setState({buttonEnabled:true}); }
            this.setState({selectedPayOption:mthd})
            for(let method of methodsArr)
            document.getElementById(method).style.backgroundColor='inherit'
            document.getElementById(mthd).style.backgroundColor='rgba(0,0,0,0.2)'           //(need a better way to highlight selected payment option)
        }
        const methodsArr=['Card','Net Banking','Wallet','UPI'] 
        const methods=
        (<div>
            <div style={{display:'flex',flexWrap:'wrap'}}>
            {methodsArr.map(mthd=>
                <div className="card col-md-5"
                    style={{cursor:'pointer',margin:'2vh auto',padding:'0',textAlign:'center'}}
                    key={methodsArr.indexOf(mthd)}
                    >
                <div className="card-body" id={mthd} onClick={()=>methodOptions(mthd)}>
                    {mthd}
                </div>
                </div>
            )}  
            </div>
        </div>) 
        return methods;
        }
    
    paymentsForm=()=>{
        const { contact, address } = this.state;
        if(this.state.stage===1)
        return(
        <div style={{margin:'3vh 3vw'}}>
            <div className="jumbotron">
            <h3>Dhanyavad! Keep shopping and make us #Rich..</h3>
            </div>
            <form>
                <div className="form-group">
                    <label className="text-muted">Phone</label>
                    <input
                        onChange={this.handleChange("contact")}
                        type="text"
                        className="form-control"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        placeholder="XXXXXXXXXX"
                        value={contact}
                    />
                </div>
                <div className="form-group">
                    <label className="text-muted">Shipping Address</label>
                    <textarea
                        onChange={this.handleChange("address")}
                        className="form-control"
                        value={address}
                    />
                </div>
                <h3>Select a payment Method</h3>
                {this.paymentMethods()}
                <div style={{textAlign:'center'}}>
                    <button
                        onClick={(event)=>this.props.back(event)}
                        className="btn btn-raised btn-primary"
                        style={{marginRight:'1vw'}}
                    >
                    Back
                    </button>
                    <button
                        onClick={(event)=>this.nextStage(event)}
                        className="btn btn-raised btn-primary"
                        style={ !this.state.buttonEnabled?{backgroundColor:'grey',cursor:'default'}:null}
                        disabled={!this.state.buttonEnabled?true:false}
                    >
                    Next
                    </button>
                </div>
            </form>
        </div>
        )
    else if(this.state.stage===2)                   //render options of payment option selected in stage 1
    {
        switch(this.state.selectedPayOption){
        case 'Card':{
            return(<PayCard prevStage={this.prevStage} details={this.state}/>)
            }
        case 'Net Banking':{
            const banks = this.state.payOptions.netbanking
            const majorBanks=['SBI','Kotak','HDFC','ICICI','Axis','Yes']
                return(
                    <NetBanking prevStage={this.prevStage} banks={banks} majorBanks={majorBanks} next={this.state.stage} details={this.state}/>
                )}
        case 'Wallet':{
                return(
                    <Wallets prevStage={this.prevStage} wallets={this.state.payOptions.wallet} details={this.state}/>
            )}
        case 'UPI':{
                return(
                    <UPI prevStage={this.prevStage}  details={this.state}/>
            )}
        default: return alert('Please select a payment method ')
        }
        
    }
    else{
        return(<div>Where to go next? :( </div>)        //post payment stage
    }
    
    }
    
render(){
    return (
        this.paymentsForm()
        )
    }
}

export default Pay;
