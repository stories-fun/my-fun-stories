"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { WalletProvider } from "./wallet";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto flex items-center justify-between border-b-2 p-2">
        <div className="flex flex-row space-x-6">
          <Link href={"/aboutus"}>
            <div className="decoration-skip-ink-none flex items-center space-x-2 text-left font-[Mont] text-[25px] font-bold leading-[25px] text-[#000000]">
              <Image src="/images/logo.png" width={50} height={50} alt="logo" />
              <div className="font-[Mont] font-bold">stories.fun</div>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src={"/images/home.png"} width={35} height={35} alt="" />
            <div>Home</div>
          </div>
        </div>

        <div className="relative hidden sm:flex">
          <Image
            src={"/images/Search.png"}
            width={25}
            height={25}
            alt="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 transform"
          />
          <input
            type="text"
            className="rounded-full border-pink-500 bg-[#F5F5F5] px-24 py-4 text-black focus:outline-none"
            placeholder="Search Stories"
          />
        </div>
        <div className="flex items-center space-x-2">
          {/* <div className="flex flex-row items-center justify-center gap-2 rounded-xl bg-[#FFE700] p-2">
            <Image
              src={"/images/Advertise.png"}
              width={25}
              height={25}
              alt="img"
            /> */}
          <div className="hidden sm:block">
            <WalletProvider></WalletProvider>
          </div>
          {/* </div> */}
          {/* <div className="text-[#000000]">Connect Wallet</div> */}

          {/* <div className="flex items-center rounded-full bg-[#FFE700] px-6 py-2">
            <div className="font-bold text-[#000000]">Login</div>
          </div> */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl sm:hidden"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="absolute left-0 top-16 flex w-full flex-col items-center space-y-4 bg-white py-4 shadow-md sm:hidden">
            <input
              type="text"
              className="w-[80%] rounded-full border-pink-500 bg-[#F5F5F5] px-4 py-2 text-black focus:outline-none"
              placeholder="Search Stories"
            />
            {/* <div className="flex w-[80%] items-center justify-center space-x-2 rounded-full bg-[#F5F5F5] px-4 py-2"> */}
            {/* <Image
                src={"/images/Advertise.png"}
                width={20}
                height={20}
                alt="advertise"
              /> */}
            <WalletProvider></WalletProvider>
            {/* <div className="text-black">Connect Wallet</div> */}
            {/* </div> */}
            {/* <div className='bg-[#FFE700] rounded-full px-6 py-2 flex items-center w-[80%] justify-center'>
                    <div className='text-black font-bold'>Login</div>
                  </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
