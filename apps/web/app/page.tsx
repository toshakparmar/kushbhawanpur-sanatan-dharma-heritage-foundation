import React from "react";
import { getSiteData, getDonateConfig } from "@/lib/api";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Always fetch live data from CMS on every request

export default async function HomePage() {
  const [siteData, donateConfig] = await Promise.all([
    getSiteData(),
    getDonateConfig(),
  ]);

  return <HomeClient siteData={siteData} donateConfig={donateConfig} />;
}
