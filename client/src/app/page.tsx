'use client';

import React from "react";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Welcome to&nbsp;</span>
        <span className={title({ color: "violet" })}>ETC Shop&nbsp;</span>
        <br />
        <span className={title()}>
          to the best shopping experience
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern shopping web.
        </div>
      </div>
    </section>
  );
}
