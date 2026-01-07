"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
const Hero = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    const imageElement = imgRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-20 px-4">
      <div className="mx-auto container text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[145px] pb-6  gradient gradient-title">
          Manage your finances <br /> with Intellegence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered platfom that helps you track, analyze,and optimize your
          real time speeding with real-time insghts
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <Link href={"/dashboard"}>
          <Button size="lg" variant={"outline"} className={"px-8"}>
            Get Started
          </Button>
        </Link>
        <Link href="https://www.youtube.com">
          <Button size="lg" className="px-8">
            Watch Demo
          </Button>
        </Link>
      </div>
      <div className="hero-image-wrapper">
        <div ref={imgRef} className="hero-image">
          <Image
            src={"/banner.jpeg"}
            width={1580}
            height={720}
            alt="image"
            className="shadow-2xl rounded-lg border mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
