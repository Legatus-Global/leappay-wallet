import React, { useEffect, useState } from "react";
import "./Wallet.css";
import { FiArrowUpRight, FiArrowDown, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Header2 from "../Header/Header2";
import Article from "../Article/Article";
import Mains from "../Mains/Mains";


function Wallet({ updateRoute }) {

  const navigate = useNavigate();
  useEffect(() => {

    updateRoute(window.location.pathname)
    if (!window.identity) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="hero svelte-bnd0rw">
        <Header2 />
        <Article />
      </div>
      <Mains />
    </>
  );
}

export default Wallet;
