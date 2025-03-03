import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="main-footer">
      <span>&copy; 2025. Mertko. Tüm Hakları Saklıdır.</span>
      <span><Link to="#" target="_blank">CBS</Link> Tarafından Hazırlanmıştır</span>
    </div>
  )
}