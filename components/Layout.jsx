import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TopBanner from "./TopBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const Layout = ({ children, topBannerData }) => {
  return (
    <div className="layout">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>Tek Way</title>
      </Head>
      <header>
        {topBannerData && (
          <TopBanner
            text={topBannerData.text}
            discount={topBannerData.discount}
            isVisible={topBannerData.isVisible}
          />
        )}
        <Navbar />
      </header>
      <main className="main-container">{children}</main>
      <footer>
        <Footer />
      </footer>
      <SpeedInsights />
      <Analytics />
    </div>
  );
};

export default Layout;
