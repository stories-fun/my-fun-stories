"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiBell,
  FiPlus,
  FiUser,
  FiHome,
  FiInfo,
} from "react-icons/fi";
import { FiMic } from "react-icons/fi";
import Link from "next/link";
import { useUIStore } from "~/store/useUIStore";
import MessageIndicator from "./MessageIndicator";
import ChatModal from "./ChatModal";
import { useChatStore } from "~/store/useChatStore";

import ExpandableSearch from "~/components/ExpandableSearch";

import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";


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
        sizes="(max-width: 640px) 30px, (max-width: 768px) 40px, 50px"
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
        src="/images/search.png"
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
  const { menuOpen, setMenuOpen, mounted, setMounted } = useUIStore();
  const { openChat } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && !(e.target as Element).closest(".mobile-menu")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, setMenuOpen]);

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
    // Implement search functionality
    console.log("Searching for:", value);
  };

  if (!mounted) return null;

  return <>
  <nav className="sticky top-0 z-50 bg-white shadow-sm">
  <div className="container mx-auto flex items-center justify-between gap-4 px-2 py-2 sm:px-4 sm:py-3">
    <div className="flex flex-shrink-0 items-center space-x-2 sm:space-x-4">
      <NavLogo />
    </div>
    <div className="ml-auto flex flex-1 items-center justify-end gap-3 sm:gap-4">
      <div className="w-full max-w-sm">
        <ExpandableSearch />
      </div>
      <Link
        href="/"
        className="font-mont whitespace-nowrap text-xs font-semibold text-black decoration-2 transition-colors hover:text-gray-700 sm:text-sm md:text-base"
      >
        what&apos;s your story?
      </Link>
      <Link
        href="/aboutus"
        className="font-mont mr-2 hidden whitespace-nowrap text-xs font-semibold text-gray-700 transition-colors hover:text-gray-700 sm:mr-4 sm:block sm:text-sm md:text-base"
      >
        about us
      </Link>
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
        <div className="rounded-lg text-lg text-gray-700 transition-colors hover:bg-gray-100 sm:text-xl">
          <MessageIndicator />
        </div>
      </div>
    </div>
    <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
      <SearchBar className="max-w-xl" onSearch={handleSearch} />
    </div>
    <div className="flex items-center space-x-4">
      <UnifiedWalletButton />
      <MessageIndicator />
      <Link
        href="/voice-llm"
        className="rounded-full bg-purple-500 p-2 text-white hover:bg-purple-600"
        title="Voice to Story"
      >
        <FiMic className="h-5 w-5" />
      </Link>
      <button
        className="rounded-full bg-primary p-2 text-white hover:bg-primary/90"
        onClick={() => openChat()}
      >
        <FiPlus className="h-5 w-5" />
      </button>
      <Link
        href="/profile"
        className="rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
      >
        <FiUser className="h-5 w-5" />
      </Link>
    </div>
  </div>
  
  {/* Mobile menu */}
  {menuOpen && (
    <div className="mobile-menu fixed inset-0 z-50 bg-white lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <NavLogo />
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          onClick={() => setMenuOpen(false)}
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-1 px-4 py-2">
        <MobileMenuItem icon={FiHome} label="Home" href="/" />
        <MobileMenuItem icon={FiInfo} label="About" href="/aboutus" />
        <MobileMenuItem
          icon={FiMic}
          label="Voice to Story"
          href="/voice-llm"
        />
        <MobileMenuItem
          icon={FiBell}
          label="Notifications"
          href="/notifications"
        />
        <MobileMenuItem icon={FiUser} label="Profile" href="/profile" />
        <div className="px-3 py-2">
          <UnifiedWalletButton />
        </div>
      </div>
    </div>
  )}
  <ChatModal />
</nav>
  </>
}

export default NavBar;
