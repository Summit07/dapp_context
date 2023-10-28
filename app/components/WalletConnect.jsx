"use client";
import React from "react";
import Web3 from "web3";
import twitterAbi from "../contract/tweeter.json";
import profileAbi from "../contract/profile.json";
import { ethers } from "ethers";
import { useEffect, useState, createContext } from "react";

const twitterContratAddress = "0xb181f9a0fe9dec81656307acb53bcf6c5d13ae65";
const profileContractAddress = "0x85b70c96c58a68c79722208b738b2bb258b24e0a";

const Connect = () => {
  const [data, setData] = useState(false);
  const [tweet, setTweet] = useState(false);
  const [name, setName] = useState(false);
  const [bio, setBio] = useState(false);
  const [account, setAccount] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [profileContract, setProfileContract] = useState(null);
  const [tweeterContract, setTweeterContract] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new Web3(
        //   Web3.givenProvider || "https://sepolia.infura.io/v3/"
        // );
        // setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }
  async function execute() {
    if (typeof window.ethereum !== "undefined") {
      // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

      const tempWeb3 = new Web3(window.ethereum);
      const acc = await tempWeb3.eth.getAccounts();
      setAccount(acc[0]);
      console.log("Account", acc[0]);
      const profileInstance = new tempWeb3.eth.Contract(
        profileAbi,
        profileContractAddress
      );
      setProfileContract(profileInstance);

      const tweeterInstance = new tempWeb3.eth.Contract(
        twitterAbi,
        twitterContratAddress
      );
      setTweeterContract(tweeterInstance);
    } else {
      console.log("Please install MetaMask");
    }
  }

  async function getProfile() {
    const profile = await profileContract.methods.getProfile(account).call();
    let getTweet = await tweeterContract.methods.getAllTweets(account).call();
    // getProfile();
    console.log(
      getTweet[0].timestamp,
      getTweet[0].likes,
      getTweet[0].content,
      getTweet[0].id
    );
    setTweet(getTweet[0]);
    setData(profile);
  }

  async function handelsubmit(e) {
    e.preventDefault();
    console.log(name, bio, account);
    let id = ethers.formatEther(bio);
    console.log(id, bio);
    await tweeterContract.methods.createTweet(name).send({ from: account });
  }

  return (
    <div>
      {" "}
      {hasMetamask ? (
        isConnected ? (
          "Connected! "
        ) : (
          <button
            onClick={() => connect()}
            className="bg-cyan-400 p-2 rounded-xl px-4"
          >
            Connect to Wallet
          </button>
        )
      ) : (
        "Please install metamask"
      )}
      {isConnected ? (
        <>
          <button
            onClick={() => execute()}
            className="bg-orange-500 p-2 px-4 rounded-xl m-2"
          >
            Execute
          </button>
          <button
            onClick={() => getProfile()}
            className="bg-teal-500 p-2 px-4 rounded-xl m-2"
          >
            Display name
          </button>
          <div className=" w-full p-4 text-black">
            Connected to :- {account}
          </div>
          <div className=" w-full p-4 text-black">{data?.displayName}</div>
          <div className=" w-full p-4 text-black">{data?.bio}</div>
          <div className=" w-full p-4 text-black">{tweet?.content}</div>
          <div className=" w-full p-4 text-black bg-red-400">
            {tweet?.likes?.toString()}
          </div>
          <div className=" w-full p-4 text-black bg-yellow-400">
            {tweet?.timestamp?.toString()}
          </div>
          <form onSubmit={handelsubmit}>
            <label>Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              name="name"
              required
            />
            <label>Bio</label>
            <input
              type="number"
              onChange={(e) => setBio(e.target.value)}
              name="bio"
              required
            />
            <button className="bg-teal-500 p-2 px-4 rounded-xl m-2">
              Submit
            </button>
          </form>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Connect;
