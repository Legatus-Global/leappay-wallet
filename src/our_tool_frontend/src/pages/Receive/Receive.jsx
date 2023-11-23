import React from "react";
import "./Receive.css";

const Receive = () => {
  const walletAddress = "Your_Wallet_Address"; // Replace with actual wallet address

  return (
    <div className="receive-page">
      {/* <QRCode value={walletAddress} /> */}
      <p>Show QR Code for: {walletAddress}</p>
    </div>
  );
};

export default Receive;
