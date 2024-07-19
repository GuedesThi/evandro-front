import { LayoutChooser } from "@/layouts/LayoutChoose";
import { globalStyles } from "@/styles/global";
import type { AppProps } from "next/app";
import Head from "next/head";

globalStyles();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayoutChooser>
      <Head>
        <title>Decasa Metais</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Italiana&display=swap" rel="stylesheet"/>
      </Head>
      <Component {...pageProps}/>
    </LayoutChooser>
  )
}