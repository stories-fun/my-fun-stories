"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiBell,
  FiPlus,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";
import Link from "next/link";
import { WalletProvider } from "./wallet";

const NavLogo = () => (
  <Link href="/" className="group flex items-center space-x-2">
    <div className="relative h-[50px] w-[50px]">
      <Image
        src="/images/logo.png"
        fill
        className="object-contain"
        alt="logo"
        priority
      />
    </div>
    <div className="font-mont text-2xl font-bold text-black transition-colors group-hover:text-gray-700">
      stories.fun
    </div>
  </Link>
);

const SearchBar = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform">
      <Image
        src="/images/Search.png"
        fill
        className="object-contain"
        alt="search"
      />
    </div>
    <input
      type="text"
      className="w-full rounded-full bg-gray-100 px-12 py-3 text-black transition-colors placeholder:text-gray-500 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
      placeholder="Search Stories"
    />
  </div>
);

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-menu") && !target.closest(".menu-button")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  if (!mounted) {
    return null; // Return null on server-side to prevent hydration mismatch
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-6">
          <NavLogo />
        </div>

        <SearchBar className="hidden w-96 sm:block" />

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Link href="/aboutus">about us</Link>
          </div>

          <button
            className="hidden rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 sm:block"
            aria-label="Notifications"
          >
            <FiBell />
          </button>

          <button
            className="hidden rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 sm:block"
            aria-label="Create new"
          >
            <FiPlus />
          </button>

          <button
            className="hidden rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 sm:block"
            aria-label="Messages"
          >
            <FiMessageSquare />
          </button>

          <div className="hidden sm:block">
            <WalletProvider />
          </div>

          <button
            className="hidden rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 sm:block"
            aria-label="Profile"
          >
            <FiUser />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-button rounded-lg p-2 text-2xl transition-colors hover:bg-gray-100 sm:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu fixed inset-x-0 top-[73px] z-50 h-screen bg-white shadow-lg sm:hidden">
          <div className="container mx-auto space-y-4 p-4">
            <SearchBar />
            <div className="flex justify-center">
              <WalletProvider />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
