"use client";

import Image from "next/image";
import React from "react";
import { useRightSidebarStore } from "~/store/useRightSidebarStore";
import { useChatStore } from "~/store/useChatStore";
import space from "../../../public/images/Space.png";

const RightSidebar = ({ username }: { username: string }) => {
  const tiers = [
    {
      price: 5,
      description:
        "Unlock DM access. Response guaranteed in 5 days else moneyback.",
    },
    {
      price: 10,
      description: "All of above + Access to full story & future updates",
    },
    {
      price: 20,
      description: "All of above + Free Book shipped",
    },
    {
      price: 50,
      description: "All of above + 30 mins Voice call",
    },
    {
      price: 100,
      description: "All of above + Video Call",
    },
  ];

  const { expandedTiers, toggleTier } = useRightSidebarStore();
  const { openChat } = useChatStore();

  const handleOpenChat = () => {
    openChat(username);
  };

  return (
    <div className="mt-12 w-full overflow-hidden rounded-lg border bg-[#F6F7F8] shadow-md">
          <div className="bg-navy-900 relative h-20 w-full">
            <Image
              src={space}
              fill={true}
              sizes="(max-width: 768px) 100%, 100%"
              alt="Space theme with planets"
            />
          </div>
    
          <div className="space-y-6 p-4">
            <div>
              <p className="mt-4 text-xl text-gray-800">
              Perks & token details coming soon. Be the first to know when this story unlocks.
              </p>
            </div>
          </div>
        </div>
  );
};

export default RightSidebar;
