import config from "@config/config.json";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = () => {
  const { logo, logo_white } = config.site;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [logoImg, setLogoImg] = useState(logo);

  useEffect(() => {
    if ((mounted && theme === "dark") || resolvedTheme === "dark") {
      setLogoImg(logo_white)
    } else {
      setLogoImg(logo)
    }
  }, [mounted, theme, resolvedTheme]);

  useEffect(() => setMounted(true), []);

  return (
    <Link href="/" className="navbar-brand">
      <Image src={logoImg} width={40} height={40} />
    </Link>
  );
};

export default Logo;
