import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Footer from "@partials/Footer";
import Header from "@partials/Header";
import Head from "next/head";

const Base = ({ title, meta_title, children }) => {
  return (
    <>
      <Head>
        <title>
          {plainify(
            meta_title ? meta_title : title ? title : config.site.title
          )}
        </title>
      </Head>
      <Header />
      <main className="flex min-h-[80vh] flex-col">{children}</main>
      <Footer />
    </>
  );
};

export default Base;
