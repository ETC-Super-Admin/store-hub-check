"use client";

import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-screen">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ size: "lg" })}>Oops!&nbsp;</span>
        <span className={title({ size: "lg", color: "yellow" })}>
          Sorry&nbsp;
        </span>
        <br />
        <span className={title({ color: "pink" })}>Status - 404</span>
        <div className={subtitle({ class: "mt-4" })}>Page not found</div>
      </div>
      <Link href="/" className="inline-block">
        <Button color="primary" startContent={<Home size={20} />}>
          Back to Home Page
        </Button>
      </Link>
    </div>
  );
}
