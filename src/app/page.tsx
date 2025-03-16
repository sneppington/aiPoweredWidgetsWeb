"use client";

import { match } from "assert";
import Image from "next/image";
import Link from 'next/link';
import { Node } from "postcss";
import { useEffect, useRef, useState } from "react";
import DashboardBrowse from "./pages/dashboardBrowse"
import Home from "./pages/home"

export default function Index() {
  const [page, setPage] = useState("dashboardBrowse")
  const pageRef = useRef(page)

  useEffect(() => {
    pageRef.current = page
  }, [page])

  return (
    <>
      { page === "home" && <Home></Home> }
      { page === "dashboardBrowse" && <DashboardBrowse></DashboardBrowse> }
    </>
  );
}
