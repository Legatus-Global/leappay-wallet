import React, { useState, useRef, useEffect } from "react";
import "./Article.css";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";
import TokenModal from "../Modal/TokenModal";
import SpendModal from "../Modal/SpendModal";
import DepositModal from "../Modal/DepositModal";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { formatTokenMetaData } from "../../utils/formatTokenMetaData";
import { createTokenActor } from "../../utils/createTokenActor";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { updateLocalStorageBalance } from "../../utils/updateLocalStorageBalance";

const Article2 = ({ isReload, reloadFunction }) => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [isOpenSend, setIsOpenSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRefSend = useRef(null);

  const toggleDropdownSend = () => setIsOpenSend(!isOpenSend);

  const closeModalSend = () => {
    setIsOpenSend(false);
  };

  useEffect(() => {
    const handleClickOutsideSend = (event) => {
      if (
        dropdownRefSend.current &&
        !dropdownRefSend.current.contains(event.target)
      ) {
        setIsOpenSend(false);
      }
    };

    if (isOpenSend) {
      document.addEventListener("mousedown", handleClickOutsideSend);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSend);
    };
  }, [isOpenSend]);

  const [showNextSection, setShowNextSection] = useState(false);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (!sendPrincipal?.length) {
      toast.error("Enter principal id");
      return;
    }
    if (sendAmount > parseInt(tokenMetaData?.balance)) {
      toast.error("Your balance is less than the send amount");
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

  // Logically part of the token
  const [sendAmount, setSendAmount] = useState(0);
  const [sendPrincipal, setSendPrincipal] = useState("");
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

  const handleSendAmount = async () => {
    if (!sendPrincipal?.length) {
      toast.error("Enter principal id");
      return;
    }
    if (sendAmount > parseInt(tokenMetaData?.balance)) {
      toast.error("Your balance is less than the send amount");
      return;
    }
    if (parseInt(tokenMetaData?.balance) == 0) {
      toast.error("Your balance is zero");
      return;
    }
    setIsLoading(true);
    try {
      let transaction = {
        amount: parseInt(Number(sendAmount) * Math.pow(10, parseInt(tokenMetaData?.metadata?.["icrc1:decimals"]))),
        from_subaccount: [],
        to: {
          owner: Principal.fromText(sendPrincipal),
          subaccount: [],
        },
        fee: [parseInt(tokenMetaData?.metadata?.["icrc1:fee"])],
        memo: [],
        created_at_time: [],
      };
      let response = await tokenActor.icrc1_transfer(transaction);
      let data = displayObject(response);
      if (response.Err) {
        toast.error(data);
      } else {
        toast.success("Transaction successful");
        let balance = await tokenActor.icrc1_balance_of({ owner: window.principal, subaccount: [] });
        balance = parseInt(balance) / Math.pow(10, tokenMetaData?.metadata?.["icrc1:decimals"]);
        await updateLocalStorageBalance(balance);
        reloadFunction();
        closeModalSend();
        closeModalNextSection();
        setSendAmount(0);
        setSendPrincipal("");
      }
    } catch (error) {
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
    fetchSelectedTokenData();
  }, [isReload]);


  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading && <Loader />}
      <article className="flex flex-col text-off-white rounded-lg pt-1 sm:pt-3 pb-2 px-4 relative main svelte-bnd0rw">
        <a
          rel="external noopener noreferrer"
          target="_blank"
          className="no-underline inline-block text-center px-3 py-1 font-bold text-xs md:text-base svelte-1xf36on"
        >
          <svg
            width="20"
            style={{ minWidth: "20px", verticalAlign: "sub" }}
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.55 15.7069L11.5611 0.870937C10.9948 -0.180938 9.48637 -0.180938 8.91965 0.870937L0.931217 15.7069C0.80827 15.9352 0.74663 16.1916 0.752313 16.4508C0.757997 16.7101 0.83081 16.9635 0.963646 17.1863C1.09648 17.409 1.2848 17.5935 1.51022 17.7217C1.73564 17.85 1.99046 17.9176 2.24981 17.918H18.229C18.4886 17.918 18.7437 17.8507 18.9694 17.7226C19.1952 17.5945 19.3838 17.4101 19.5169 17.1873C19.65 16.9644 19.7231 16.7109 19.7289 16.4514C19.7346 16.1919 19.673 15.9354 19.55 15.7069ZM10.2406 15.6211C10.0552 15.6211 9.87392 15.5661 9.71974 15.4631C9.56557 15.3601 9.44541 15.2137 9.37445 15.0424C9.3035 14.8711 9.28493 14.6826 9.32111 14.5007C9.35728 14.3188 9.44657 14.1518 9.57768 14.0207C9.70879 13.8896 9.87584 13.8003 10.0577 13.7641C10.2396 13.7279 10.4281 13.7465 10.5994 13.8175C10.7707 13.8884 10.9171 14.0086 11.0201 14.1627C11.1231 14.3169 11.1781 14.4982 11.1781 14.6836C11.1781 14.9322 11.0793 15.1707 10.9035 15.3465C10.7277 15.5223 10.4892 15.6211 10.2406 15.6211ZM11.2587 6.19219L10.9897 11.9109C10.9897 12.1098 10.9106 12.3006 10.77 12.4413C10.6293 12.5819 10.4386 12.6609 10.2397 12.6609C10.0407 12.6609 9.84998 12.5819 9.70932 12.4413C9.56867 12.3006 9.48965 12.1098 9.48965 11.9109L9.22059 6.19453C9.21455 6.05793 9.23606 5.92151 9.28386 5.79341C9.33166 5.6653 9.40476 5.54813 9.49881 5.44888C9.59285 5.34963 9.70592 5.27033 9.83127 5.2157C9.95662 5.16108 10.0917 5.13225 10.2284 5.13094H10.2382C10.3759 5.13087 10.5122 5.15869 10.6388 5.21272C10.7654 5.26675 10.8797 5.34587 10.9749 5.44531C11.0701 5.54475 11.1442 5.66245 11.1926 5.7913C11.2411 5.92015 11.2629 6.05748 11.2568 6.195L11.2587 6.19219Z"
              fill="currentColor"
            ></path>
          </svg>
          <span className="pl-1">
            Learn more about this alpha version. Use with caution.
          </span>
        </a>
        <div>
          <div className="icon flex flex-col items-start mt-3 md:mt-6 mb-0.5 pt-2 svelte-bnd0rw">
            <div>
              <div
                className="flex items-center justify-center rounded-50 bg-off-white"
                style={{
                  border: "1px solid #fcfaf6",
                  width: "calc(64px + 2px)",
                  height: "calc(64px + 2px)",
                  transition: "opacity 0.15s ease-in",
                }}
              >
                <img
                  src={tokenMetaData?.metadata?.["icrc1:logo"]}
                  role="presentation"
                  alt="Token logo"
                  loading="lazy"
                  width="64px"
                  height="64px"
                  decoding="async"
                  className="rounded-50"
                />
              </div>
            </div>
          </div>
          <span className="text-off-white">
            <output
              className="break-words opacity-50"
              style={{
                fontSize: "calc(2 * 1.802rem)",
                lineHeight: "0.95",
                marginLeft: "5px",
              }}
            >
              {tokenMetaData?.balance ? tokenMetaData?.balance : 0}
            </output>
            <span className="opacity-100">
              {tokenMetaData?.metadata?.["icrc1:symbol"]
                ? " " + tokenMetaData?.metadata?.["icrc1:symbol"]
                : ""}
            </span>
          </span>
        </div>
        <div>
          <div
            role="toolbar"
            className="flex flex-wrap gap-2 text-deep-violet font-bold py-4"
          >
            <DepositModal />
            <button className="flex-1 hero" onClick={toggleDropdownSend}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 17V7M17 7H7M17 7L7 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span>Send</span>
            </button>
            {isOpenSend && (
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
                  ref={dropdownRefSend}
                  style={{ borderRadius: "1rem" }}
                >
                  <div className="header svelte-1bbimtl">
                    <h2
                      id="modal-title-1"
                      data-tid="modal-title"
                      className="svelte-1bbimtl"
                    >
                      {showNextSection === true ? (
                        <span>Review</span>
                      ) : (
                        <span>Send</span>
                      )}
                    </h2>
                    <button
                      data-tid="close-modal"
                      aria-label="Close"
                      className="svelte-1bbimtl"
                      onClick={closeModalSend}
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
                        <div
                          className="content svelte-1bbimtl"
                          id="modal-content-1"
                          style={{ position: "relative", height: "560px" }}
                        >
                          <form>
                            <label
                              for="principalId"
                              className="font-bold px-1.25"
                            >
                              Principal ID:
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
                                  onChange={(e) =>
                                    setSendAmount(e.target.value)
                                  }
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
                              {tokenMetaData?.balance
                                ? tokenMetaData?.balance
                                : 0 + " "}{" "}
                              {tokenMetaData?.metadata?.["icrc1:symbol"]
                                ? tokenMetaData?.metadata?.["icrc1:symbol"]
                                : ""}
                            </div>
                            <label for="balance" className="font-bold px-1.25">
                              Cycles fee{" "}
                              <small>(likely in &lt; 30 seconds)</small>:
                            </label>
                            <div
                              id="balance"
                              className="font-normal px-1.25 mb-2 break-words"
                              style={{ minHeight: "24px" }}
                            >
                              <div>
                                {tokenMetaData?.metadata?.["icrc1:fee"]
                                  ? tokenMetaData?.metadata?.["icrc1:fee"]
                                  : 0}
                              </div>
                            </div>
                            <div
                              className="flex justify-end gap-1"
                              style={{ paddingTop: "10rem" }}
                            >
                              <button
                                type="button"
                                className="secondary"
                                onClick={closeModalSend}
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
                        </div>
                      )}
                      {showNextSection && (
                        <div
                          className="content svelte-1bbimtl"
                          id="modal-content-1"
                          style={{ position: "relative", height: "560px" }}
                        >
                          <div
                            className="svelte-j8eaq1"
                            style={{ position: "relative" }}
                          >
                            <label
                              for="principalId"
                              className="font-bold px-1.25"
                            >
                              Principal ID:
                            </label>
                            <div
                              id="principalId"
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
                              {sendAmount + " "}{" "}
                              {tokenMetaData?.metadata?.["icrc1:symbol"]
                                ? tokenMetaData?.metadata?.["icrc1:symbol"]
                                : ""}
                            </div>
                            <label for="balance" className="font-bold px-1.25">
                              Balance:
                            </label>
                            <div
                              id="balance"
                              className="font-normal px-1.25 mb-2 break-words"
                            >
                              {tokenMetaData?.balance
                                ? tokenMetaData?.balance
                                : 0 + " "}{" "}
                              {tokenMetaData?.metadata?.["icrc1:symbol"]
                                ? tokenMetaData?.metadata?.["icrc1:symbol"]
                                : ""}
                            </div>
                            <label for="balance" className="font-bold px-1.25">
                              Cycles fee{" "}
                              <small>(likely in &lt; 30 seconds)</small>:
                            </label>
                            <div
                              id="balance"
                              className="font-normal px-1.25 mb-2 break-words"
                              style={{ minHeight: "24px" }}
                            >
                              <div>
                                {tokenMetaData?.metadata?.["icrc1:fee"]
                                  ? tokenMetaData?.metadata?.["icrc1:fee"]
                                  : 0}
                              </div>
                            </div>
                            <div
                              className="flex justify-end gap-1"
                              style={{ paddingTop: "13rem" }}
                            >
                              <button
                                className="secondary"
                                onClick={closeModalNextSection}
                              >
                                Back
                              </button>
                              <button
                                onClick={handleSendAmount}
                                className="primary"
                              >
                                Send
                              </button>
                            </div>
                            <iframe
                              const
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
                              tabindex="-1"
                              src="about:blank"
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            role="toolbar"
            className="flex flex-wrap gap-2 text-deep-violet font-bold"
          >
            <SpendModal isReload={isReload} reloadFunction={reloadFunction} />
            <TokenModal reloadFunction={reloadFunction} />
          </div>
        </div>
      </article>
    </>
  );
};

export default Article2;
