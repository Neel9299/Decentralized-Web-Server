import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import './App.css';
import Meme from '../abis/Meme.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
//const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  async componentWillMount() {
     await this.loadWeb3()
     await this.loadBlockchainData()
  }


  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if(networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract: contract })
      const memeHash = await contract.methods.get().call()
      const memeHash1 = await contract.methods.get1().call()
      const memeHash2 = await contract.methods.get2().call()
      await this.setState({ memeHash : memeHash })
      await this.setState({ memeHash1 : memeHash1 })
      await this.setState({ memeHash2 : memeHash2 })

    } else {
       window.alert('Smart contract not deployed to detected network!!')
    }
  }
   
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      buffer: null,
      buffer1:null,
      buffer2:null,
      contract: null,
      memeHash: null,
      memeHash1: null,
      memeHash2: null
    };
  }

  async loadWeb3(){
    if (window.ethereum) {
       window.web3 = new Web3(window.ethereum)
       await window.ethereum.enable()
    } if (window.web3) {
       window.web3 = new Web3(window.web3.currentProvider) 
    } else {
      window.alert('Please use metamask')
    }
  }

  captureFile=(event) => {
    event.preventDefault()
    console.log('file captured..')

   //IPFS processing... 
    const file=event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend= () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }
  
  captureFile1=(event) => {
    event.preventDefault()
    console.log('file captured..')

   //IPFS processing... 
    const file=event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend= () => {
      this.setState({ buffer1: Buffer(reader.result) })
    }
  }
  
  captureFile2=(event) => {
    event.preventDefault()
    console.log('file captured..')

   //IPFS processing... 
    const file=event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend= () => {
      this.setState({ buffer2: Buffer(reader.result) })
    }
  }

  onSubmit = (event) => {
   event.preventDefault()
   console.log("submitting the form...")

   const file=ipfs.add(this.state.buffer, (error,result) => {
     console.log('Ipfs result', result)
     if(error) {
        console.error(error)
        return
     }


   }).then(token => { 
       this.state.contract.methods.set(token["path"]).send({ from: this.state.account }).then((r) => {
          console.log("tokenva  "+token);
          this.setState({memeHash:token["path"]}) 
         })
        })
  }
  
  
    onSubmit1 = (event) => {
   event.preventDefault()
   console.log("submitting the form...")

   const file=ipfs.add(this.state.buffer1, (error,result) => {
     console.log('Ipfs result', result)
     if(error) {
        console.error(error)
        return
     }


   }).then(token => { 
       this.state.contract.methods.set1(token["path"]).send({ from: this.state.account }).then((r) => {
          
          this.setState({memeHash1:token["path"]}) 
         })
        })
  }
  
    onSubmit2 = (event) => {
   event.preventDefault()
   console.log("submitting the form...")

   const file=ipfs.add(this.state.buffer2, (error,result) => {
     console.log('Ipfs result', result)
     if(error) {
        console.error(error)
        return
     }


   }).then(token => { 
       this.state.contract.methods.set2(token["path"]).send({ from: this.state.account }).then((r) => {
          
          this.setState({memeHash2:token["path"]}) 
         })
        })
  }

  render() {
  console.log("hash: "+this.state.memeHash);
    console.log("hash1: "+this.state.memeHash1);
      console.log("hash2: "+this.state.memeHash2);
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            
            target="_blank"
            rel="noopener noreferrer"
          >
            <small className="text-white">Decentralized web server</small>
          </a>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul>


        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    
                    
                  {this.state.memeHash != null ? <img src={"http://127.0.0.1:8080/ipfs/"+this.state.memeHash} width="400" height="400"/>:""}
                    
                  
                  
                   {this.state.memeHash1 != null ? <img src={"http://127.0.0.1:8080/ipfs/"+this.state.memeHash1} width="400" height="400"/> : ""}
                   
                    
                  
                   {this.state.memeHash2 != null ? <img src={"http://127.0.0.1:8080/ipfs/"+this.state.memeHash2} width="400" height="400"/> :""}
                  
                </a>
                <p>&nbsp;</p>
                <h2>Upload photo</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile}/> 
                  <input type='submit'/>
                  </form>
                  
                  <form onSubmit={this.onSubmit1} >
                  <input type='file' onChange={this.captureFile1}/> 
                  <input type='submit'/>
                  </form>
                  
                  <form onSubmit={this.onSubmit2} >
                  <input type='file' onChange={this.captureFile2}/> 
                  <input type='submit'/>
                  </form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
