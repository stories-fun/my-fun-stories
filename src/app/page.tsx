import NavBar from "./_components/NavBar";
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
