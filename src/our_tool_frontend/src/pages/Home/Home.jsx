import React, { useEffect } from "react";
import "./Home.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { Actor, HttpAgent } from "@dfinity/agent";
import {
  createActor,
  our_tool_backend,
} from "../../../../declarations/our_tool_backend/index";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../utils/useAuthClient";

let backendActor = our_tool_backend;

const Home = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSaveData = async (authClient) => {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    backendActor = createActor(process.env.CANISTER_ID_OUR_TOOL_BACKEND, {
      agent,
    });

    window.identity = identity;
    const principal = identity.getPrincipal();
    window.principal = principal;
    window.principalString = principal.toText();
    let accountId = AccountIdentifier.fromPrincipal({ principal });
    window.accountId = accountId;
    let accountIdString = toHexString(accountId.bytes);
    window.accountIdString = accountIdString;
    window.backendActor = backendActor;
    localStorage.setItem("accountIdString", accountIdString);
    localStorage.setItem("principalString", principalString);
    navigate("/wallet");
  };

  const handleLogin = async () => {
    let authClient = await login();
    handleSaveData(authClient);
    navigate("/wallet");
  };

  const handleRefresh = async () => {
    const authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // set to 30 minutes
        disableDefaultIdleCallback: true, // disable the default reload behavior
      },
    });
    // ...authClient.login()
    if (
      authClient.isAuthenticated() &&
      (await authClient.getIdentity().getPrincipal().isAnonymous()) === false
    ) {
      handleSaveData(authClient);
    } else {
      toast.error("Please authenticate");
    }
  };

  function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
  }

  useEffect(() => {
    if (!window.identity) {
      handleRefresh();
    }
  }, []);

  return (
    <div>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container">
        <div className="z-0 bg-misty-rose opacity-5 top-right rounded-50 svelte-15u1r41"></div>
        <section className="flex flex-col justify-center items-center sm-pt-0 sm-pb-8 relative z-1 svelte-l4oydv">
          <div className="flex justify-center items-center">
            <img
              src="Legatus.jpg"
              role="presentation"
              alt=""
              loading="lazy"
              width="60px"
              height="60px"
              decoding="async"
              className="rounded-50"
            />
            <h2 className="font-bold" style={{ marginLeft: "1rem" }}>
              Leap Pay
            </h2>
          </div>
          <h1
            className="text-center py-4 xs-px-3 sm-px-4 mb-0.25"
            style={{ maxWidth: "600px" }}
          >
            The Leap Pay is a browser-based ICP wallet that is safeguarded by
            the Internet Computer and equipped with networked custody support.
          </h1>
          <p
            className="text-center pb-4 xs-px-3 sm-px-4 mb-0.25"
            style={{ maxWidth: "600px" }}
          >
            The Leap Pay offers a smooth on-chain interface for overseeing your
            ICP assets. By leveraging Web technologies and Advanced
            Cryptography, Leap Pay removes the necessity for browser extensions
            or mobile applications.
          </p>
          <button onClick={handleLogin} className="ic">
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16.5412" cy="16" r="15.6" fill="#F8F6FC"></circle>
              <path
                d="M22.5577 10.1855C21.2496 10.1855 19.8236 10.8559 18.3165 12.1761C17.6015 12.8018 16.984 13.4721 16.5209 14.0083C16.5209 14.0083 16.5209 14.0083 16.525 14.0124V14.0083C16.525 14.0083 17.2562 14.8046 18.0646 15.6577C18.4993 15.1417 19.125 14.4389 19.844 13.8052C21.1846 12.6312 22.058 12.3833 22.5577 12.3833C24.4387 12.3833 25.9661 13.8743 25.9661 15.7064C25.9661 17.5264 24.4346 19.0173 22.5577 19.0295C22.4724 19.0295 22.3627 19.0173 22.2245 18.9889C22.773 19.2245 23.3621 19.3951 23.9227 19.3951C27.3676 19.3951 28.042 17.1486 28.0867 16.9861C28.1883 16.5758 28.2411 16.1452 28.2411 15.7024C28.2411 12.6636 25.6899 10.1855 22.5577 10.1855Z"
                fill="url(#paint0_linear_7_386)"
              ></path>
              <path
                d="M10.5246 21.2375C11.8327 21.2375 13.2586 20.5672 14.7658 19.2469C15.4808 18.6213 16.0983 17.951 16.5613 17.4147C16.5613 17.4147 16.5614 17.4147 16.5573 17.4107V17.4147C16.5573 17.4147 15.8261 16.6185 15.0177 15.7654C14.583 16.2813 13.9574 16.9841 13.2383 17.6178C11.8977 18.7919 11.0243 19.0397 10.5246 19.0397C8.64367 19.0356 7.11618 17.5447 7.11618 15.7125C7.11618 13.8926 8.64773 12.4016 10.5246 12.3895C10.6099 12.3895 10.7196 12.4016 10.8577 12.4301C10.3093 12.1945 9.72022 12.0238 9.1596 12.0238C5.71464 12.0238 5.04433 14.2704 4.99558 14.4288C4.89402 14.8432 4.84121 15.2697 4.84121 15.7125C4.84121 18.7594 7.39243 21.2375 10.5246 21.2375Z"
                fill="url(#paint1_linear_7_386)"
              ></path>
              <path
                d="M23.9143 19.3464C22.1512 19.3017 20.319 17.9123 19.9453 17.567C18.9785 16.6733 16.7481 14.2561 16.5735 14.0652C14.9404 12.233 12.7263 10.1855 10.5245 10.1855H10.5204H10.5163C7.84323 10.1977 5.5967 12.0096 4.99545 14.4268C5.04014 14.2683 5.9217 11.9771 9.15541 12.0583C10.9185 12.103 12.7588 13.5127 13.1366 13.858C14.1035 14.7517 16.3338 17.1689 16.5085 17.3598C18.1416 19.188 20.3556 21.2355 22.5574 21.2355H22.5615H22.5656C25.2387 21.2233 27.4892 19.4114 28.0865 16.9942C28.0377 17.1527 27.1521 19.4236 23.9143 19.3464Z"
                fill="#2CBAF7"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_7_386"
                  x1="19.5992"
                  y1="10.9141"
                  x2="27.3264"
                  y2="18.9159"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.21" stopColor="#FF591E"></stop>
                  <stop offset="0.6841" stopColor="#FBB03B"></stop>
                </linearGradient>
                <linearGradient
                  id="paint1_linear_7_386"
                  x1="13.4831"
                  y1="20.5089"
                  x2="5.75587"
                  y2="12.5071"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.21" stopColor="#ED1E79"></stop>
                  <stop offset="0.8929" stopColor="#8134DC"></stop>
                </linearGradient>
              </defs>
            </svg>
            <span>
              <span>Connect with</span> <span>Internet Identity</span>
            </span>
          </button>
        </section>
        <div className="z-0 bg-misty-rose opacity-5 bottom-left rounded-50 svelte-15u1r41"></div>
      </div>
    </div>
  );
};

export default Home;
