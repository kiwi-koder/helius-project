"use client";

import dynamic from "next/dynamic";

const PlaygroundPage = dynamic(() => import("./playground/PlaygroundPage"), {
  ssr: false,
});

export default function Home() {
  return <PlaygroundPage />;
}
