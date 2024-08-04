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
        <title>Praise my GitHub profile!</title>
        <meta name="title" content="Praise my GitHub profile!" />
        <meta
          name="description"
          content="Use your GitHub profile as a way to get personalized messages of praise and encouragement."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://praise-me.fly.dev/" />
        <meta property="og:title" content="Praise my GitHub profile!" />
        <meta
          property="og:description"
          content="Use your GitHub profile as a way to get personalized messages of praise and encouragement."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://praise-me.fly.dev/" />
        <meta property="twitter:title" content="Praise my GitHub profile!" />
        <meta
          property="twitter:description"
          content="Use your GitHub profile as a way to get personalized messages of praise and encouragement."
        />
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
