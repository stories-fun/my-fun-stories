import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import ProgressBar from "./_components/ProgressBar";
import NavBar from "./_components/NavBar";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <div>
      <NavBar/>
   {/* <ProgressBar/> */}
   </div>
  );
}
