import React from 'react'
import './Header.css'
const Header = () => {

    return (
        <header className="flex justify-center md-px-2 py-2 relative z-1">
            <a className='no-underline inline-block text-center px-3 py-1 font-bold text-xs md:text-base svelte-1xf36on' style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="20" style={{ minWidth: '20px', verticalAlign: 'sub' }} height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.55 15.7069L11.5611 0.870937C10.9948 -0.180938 9.48637 -0.180938 8.91965 0.870937L0.931217 15.7069C0.80827 15.9352 0.74663 16.1916 0.752313 16.4508C0.757997 16.7101 0.83081 16.9635 0.963646 17.1863C1.09648 17.409 1.2848 17.5935 1.51022 17.7217C1.73564 17.85 1.99046 17.9176 2.24981 17.918H18.229C18.4886 17.918 18.7437 17.8507 18.9694 17.7226C19.1952 17.5945 19.3838 17.4101 19.5169 17.1873C19.65 16.9644 19.7231 16.7109 19.7289 16.4514C19.7346 16.1919 19.673 15.9354 19.55 15.7069ZM10.2406 15.6211C10.0552 15.6211 9.87392 15.5661 9.71974 15.4631C9.56557 15.3601 9.44541 15.2137 9.37445 15.0424C9.3035 14.8711 9.28493 14.6826 9.32111 14.5007C9.35728 14.3188 9.44657 14.1518 9.57768 14.0207C9.70879 13.8896 9.87584 13.8003 10.0577 13.7641C10.2396 13.7279 10.4281 13.7465 10.5994 13.8175C10.7707 13.8884 10.9171 14.0086 11.0201 14.1627C11.1231 14.3169 11.1781 14.4982 11.1781 14.6836C11.1781 14.9322 11.0793 15.1707 10.9035 15.3465C10.7277 15.5223 10.4892 15.6211 10.2406 15.6211ZM11.2587 6.19219L10.9897 11.9109C10.9897 12.1098 10.9106 12.3006 10.77 12.4413C10.6293 12.5819 10.4386 12.6609 10.2397 12.6609C10.0407 12.6609 9.84998 12.5819 9.70932 12.4413C9.56867 12.3006 9.48965 12.1098 9.48965 11.9109L9.22059 6.19453C9.21455 6.05793 9.23606 5.92151 9.28386 5.79341C9.33166 5.6653 9.40476 5.54813 9.49881 5.44888C9.59285 5.34963 9.70592 5.27033 9.83127 5.2157C9.95662 5.16108 10.0917 5.13225 10.2284 5.13094H10.2382C10.3759 5.13087 10.5122 5.15869 10.6388 5.21272C10.7654 5.26675 10.8797 5.34587 10.9749 5.44531C11.0701 5.54475 11.1442 5.66245 11.1926 5.7913C11.2411 5.92015 11.2629 6.05748 11.2568 6.195L11.2587 6.19219Z" fill="currentColor"></path></svg>
                <span className="pl-1">Learn more about this alpha version. Use with caution.</span>
            </a>
        </header>
    )
}

export default Header
