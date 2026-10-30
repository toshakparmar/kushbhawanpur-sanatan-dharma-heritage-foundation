import React from "react";
import { getSiteData, getDonateConfig } from "@/lib/api";
import { HomeClient } from "@/components/HomeClient";

export const revalidate = 60; // ISR revalidation window in seconds

export default async function HomePage() {
  const [siteData, donateConfig] = await Promise.all([
    getSiteData(),
    getDonateConfig(),
  ]);

  return <HomeClient siteData={siteData} donateConfig={donateConfig} />;
}
