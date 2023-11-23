import React, { useState, useEffect, useRef } from "react";
import "../Article/Article.css";
import "./TokenModal.css";
import QrReader from "react-qr-scanner";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import { getValueByKeyFromString } from "../../utils/getValueByKeyFromString";
import { createTokenActor } from "../../utils/createTokenActor";
import { updateLocalStorageBalance } from "../../utils/updateLocalStorageBalance";

const TokenModal = ({reloadFunction}) => {
  const [isOpenCoupon, setIsOpenCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRefCoupon = useRef(null);
  const toggleDropdownCoupon = () => setIsOpenCoupon(!isOpenCoupon);
  const closeModalCoupon = () => {
    setIsOpenCoupon(false);
  };
  useEffect(() => {
    const handleClickOutsideCoupon = (event) => {
      if (
        dropdownRefCoupon.current &&
        !dropdownRefCoupon.current.contains(event.target)
      ) {
        setIsOpenCoupon(false);
      }
    };

    if (isOpenCoupon) {
      document.addEventListener("mousedown", handleClickOutsideCoupon);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCoupon);
    };
  }, [isOpenCoupon]);
  const [showNextSection, setShowNextSection] = useState(false);


  const [tokenActor, setTokenActor] = useState(null);
  const [tokenMetaData, setTokenMetaData] = useState(
    JSON.parse(localStorage.getItem("selectToken")) || {}
  );
  const fetchSelectedTokenData = async () => {
    let token = localStorage.getItem("selectToken") || {};
    let parseToken = JSON.parse(token);
    setTokenMetaData(parseToken);
    setTokenActor(createTokenActor(tokenMetaData?.tokenCanisterId));
  };

  useEffect(()=>{
    fetchSelectedTokenData();
  },[])

  const handleNextClick = async () => {
    if(!couponCode?.length){
        toast.error("Please enter a coupon code");
        return
    }
    try {
      setIsLoading(true);
      let response = await window.backendActor.claimCoupon(couponCode);
      setIsLoading(false);
      toast.success(response);
      setShowNextSection(true);
      let balance = await tokenActor.icrc1_balance_of({owner: window.principal,subaccount: []});
      balance = parseInt(balance)/Math.pow(10,tokenMetaData?.metadata?.["icrc1:decimals"]);
      await updateLocalStorageBalance(balance);
      toggleDropdownCoupon();
      closeModalNextSection();
      reloadFunction();
      setCouponCode();
    } catch (error) {
      setIsLoading(false);
      toast.error(getValueByKeyFromString(error.toString(),"Reject text"));
    }
  };

  const closeModalNextSection = () => {
    setShowNextSection(false);
  };

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannerBtnText, setScannerBtnText] = useState("Scan QR Code");
  const [couponCode, setCouponCode] = useState("");

  // Toggle the scanner on or off
  const toggleScanner = () => {
    if(!isScannerActive){
      setScannerBtnText("Stop Scanner");
    }else{
      setScannerBtnText("Scan QR Code");
    }
    setIsScannerActive((prevState) => !prevState);
  };

  async function handleScan(data) {
    if(data){
        setCouponCode(data?.text);
        toggleScanner();
        setScannerBtnText("Scan Again");
    }
  }
  function handleError(err) {
    console.error(err);
  }
  return (
    <>
    {isLoading && <Loader />}
      <button className="flex-1 hero" onClick={toggleDropdownCoupon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 576 512"
          fill="currentColor"
        >
          <path d="M0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64v64c0 8.8-7.4 15.7-15.7 18.6C541.5 217.1 528 235 528 256s13.5 38.9 32.3 45.4c8.3 2.9 15.7 9.8 15.7 18.6v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320c0-8.8 7.4-15.7 15.7-18.6C34.5 294.9 48 277 48 256s-13.5-38.9-32.3-45.4C7.4 207.7 0 200.8 0 192V128z" />
        </svg>
        <span>Claim Token</span>
      </button>
      {isOpenCoupon && (
        <div
          className="modal svelte-1bbimtl"
          role="dialog"
          aria-labelledby="modal-title-1"
          aria-describedby="modal-content-1"
        >
          <div
            role="button"
            tabIndex="-1"
            aria-label="Close"
            className="backdrop svelte-whxjdd"
            data-tid="backdrop"
          ></div>
          <div
            className="wrapper dialog svelte-1bbimtl"
            ref={dropdownRefCoupon}
            style={{ borderRadius: "1rem" }}
          >
            <div className="header svelte-1bbimtl">
              <h2
                id="modal-title-1"
                data-tid="modal-title"
                className="svelte-1bbimtl"
              >
                {showNextSection === true ? (
                  <span>Claim Status</span>
                ) : (
                  <span>Claim Token</span>
                )}
              </h2>
              <button
                data-tid="close-modal"
                aria-label="Close"
                className="svelte-1bbimtl"
                onClick={closeModalCoupon}
              >
                <svg
                  height="24px"
                  width="24px"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14.4194"
                    y="4.52441"
                    width="1.5"
                    height="14"
                    rx="0.75"
                    transform="rotate(45 14.4194 4.52441)"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4.5199"
                    y="5.58496"
                    width="1.5"
                    height="14"
                    rx="0.75"
                    transform="rotate(-45 4.5199 5.58496)"
                    fill="currentColor"
                  ></rect>
                </svg>
              </button>
            </div>
            {!showNextSection && (
              <div
                className="container-wrapper svelte-1bbimtl"
                style={{
                  margin: "1.5rem",
                  overflowY: "auto",
                  borderRadius: "1rem",
                }}
              >
                <div className="container svelte-1bbimtl">
                  <div className="content svelte-1bbimtl" id="modal-content-3">
                    <div
                      className="svelte-j8eaq1"
                      style={{ position: "relative" }}
                    >
                      <div className="rounded-lg qr-code svelte-16p7uvu" style={{padding: 0}}>
                        {isScannerActive && (
                          <QrReader
                            delay={1000}
                            style={{ width: "100%", height: "100%" }}
                            onError={handleError}
                            onScan={handleScan}
                            constraints={{
                                audio: false,
                                video: { facingMode: "environment" }}}
                          />
                        )}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={toggleScanner}
                          type="button"
                          className="wallet-connect pt-4 text-white font-bold text-center primary"
                          style={{ margin: "auto" }}
                        >
                          {scannerBtnText}
                        </button>
                      </div>
                      <p className="text-center pt-2 pb-2">Redeem Token</p>
                      <div className="input-block svelte-kabhds">
                        <div className="info svelte-kabhds">
                          <label
                            className="label svelte-kabhds"
                            htmlFor="uri"
                          ></label>
                        </div>
                        <div className="input-field svelte-kabhds">
                          <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            type="text"
                            required=""
                            name="uri"
                            id="uri"
                            placeholder="e.g. wc:a281567bb3e4..."
                            autoComplete="off"
                            className="svelte-kabhds"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-1 mt-2">
                        <button
                          className="primary"
                          onClick={handleNextClick}
                        >
                          Claim
                        </button>
                      </div>
                      <iframe
                        style={{
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                          border: 0,
                          opacity: 0,
                          pointerEvents: "none",
                          zIndex: -1,
                        }}
                        aria-hidden="true"
                        tabIndex="-1"
                        src="about:blank"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showNextSection && (
              <div
                className="container-wrapper svelte-1bbimtl"
                style={{
                  margin: "1.5rem",
                  overflowY: "auto",
                  borderRadius: "1rem",
                }}
              >
                <div className="container svelte-1bbimtl">
                  <div className="content svelte-1bbimtl" id="modal-content-3">
                    <div
                      className="svelte-j8eaq1"
                      style={{ position: "relative" }}
                    >
                      <div className="rounded-lg qr-code svelte-16p7uvu flex justify-center">
                        <img src="logo.png" alt="logo" />
                      </div>
                      <p className="text-center pt-4 pb-2">Success</p>
                      <div className="input-block svelte-kabhds">
                        <div className="info svelte-kabhds"></div>
                        <div className="input-field svelte-kabhds"></div>
                      </div>
                      <div className="flex justify-center gap-1 mt-2">
                        <button
                          className="primary"
                          onClick={closeModalNextSection}
                        >
                          Back
                        </button>

                        <button className="primary" onClick={closeModalCoupon}>
                          View Transactions
                        </button>
                      </div>
                      <iframe
                        style={{
                          display: "block",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                          border: 0,
                          opacity: 0,
                          pointerEvents: "none",
                          zIndex: -1,
                        }}
                        aria-hidden="true"
                        tabIndex="-1"
                        src="about:blank"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default TokenModal;
