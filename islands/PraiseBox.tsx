import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { Button, BUTTON_CLASS } from "@/components/Button.tsx";
import { Data } from "@/lib/praise.ts";
import { convert } from "npm:html-to-text";

interface ServerResponse {
  data: Data;
  praise: string;
}

export default function PraiseBox() {
  const [praiseMessage, setPraiseMessage] = useState<ServerResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username == "") {
      return;
    }

    fetch(`/api/praise/${username}`)
      .then((resp) => {
        if (!resp.ok) {
          setLoading(false);
          resp.text().then((msg) => setError(`Error: ${resp.status}: ${msg}`));
        }

        return resp;
      })
      .then((resp) => resp.json())
      .then((resp) => setPraiseMessage(resp))
      .catch((err) => setError(err));
  }, [loading]);

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <>
      <div className="max-w-2xl">
        <h1 class="pb-4 font-semibold text-2xl">
          Praise my GitHub profile!
        </h1>
        {error !== null && (
          <div class="p-2 bg-red-200 dark:bg-red-900">
            <p class="pb-4">Oh no, there was an error!</p>
            <p class="pb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setUsername("");
                setLoading(false);
                setPraiseMessage(null);
              }}
            >
              Reset
            </Button>
          </div>
        )}

        {loading
          ? (
            <>
              {praiseMessage !== null
                ? (
                  <>
                    <h2 class="text-xl weight-semibold pb-4">
                      {praiseMessage.data.username}
                    </h2>
                    <img
                      class="float-right max-w-32 p-4 rounded-full"
                      src={praiseMessage.data.avatar_url}
                    />
                    <p
                      class="pb-4 prose"
                      id="praise-message"
                      dangerouslySetInnerHTML={{
                        __html: praiseMessage.praise,
                      }}
                    >
                    </p>

                    <div class="mt-4">
                      <Button
                        onClick={() => {
                          setError(null);
                          setUsername("");
                          setLoading(false);
                          setPraiseMessage(null);
                        }}
                      >
                        Try again!
                      </Button>
                      <span class="mx-4" />
                      <a
                        class={BUTTON_CLASS}
                        href={`https://x.com/intent/post?text=${
                          encodeURIComponent(
                            `${praiseMessage.data.username}'s GitHub encouragement: ${
                              convert(
                                praiseMessage
                                  .praise,
                                {
                                  wordWrap: 256,
                                },
                              )
                                .substring(
                                  0,
                                  100,
                                )
                            }... via https://praise-me.fly.dev`,
                          )
                        }`}
                      >
                        Share on X
                      </a>
                    </div>
                  </>
                )
                : (
                  <>
                    <h1 class="pb-4 text-2xl">
                      Loading...
                    </h1>
                    <p class="pb-4">
                      This may take a moment, Mimi (the chatbot powering this
                      thing) may have taken a cat nap and you may need to wait
                      for her model weights to load. Just have patience and
                      it'll be here in a snap!
                    </p>
                  </>
                )}
            </>
          )
          : (
            <>
              <p class="pb-4">
                Instead of trying to tear eachother down with AI, why not use it
                to help lift others up?
              </p>
              <form class="mb-4" onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="GitHub username"
                  className="w-full px-3 py-2 border dark:bg-black border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading}
                  value={username}
                  onChange={(e) =>
                    setUsername((e.target as HTMLInputElement).value)}
                />

                <div class="py-2"></div>

                <Button
                  class="my-4 focus:ring-emerald-500 bg-emerald-200 dark:bg-emerald-800"
                  type="submit"
                >
                  Praise this profile!
                </Button>
              </form>
            </>
          )}
      </div>
    </>
  );
}
