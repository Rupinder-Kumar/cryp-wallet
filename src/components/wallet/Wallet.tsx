import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import { FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./Wallet.css";

const Wallet: React.FC = () => {
  const [address, setAddress] = useState<string>("");

  const connectWallet = async (): Promise<void> => {
    try {
      // Check if MetaMask is installed else throw toast exception
      if (!window.ethereum) {
        toast.error("MetaMask is not installed");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      setAddress(walletAddress);
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };

  const copyAddress = async (): Promise<void> => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy address");
    }
  };
  return (
    <div className="wallet-container">
      {!address ? (
        <button className="cta-button" onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <div className="wallet-address">
          <span
            className="address"
            onClick={copyAddress}
            title="Copy wallet address"
          >
            {address}
          </span>

          <FiCopy
            className="copy-icon"
            size={18}
            onClick={copyAddress}
            title="Copy wallet address"
          />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Wallet;
