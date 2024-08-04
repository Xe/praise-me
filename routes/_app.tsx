import { type PageProps } from "$fresh/server.ts";
import Footer from "@/components/Footer.jsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Praise me!</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-emerald-100 dark:bg-emerald-900 dark:text-gray-50">
        <div class="p-4 mx-auto max-w-screen-md">
          <noscript>Sorry! You need JavaScript enabled for this.</noscript>

          <Component />
          <Footer />
        </div>
      </body>
    </html>
  );
}
