import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(null);
  const [allWaves, setAllWaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("");

  const contractAddress = "0x6DDa7B69b472613421B8A7e6Fc38880e2072c76F";

  const contractABI = abi.abi;

  const handleChange = (e) => setMessage(e.target.value);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getTotalWaves()
    } catch (error) {
      console.log(error)
    }
  }
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("------ contractABI ------")
        console.log(contractABI)
        console.log("------ signer ------")
        console.log(signer)
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        console.log(this)
        
        /*
        * Execute the actual wave from your smart contract
        */
        if(!message.isEmpty){
          alert("Please write a message!");
          return
        }
        const waveTxn = await wavePortalContract.wave(message)
        console.log("Mining...", waveTxn.hash);
        setIsLoading(true)
        
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        getTotalWaves()
        setIsLoading(false)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalWaves = async () => {
    try {
      // @ts-ignore
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log('COUNT', count);
        setTotalWaves(count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // HACK: Reactの書き方知らないのでとりあえずこれ
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        {!isLoading && (
          <div className="header">
            👋 Wave Contract on Ethereum Blockchain
          </div>
        )}
        
        {!isLoading && (
        <div className="bio">
         Connect your Ethereum wallet and wave at me!
        </div>
        )}
        
        {!isLoading && (
        <p className="totalWaves">
          {totalWaves === null
            ? 'Waiting for waves'
            : // @ts-ignore
              'Total waves: ' + totalWaves.toNumber()}
        </p>
        )}
        {!isLoading && (
        <div>
          <p>Write your message</p>
          <input type="text" value={message} onChange={handleChange}/>
          <br></br>
          <button className="waveButton" onClick={wave}>
              Wave at Me
          </button>
        </div>
        )}

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {isLoading && (
          <div className="loaderDiv">
            <p>Mining...</p>
            <p className="loader"></p>
          </div>
        )}
        {!isLoading && allWaves &&(
          <h2 style={{ marginTop: "30px", padding: "8px" }}>Waves</h2>
        )}
        {!isLoading && allWaves.map((wave, index) => {
          return (
            <div>
              <p>Wave{index+1}</p>
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "0px", padding: "8px" }}>
                <div>Waver address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            </div>
            )
        })}
    </div>
  </div>
  );
}

export default App