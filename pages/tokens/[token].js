import Header from "@layouts/partials/Header";
import Footer from "@layouts/partials/Footer";
import Base from "@layouts/Baseof";
import AnimatedNumber from "@layouts/components/AnimateNumber";
import { dexTVLData } from "content/table";
import { useRouter } from "next/router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
import ImageFallback from "@layouts/components/ImageFallback";
import { IoShieldCheckmarkOutline, IoShieldOutline } from "react-icons/io5";
import axios from "axios";
import { useTheme } from "next-themes";
import moment from "moment/moment";

const TokenPage = () => {
  const router = useRouter();
  // const data = router.query;
  const [tokenData, setTokenData] = useState({});
  const [marketData, setMarketData] = useState({});

  const { theme, setTheme } = useTheme();

  console.log(theme);

  useEffect(() => {
    const data = router.query;
    if (data.uuid != undefined) {
      const option = {
        headers: {
          "x-access-token": process.env.COINRAKING_API_KEY,
        },
      };
      const options = {
        headers: {
          "x-access-token": process.env.COINRAKING_API_KEY,
        },
        params: {
          referenceCurrencyUuid: "yhjMzLPhuIDl",
        },
      };
      async function fetchData() {
        axios
          .get(`https://api.coinranking.com/v2/coin/${data.uuid}`, option)
          .then((coindata) => {
            setTokenData(coindata.data.data.coin);
            axios
              .get(
                `/coinranking/v2/coin/${data.uuid}/markets?offset=0&referenceCurrencyUuid=yhjMzLPhuIDl&limit=5`,
                option
              )
              .then((market) => {
                setMarketData(market.data.data);
              });
          });
      }
      fetchData();
    }
  }, []);

  const loading = () => {
    return (
      <div className="m-auto flex h-[100px] w-10/12 items-center justify-center">
        <div role="status m-auto py-8">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };

  console.log(marketData, "----market data---");

  return (
    <Base>
      <section className="section mt-16 overflow-hidden">
        <div className="sm:container">
          {tokenData.iconUrl ? (
            <div className="mt-6 flex flex-col items-center md:flex-row">
              <div className="flex items-center">
                <ImageFallback
                  className="rounded-xl"
                  src={tokenData.iconUrl}
                  priority
                  alt="logo"
                  style={{ width: "35px"}}
                  width="60"
                  height="60"
                />
                <h4 className="mx-3 font-bold">{tokenData.name}</h4>
                <div>{tokenData.symbol}</div>
                <div className="ml-3 rounded-md border px-1 py-[0.5] text-sm">
                  #{tokenData.rank}
                </div>
              </div>
              <div className="flex items-center">
                <div className="font-2xl ml-12 font-extrabold">
                  ${tokenData.price}
                </div>
                <div className="ml-3 rounded-md border px-1 py-[0.5] text-sm">
                  LIVE
                </div>
              </div>
            </div>
          ) : (
            loading()
          )}

          <div className="my-4 grid grid-cols-12">
            <div className="col-span-12 w-full rounded-md border border-gray-700/10 p-3 lg:col-span-9">
              {tokenData.sparkline != null ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={200}
                    data={tokenData.sparkline.map((val, index) => ({
                      time: moment()
                        .subtract(
                          tokenData.sparkline.length - index - 1,
                          "hours"
                        )
                        .format("HH:00"),
                      value: val,
                    }))}
                    margin={{
                      top: 0,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="time"
                      tick={{ fill: theme === "dark" ? "white" : "black" }}
                      tickLine={{ stroke: "white" }}
                    />
                    <YAxis
                      dataKey="value"
                      orientation="right"
                      tick={{ fill: theme === "dark" ? "white" : "black" }}
                      tickLine={{ stroke: "white" }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#279778"
                      fillOpacity={0.6}
                      fill={theme === "dark" ? "#234b56" : "#22c55e"}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{ width: "100%", height: "200px" }}
                  className="flex items-center justify-center text-center font-extrabold"
                >
                  --
                </div>
              )}
            </div>

            {tokenData.supply != undefined && (
              <div className="col-span-12 mt-4 grid grid-cols-2 justify-between  gap-2 px-3 lg:col-span-3 lg:mt-0 lg:flex lg:flex-col">
                <div className="mb-2 flex h-full w-full flex-col items-center justify-center rounded-md bg-gray-700/10 p-5 text-center ">
                  <p className="text-base font-bold text-blue-500 dark:text-blue-500 md:text-xl">
                    <AnimatedNumber
                      value={
                        tokenData.supply.total != null
                          ? parseInt(tokenData.supply.total)
                          : "--"
                      }
                      startValue={0}
                      duration={3000}
                      generateCommas={true}
                      generateDecimals={false}
                    />
                  </p>
                  <h6 className="mb-4 mt-2 font-semibold">Total Supply</h6>
                </div>

                <div className="mb-2 flex h-full w-full flex-col items-center justify-center rounded-md bg-gray-700/10 p-5 text-center">
                  <p className="text-base font-bold text-green-500 dark:text-green-500 md:text-xl">
                    $
                    <AnimatedNumber
                      value={Number(tokenData.marketCap)}
                      startValue={0}
                      duration={3000}
                      generateCommas={true}
                      generateDecimals={false}
                    />
                  </p>
                  <h6 className="mb-4 mt-2 font-semibold">Market Cap</h6>
                </div>

                <div className="mb-2 flex h-full w-full flex-col items-center justify-center rounded-md bg-gray-700/10 p-5 text-center">
                  <p className="text-base font-bold md:text-xl">
                    $
                    <AnimatedNumber
                      value={tokenData.price != null ? tokenData.price : "--"}
                      startValue={0}
                      duration={3000}
                      generateCommas={false}
                      generateDecimals={true}
                      count={6}
                    />
                  </p>
                  <h6 className="mb-4 mt-2 font-semibold">Price</h6>
                </div>

                <div className="md flex h-full w-full flex-col items-center  justify-center rounded-md bg-gray-700/10 py-3 text-center sm:p-5">
                  <p className="text-base font-bold text-green-500 dark:text-green-500 md:text-xl">
                    $
                    <AnimatedNumber
                      value={
                        tokenData.allTimeHigh.price != null
                          ? tokenData.allTimeHigh.price
                          : "--"
                      }
                      startValue={0}
                      duration={3000}
                      generateCommas={false}
                      generateDecimals={true}
                      count={6}
                    />
                  </p>
                  <h6 className="mb-4 mt-2 font-semibold">Highest Price</h6>
                </div>
              </div>
            )}
          </div>

          {tokenData.supply != undefined && (
            <>
              <h4 className="mt-12 text-center text-3xl">Market Information</h4>
              <p className=" mb-4 text-center">
                A list of the top {tokenData.name} markets across all crypto
                exchanges based on the highest 24h trading volume, with their
                current price.
              </p>
              <hr className="border border-b border-gray-700/10"/>
              <div className="my-4 flex flex-col items-center md:flex-row">
                <div className="mb-4 flex items-center justify-start">
                  <h5 className="mx-3 font-bold text-blue-400"> Total </h5>
                  {marketData.stats && (
                    <h5 className="text-gray-700">{marketData.stats.total}</h5>
                  )}
                </div>
                <div className="mb-4 flex items-center justify-start">
                  <h5 className="mr-3 font-bold text-blue-400 md:ml-8">
                    {" "}
                    24h trade volume{" "}
                  </h5>
                  {marketData.stats && (
                    <h5 className="text-gray-700">
                      ${Number(marketData.stats["24hVolume"]).toFixed(5)}
                    </h5>
                  )}
                </div>
              </div>
              <div className="w-full overflow-auto">
                <div className="w-full overflow-hidden rounded-xl">
                  <div className="roundex-xl flex min-w-[100%] items-center justify-between gap-3 px-2 py-4 transition-all duration-200 ease-linear">
                    <div className="min-w-[12%] font-bold md:min-w-[10%]">
                      ID
                    </div>
                    <div className="min-w-[50%] font-bold md:min-w-[30%]">
                      Markets
                    </div>
                    <div className="min-w-[38%] font-bold md:min-w-[20%]">
                      {tokenData.symbol} price
                    </div>
                    <div className="hidden font-bold md:block md:min-w-[20%]">
                      24h trade volume
                    </div>
                    <div className="hidden font-bold md:block md:min-w-[20%]">
                      Recommended
                    </div>
                  </div>

                  {marketData.markets &&
                    marketData.markets.map((market, index) => {
                      return (
                        <div
                          key={index}
                          className="roundex-xl flex min-w-[100%] items-center justify-between gap-3 border-b px-2 py-4 transition-all duration-200 ease-linear dark:border-gray-700"
                        >
                          <div className="min-w-[12%] font-bold md:min-w-[10%]">
                            {index + 1}
                          </div>
                          <div className="flex min-w-[50%] items-center font-bold md:min-w-[30%]">
                            {market.exchange && (
                              <ImageFallback
                                className="rounded-xl"
                                src={market.exchange.iconUrl}
                                priority
                                alt="logo"
                                style={{ width: "35px", height: "35px" }}
                                width="60"
                                height="60"
                              />
                            )}
                            {market.base && (
                              <div className="ml-4">
                                <div className="font-bold">
                                  {market.base.symbol}/{market.quote.symbol}
                                </div>
                                <div className="">{market.exchange.name}</div>
                              </div>
                            )}
                          </div>
                          <div className="min-w-[38%] md:min-w-[20%]">
                            ${parseFloat(market.price).toFixed(3)}
                          </div>
                          <div className="hidden font-bold md:block md:min-w-[20%]">
                            ${market["24hVolume"]}
                          </div>
                          <div className="hidden font-bold md:block md:min-w-[20%]">
                            {market.recommended ? (
                              <IoShieldCheckmarkOutline className="m-auto text-2xl text-green-400 lg:m-0" />
                            ) : (
                              <IoShieldOutline className="m-auto text-2xl lg:m-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Base>
  );
};

export default TokenPage;

export async function getServerSideProps(context) {
  const { params } = context;
  return {
    props: { data: "data" },
  };
}
