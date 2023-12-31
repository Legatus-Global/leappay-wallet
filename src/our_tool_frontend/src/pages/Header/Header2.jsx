import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { AuthClient } from "@dfinity/auth-client";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const Header2 = () => {
        const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null)
    const toggleDropdown = () => setIsOpen(!isOpen);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        const authClient = await AuthClient.create({
            idleOptions: {
                idleTimeout: 1000 * 60 * 30, // set to 30 minutes
                disableDefaultIdleCallback: true // disable the default reload behavior
            }
        });
        await authClient.logout();
        navigate("/");
        localStorage.clear();
            }
    function goBack() {
        navigate(-1); // This line navigates to the previous page
    }

    return (
        <header className='flex justify-between md:px-2 relative z-1 pointer-events-none' style={{ minHeight: '76px' }}>
            <div className='flex p-2 items-center text-off-white'>
                <div className="flex justify-center items-center">
                    {location.pathname === '/wallet' && <> <img src='Legatus.jpg' role="presentation" alt="" loading="lazy"
                        width="50px" height="50px" decoding="async" className="rounded-50" style={{ border: '3px solid #5a5a5f' }} />
                        <h6 className="font-bold" style={{ marginLeft: '1rem' }}>Leap Pay</h6></>}
                </div>
                {location.pathname.includes('/send-token') && <button className="flex gap-0.5 text-white font-bold pointer-events-all" onClick={goBack}>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 15.5L7 10.25L12.25 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg> Back to Wallet</button>}
            </div>
            <div className="flex m-2 gap-2 pointer-events-all" style={{ marginLeft: 'auto' }}>
                {/* <button className="wallet-connect icon desktop-wide">
                    <svg fill="none" height="24" viewBox="0 0 480 332" width="34.7" xmlns="http://www.w3.org/2000/svg"><path d="m126.613 93.9842c62.622-61.3123 164.152-61.3123 226.775 0l7.536 7.3788c3.131 3.066 3.131 8.036 0 11.102l-25.781 25.242c-1.566 1.533-4.104 1.533-5.67 0l-10.371-10.154c-43.687-42.7734-114.517-42.7734-158.204 0l-11.107 10.874c-1.565 1.533-4.103 1.533-5.669 0l-25.781-25.242c-3.132-3.066-3.132-8.036 0-11.102zm280.093 52.2038 22.946 22.465c3.131 3.066 3.131 8.036 0 11.102l-103.463 101.301c-3.131 3.065-8.208 3.065-11.339 0l-73.432-71.896c-.783-.767-2.052-.767-2.835 0l-73.43 71.896c-3.131 3.065-8.208 3.065-11.339 0l-103.4657-101.302c-3.1311-3.066-3.1311-8.036 0-11.102l22.9456-22.466c3.1311-3.065 8.2077-3.065 11.3388 0l73.4333 71.897c.782.767 2.051.767 2.834 0l73.429-71.897c3.131-3.065 8.208-3.065 11.339 0l73.433 71.897c.783.767 2.052.767 2.835 0l73.431-71.895c3.132-3.066 8.208-3.066 11.339 0z" fill="#fff"></path></svg>
                    <span className="text-white font-bold text-xs">Connect</span></button> */}
                <button className="user icon" aria-label="Settings, sign-out and external links" onClick={toggleDropdown}>
                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16.5412" cy="16" r="15.6" fill="#F8F6FC"></circle><path d="M22.5577 10.1855C21.2496 10.1855 19.8236 10.8559 18.3165 12.1761C17.6015 12.8018 16.984 13.4721 16.5209 14.0083C16.5209 14.0083 16.5209 14.0083 16.525 14.0124V14.0083C16.525 14.0083 17.2562 14.8046 18.0646 15.6577C18.4993 15.1417 19.125 14.4389 19.844 13.8052C21.1846 12.6312 22.058 12.3833 22.5577 12.3833C24.4387 12.3833 25.9661 13.8743 25.9661 15.7064C25.9661 17.5264 24.4346 19.0173 22.5577 19.0295C22.4724 19.0295 22.3627 19.0173 22.2245 18.9889C22.773 19.2245 23.3621 19.3951 23.9227 19.3951C27.3676 19.3951 28.042 17.1486 28.0867 16.9861C28.1883 16.5758 28.2411 16.1452 28.2411 15.7024C28.2411 12.6636 25.6899 10.1855 22.5577 10.1855Z" fill="url(#paint0_linear_7_386)"></path><path d="M10.5246 21.2375C11.8327 21.2375 13.2586 20.5672 14.7658 19.2469C15.4808 18.6213 16.0983 17.951 16.5613 17.4147C16.5613 17.4147 16.5614 17.4147 16.5573 17.4107V17.4147C16.5573 17.4147 15.8261 16.6185 15.0177 15.7654C14.583 16.2813 13.9574 16.9841 13.2383 17.6178C11.8977 18.7919 11.0243 19.0397 10.5246 19.0397C8.64367 19.0356 7.11618 17.5447 7.11618 15.7125C7.11618 13.8926 8.64773 12.4016 10.5246 12.3895C10.6099 12.3895 10.7196 12.4016 10.8577 12.4301C10.3093 12.1945 9.72022 12.0238 9.1596 12.0238C5.71464 12.0238 5.04433 14.2704 4.99558 14.4288C4.89402 14.8432 4.84121 15.2697 4.84121 15.7125C4.84121 18.7594 7.39243 21.2375 10.5246 21.2375Z" fill="url(#paint1_linear_7_386)"></path><path d="M23.9143 19.3464C22.1512 19.3017 20.319 17.9123 19.9453 17.567C18.9785 16.6733 16.7481 14.2561 16.5735 14.0652C14.9404 12.233 12.7263 10.1855 10.5245 10.1855H10.5204H10.5163C7.84323 10.1977 5.5967 12.0096 4.99545 14.4268C5.04014 14.2683 5.9217 11.9771 9.15541 12.0583C10.9185 12.103 12.7588 13.5127 13.1366 13.858C14.1035 14.7517 16.3338 17.1689 16.5085 17.3598C18.1416 19.188 20.3556 21.2355 22.5574 21.2355H22.5615H22.5656C25.2387 21.2233 27.4892 19.4114 28.0865 16.9942C28.0377 17.1527 27.1521 19.4236 23.9143 19.3464Z" fill="#2CBAF7"></path><defs><linearGradient id="paint0_linear_7_386" x1="19.5992" y1="10.9141" x2="27.3264" y2="18.9159" gradientUnits="userSpaceOnUse"><stop offset="0.21" stopColor="#FF591E"></stop><stop offset="0.6841" stopColor="#FBB03B"></stop></linearGradient><linearGradient id="paint1_linear_7_386" x1="13.4831" y1="20.5089" x2="5.75587" y2="12.5071" gradientUnits="userSpaceOnUse"><stop offset="0.21" stopColor="#ED1E79"></stop><stop offset="0.8929" stopColor="#8134DC"></stop></linearGradient></defs></svg>
                </button >
                {isOpen && (
                    <div role="menu" aria-orientation="vertical" className="popover svelte-kxf19z" tabIndex="-1" style={{ popoverTop: '57.60000133514404px', popoverLeft: '1464px', popoverRight: '28.799999237060547px' }}>
                        <div role="button" tabIndex="-1" aria-label="Close" className="backdrop svelte-whxjdd" data-tid="backdrop">
                        </div>
                        <div className="wrapper svelte-kxf19z rtl" ref={dropdownRef}>
                            <div className="flex flex-col gap-1">
                                {/* <a href="#" rel="external noopener noreferrer" target="_blank" className="flex gap-1 items-center no-underline" aria-label="Open the Internet Computer portal" >
                                    <div className="flex items-center justify-center rounded-50" style={{ border: '1px solid #c0bbc4', zoom: '0.6' }}></div>
                                    Internet Computer
                                </a>
                                <a rel="external noopener noreferrer" target="_blank" className="flex gap-1 items-center no-underline" aria-label="Source code on GitHub">
                                    Source code
                                </a>
                                <hr className="bg-dark-blue opacity-15 my-0.5" style={{ width: "100%", border: "0.05rem solid" }} /> */}
                                <button className="flex gap-1 items-center no-underline" aria-label="More settings" >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" /></svg>Settings
                                </button>
                                <button data-tid="logout" className="text" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" /></svg>Logout
                                </button>
                            </div>
                        </div>
                    </div>)}
            </div>
        </header >
    )
}

export default Header2
