"use client";

import { useEffect, useRef, useState } from "react";
import DashboardBrowse from "./pages/dashboardBrowse"
import Home from "./pages/home"

export default function Index() {
  const [page, setPage] = useState("dashboardBrowse")
  const pageRef = useRef(page)
  useEffect(() => {
    pageRef.current = page
  }, [page])

  useEffect(() => {
    setPage("dashboardBrowse")
  }, [])

  return (
    <>
      { page === "home" && <Home></Home> }
      { page === "dashboardBrowse" && <DashboardBrowse></DashboardBrowse> }
    </>
  );
}
