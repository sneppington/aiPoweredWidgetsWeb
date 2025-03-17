"use client";

import { useEffect, useRef, useState } from "react";
import DashboardBrowse from "./pages/dashboardBrowse"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard";

export default function Index() {
  const [page, setPage] = useState("dashboard")
  const pageRef = useRef(page)
  useEffect(() => {
    pageRef.current = page
  }, [page])

  useEffect(() => {
    setPage("dashboard")
  }, [])

  return (
    <>
      { page === "home" && <Home></Home> }
      { page === "dashboardBrowse" && <DashboardBrowse></DashboardBrowse> }
      { page === "dashboard" && <Dashboard></Dashboard> }
    </>
  );
}
