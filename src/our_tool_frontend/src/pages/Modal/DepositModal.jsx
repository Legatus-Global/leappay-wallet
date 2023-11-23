import React, { useState, useEffect, useRef } from 'react'
import '../Article/Article.css'
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";
import { handleCopyClick } from '../../utils/HandleCopyClick';

const DepositModal = () => {
    const [isOpenDeposit, setIsOpenDeposit] = useState(false);
    const dropdownRefDeposit = useRef(null)
    const toggleDropdownDeposit = () => setIsOpenDeposit(!isOpenDeposit);
    const closeModalDeposit = () => { setIsOpenDeposit(false); };

    useEffect(() => {
        const handleClickOutsideDeposit = (event) => {
            if (dropdownRefDeposit.current && !dropdownRefDeposit.current.contains(event.target)) {
                setIsOpenDeposit(false);
            }
        };

        if (isOpenDeposit) {
            document.addEventListener('mousedown', handleClickOutsideDeposit);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDeposit);
        };
    }, [isOpenDeposit]);
    return (
        <>
            <button className="flex-1 hero" onClick={toggleDropdownDeposit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                fill="currentColor"
              >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
              </svg>
              <span>Deposit</span>
            </button>
            {isOpenDeposit && (
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
                  ref={dropdownRefDeposit}
                  style={{ borderRadius: "1rem" }}
                >
                  <div className="header svelte-1bbimtl">
                    <h2
                      id="modal-title-1"
                      data-tid="modal-title"
                      className="svelte-1bbimtl"
                    >
                      Deposit
                    </h2>
                    <button
                      data-tid="close-modal"
                      aria-label="Close"
                      className="svelte-1bbimtl"
                      onClick={closeModalDeposit}
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
                      <div
                        className="content svelte-1bbimtl"
                        id="modal-content-1"
                      >
                        <p className="font-bold text-center">Principal ID:</p>
                        <p className="mb-2 font-normal text-center">
                          <output className="break-words">
                            {window.principalString? window.principalString : ''}
                          </output>
                          <button
                            aria-label="Copy: 0x50Cd02E3C19778149c8D597da14097fc932323f5"
                            const
                            style={{
                              height: "var(--padding-4x)",
                              width: "var(--padding-4x)",
                              minWidth: "var(--padding-4x)",
                              verticalAlign: "sub",
                            }}
                            className="inline-block"
                            onClick={()=> handleCopyClick(window.principalString? window.principalString : '')}
                          >
                            <svg
                              height="20px"
                              width="20px"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.75 3C5.23207 3 4 4.22862 4 5.74826V14.75H5.5V5.74826C5.5 5.05875 6.05879 4.5 6.75 4.5H12.75V3H6.75ZM8.75 7.25H13.75C14.0261 7.25 14.25 7.47386 14.25 7.75V15.75C14.25 16.0261 14.0261 16.25 13.75 16.25H8.75C8.47386 16.25 8.25 16.0261 8.25 15.75V7.75C8.25 7.47386 8.47386 7.25 8.75 7.25ZM6.75 7.75C6.75 6.64543 7.64543 5.75 8.75 5.75H13.75C14.8546 5.75 15.75 6.64543 15.75 7.75V15.75C15.75 16.8546 14.8546 17.75 13.75 17.75H8.75C7.64543 17.75 6.75 16.8546 6.75 15.75V7.75Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>
                        </p>
                        <p className="font-bold text-center">Account ID:</p>
                        <p className="mb-2 font-normal text-center">
                          <output className="break-words">
                            {window.accountIdString ? window.accountIdString : ''}
                          </output>
                          <button
                            aria-label="Copy: 0x50Cd02E3C19778149c8D597da14097fc932323f5"
                            const
                            style={{
                              height: "var(--padding-4x)",
                              width: "var(--padding-4x)",
                              minWidth: "var(--padding-4x)",
                              verticalAlign: "sub",
                            }}
                            className="inline-block"
                            onClick={()=> handleCopyClick(window.accountIdString ? window.accountIdString : '')}
                          >
                            <svg
                              height="20px"
                              width="20px"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.75 3C5.23207 3 4 4.22862 4 5.74826V14.75H5.5V5.74826C5.5 5.05875 6.05879 4.5 6.75 4.5H12.75V3H6.75ZM8.75 7.25H13.75C14.0261 7.25 14.25 7.47386 14.25 7.75V15.75C14.25 16.0261 14.0261 16.25 13.75 16.25H8.75C8.47386 16.25 8.25 16.0261 8.25 15.75V7.75C8.25 7.47386 8.47386 7.25 8.75 7.25ZM6.75 7.75C6.75 6.64543 7.64543 5.75 8.75 5.75H13.75C14.8546 5.75 15.75 6.64543 15.75 7.75V15.75C15.75 16.8546 14.8546 17.75 13.75 17.75H8.75C7.64543 17.75 6.75 16.8546 6.75 15.75V7.75Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </button>
                        </p>
                        <div
                          className="p-2 rounded-sm bg-off-white"
                          style={{
                            border: "1px dashed #0e002d",
                            maxWidth: "360px",
                            margin: "0px auto",
                            height: "360px",
                          }}
                        >
                          <div
                            className="container svelte-1np4ydw"
                            data-tid="qr-code"
                          >
                            <div
                              aria-label="0x50Cd02E3C19778149c8D597da14097fc932323f5"
                              style={{ width: "100%", height: "100%" }}
                              width="659"
                              height="659"
                            >
                              <div style={{ height: "100%", width: "100%" }}>
                                <QRCode
                                  size={256}
                                  style={{
                                    height: "auto",
                                    maxWidth: "100%",
                                    width: "100%",
                                  }}
                                  value={JSON.stringify({accoundId: window.accountIdString? window.accountIdString: '',principalId: window.principalString? window.principalString : ''})}
                                  includeMargin={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className="primary full center text-center mt-6 mb-3"
                          onClick={closeModalDeposit}
                        >
                          <span style={{ margin: "auto" }}>Done</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
    )
}

export default DepositModal
