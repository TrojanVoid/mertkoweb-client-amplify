import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Main() {

  const offsets = ["/apps/file-manager", "/apps/email", "/apps/calendar"];
  const { pathname } = useLocation();
  const bc = document.body.classList;

  // set sidebar to offset
  (offsets.includes(pathname)) ? bc.add("sidebar-offset") : bc.remove("sidebar-offset");

  // auto close sidebar when switching pages in mobile
  bc.remove("sidebar-show");

  // scroll to top when switching pages
  window.scrollTo(0, 0);

  return (
    <React.Fragment>
      <div className="panel-wrapper">
        <Header />
        <Sidebar />
        <Outlet />
      </div>
    </React.Fragment> 
  )
}