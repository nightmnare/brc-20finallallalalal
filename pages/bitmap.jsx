import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import NumberFormat from "@layouts/components/NumberFormat";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Bitmap() {
  const [bitMaps, setBitMaps] = useState();
  const [status, setStatus] = useState();
  const [offset, setOffset] = useState(20);

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setOffset((val) => val + 20);
    }, 1500);
  };

  useEffect(() => {
    async function fetchmore() {
      const data1 = await fetch(
        "/magiceden/v2/ord/btc/tokens?limit=20&offset=20&sortBy=priceAsc&minPrice=0&maxPrice=0&collectionSymbol=bitmap&disablePendingTransactions=false",
        {
          headers: {
            Authorization: "Bearer 6bed77b6-3723-4376-a492-751f74ef27af",
            accept: "application/json",
          },
        }
      );
      const jsonData1 = await data1.json();
      const maps = {
        bitMaps,
        ...{
          tokens: bitMaps.tokens.concat(jsonData1.tokens),
        },
      };
      setBitMaps(maps);
    }

    if (offset > 20) {
      fetchmore();
    }
  }, [offset]);

  useEffect(() => {
    const init = async () => {
      const data = await fetch(
        "/magiceden/v2/ord/btc/tokens?limit=20&offset=0&sortBy=priceAsc&minPrice=0&maxPrice=0&collectionSymbol=bitmap&disablePendingTransactions=false",
        {
          headers: {
            Authorization: "Bearer 6bed77b6-3723-4376-a492-751f74ef27af",
            accept: "application/json",
          },
        }
      );
      const data1 = await fetch(
        "/magiceden/v2/ord/btc/tokens?limit=20&offset=20&sortBy=priceAsc&minPrice=0&maxPrice=0&collectionSymbol=bitmap&disablePendingTransactions=false",
        {
          headers: {
            Authorization: "Bearer 6bed77b6-3723-4376-a492-751f74ef27af",
            accept: "application/json",
          },
        }
      );
      const status = await fetch(
        "/magiceden/v2/ord/btc/stat?collectionSymbol=bitmap",
        {
          headers: {
            Authorization: "Bearer 6bed77b6-3723-4376-a492-751f74ef27af",
            accept: "application/json",
          },
        }
      );
      const jsonData = await data.json();
      const jsonData1 = await data1.json();
      const jsonStatus = await status.json();
      setStatus(jsonStatus);
      const maps = {
        jsonData,
        ...{
          tokens: jsonData.tokens.concat(jsonData1.tokens),
        },
      };
      setBitMaps(maps);
    };
    init();
  }, []);

  return (
    <Base>
      <section className="section table-body container mt-3 px-2">
        <div>
          <div className="overflow-hidden">
            <div className="mt-12 w-full lg:hidden">
              <h2 className="tex-left ml-8 text-2xl">BITMAP</h2>
              <p className="mt-4 px-8">
                Bitmap is the community-backed metaverse protocol on Bitcoin.
                Each land represents a BTC block number. Purchase your plot of
                land today!
              </p>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row  lg:flex-none">
                <Link
                  href="https://magiceden.io/ordinals/marketplace/bitmap"
                  className="relative m-auto mt-8 h-[160px] w-[160px] "
                >
                  <ImageFallback
                    className="h-full rounded-xl object-cover object-left"
                    src="/images/tokens/bitmap.jpg"
                    alt="AD"
                    unoptimized={true}
                    width={400}
                    height={300}
                  />
                </Link>
              </div>

              <div className="mt-12 hidden w-full lg:block">
                <h2 className="tex-left ml-8 text-2xl">BITMAP</h2>
                <p className="mt-4 px-8">
                  Bitmap is the community-backed metaverse protocol on Bitcoin.
                  Each land represents a BTC block number. Purchase your plot of
                  land today!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 grid w-full grid-cols-3 gap-3 md:grid-cols-5">
          <div className="rounded-md bg-gray-700/10 p-3">
            <div
              className="text-xl font-semibold"
              id="total"
              data-count="24677"
            >
              {status ? (
                <>
                  {" "}
                  {Number(status.floorPrice) / 10 ** 8}{" "}
                  <span className="text-sm">
                    ( $
                    {(
                      Number(Number(status.floorPrice) / 10 ** 8) * 36300
                    ).toFixed(1)}{" "}
                    )
                  </span>
                </>
              ) : (
                <div className="flex items-center justify-center bg-gray-700/10">
                  <div className="animate-pluse rounded-lg p-4"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm">FLOOR PRICE</p>
          </div>
          <div className="rounded-md bg-gray-700/10 p-3">
            <div
              className="text-xl font-semibold"
              id="total"
              data-count="24677"
            >
              {status ? (
                <>
                  <NumberFormat number={Number(status.totalVolume / 10 ** 2)} />{" "}
                  <span className="text-sm">
                    ( $
                    <NumberFormat
                      number={(
                        Number(status.totalVolume / 10 ** 8) * 44500
                      ).toFixed(1)}
                    />{" "}
                    )
                  </span>
                </>
              ) : (
                <div className="flex items-center justify-center bg-gray-700/10">
                  <div className="animate-pluse rounded-lg p-4"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm">TOTAL VOLUME</p>
          </div>
          <div className="rounded-md bg-gray-700/10 p-3">
            <div
              className="text-xl font-semibold"
              id="total"
              data-count="24677"
            >
              {status ? (
                <NumberFormat number={Number(status.totalListed)} />
              ) : (
                <div className="flex items-center justify-center bg-gray-700/10">
                  <div className="animate-pluse rounded-lg p-4"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm">LISTED</p>
          </div>
          <div className="rounded-md bg-gray-700/10 p-3">
            <div
              className="text-xl font-semibold"
              id="total"
              data-count="24677"
            >
              {status ? (
                <NumberFormat number={Number(status.supply)} />
              ) : (
                <div className="flex items-center justify-center bg-gray-700/10">
                  <div className="animate-pluse rounded-lg p-4"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm">SUPPLY</p>
          </div>
          <div className="rounded-md bg-gray-700/10 p-3">
            <div
              className="text-xl font-semibold"
              id="total"
              data-count="24677"
            >
              {status ? (
                <NumberFormat number={Number(status.owners)} />
              ) : (
                <div className="flex items-center justify-center bg-gray-700/10">
                  <div className="animate-pluse rounded-lg p-4"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm">OWNERS</p>
          </div>
        </div>

        {bitMaps && bitMaps?.tokens?.length > 0 ? (
          <div className="relative">
            <InfiniteScroll
              dataLength={bitMaps?.tokens?.length}
              next={fetchMoreData}
              hasMore={true}
              loader={
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <AiOutlineLoading3Quarters className="animate-spin text-center text-3xl font-bold" />
                </div>
              }
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            >
              {bitMaps.tokens.map((item, key) => {
                return (
                  <div
                    key={key}
                    className="cursor-pointer rounded-md bg-gray-700/10 p-3 transition ease-in-out hover:shadow-lg hover:shadow-black/50"
                  >
                    <Image
                      src={`https://bitmap-img.magiceden.dev/v1/${item.id}`}
                      width={250}
                      height={250}
                      className="w-full"
                    />
                    <div className="px-1 py-2">
                      <p className="font-semibold">{item.meta.name}</p>
                      <p className="text-[10px] text-gray-400">
                        #{item.inscriptionNumber - key}
                      </p>
                      <div className="flex items-center justify-between py-2 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold">
                            {item.listedPrice / 10 ** 8}{" "}
                            <span className="text-[10px]"> btc</span>
                          </p>
                          <p className="text-sm font-semibold">
                            ${" "}
                            {(
                              Number(item.listedPrice / 10 ** 8) * 36300
                            ).toFixed(1)}
                          </p>
                        </div>

                        <Link
                          href="https://magiceden.io/ordinals/marketplace/bitmap"
                          target="_blank"
                          className="rounded-full bg-primary/50 px-3 py-1.5 text-white transition ease-in-out hover:bg-primary"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 20 }, (_, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-md bg-gray-700/10 p-3 transition ease-in-out hover:shadow-lg hover:shadow-black/50"
                >
                  <div className="h-[220px] w-full animate-pulse bg-gray-700/10"></div>
                  <div className="px-1 py-2">
                    <p className="h-5 animate-pulse bg-gray-700/10 font-semibold"></p>
                    <p className="h-4 animate-pulse bg-gray-700/10 font-semibold"></p>
                    <div className="flex items-center justify-between py-2">
                      <p className="h-6 w-16 animate-pulse bg-gray-700/10 font-semibold"></p>
                      <Link
                        href="/"
                        className="h-6 w-16 animate-pulse bg-gray-700/10 font-semibold"
                      ></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Base>
  );
}
