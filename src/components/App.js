import React, { Component } from 'react';
import { Button,InputGroup, FormControl, Card} from 'react-bootstrap';
import Web3 from 'web3';
import './App.css';
import TopNav from './Nav';
import {etherRPC, avaxRPC, arbiRPC,wsohmAddress_ether, wsohmAddress_avax,wsohmAddress_arbi, ERC20ABI, indexABI,indexContractAddress, ohmabi, ohm_address} from './config'
import { BsWallet } from 'react-icons/bs';

const etherWeb3    = new Web3(etherRPC);
const avaxWeb3     = new Web3(avaxRPC);
const arbitrumWeb3 = new Web3(arbiRPC);


const etherWShomContract = new etherWeb3.eth.Contract   (ERC20ABI, wsohmAddress_ether)
const avaxWShomContract  = new avaxWeb3.eth.Contract    (ERC20ABI, wsohmAddress_avax)
const arbiWShomContract  = new arbitrumWeb3.eth.Contract(ERC20ABI, wsohmAddress_arbi)
const indexContract      = new etherWeb3.eth.Contract   (indexABI, indexContractAddress)
const ohmContract        = new etherWeb3.eth.Contract   (ohmabi, ohm_address)




class App extends Component {
  constructor(props){
    super(props)
    this.state={
      walletAddress : '',
      etherValue    : 0,
      avaxValue     : 0,
      arbiValue     : 0,
      totalValue    : 0,
      totalWValue   : 0,
      index         : 0,
      totalSohmValue: 0,
      rewardAmount  :0,
      etherwString  : '',
      avaxwString   :'',
      arbiwString     :'',
      totalwString     :'',
      indexString     :'',
      totalSohmString:'',
      rewardratestring : '',
      label : '',
      rewardAmountString : '',
      data :[] 
    }
  }

  async getData(){

    try{
      if (etherWeb3.utils.checkAddressChecksum(this.state.walletAddress) === false){
        alert("please check wallet address")
        return
      }
    }catch(err){
      return
    }

    if(this.state.walletAddress === ''){
      alert("please add wallet address!")
      return
    }
    
    let etherWValue = await etherWShomContract.methods.balanceOf(this.state.walletAddress).call()
    etherWValue =Math.round(etherWValue / 10000000000000) / 100000
    console.log(etherWValue)

    let avaxWValue = await avaxWShomContract.methods.balanceOf(this.state.walletAddress).call()
    avaxWValue = Math.round(avaxWValue  / 10000000000000) / 100000

    let arbiWValue = await arbiWShomContract.methods.balanceOf(this.state.walletAddress).call()
    arbiWValue = Math.round(arbiWValue  / 10000000000000)/ 100000

    let totalWValue = etherWValue + avaxWValue + arbiWValue

    let index =await indexContract.methods.index().call()
    index = Math.round(index/10000) / 100000

    let totalValue = totalWValue * index

    let transferdtoken = await indexContract.methods.epoch().call()
    transferdtoken = transferdtoken.distribute / 1
    

    let staked_first = await ohmContract.methods.balanceOf("0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2").call()
    let staked_second  = await ohmContract.methods.balanceOf("0xFd31c7d00Ca47653c6Ce64Af53c1571f9C36566a").call()

    console.log(staked_first, staked_second)

    let totalSupply = staked_first/ 1 + staked_second / 1



    let currentRate = Math.round(transferdtoken * 1.005/ totalSupply * 100000) / 1000


    let rewardAmount = Math.round(totalValue * currentRate * 10000) / 1000000



    let etherwString = "wsOHM Balance in Ethereum  : " + etherWValue
    let avaxwString =  "wsOHM Balance in Avax      : " + avaxWValue
    let arbiwString =  "wsOHM Balance in Arbitrium : " + arbiWValue
    let totalwString = "Total wsOHM Balance : " + etherWValue
    let indexString = "Index :  " + index
    let totalsohmString = "Total sOHM Balance : " + totalValue

    let rewardratestring = "Reward rate : " + currentRate
    let rewardAmountString  = "Reward Amount  : " + rewardAmount


    this.setState({
      etherValue : etherWValue,
      avaxValue  : avaxWValue,
      arbiValue  :  arbiWValue,
      totalWValue : totalWValue,
      totalValue  : totalValue,
      rewardRate  : currentRate,
      etherwString : etherwString,
      avaxwString : avaxwString,
      arbiwString : arbiwString,
      totalwString : totalwString,
      indexString  : indexString,
      totalsohmString : totalsohmString,
      rewardratestring : rewardratestring,
      rewardAmountString    : rewardAmountString,
      label : "Result"
    })
  }

  render() {
    const handleWalletAddress =  (e) => {
      let addLabel  = e.target.value
      this.setState({
        walletAddress : addLabel
      }) 
    }  
    return (
      <div>
        <TopNav/><br/><br/><br/><br/>
        <div className = "row">
          <div className = "col-1"></div>
          <div className = "col-10">
          <Card  bg="light" >
            <Card.Body>
              <br/><br/>
             <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon3">
              <BsWallet/> &nbsp;&nbsp;&nbsp; Wallet Address
              </InputGroup.Text>
              <FormControl id="basic-url" aria-describedby="basic-addon3" defaultValue = {this.state.walletAddress} onChange={handleWalletAddress}/>
              <Button variant="success"  onClick = {()=>this.getData()}>&nbsp;&nbsp; &nbsp; Get Data &nbsp;&nbsp;&nbsp;</Button>
              </InputGroup>
              <br/><br/>
             </Card.Body>
           </Card>
            <br/><br/>
           <Card  bg="light" >
            <Card.Body>
              <br/>
              <h2>Result:</h2><hr/>
              <h4>{this.state.etherwString}</h4>
              <h4>{this.state.avaxwString}</h4>
              <h4>{this.state.arbiwString}</h4><hr/>
              <h4>{this.state.totalwString}</h4>
              <h4>{this.state.indexString}</h4>
              <h4>{this.state.totalsohmString}</h4><hr/>
              <h4>{this.state.rewardratestring}</h4>
              <h4>{this.state.rewardAmountString}</h4>
              <br/>
              </Card.Body>
           </Card>
          </div>
          <div className = "col-1"></div>
        </div>
      </div>
    );
  }
}

export default App;