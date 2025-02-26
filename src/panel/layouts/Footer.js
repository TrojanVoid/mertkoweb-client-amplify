import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="main-footer">
      <span>&copy; 2025. MeraklıKids. All Rights Reserved.</span>
      <span>Created by: <Link to="http://themepixels.me" target="_blank">CBS</Link></span>
    </div>
  )
}