import React from "react";
import { usePageContext } from './index'

interface NavBarProps {
    list: string[];
}

const NavBar: React.FC<NavBarProps> = ({ list }) => {
    const { openPage } = usePageContext();

    const handlePageClick = (pageName: string) => {
        openPage(pageName);
    }

    return(
        <ul className="m-4 mb-4 flex flex-col gap-1">
            {list.map((pageName, index) => (
                <li key={index} onClick={() => {handlePageClick(pageName)}}>
                    <button className="middle none font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize" type="button">
                        <p className="text-base leading-relaxed text-inherit font-medium normal-case" >{pageName}</p>
                    </button>
                </li>
                
            ))}
        </ul>
    )
}

export default NavBar