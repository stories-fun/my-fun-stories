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
  FiHome,
  FiInfo,
} from "react-icons/fi";
import Link from "next/link";
import { WalletProvider } from "./wallet";

interface MobileMenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
}

const NavLogo = () => (
  <Link href="/" className="group flex flex-shrink-0 items-center space-x-1">
    <div className="relative h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] md:h-[50px] md:w-[50px]">
      <Image
        src="/images/logo.png"
        fill
        className="object-contain"
        alt="logo"
        priority
      />
    </div>
    <div className="font-mont whitespace-nowrap text-lg font-bold text-black transition-colors group-hover:text-gray-700 sm:text-xl md:text-2xl">
      stories.fun
    </div>
  </Link>
);

const SearchBar = ({
  className,
  onSearch,
}: {
  className?: string;
  onSearch?: (value: string) => void;
}) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform sm:h-6 sm:w-6">
      <Image
        src="/images/Search.png"
        fill
        className="object-contain"
        alt="search"
      />
    </div>
    <input
      type="text"
      className="w-full rounded-full bg-gray-100 px-12 py-2 text-sm text-black transition-colors placeholder:text-gray-500 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:py-3 sm:text-base"
      placeholder="Search Stories"
      onChange={(e) => onSearch?.(e.target.value)}
    />
  </div>
);

const MobileMenuItem = ({
  icon: Icon,
  label,
  onClick,
  href,
}: MobileMenuItemProps) => {
  const content = (
    <div
      className="flex items-center space-x-3 rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-100"
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-base">{label}</span>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    <button className="w-full text-left">{content}</button>
  );
};

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

  const handleSearch = (value: string) => {
    // TODO: Implement search functionality here
    console.log("Search:", value);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-4">
          <NavLogo />
        </div>

        {/* Navigation Links and Icons */}
        <div className="ml-auto flex items-center">
          {/* What's your story link - always visible but smaller on mobile */}
          <Link
            href="/"
            className="font-mont mr-2 whitespace-nowrap text-xs font-bold font-semibold text-black decoration-2 transition-colors hover:text-gray-700 sm:mr-4 sm:text-sm md:text-base"
          >
            what&apos;s your story?
          </Link>

          {/* About us link - hidden on small mobile, visible on medium screens */}
          <Link
            href="/aboutus"
            className="font-mont mr-2 hidden whitespace-nowrap text-xs font-semibold text-gray-700 transition-colors hover:text-gray-700 sm:mr-4 sm:block sm:text-sm md:text-base"
          >
            about us
          </Link>

          {/* Desktop Navigation Icons */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <button
              className="rounded-lg p-2 text-lg text-gray-700 transition-colors hover:bg-gray-100 sm:text-xl"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            <button
              className="rounded-lg p-2 text-lg text-gray-700 transition-colors hover:bg-gray-100 sm:text-xl"
              aria-label="Create new"
            >
              <FiPlus />
            </button>

            <button
              className="rounded-lg p-2 text-lg text-gray-700 transition-colors hover:bg-gray-100 sm:text-xl"
              aria-label="Messages"
            >
              <FiMessageSquare />
            </button>

            <div className="hidden md:block">
              <WalletProvider />
            </div>

            <button
              className="rounded-lg p-2 text-lg text-gray-700 transition-colors hover:bg-gray-100 sm:text-xl"
              aria-label="Profile"
            >
              <FiUser />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-button ml-1 rounded-lg p-1 text-xl text-gray-700 transition-colors hover:bg-gray-100 sm:p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu fixed inset-x-0 top-[57px] z-50 h-[calc(100vh-57px)] overflow-y-auto bg-white shadow-lg sm:top-[73px] sm:h-[calc(100vh-73px)] md:hidden">
          <div className="container mx-auto space-y-4 p-4">
            <SearchBar onSearch={handleSearch} />

            <div className="space-y-2">
              <MobileMenuItem
                icon={FiHome}
                label="Home"
                href="/"
                onClick={() => setMenuOpen(false)}
              />
              <MobileMenuItem
                icon={FiHome}
                label="What's your story"
                href="/"
                onClick={() => setMenuOpen(false)}
              />
              <MobileMenuItem
                icon={FiInfo}
                label="About Us"
                href="/aboutus"
                onClick={() => setMenuOpen(false)}
              />
              <MobileMenuItem
                icon={FiBell}
                label="Notifications"
                onClick={() => {
                  // Handle notifications
                  setMenuOpen(false);
                }}
              />
              <MobileMenuItem
                icon={FiPlus}
                label="Create New"
                onClick={() => {
                  // Handle create new
                  setMenuOpen(false);
                }}
              />
              <MobileMenuItem
                icon={FiMessageSquare}
                label="Messages"
                onClick={() => {
                  // Handle messages
                  setMenuOpen(false);
                }}
              />
              <MobileMenuItem
                icon={FiUser}
                label="Profile"
                onClick={() => {
                  // Handle profile
                  setMenuOpen(false);
                }}
              />
            </div>

            <div className="pt-4">
              <div className="flex justify-center border-t border-gray-200 pt-4">
                <WalletProvider />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
