import React, { useState, useEffect, useRef } from "react";
import "../Article/Article.css";
import toast, { Toaster } from "react-hot-toast";
import QrReader from "react-qr-scanner";
import "./TokenModal.css";
import "./SpendModal.css";
import { createTokenActor } from "../../utils/createTokenActor";
import { Principal } from "@dfinity/principal";
import Loader from "../Loader/Loader";
import { updateLocalStorageBalance } from "../../utils/updateLocalStorageBalance";

const SpendModal = ({reloadFunction,isReload}) => {
  const [isOpenSpend, setIsOpenSpend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRefSpend = useRef(null);
  const toggleDropdownSpend = () => setIsOpenSpend(!isOpenSpend);
  const closeModalSpend = () => {
    setIsOpenSpend(false);
  };

  useEffect(() => {
    const handleClickOutsideSpend = (event) => {
      if (
        dropdownRefSpend.current &&
        !dropdownRefSpend.current.contains(event.target)
      ) {
        setIsOpenSpend(false);
      }
    };

    if (isOpenSpend) {
      document.addEventListener("mousedown", handleClickOutsideSpend);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSpend);
    };
  }, [isOpenSpend]);

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanData, setScanData] = useState({});

  // Toggle the scanner on or off
  const toggleScanner = () => {
    if(!isScannerActive){
      setScannerBtnText("Stop Scanner");
    }else{
      setScannerBtnText("Scan QR Code");
    }
    setIsScannerActive((prevState) => !prevState);
  };
  const handleCancelQrScanner = () => {
    setIsScannerActive(false);
  };

  const [scannerBtnText, setScannerBtnText] = useState("Scan QR Code");
  
  function handleScan(result) {
    try {
        let data = JSON.parse(result?.text);
        if(data?.accoundId && data?.principalId){
            setScanData(data?.text);
            setSendPrincipal(data?.principalId);
            setMerchantName(data?.merchantName || '');
            toggleScanner();
            setScannerBtnText("Scan Again");
        }
    } catch (error) {
        console.log(error)
    }
  }
  function handleError(err) {
    console.error(err);
  }

  const [showNextSection, setShowNextSection] = useState(false);

  const handleNextClick = (e) => {
    e.preventDefault();
    if(!merchantName?.length){
      toast.error("Enter merchant name");
      return;
    }
    if(!sendPrincipal?.length){
      toast.error("Enter principal id");
      return;
    }
    if (sendAmount > parseInt(tokenMetaData?.balance)) {
      toast.error("Your balance is less than the amount");
      return;
    }
    if (sendAmount <= 0) {
      toast.error("Enter the amount");
      return;
    }
    if (parseInt(tokenMetaData?.balance) == 0) {
      toast.error("Your balance is zero");
      return;
    }
    setShowNextSection(true);
  };
  const closeModalNextSection = () => {
    setShowNextSection(false);
  };

  const [showSpendConformation, setSpendConformation] = useState(false);

  const closeModalSpendConformation = () => {
    setSpendConformation(false);
  };

  const handleViewTransaction = () => {
    setSpendConformation(false);
    setShowNextSection(false);
    setIsOpenSpend(false);
  }

  const [tokenActor, setTokenActor] = useState(null);
  const [sendAmount, setSendAmount] = useState(0);
  const [sendPrincipal, setSendPrincipal] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [tokenMetaData, setTokenMetaData] = useState(
    JSON.parse(localStorage.getItem("selectToken"))
  );

  const fetchTokenData = async () => {
    let token = localStorage.getItem("selectToken") || [];
    let parseToken = JSON.parse(token);
    setTokenMetaData(parseToken);
    setTokenActor(createTokenActor(tokenMetaData?.tokenCanisterId));
  };

  const handleSpendConformationClick = async () => {
    if(!merchantName?.length){
      toast.error("Enter merchant name");
      return;
    }
    if(!sendPrincipal?.length){
      toast.error("Enter principal id");
      return;
    }
    if (sendAmount > parseInt(tokenMetaData?.balance)) {
      toast.error("Your balance is less than the amount");
      return;
    }
    if (parseInt(tokenMetaData?.balance) == 0) {
      toast.error("Your balance is zero");
      return;
    }
    setIsLoading(true);
    const data = merchantName;
    const blob = new Blob([data], {type: 'text/html'});
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    try {
      let transaction = {
        amount: parseInt(Number(sendAmount) * Math.pow(10, parseInt(tokenMetaData?.metadata?.["icrc1:decimals"]))),
        from_subaccount: [],
        to: {
          owner: Principal.fromText(sendPrincipal),
          subaccount: [],
        },
        fee: [parseInt(tokenMetaData?.metadata?.["icrc1:fee"])],
        memo: [uint8Array],
        created_at_time: [],
      };
      let response = await tokenActor.icrc1_transfer(transaction);
      let data = displayObject(response);
      if (response.Err) {
        toast.error(data);
      } else {
        toast.success("Transaction successful");
        setSpendConformation(true);
        setIsLoading(false);
        let balance = await tokenActor.icrc1_balance_of({owner: window.principal,subaccount: []});
        balance = parseInt(balance)/Math.pow(10,tokenMetaData?.metadata?.["icrc1:decimals"]);
        await updateLocalStorageBalance(balance);
        reloadFunction();
        setSendAmount(0);
        setSendPrincipal("");
        setMerchantName("");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      let err = displayObject(error);
      toast.error(err);
    }
    setIsLoading(false);
  };

  function displayObject(obj, indent = "") {
    var alertMessage = "";
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          // Recursively display nested objects
          alertMessage += key + ":\n" + displayObject(obj[key], indent + "  ");
        } else {
          // Check if the value is a string before truncating
          var truncatedValue = (typeof obj[key] === "string")
            ? obj[key].slice(0, 32)
            : obj[key];
          if (obj[key] && typeof obj[key] === "string" && obj[key].length > 10) {
            truncatedValue += " ...";
          }
          alertMessage += indent + key + ": " + truncatedValue + "\n";
        }
      }
    }
    return alertMessage;
  }

  useEffect(() => {
    fetchTokenData();
  }, [isReload]);

  return (
    <>
    {isLoading && <Loader />}
      <button className="flex-1 hero" onClick={toggleDropdownSpend}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" />
        </svg>
        <span>Spend</span>
      </button>
      {isOpenSpend && (
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
            ref={dropdownRefSpend}
            style={{ borderRadius: "1rem" }}
          >
            <div className="header svelte-1bbimtl">
              <h2
                id="modal-title-1"
                data-tid="modal-title"
                className="svelte-1bbimtl"
              >
                {showNextSection === true ? (
                  <span> Make Payment Review</span>
                ) : (
                  <span>Make Payment to</span>
                )}
              </h2>
              <button
                data-tid="close-modal"
                aria-label="Close"
                className="svelte-1bbimtl"
                onClick={closeModalSpend}
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
            <div
              className="container-wrapper svelte-1bbimtl"
              style={{
                margin: "1.5rem",
                overflowY: "auto",
                borderRadius: "1rem",
              }}
            >
              <div className="container svelte-1bbimtl">
                {!showNextSection && (
                  <div className="content svelte-1bbimtl" id="modal-content-1">
                    {isScannerActive ? (
                      <>
                        <div className="rounded-lg qr-code svelte-16p7uvu" style={{padding: 0}}>
                          <QrReader
                            delay={1000}
                            style={{ width: "100%", height: "100%" }}
                            onError={handleError}
                            onScan={handleScan}
                            constraints={{
                                audio: false,
                                video: { facingMode: "environment" }}}
                          />
                        </div>
                        <form className="mt-3">
                          <label
                            for="principalId"
                            className="font-bold px-1.25"
                          >
                            Merchant Name:
                          </label>
                          <div className="input-block svelte-kabhds">
                            <div className="info svelte-kabhds">
                              <label
                                className="label svelte-kabhds"
                                for="merchantName"
                              ></label>
                            </div>
                            <div className="input-field svelte-kabhds">
                              <input
                                value={merchantName}
                                onChange={(e) =>
                                  setMerchantName(e.target.value)
                                }
                                type="text"
                                required=""
                                name="merchantName"
                                id="merchantName"
                                placeholder="Enter Merchant Name"
                                autocomplete="off"
                                className="svelte-kabhds"
                              />
                            </div>
                          </div>
                          <label
                            for="principalId"
                            className="font-bold px-1.25"
                          >
                            Merchant Principal ID:
                          </label>
                          <div className="input-block svelte-kabhds">
                            <div className="info svelte-kabhds">
                              <label
                                className="label svelte-kabhds"
                                for="principalId"
                              ></label>
                            </div>
                            <div className="input-field svelte-kabhds">
                              <input
                                value={sendPrincipal}
                                onChange={(e) =>
                                  setSendPrincipal(e.target.value)
                                }
                                type="text"
                                required=""
                                name="principalId"
                                id="principalId"
                                placeholder="Enter your Principal Id"
                                autocomplete="off"
                                className="svelte-kabhds"
                              />
                            </div>
                          </div>
                          <label for="amount" className="font-bold px-1.25">
                            Amount:
                          </label>
                          <div className="input-block svelte-kabhds">
                            <div className="info svelte-kabhds">
                              <label
                                className="label svelte-kabhds"
                                for="amount"
                              ></label>
                            </div>
                            <div className="input-field svelte-kabhds">
                              <input
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                type="number"
                                required=""
                                name="amount"
                                id="amount"
                                placeholder="Amount"
                                className="svelte-kabhds"
                              />
                            </div>
                          </div>
                          <label for="balance" className="font-bold px-1.25">
                            Balance:
                          </label>
                          <div
                            id="balance"
                            className="font-normal px-1.25 mb-2 break-words"
                          >
                            {tokenMetaData?.balance + " "}{" "}
                            {tokenMetaData?.metadata?.["icrc1:symbol"]
                              ? " " + tokenMetaData?.metadata?.["icrc1:symbol"]
                              : ""}
                          </div>
                          <div className="mt-6">
                            <button
                              type="button"
                              className="wallet-connect pt-4 text-white font-bold text-center primary"
                              style={{ margin: "auto" }}
                              onClick={toggleScanner}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 448 512"
                                fill="currentColor"
                              >
                                <path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" />
                              </svg>
                              {scannerBtnText}
                            </button>
                          </div>
                          <div
                            className="flex justify-center gap-1"
                            style={{ paddingTop: "2rem" }}
                          >
                            <button
                              type="button"
                              className="secondary"
                              onClick={handleCancelQrScanner}
                            >
                              Cancel
                            </button>
                            <button
                              className="primary "
                              type="burron"
                              onClick={handleNextClick}
                            >
                              Next
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <form className="mt-3">
                        <label for="principalId" className="font-bold px-1.25">
                          Merchant Name:
                        </label>
                        <div className="input-block svelte-kabhds">
                          <div className="info svelte-kabhds">
                            <label
                              className="label svelte-kabhds"
                              for="merchantName"
                            ></label>
                          </div>
                          <div className="input-field svelte-kabhds">
                            <input
                              value={merchantName}
                              onChange={(e) => setMerchantName(e.target.value)}
                              type="text"
                              required=""
                              name="merchantName"
                              id="merchantName"
                              placeholder="Enter Merchant Name"
                              autocomplete="off"
                              className="svelte-kabhds"
                            />
                          </div>
                        </div>
                        <label for="principalId" className="font-bold px-1.25">
                          Merchant Principal ID:
                        </label>
                        <div className="input-block svelte-kabhds">
                          <div className="info svelte-kabhds">
                            <label
                              className="label svelte-kabhds"
                              for="principalId"
                            ></label>
                          </div>
                          <div className="input-field svelte-kabhds">
                            <input
                              value={sendPrincipal}
                              onChange={(e) => setSendPrincipal(e.target.value)}
                              type="text"
                              required=""
                              name="principalId"
                              id="principalId"
                              placeholder="Enter your Principal Id"
                              autocomplete="off"
                              className="svelte-kabhds"
                            />
                          </div>
                        </div>
                        <label for="amount" className="font-bold px-1.25">
                          Amount:
                        </label>
                        <div className="input-block svelte-kabhds">
                          <div className="info svelte-kabhds">
                            <label
                              className="label svelte-kabhds"
                              for="amount"
                            ></label>
                          </div>
                          <div className="input-field svelte-kabhds">
                            <input
                              value={sendAmount}
                              onChange={(e) => setSendAmount(e.target.value)}
                              type="number"
                              required=""
                              name="amount"
                              id="amount"
                              placeholder="Amount"
                              className="svelte-kabhds"
                            />
                          </div>
                        </div>
                        <label for="balance" className="font-bold px-1.25">
                          Balance:
                        </label>
                        <div
                          id="balance"
                          className="font-normal px-1.25 mb-2 break-words"
                        >
                          {tokenMetaData?.balance + " "}{" "}
                          {tokenMetaData?.metadata?.["icrc1:symbol"]
                            ? " " + tokenMetaData?.metadata?.["icrc1:symbol"]
                            : ""}
                        </div>
                        <div className="mt-6">
                          <button
                            type="button"
                            className="wallet-connect pt-4 text-white font-bold text-center primary"
                            style={{ margin: "auto" }}
                            onClick={toggleScanner}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 448 512"
                              fill="currentColor"
                            >
                              <path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" />
                            </svg>
                            <span>Scan QR to Pay</span>
                          </button>
                        </div>
                        <div
                          className="flex justify-center gap-1"
                          style={{ paddingTop: "2rem" }}
                        >
                          <button
                            type="button"
                            className="secondary"
                            onClick={closeModalSpend}
                          >
                            Cancel
                          </button>
                          <button
                            className="primary "
                            type="burron"
                            onClick={handleNextClick}
                          >
                            Next
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
                {showNextSection && (
                  <>
                    {showSpendConformation !== true ? (
                      <div
                        className="content svelte-1bbimtl"
                        id="modal-content-1"
                      >
                        <div
                          className="svelte-j8eaq1"
                          style={{ position: "relative" }}
                        >
                          <label
                            for="merchantName"
                            className="font-bold px-1.25"
                          >
                            Merchant Name:
                          </label>
                          <div
                            id="merchantName"
                            className="font-normal mb-2 px-1.25 break-words"
                          >
                            {merchantName}
                          </div>
                          <label
                            for="merchantPrincipalId"
                            className="font-bold px-1.25"
                          >
                            Merchant Principal ID:
                          </label>
                          <div
                            id="merchantPrincipalId"
                            className="font-normal mb-2 px-1.25 break-words"
                          >
                            {sendPrincipal}
                          </div>
                          <label for="amount" className="font-bold px-1.25">
                            Amount:
                          </label>
                          <div
                            id="amount"
                            className="font-normal px-1.25 mb-2 break-words"
                          >
                            {sendAmount}
                          </div>
                          <label for="balance" className="font-bold px-1.25">
                            Balance:
                          </label>
                          <div
                            id="balance"
                            className="font-normal px-1.25 mb-2 break-words"
                          >
                            {tokenMetaData?.balance}
                          </div>
                          <div
                            className="flex justify-end gap-1"
                            style={{ paddingTop: "5rem" }}
                          >
                            <button
                              className="secondary"
                              onClick={closeModalNextSection}
                            >
                              Back
                            </button>
                            <button
                              onClick={handleSpendConformationClick}
                              className="primary"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="container-wrapper svelte-1bbimtl"
                        style={{
                          margin: "1.5rem",
                          overflowY: "auto",
                          borderRadius: "1rem",
                        }}
                      >
                        <div className="container svelte-1bbimtl">
                          <div
                            className="content svelte-1bbimtl"
                            id="modal-content-3"
                          >
                            <div
                              className="svelte-j8eaq1"
                              style={{ position: "relative" }}
                            >
                              <div
                                className="rounded-lg qr-code svelte-16p7uvu flex justify-center"
                                style={{ alignItems: "center" }}
                              >
                                <div class="checkmark-circle">
                                  <div class="background"></div>
                                  <div class="checkmark draw"></div>
                                </div>
                              </div>
                              <p className="text-center pt-4 pb-2">
                                Payment Successful
                              </p>
                              <div className="input-block svelte-kabhds">
                                <div className="info svelte-kabhds"></div>
                                <div className="input-field svelte-kabhds"></div>
                              </div>
                              <div className="flex justify-center gap-1 mt-2">
                                {/* <button
                                  className="primary"
                                  onClick={closeModalNextSection}
                                >
                                  Back
                                </button> */}

                                <button
                                  className="primary"
                                  onClick={handleViewTransaction}
                                >
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpendModal;
