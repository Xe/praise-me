import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { Button } from "@/components/Button.tsx";

export default function DeleteBox() {
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);

  useEffect(() => {
    if (username == "") {
      return;
    }

    fetch(`/api/praise/${username}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (!resp.ok) {
          setLoading(false);
          resp.text().then((msg) => setError(`Error: ${resp.status}: ${msg}`));
        }

        return resp;
      })
      .then((resp) => resp.json())
      .catch((err) => setError(err));
  }, [loading]);

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <>
      {deleted && (
        <>
          <div class="p-2 bg-red-200 dark:bg-red-900">
            <h2 class="pb-4">
              Your personal information was deleted
            </h2>
            <p class="pb-4">Thanks for trying this experiment!</p>
          </div>
        </>
      )}

      {error !== null && (
        <div class="p-2 bg-red-200 dark:bg-red-900">
          <p class="pb-4">Oh no, there was an error!</p>
          <p class="pb-4">{error}</p>
        </div>
      )}

      {loading ? <></> : (
        <>
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
              Remove my information
            </Button>
          </form>
        </>
      )}
    </>
  );
}
