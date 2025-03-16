// src/layouts/Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import userAvatar from "../assets/img/img1.jpg";
import notification from "../data/Notification";
import { UserContext } from '../context/UserContext'; 
import { useEffect,useState } from "react";

export default function Header({ onSkin = () => {} })  {
  const { user } = useContext(UserContext);
  
  const [skin, setSkin] = useState(localStorage.getItem("skin-mode") || "light");
  
  useEffect(() => {
    const storedSkin = localStorage.getItem("skin-mode");
    if (storedSkin) {
      setSkin(storedSkin);
    }
  }, []);
  useEffect(() => {
    const storedSkin = localStorage.getItem("skin-mode");
    const HTMLTag = document.querySelector("html");

    if (storedSkin === "dark") {
      HTMLTag.setAttribute("data-skin", storedSkin);
      document.body.style.color = "white";
      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "white";
      });
      onSkin(storedSkin);
    } else if (storedSkin === "light") {
      HTMLTag.setAttribute("data-skin", storedSkin);
      document.body.style.color = "black";
      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "black";
      });
      onSkin(storedSkin);
    } else {
      HTMLTag.removeAttribute("data-skin");
      document.body.style.color = "";
      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "";
      });
      onSkin("");
    }
  }, [onSkin]);

  useEffect(() => {
    if (typeof onSkin === "function") {
      onSkin(skin);
    }
  }, [skin, onSkin]);

  
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      to=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="dropdown-link"
    >
      {children}
    </Link>
  ));
 
 const toggleSkin = (e) => {
  e.preventDefault();
  const newSkin = skin === "light" ? "dark" : "light";
  setSkin(newSkin);
  localStorage.setItem("skin-mode", newSkin);
  window.location.reload();
};
  const toggleSidebar = (e) => {
    e.preventDefault();
    let isOffset = document.body.classList.contains("sidebar-offset");
    if (isOffset) {
      document.body.classList.toggle("sidebar-show");
    } else {
      if (window.matchMedia("(max-width: 991px)").matches) {
        document.body.classList.toggle("sidebar-show");
      } else {
        document.body.classList.toggle("sidebar-hide");
      }
    }
  }
  

  function NotificationList() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
      document.body.className = theme;
    }, [theme]);
  
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    };
  
    const notiList = notification.map((item, key) => (
      <li className="list-group-item" key={key}>
        <div className={item.status === "online" ? "avatar online" : "avatar"}>
          {item.avatar}
        </div>
        <div className="list-group-body">
          <p>{item.text}</p>
          <span>{item.date}</span>
        </div>
      </li>
    ));
  
    return (
      <div>
    
        <button onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode'a Geç" : "Light Mode'a Geç"}
        </button>
        <ul className="list-group">
          {notiList}
        </ul>
      </div>
    );
  }
  
  
  const skinMode = (e) => {
    e.preventDefault();
    e.target.classList.add("active");

    let node = e.target.parentNode.firstChild;
    while (node) {
      if (node !== e.target && node.nodeType === Node.ELEMENT_NODE)
        node.classList.remove("active");
      node = node.nextElementSibling || node.nextSibling;
    }

    let skin = e.target.textContent.toLowerCase();
    let HTMLTag = document.querySelector("html");

    if (skin === "dark") {
      HTMLTag.setAttribute("data-skin", skin);
      localStorage.setItem("skin-mode", skin);
      
  
      document.body.style.color = "white";
      
 
      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "white";
      });
      
      onSkin(skin);
    
    } else if (skin === "light") {
      HTMLTag.setAttribute("data-skin", skin);
      localStorage.setItem("skin-mode", skin);
      
   
      document.body.style.color = "black";
      

      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "black";
      });
      
      onSkin(skin);
    
    } else {
      HTMLTag.removeAttribute("data-skin");
      localStorage.removeItem("skin-mode");
      
      
      document.body.style.color = "";
      document.querySelectorAll('.breadcrumb-item.active').forEach(item => {
        item.style.color = "";
      });
      
      onSkin("");
    }
    
    

  };

  const sidebarSkin = (e) => {
    e.preventDefault();
    e.target.classList.add("active");

    let node = e.target.parentNode.firstChild;
    while (node) {
      if (node !== e.target && node.nodeType === Node.ELEMENT_NODE)
        node.classList.remove("active");
      node = node.nextElementSibling || node.nextSibling;
    }

    let skin = e.target.textContent.toLowerCase();
    let HTMLTag = document.querySelector("html");

    HTMLTag.removeAttribute("data-sidebar");

    if (skin !== "default") {
      HTMLTag.setAttribute("data-sidebar", skin);
      localStorage.setItem("sidebar-skin", skin);
    } else {
      localStorage.removeItem("sidebar-skin", skin);
    }
  };

  return (
    <div className="header-main px-3 px-lg-4">
      <Link onClick={toggleSidebar} className="menu-link me-3 me-lg-4"><i className="ri-menu-2-fill"></i></Link>

      <div className="form-search me-auto">
        <input type="text" className="form-control" placeholder="Search" />
        <i className="ri-search-line"></i>
      </div> 

     

     

      <Dropdown className="dropdown-profile ms-3 ms-xl-4" align="end">
        <Dropdown.Toggle as={CustomToggle}>
          <div className="avatar online">
            <img src={userAvatar} alt="" />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="mt-10-f">
          <div className="dropdown-menu-body">
       
            <hr />
            <nav className="nav">
            
              <Link to="/admin" style={{ padding: '10px', color: '#d9534f', display: 'flex', alignItems: 'center' }}><i className="ri-logout-box-r-line"></i> Çıkış Yap</Link>
            </nav>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
