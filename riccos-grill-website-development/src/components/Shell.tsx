"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { OrderProvider } from "@/components/order/OrderProvider";
import { OrderDrawer } from "@/components/order/OrderDrawer";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";

/** Client providers + chrome. Page sections are passed in as server-rendered children. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <OrderProvider>
        <Header />
        {children}
        <OrderDrawer />
        <div className="grain" aria-hidden="true" />
        <Preloader />
      </OrderProvider>
    </SmoothScroll>
  );
}
