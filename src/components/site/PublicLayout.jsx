import React, { useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import BottomNav from "@/components/site/BottomNav";
import MobilePublicHeader from "@/components/site/MobilePublicHeader";

export default function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const cacheRef = useRef({});

  // Keep-alive: cache each visited route so tab switches preserve state/scroll
  cacheRef.current[location.pathname] = outlet;

  return (
    <>
      <MobilePublicHeader />
      {Object.entries(cacheRef.current).map(([path, element]) => (
        <div
          key={path}
          className={path === location.pathname ? "block" : "hidden"}
          aria-hidden={path !== location.pathname}
        >
          {element}
        </div>
      ))}
      <div className="h-20 md:hidden" />
      <BottomNav />
    </>
  );
}