import DeleteBox from "@/islands/DeleteBox.tsx";

export default function DeletePage() {
  return (
    <>
      <h1 class="pb-4 font-semibold text-2xl">
        Remove my information
      </h1>

      <p class="pb-4">
        This service stores any personal information in Canada. Personal
        information includes:
      </p>
      <ul class="list-disc list-inside prose">
        <li>
          GitHub profile information (what's visible in{" "}
          <a href="https://api.github.com/users/Xe">
            <code>https://api.github.com/users/Xe</code>)
          </a>
        </li>
        <li>
          GitHub repositories information (what's visible in{" "}
          <a href="https://api.github.com/users/Xe/repos">
            <code>https://api.github.com/users/Xe/repos</code>)
          </a>
        </li>
        <li>
          GitHub README information (what's visible in{" "}
          <a href="https://github.com/Xe/Xe">
            <code>https://github.com/Xe/Xe</code>
          </a>)
        </li>
        <li>
          Derived praise information (generated with Llama 3.1 70b)
        </li>
      </ul>
      <p class="py-4">
        All information is stored solely for the purposes of generating praise.
      </p>

      <DeleteBox />
    </>
  );
}
