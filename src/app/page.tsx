import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import ProgressBar from "./_components/ProgressBar";
import NavBar from "./_components/NavBar";
import Stories from "./stories/page";
import HomePage from "./pages/homepage/page";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <div>
      {/* <Stories/> */}
      <NavBar />
      <HomePage />

      {/* <ProgressBar/> */}
    </div>
  );
}
