import PraiseBox from "@/islands/PraiseBox.tsx";

export default function Home() {
  return (
    <>
      <PraiseBox />

      <p class="py-4">Powered by Llama 3.1 70b and Fly.io GPUs.</p>

      {
        /*
      <h1 className="text-4xl pb-4">Oopsie whoopsie! UWU!!!</h1>
      <p>
        This is way more popular than I thought. I seem to have hit a scaling
        limit somewhere in the stack. Investigating ASAP.
      </p>*/
      }
    </>
  );
}
