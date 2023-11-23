import React, { useEffect, useState } from "react";
import "../Mains/Mains.css";
import "./Transaction.css";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../../our_tool_backend/index.did.js";
import { tokenImages } from "../../utils/TokenImages";
import Loader from "../Loader/Loader";
import { ledgerIndexCanisters } from "../../utils/indexCanisterIds";
import LoaderSmall from "../Loader/LoaderSmall";

const Transaction = ({isReload}) => {
  const [openItems, setOpenItems] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle function for accordion items
  const toggleItem = (index) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      let identity = window.identity;
      const agent = new HttpAgent({ identity });
      let icpIndexCanisterActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: getIndexCanister(),
      });
      let results = await icpIndexCanisterActor.get_account_transactions({
        start: [],
        max_results: parseInt(30),
        account: {
          owner: window.principal,
          subaccount: [],
        },
      });
      if (results.Ok) {
        setTransactions(results.Ok.transactions);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const [tokenMetaData, setTokenMetaData] = useState(
    JSON.parse(localStorage.getItem("selectToken")) || {}
  );
  const fetchSelectedTokenData = async () => {
    let token = localStorage.getItem("selectToken") || [];
    let parseToken = JSON.parse(token);
    setTokenMetaData(parseToken);
  };

  const getIndexCanister = () => {
    let symbol = tokenMetaData?.metadata?.["icrc1:symbol"];
    let canister = ledgerIndexCanisters[symbol] || process.env.CANISTER_ID_OF_TOKEN_INDEX;
    return canister;
  }

  useEffect(() => {
    getIndexCanister();
    fetchSelectedTokenData();
    getTransactions();
  }, [isReload]);

  const principalToText = (principal) => {
    return principal?.toText();
  };

  const timeStampConverter = (timestamp) => {
    return new Date(timestamp / 1000000).toDateString()
  }

  const decodeMemo = (data, to = '', from = '') => {
    if (!data) {
      if (to == window.principalString) {
        return "Receive"
      }
      if (from == window.principalString) {
        return "Send"
      }
      return "Transaction";
    }
    const uint8Array = new Uint8Array(Object.values(data));
    const textDecoder = new TextDecoder('utf-8');
    const decodedString = textDecoder.decode(uint8Array);
    if (decodedString == "Claim") {
      return decodedString;
    }
    if (to == window.principalString) {
      return "Receive"
    }
    if (decodedString != "Claim") {
      return "Spend";
    }
    if (from == window.principalString) {
      return "Send"
    }
    return decodedString;
  }

  return (
    <main>
      <div>
        <h2 className="text-base mb-3 pb-0.5 mt-6">Transactions</h2>
        {isLoading ? <LoaderSmall /> : 
         transactions?.length ? (
          <div
            className="no-underline"
            style={{ cursor: "pointer" }}
            aria-label="Open the list of ETH transactions"
          >
            {transactions.map((item, index) => (
              <div
                key={index}
                className={`accordion ${openItems[index] ? "active" : ""}`}
              >
                <div className="question" onClick={() => toggleItem(index)}>
                  <div className="flex gap-2 mb-0.5 px-4 py-2">
                    <div
                      className="flex items-center justify-center rounded-50 bg-white"
                      style={{
                        border: "1px solid #dbd9d6",
                        width: "calc(46px + 2px)",
                        height: "calc(46px + 2px)",
                        transition: "opacity 0.15s ease-in",
                      }}
                    >
                      {/* <img src='' role="presentation" alt="" loading="lazy"
                                            width="46px" height="46px" decoding="async" className="rounded-50" /> */}
                      <div className="main-container">
                        <div className="profile" style={{ padding: "5px" }}>
                          <img
                            src={
                              tokenMetaData?.metadata?.["icrc1:logo"]
                                ? tokenMetaData?.metadata?.["icrc1:logo"]
                                : tokenImages["DEFAULT"]
                            }
                          />
                          <span className="active-icon">
                            {principalToText(
                              item?.transaction?.transfer?.[0]?.from?.owner
                            ) !== window?.principalString ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1rem"
                                viewBox="0 0 512 512"
                              >
                                <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1.2rem"
                                viewBox="0 0 496 512"
                              >
                                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className=" flex flex-1 justify-between px-1.25">
                      <div className="gap-1 items-center">
                        <span
                          className="clamp-2 font-bold truncate" style={{ width: '100px' }}>
                          Amount
                        </span>
                        <span className="text-grey clamp-2 truncate" style={{ width: '100px' }} >
                          {parseInt(item?.transaction?.transfer?.[0]?.amount) /
                            10 **
                            parseInt(
                              tokenMetaData?.metadata?.["icrc1:decimals"]
                            )}{" "}
                          {tokenMetaData?.metadata?.["icrc1:symbol"]
                            ? tokenMetaData?.metadata?.["icrc1:symbol"]
                            : ""}
                        </span>
                      </div>
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold truncate " style={{ width: '30px' }} >Fee</span>
                        <span className="text-grey clamp-2 truncate" style={{ width: '30px' }} title={parseInt(item?.transaction?.transfer?.[0]?.fee[0])}>
                          {parseInt(item?.transaction?.transfer?.[0]?.fee[0])}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="answer"
                  style={{ height: openItems[index] ? "auto" : "0px" }}
                >
                  <div className="gap-2 mb-0.5 px-2 py-2">
                    <div className=" flex flex-1 justify-between">
                      <div className="gap-1 items-center px-2 py-1">
                        <span className="clamp-2 font-bold">
                          Transaction Time:
                        </span>
                      </div>
                      <div className="gap-1 items-center px-2 py-1">
                        <span className="clamp-2 font-bold truncate" style={{ width: '156px' }} title={timeStampConverter(parseInt(item?.transaction?.timestamp))}>
                          {timeStampConverter(parseInt(item?.transaction?.timestamp))}
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-1 justify-between px-2 py-1">
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold">From:</span>
                      </div>
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold truncate" style={{ width: '156px' }} title={principalToText(item?.transaction?.transfer?.[0]?.from?.owner)} >
                          {principalToText(
                            item?.transaction?.transfer?.[0]?.from?.owner
                          )}
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-1 justify-between px-2 py-1">
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold">To:</span>
                      </div>
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold truncate" style={{ width: '156px' }} title={principalToText(item?.transaction?.transfer?.[0]?.to?.owner)}>
                          {principalToText(
                            item?.transaction?.transfer?.[0]?.to?.owner
                          )}
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-1 justify-between px-2 py-1">
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold">Type:</span>
                      </div>
                      <div className="gap-1 items-center">
                        <span className="clamp-2 font-bold truncate" style={{ width: '156px' }} title={principalToText(item?.transaction?.transfer?.[0]?.to?.owner)}>
                          {decodeMemo(
                            item?.transaction?.transfer?.[0]?.memo?.[0],
                            principalToText(
                              item?.transaction?.transfer?.[0]?.to?.owner
                            ),
                            principalToText(
                              item?.transaction?.transfer?.[0]?.from?.owner
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>You hane no transaction.</div>
        )}
      </div>
    </main>
  );
};

export default Transaction;
