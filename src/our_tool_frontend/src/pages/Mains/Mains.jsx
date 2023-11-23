import React, { useEffect, useState } from "react";
import "./Mains.css";
import { useNavigate } from "react-router-dom";
import { tokenImages } from "../../utils/TokenImages";
import { formatTokenMetaData } from "../../utils/formatTokenMetaData";
import Loader from "../Loader/Loader";
import { Actor, HttpAgent } from "@dfinity/agent";
import { ledgers } from "../../utils/ledgers";
import { createTokenActor } from "../../utils/createTokenActor";
import { useAuthClient } from "../../utils/useAuthClient";

const Main = () => {
  const navigate = useNavigate();
  const {createLedgerActor} = useAuthClient();
  const [tokensWithData, setTokensWithData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDataForLedgers(window.principal)
      .then((finalData) => {
        setTokensWithData(finalData);
      })
      .catch((error) => { });
  }, []);

  async function fetchDataForLedgers(principal) {
    setIsLoading(true);
    const fetchDataPromises = ledgers.map(async (ledger) => {
      const backendActorNew = createLedgerActor(ledger);
      try {
        const balance = await backendActorNew.icrc1_balance_of({
          owner: principal,
          subaccount: [],
        });
        const metadata = await backendActorNew.icrc1_metadata();
        return {
          balance,
          tokenCanisterId: ledger,
          metadata,
        };
      } catch (error) {
        return null;
      }
    });

    try {
      const final = await Promise.all(fetchDataPromises);
      setIsLoading(false);
      return final.filter((data) => data !== null);
    } catch (error) {
      console.error("Error fetching data for all ledgers:", error);
      setIsLoading(false);
      return [];
    }
  }

  const handleSelectToken = (selectToken, index) => {
    let formatData = formatTokenMetaData(tokensWithData[index].metadata);
    let tokenData = {
      metadata: {
        "icrc1:logo": formatData?.["icrc1:logo"]
          ? formatData?.["icrc1:logo"]
          : formatData?.["icrc1:symbol"]
            ? tokenImages[formatData?.["icrc1:symbol"]]
            : tokenImages["DEFAULT"],
        "icrc1:symbol": formatData?.["icrc1:symbol"],
        "icrc1:fee": formatData?.["icrc1:fee"].toString(),
        "icrc1:name": formatData?.["icrc1:name"],
        "icrc1:decimals": formatData?.["icrc1:decimals"].toString(),
      },
      tokenCanisterId: tokensWithData[index].tokenCanisterId,
      balance: (
        parseInt(tokensWithData[index].balance) /
        10 ** parseInt(formatData?.["icrc1:decimals"])
      ).toString(),
    };
    localStorage.setItem("selectToken", JSON.stringify(tokenData));
    navigate(`/send-token/${selectToken}`);
  };

  return (
    <>
      <main>
        <div className="p-2" style={{ overflow: 'auto' }}>
          <h2 className="text-base mb-3 pb-0.5 mt-6">Tokens</h2>
          {tokensWithData.map((e, index) => {
            return (
              <div
                className="no-underline"
                // href="#"
                onClick={() => handleSelectToken(e.tokenCanisterId, index)}
                style={{ cursor: "pointer" }}
                key={index}
                aria-label="Open the list of ETH transactions"
              >
                <div className="flex gap-2 mb-3">
                  <div
                    className="flex items-center justify-center rounded-50 bg-white"
                    style={{
                      border: "1px solid #dbd9d6",
                      width: "calc(46px + 2px)",
                      height: "calc(46px + 2px)",
                      transition: "opacity 0.15s ease-in",
                    }}
                  >
                    <img
                      src={
                        formatTokenMetaData(e.metadata)?.["icrc1:logo"]
                          ? formatTokenMetaData(e.metadata)?.["icrc1:logo"]
                          : tokenImages[
                            formatTokenMetaData(e.metadata)?.["icrc1:symbol"]
                          ]
                            ? tokenImages[
                            formatTokenMetaData(e.metadata)?.["icrc1:symbol"]
                            ]
                            : tokenImages["DEFAULT"]
                      }
                      role="presentation"
                      alt=""
                      loading="lazy"
                      width="46px"
                      height="46px"
                      decoding="async"
                      className="rounded-50"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex font-bold gap-1 items-center">
                      <span className="clamp-2" style={{ maxWidth: "60%" }}>
                        {formatTokenMetaData(e.metadata)?.["icrc1:name"]}
                      </span>
                      <span className="flex-1 text-right">
                        <output className="break-words" slot="amount">
                          {parseInt(e.balance) /
                            10 **
                            parseInt(
                              formatTokenMetaData(e.metadata)?.[
                              "icrc1:decimals"
                              ]
                            ) +
                            " "}{" "}
                          {formatTokenMetaData(e.metadata)?.["icrc1:symbol"]}
                        </output>
                      </span>
                    </div>
                    <p className="text-grey"></p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* <button className="contents">
                    <div className="flex gap-2 mb-3">
                        <div className="relative">
                            <div className="rounded-50 bg-white" style={{ width: '2.9rem', aspectRatio: '1 / 1', border: '1px solid #dbd9d6' }}>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 14 14" className="inset-center " fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99976 13.0005L6.99976 0.999999" stroke="#3B00B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M13 7.00024H0.999511" stroke="#3B00B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex font-bold gap-1 items-center">
                                <span className="clamp-2" style={{ maxWidth: '60%' }}>
                                    <span>Add new token</span>
                                </span>
                                <span className="flex-1 text-right">
                                </span>
                            </div>
                            <p className="text-grey"> </p>
                        </div>
                    </div>
                </button> */}
        </div>
      </main>
      {isLoading && <Loader />}
    </>
  );
};

export default Main;
