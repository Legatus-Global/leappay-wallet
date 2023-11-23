import React, { useState, useRef, useEffect } from "react";
import "./Article.css";
import QRCode from "react-qr-code";
import toast, { Toaster } from "react-hot-toast";
import { handleCopyClick } from "../../utils/HandleCopyClick";

const Article = ({ handleShow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <article className="flex flex-col text-off-white rounded-lg pt-1 sm:pt-3 pb-2 px-4 relative main svelte-bnd0rw">
        <a
          rel="external noopener noreferrer"
          target="_blank"
          className="no-underline inline-block text-center px-3 py-1 font-bold text-xs md:text-base svelte-1xf36on"
        >
          <svg
            width="20"
            style={{ minWidth: "20px", verticalAlign: " sub" }}
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
          <div
            role="toolbar"
            className="flex gap-2 text-deep-violet font-bold py-4"
          >
            <button className="flex-1 hero" onClick={toggleDropdown}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.68629 9.65686L12.3431 15.3137M12.3431 15.3137L18 9.65686M12.3431 15.3137V4.00001"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <line
                  x1="6"
                  y1="19"
                  x2="19"
                  y2="19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeinejoin="round"
                ></line>
              </svg>
              <span>Receive</span>
            </button>
            {isOpen && (
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
                  ref={dropdownRef}
                  style={{ overflow: "auto", borderRadius: "1rem" }}
                >
                  <div className="header svelte-1bbimtl">
                    <h2
                      id="modal-title-1"
                      data-tid="modal-title"
                      className="svelte-1bbimtl"
                    >
                      Receive
                    </h2>
                    <button
                      data-tid="close-modal"
                      aria-label="Close"
                      className="svelte-1bbimtl"
                      onClick={closeModal}
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
                    style={{ margin: "1.5rem" }}
                  >
                    <div className="container svelte-1bbimtl">
                      <div
                        className="content svelte-1bbimtl"
                        id="modal-content-1"
                      >
                        <p className="font-bold text-center">Principal ID:</p>
                        <p className="mb-2 font-normal text-center">
                          <output className="break-words">
                            {window.principalString
                              ? window.principalString
                              : ""}
                          </output>
                          <button
                            onClick={() =>
                              handleCopyClick(
                                window.principalString
                                  ? window.principalString
                                  : ""
                              )
                            }
                            aria-label="Copy: 0x50Cd02E3C19778149c8D597da14097fc932323f5"
                            const
                            style={{
                              height: "var(--padding-4x)",
                              width: "var(--padding-4x)",
                              minWidth: "var(--padding-4x)",
                              verticalAlign: "sub",
                            }}
                            className="inline-block"
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
                            {window.accountIdString
                              ? window.accountIdString
                              : ""}
                          </output>
                          <button
                            onClick={() =>
                              handleCopyClick(
                                window.accountIdString
                                  ? window.accountIdString
                                  : ""
                              )
                            }
                            aria-label="Copy: 0x50Cd02E3C19778149c8D597da14097fc932323f5"
                            const
                            style={{
                              height: "var(--padding-4x)",
                              width: "var(--padding-4x)",
                              minWidth: "var(--padding-4x)",
                              verticalAlign: "sub",
                            }}
                            className="inline-block"
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
                            height: "auto",
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
                                  value={JSON.stringify({
                                    accoundId: window.accountIdString
                                      ? window.accountIdString
                                      : "",
                                    principalId: window.principalString
                                      ? window.principalString
                                      : "",
                                  })}
                                  includeMargin={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={closeModal}
                          className="primary full center text-center mt-6 mb-3"
                        >
                          <span style={{ margin: "auto" }}>Done</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default Article;
