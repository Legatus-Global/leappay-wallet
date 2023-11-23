import React, { useEffect, useState } from "react";
import "./Send.css";
import Header2 from "../Header/Header2";
import Article2 from "../Article/Article2";
import { useNavigate } from "react-router-dom";
import Transaction from "../Transaction/Transaction";


const Send = ({ updateRoute }) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleScanQR = () => {
    // Implement QR scanning logic here
    console.log("Scan QR");
  };

  const handleSend = () => {
    // Implement send logic here
    console.log("Send", address, amount);
  };

  useEffect(() => {
    updateRoute(window.location.pathname)
    if (!window.identity) {
      navigate("/");
    }
  }, []);

  const [isReload, setIsReload] = useState(false);
  const reloadFunction = () => {
    setIsReload(!isReload);
  }

  return (<>
    <div className="hero svelte-bnd0rw">
      <Header2 />
      <Article2 reloadFunction={reloadFunction} isReload={isReload} />
    </div>
    <Transaction isReload={isReload} />
  </>
    // <div className="send-page">
    //   <input
    //     type="text"
    //     placeholder="Wallet Address"
    //     value={address}
    //     onChange={(e) => setAddress(e.target.value)}
    //   />
    //   <input
    //     type="number"
    //     placeholder="Amount"
    //     value={amount}
    //     onChange={(e) => setAmount(e.target.value)}
    //   />
    //   <button onClick={handleScanQR}>Scan QR</button>
    //   <button onClick={handleSend}>Send</button>
    // </div>
  );
};

export default Send;
