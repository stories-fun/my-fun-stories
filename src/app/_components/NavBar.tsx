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
    <div className="relative h-[30px] w-[30px] sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px]">
      <Image
        src="/images/logo.png"
        fill
        className="object-contain"
        alt="logo"
        priority
        sizes="(max-width: 640px) 30px, (max-width: 768px) 35px, 40px"
      />
    </div>
    <div className="font-mont whitespace-nowrap text-base font-bold text-black transition-colors group-hover:text-gray-700 sm:text-lg md:text-xl">
      stories.fun
    </div>
  </Link>
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
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
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

// Custom styled wallet button wrapper
const CustomWalletButton = () => {
  return (
    <div className="wallet-button-wrapper h-9 scale-90 transform">
      <style jsx global>{`
        .wallet-button-wrapper .unified-wallet-button {
          height: 36px !important;
          min-height: 36px !important;
          padding: 0 12px !important;
        }

        .wallet-button-wrapper .unified-wallet-button-text {
          font-size: 14px !important;
        }

        @media (max-width: 640px) {
          .wallet-button-wrapper {
            transform: scale(0.85);
          }
        }
      `}</style>
      <UnifiedWalletButton />
    </div>
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

  if (!mounted) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-2 py-2 sm:gap-4 sm:px-4">
          <div className="flex flex-shrink-0 items-center">
            <NavLogo />
          </div>

          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <div className="w-full max-w-sm">
              <ExpandableSearch />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden sm:block bg-[#FFE700] px-2.5 py-1 rounded-full">
              <Link
                href="/"
                className="font-mont whitespace-nowrap text-xs font-semibold text-black decoration-2 transition-colors hover:text-gray-700 sm:text-sm"
              >
                what&apos;s your story?
              </Link>
            </div>

            <Link
              href="/aboutus"
              className="font-mont hidden whitespace-nowrap text-xs font-semibold text-gray-700 transition-colors hover:text-gray-700 sm:block sm:text-sm"
            >
              about us
            </Link>

            <div className="hidden md:flex md:items-center">
              <button
                className="rounded-lg p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
                aria-label="Notifications"
              >
                <FiBell className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:block">
                <CustomWalletButton />
              </div>

              {/* In the second version the navbar design is changed. */}
              {/* <MessageIndicator />

              <Link
                href="/voice-llm"
                className="rounded-full bg-purple-500 p-1.5 text-white hover:bg-purple-600 sm:p-2"
                title="Voice to Story"
              >
                <FiMic className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <button
                className="rounded-full bg-primary p-1.5 text-white hover:bg-primary/90 sm:p-2"
                onClick={() => openChat()}
              >
                <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              </button> */}

              <Link
                href="/profile"
                className="rounded-full bg-gray-100 p-1.5 text-gray-700 hover:bg-gray-200 sm:p-2"
              >
                <FiUser className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile specific components */}
        <div className="border-t border-gray-100 py-2 md:hidden">
          <div className="container mx-auto px-3">
            <ExpandableSearch />
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
                <FiX className="h-5 w-5" />
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
                <CustomWalletButton />
              </div>
            </div>
          </div>
        )}

        <ChatModal />
      </nav>
    </>
  );
};

export default NavBar;
