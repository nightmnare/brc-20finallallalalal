import config from "@config/config.json";
import menu from "@config/menu.json";
import ImageFallback from "@layouts/components/ImageFallback";
import Logo from "@layouts/components/Logo";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { IoLogoDiscord, IoLogoTwitter } from "react-icons/io5";

const Footer = () => {
  const { copyright, footer_content } = config.params;
  return (
    <footer className="section relative mt-12 pb-[50px] pt-[70px]">
      <ImageFallback
        className="-z-[1] object-cover object-left  md:object-top"
        src="/images/footer-bg-shape.svg"
        alt="footer background"
        fill={true}
      />
      <div className="container text-center">
        <div className="mb-6 inline-flex">
          <Logo />
        </div>
        {markdownify(footer_content, "p", "max-w-[638px] mx-auto")}

        {/* footer menu */}
        <ul className="mb-6 mt-6 flex-wrap space-x-2 lg:space-x-4">
          {menu.footer.map((menu) => (
            <li className="inline-block" key={menu.name}>
              <Link
                href={menu.url}
                className="p-2 font-bold text-dark hover:text-primary dark:text-darkmode-light lg:p-4"
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* copyright */}
        {markdownify(copyright, "p")}

        <div className="flex justify-center gap-5">
          <Link href={"https://discord.gg/wSjPAgpBr9"}>
            <IoLogoDiscord className="h-[30px] w-[30px] text-black dark:text-white" />
          </Link>
          <Link href={"https://twitter.com/BitX_Brc20"}>
            <IoLogoTwitter className="h-[30px] w-[30px] text-black dark:text-white" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
