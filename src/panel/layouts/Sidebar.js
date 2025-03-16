import React, { useContext, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import userAvatar from "../assets/img/img1.jpg";
import { UserContext } from '../context/UserContext'; // Import UserContext
import { useState } from "react";
import {
    dashboardMenu,
    applicationsMenu,
    pagesMenu,
    uiElementsMenu
} from "../data/Menu";

export default function Sidebar() {
    const { user } = useContext(UserContext); // Get user from context
    const scrollBarRef = useRef(null); // Use useRef hook
    const [isMenuVisible, setMenuVisible] = useState(true);

    const toggleFooterMenu = (e) => {
        e.preventDefault();
        setMenuVisible(!isMenuVisible);
        let parent = document.getElementsByClassName('sidebar')[0] || document.getElementsByClassName('sidebar-show')[0];
        console.log('parent:', parent);
        parent.classList.toggle("footer-menu-show");
    }

    const updateScroll = () => {
        if (scrollBarRef.current) {
            scrollBarRef.current.updateScroll();
        }
    }

    return (
        <div className="sidebar h-[90vh]">
            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-logo">Mertko Panel</Link>
            </div>
            <PerfectScrollbar className="sidebar-body" ref={scrollBarRef}>
                <SidebarMenu onUpdateSize={updateScroll} />
            </PerfectScrollbar>
            <div className="sidebar-footer" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', zIndex: 10, boxShadow: '-20px -20px 20px #fff', transition: 'all 0.25s' }}>
    <div className="sidebar-footer-top" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="sidebar-footer-thumb" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}>
            <img src={userAvatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
        </div>
        <div className="sidebar-footer-body" style={{ flex: 1 }}>
            <h6 style={{ marginBottom: '2px', fontWeight: '600' }}>
                <a href="" style={{ color: '#000' }}>{user.username}</a>
            </h6>
            <p style={{ marginBottom: '0', fontSize: '12px', color: '#888' }}>Administrator</p>
        </div>
        <Link onClick={toggleFooterMenu} to="" className="dropdown-link" style={{ fontSize: '20px', color: '#888', cursor: 'pointer', transition: 'all 0.25s' }}>
            {isMenuVisible ? <i className="ri-arrow-down-s-line" /> : <i className="ri-arrow-up-s-line" />}
        </Link>
    </div>
    <div className="sidebar-footer-menu" style={{ display: isMenuVisible ? 'block' : 'none' }}>
    <nav className="nav" style={{ flexDirection: 'column' }}>
        <Link to="/admin" style={{ padding: '10px', color: '#d9534f', display: 'flex', alignItems: 'center' }}>
            <i className="ri-logout-box-r-line" style={{ marginRight: '10px' }}></i> Çıkış Yap
        </Link>
    </nav>
</div>
</div>
        </div>
    );
}

function SidebarMenu({ onUpdateSize }) {
    const populateMenu = (m) => {
        const menu = m.map((m, key) => {
            let sm;
            if (m.submenu) {
                sm = m.submenu.map((sm, key) => {
                    return (
                        <NavLink to={sm.link} onClick={toggleMenu} className="nav-sub-link" key={key}>{sm.label}</NavLink>
                    )
                })
            }

            return (
                <li key={key} className="nav-item">
                    {(!sm) ? (
                        <NavLink to={m.link} onClick={toggleMenu} className="nav-link"><i className={m.icon}></i> <span>{m.label}</span></NavLink>
                    ) : (
                        <div onClick={toggleSubMenu} className="nav-link has-sub"><i className={m.icon}></i> <span>{m.label}</span></div>
                    )}
                    {m.submenu && <nav className="nav nav-sub">{sm}</nav>}
                </li>
            )
        });

        return (
            <ul className="nav nav-sidebar">
                {menu}
            </ul>
        );
    }

    // Toggle menu group
    const toggleMenu = (e) => {

        const mobileMenuToggler = document.getElementsByClassName('menu-link me-3 me-lg-4')[0];
        const computedStyle = window.getComputedStyle(mobileMenuToggler).display;
        const isMobileMenuActive = computedStyle !== 'none';

        if(!isMobileMenuActive) return;

        const sidebar = document.querySelector('.sidebar');
        const sidebarShown = document.querySelector('.sidebar-show');
        if (sidebarShown !== null) {
            sidebarShown.classList.remove('sidebar-show');
            sidebarShown.classList.add('sidebar');
        } else if(sidebar !== null) {
            sidebar.classList.remove('sidebar');
            sidebar.classList.add('sidebar-show');  
        }

        /* let parent = e.target.closest('.nav-group');
        parent.classList.toggle('show');

        const sidebar = document.querySelector('.sidebar');
        const sidebarShown = sidebar.classList.contains('sidebar-show');
        if (sidebarShown) {
            sidebar.classList.remove('sidebar-show');
            sidebar.classList.add('sidebar');
        } else {
            sidebar.classList.remove('sidebar');
            sidebar.classList.add('sidebar-show');  
        }

        console.log('sidebar click event');

        onUpdateSize(); */
    }

    // Toggle submenu while closing siblings' submenu
    const toggleSubMenu = (e) => {
        e.preventDefault();

        let parent = e.target.closest('.nav-item');
        let node = parent.parentNode.firstChild;

        while (node) {
            if (node !== parent && node.nodeType === Node.ELEMENT_NODE)
                node.classList.remove('show');
            node = node.nextElementSibling || node.nextSibling;
        }

        parent.classList.toggle('show');

        onUpdateSize();
    }

    return (
        <React.Fragment>
            <div className="nav-group show">
                <div className="nav-label no-arrow">Admin Paneli</div>
                {populateMenu(dashboardMenu)}
            </div>
        </React.Fragment>
    )
}

window.addEventListener("click", function (e) {
    // Close sidebar footer menu when clicked outside of it
    let tar = e.target;
    let sidebar = document.querySelector(".sidebar");
    if (!tar.closest(".sidebar") && sidebar) {
        sidebar.classList.remove("footer-menu-show");
    }

    // Hide sidebar offset when clicked outside of sidebar
    if (!tar.closest(".sidebar") && !tar.closest(".menu-link")) {
        document.querySelector("body").classList.remove("sidebar-show");
    }
});

window.addEventListener("load", function () {
    let skinMode = localStorage.getItem("sidebar-skin");
    let HTMLTag = document.querySelector("html");

    if (skinMode) {
        HTMLTag.setAttribute("data-sidebar", skinMode);
    }
});
