import NavBar from "./_components/NavBar";
import Stories from "./_components/Stories";
import { VoiceRecorder } from "~/components/VoiceRecorder";

export default async function Home() {
  return (
    <div>
      <NavBar />
      <Stories />
      <VoiceRecorder />
    </div>
  );
}
