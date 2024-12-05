"use client";

import * as React from "react";

import Navbar from "@/components/Navbar";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps): JSX.Element {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="w-full mt-5">{props.children}</div>
    </div>
  );
}
