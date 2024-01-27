import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import AnimatedNumber from "@layouts/components/AnimateNumber";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import Table from "@layouts/components/Table";
import axios from "axios";
import Link from "next/link";
import ImageFallback from "@layouts/components/ImageFallback";
import { useSelector, useDispatch } from "react-redux";
import { IoEllipseSharp } from "react-icons/io5";

const { blog_folder } = config.settings;

const Home = () => {
  const unisat = useSelector((state) => state.unisat);
  const ranking = useSelector((state) => state.ranking);
  const [hasValueAndMatchQueryTokens, setHasValueAndMatchQueryTokens] =
    useState([]);
  const [hasPriceNameArray, setHasPriceNameArray] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [presentHasValueCount, setPresentHasValueCount] = useState(0);
  const [matchQueryValueCount, setMatchQueryValueCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [tokenData, setTokenData] = useState({});
  const [marketData, setMarketData] = useState({});

  const [sortBy, setSortBy] = useState("price");

  var unisatTokenDetail = [];
  const unisatTokens = unisat.detail;
  var hasPriceObjectArray;
  const query = unisat.query;

  const dispatch = useDispatch();

  const option = {
    headers: {
      "x-access-token": process.env.NEXT_PUBLIC_COINRAKING_API_KEY,
    },
    params: {
      tags: ["brc-20"],
      limit: 100,
    },
  };

  async function fetchData() {
    // remove event on unmount to prevent a memory leak
    loadString(10);
    setTotalTokens(0);
    setPresentHasValueCount(0);
    setMatchQueryValueCount(0);
    setCurrentPage(0);
    try {
      const unisatData = await axios.get(
        `/coinranking/v2/coins?offset=0&orderBy=marketCap&limit=100&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=&tags[]=brc-20`,
        {
          headers: {
            "x-access-token": process.env.NEXT_PUBLIC_COINRAKING_API_KEY,
          },
        }
      );

      if (unisatData?.data?.data?.stats) {
        dispatch({ type: "GET_UNISAT_DATA", payload: unisatData.data.data });
        const coindata = await axios.get("/api-coinranking/v2/coins", option);
        const statsData = await axios.get("/coinranking/v2/stats/coins", {
          headers: {
            "x-access-token": process.env.NEXT_PUBLIC_COINRAKING_API_KEY,
          },
          params: {
            tags: "brc-20",
            referenceCurrencyUuid: "yhjMzLPhuIDl",
            timePeriod: "24h",
          },
        });

        dispatch({
          type: "GET_RANKING_TOTAL",
          payload: statsData.data.data.stats,
        });
        unisatTokenDetail = unisatData.data.data.coins;

        setTotalTokens((prev) => unisatData.data.data.stats.total);
        // document.getElementById('spinner').style.display = 'none';

        let dataSorted = coindata.data.data.coins;

        switch (sortBy) {
          case "price":
            dataSorted = dataSorted.sort((a, b) => {
              return b.price - a.price;
            });
            break;

          case "volume":
            dataSorted = dataSorted.sort((a, b) => {
              return b["24hVolume"] - a["24hVolume"];
            });
            break;

          case "market":
            dataSorted = dataSorted.sort((a, b) => {
              return b.marketCap - a.marketCap;
            });
            break;

          case "24h":
            dataSorted = dataSorted.sort((a, b) => {
              return b.change - a.change;
            });
            break;

          default:
            break;
        }

        hasPriceObjectArray = dataSorted.filter((token) => token.price != null);
        let hasValueDemo = hasPriceObjectArray.filter((one) =>
          one.name.toLowerCase().includes(query.toLowerCase())
        );
        setHasValueAndMatchQueryTokens(hasValueDemo);
        setHasPriceNameArray(hasValueDemo.map((token) => token.symbol));

        setMatchQueryValueCount(hasValueDemo.length);
      }
    } catch (error) {
      console.log(error);
    }

    //goto(0);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [sortBy]);

  useEffect(() => {
    if (totalTokens > 0) goto(0);
  }, [totalTokens]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (totalTokens > 0) {
      setPresentHasValueCount(0);
      setCurrentPage(0);
      fetchData();
    }
  }, [query]);

  const checkInPriceTokenArray = (tokenName) => {
    return hasPriceNameArray.includes(tokenName);
  };

  const isBottom = (el) => {
    return el.getBoundingClientRect().bottom - 200 <= window.innerHeight;
  };

  const onScroll = useCallback((event) => {
    const wrappedElement = document.getElementById("__next");
    if (isBottom(wrappedElement)) {
      goto();
    }
  }, []);

  const loadString = (cnt) => {
    const el = document.getElementById("tokenList");
    document.getElementById("tokenList").innerText = "";
    let str = "";
    for (let i = 0; i < cnt; i++) {
      str =
        str +
        "<div class='mt-2 animate-pulse overflow-hidden rounded ' key={" +
        i +
        "}>" +
        "<div class='flex gap-3 justify-start items-center px-4 py-6 bg-gray-700/10 hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
        "</div></div>";
    }
    el.innerHTML += str;
  };

  const unisatString = (token, i) => {
    let str =
      "<div class='mt-2  overflow-hidden rounded' key={" +
      i +
      "}>" +
      "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-gray-700/10 hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
      "<div class='flex items-center justify-start md:min-w-[20%] min-w-[50%]'>" +
      '<a class="pl-2" href="#"><div class="font-semibold">' +
      token.symbol +
      "</div></a></div>" +
      '<p class="md:min-w-[25%] min-w-[50%]"><b>$ 0.00</b></p>' +
      '<p class="text-green-500 md:min-w-[15%] md:block hidden"><b>0.00%</b></p>' +
      '<p class="md:min-w-[20%] md:block hidden"><b>$ 0.00</b></p><p class="md:min-w-[20%] md:block hidden"><b>$ 0.00</b></p>' +
      "</div></div>";
    return str;
  };

  const coinrankingString = (token, i) => {
    const price =
      token.price != (undefined || null)
        ? parseFloat(token.price).toFixed(3)
        : "0.00";
    const change =
      parseFloat(token.change) > 0 ? "text-green-500" : "text-red-500";
    const cap =
      token.marketCap != (undefined || null)
        ? parseInt(token.marketCap).toLocaleString()
        : "0.00";
    const vol =
      token["24hVolume"] != (undefined || null)
        ? parseInt(token["24hVolume"]).toLocaleString()
        : "0.00";
    const changeVal =
      token["change"] != (undefined || null)
        ? parseFloat(token["change"]).toLocaleString()
        : "0.00";
    let str =
      "<div class='mt-1 overflow-hidden rounded' key={" +
      i +
      "}>" +
      "<div class='flex gap-3 justify-start items-center px-4 py-3 bg-gray-700/10  hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
      "<div class='flex items-center justify-start md:min-w-[20%] min-w-[50%]'>" +
      '<img alt="logo" srcset="/_next/image?url=' +
      token.iconUrl +
      "&amp;w=32&amp;q=75 1x, /_next/image?url=" +
      token.iconUrl +
      '&amp;w=64&amp;q=75 2x" src="http://localhost:3000/_next/image?url=' +
      token.iconUrl +
      '&amp;w=64&amp;q=75" width="30" height="30" decoding="async" data-nimg="1" class="rounded" style="color: transparent; width: 25px; height: 25px;"></img>' +
      '<a class="pl-2" href="/tokens/' +
      token.name +
      "?uuid=" +
      token.uuid +
      "&amp;name=" +
      token.name +
      "&amp;symbol=" +
      token.symbol +
      '"><div class="font-semibold">' +
      token.name +
      "</div></a></div>" +
      "<p class='md:min-w-[25%] min-w-[50%]'><b>$" +
      price +
      "</b></p>" +
      "<p class='md:min-w-[15%] md:block hidden " +
      change +
      "'><b>" +
      changeVal +
      "%</b></p>" +
      "<p class='md:min-w-[20%] md:block hidden'>$" +
      cap +
      "</p>" +
      "<p class='md:min-w-[20%] md:block hidden'>$" +
      vol +
      "</p>" +
      "</div>" +
      "</div>";
    return str;
  };

  const manipulateUnistatData = (
    getTokensCnt,
    unisatData,
    currentPage,
    dir
  ) => {
    let data = [];
    let cnt = 0;
    if (dir === 0) {
      for (let i = 0; i < unisatData.length; i++) {
        if (!checkInPriceTokenArray(unisatData[i].symbol)) {
          cnt = cnt + 1;
          data.push(unisatData[i]);
          if (cnt === getTokensCnt) {
            currentPage = currentPage + 1;
            break;
          }
        }
        currentPage = currentPage + 1;
      }
    } else {
      if (getTokensCnt > 20) {
        for (let i = 0; i < unisatData.length; i++) {
          if (
            !checkInPriceTokenArray(
              unisatData[unisatData.length - i - 1].symbol
            )
          ) {
            cnt = cnt + 1;
            if (cnt > 20) data.push(unisatData[unisatData.length - i - 1]);
            if (cnt === getTokensCnt) {
              break;
            }
          }
          if (cnt <= 20) currentPage = currentPage - 1;
        }
      } else {
        for (let i = 0; i < unisatData.length; i++) {
          if (
            !checkInPriceTokenArray(
              unisatData[unisatData.length - i - 1].symbol
            )
          ) {
            cnt = cnt + 1;
            data.push(unisatData[unisatData.length - i - 1]);
            if (cnt === getTokensCnt) {
              currentPage = currentPage - 1;
              break;
            }
          }
          currentPage = currentPage - 1;
        }
      }
      data.reverse();
    }

    setCurrentPage(currentPage);

    return data;
  };
  
  const goto = (dir) => {
    let tokensPerPage = 20;
    let maxPageTokens = 35;
    const el = document.getElementById("tokenList");
    let addedComponent = "";

    let presentHasValueCountBuffer = presentHasValueCount;
    let currentPageBuffer = currentPage;
    if (dir === 1) {
      presentHasValueCountBuffer = 0;
      currentPageBuffer = 0;
    }
    if (dir === 4) {
      if (totalTokens <= tokensPerPage) return;
      presentHasValueCountBuffer =
        Math.ceil(totalTokens / tokensPerPage) * tokensPerPage;
      currentPageBuffer = totalTokens;
    }

    if (dir === 3 && presentHasValueCountBuffer >= totalTokens - 20) {
      return;
    } else if (dir === 2 && presentHasValueCountBuffer <= 20) {
      return;
    } else {
      document.getElementById("tokenList").innerText = "";
      if (dir === 0 || dir === 1 || dir === 3) {
        const nextPage = presentHasValueCountBuffer + 20;
        if (
          presentHasValueCountBuffer + tokensPerPage <=
          matchQueryValueCount
        ) {
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            presentHasValueCountBuffer,
            nextPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          el.innerHTML += addedComponent;
          setPresentHasValueCount(nextPage);
          setCurrentPage(0);
        } else if (presentHasValueCountBuffer >= matchQueryValueCount) {
          // // document.getElementById('spinner').style.displa
          loadString(10);
          axios
            .get(
              `/coinranking/v2/coins?offset=${currentPageBuffer}&orderBy=marketCap&limit=${maxPageTokens}&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=PEPE&tags[]=brc-20`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage,
                unisatData.data.data.coins,
                currentPageBuffer,
                0
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.symbol)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        } else {
          let remainTokensCnt =
            matchQueryValueCount - presentHasValueCountBuffer;
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            presentHasValueCountBuffer
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          loadString(10);
          // // document.getElementById('spinner').style.displa
          axios
            .get(
              `/coinranking/v2/coins?offset=${currentPageBuffer}&orderBy=marketCap&limit=${maxPageTokens}&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=PEPE&tags[]=brc-20`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage - remainTokensCnt,
                unisatData.data.data.coins,
                currentPageBuffer,
                0
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.symbol)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              //document.getElementById('spinner').style.display = 'none';
            });
        }
      } else {
        const nextPage = presentHasValueCountBuffer - 20;
        if (
          presentHasValueCountBuffer <=
          matchQueryValueCount + tokensPerPage
        ) {
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            nextPage - tokensPerPage,
            presentHasValueCountBuffer - tokensPerPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          el.innerHTML += addedComponent;
          setPresentHasValueCount(nextPage);
          setCurrentPage(0);
        } else if (
          presentHasValueCountBuffer >=
          matchQueryValueCount + tokensPerPage * 2
        ) {
          // document.getElementById('spinner').style.displa
          let start = currentPageBuffer - maxPageTokens - 20;
          if (start < 0) start = 0;
          loadString(10);

          axios
            .get(
              `/coinranking/v2/coins?offset=${start}&orderBy=marketCap&limit=${
                maxPageTokens + 20
              }&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=PEPE&tags[]=brc-20`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage * 2,
                unisatData.data.data.coins,
                currentPageBuffer,
                1
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.symbol)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        } else {
          let remainTokensCnt =
            matchQueryValueCount - presentHasValueCountBuffer + tokensPerPage;
          const addedTokenList = hasValueAndMatchQueryTokens.slice(
            nextPage - tokensPerPage
          );
          addedTokenList.forEach((token, i) => {
            addedComponent += coinrankingString(token, i);
          });
          let start = currentPageBuffer - maxPageTokens;
          if (start < 0) start = 0;
          loadString(10);
          // document.getElementById('spinner').style.displa
          axios
            .get(
              `/coinranking/v2/coins?offset=${start}&orderBy=marketCap&limit=${maxPageTokens}&orderDirection=desc&referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&search=PEPE&tags[]=brc-20`
            )
            .then((unisatData) => {
              const unisatDatas = manipulateUnistatData(
                tokensPerPage - remainTokensCnt,
                unisatData.data.data.coins,
                currentPageBuffer,
                1
              );
              unisatDatas.map((token, i) => {
                if (!checkInPriceTokenArray(token.symbol)) {
                  addedComponent += unisatString(token, i);
                }
              });
              document.getElementById("tokenList").innerText = "";
              el.innerHTML += addedComponent;
              setPresentHasValueCount(nextPage);
              // document.getElementById('spinner').style.display = 'none';
            });
        }
      }
    }
  };

  const goPage = (dir) => {
    goto(dir);
  };
  return (
    <Base>
      <section className="section table-body mt-3 px-2">
        <div className="sm:container">
          <p id="presentHasValueCount" hidden>
            0
          </p>
          <p id="matchQueryValueCount" hidden>
            0
          </p>
          <p id="currentPage" hidden>
            0
          </p>
          {ranking.stats.marketCapChange && (
            <p id="totalTokens" hidden>
              {unisat.total}
            </p>
          )}
          <p id="pageDir" visible>
          <script src="https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js" async></script>
<coingecko-coin-price-marquee-widget  coin-ids="bitcoin,ethereum,litecoin,solana,cardano,ripple" currency="usd" background-color="#ffffff" locale="en" font-color="#000000"></coingecko-coin-price-marquee-widget></p>
          <div className="overflow-hidden">
            <div className="mt-12 w-full lg:hidden">
              <h2 className="text-center text-2xl">
                Top BRC-20 Coins by Market Cap
              </h2>
              <p className="mt-4 px-8">
                — BRC-20 is an experimental standard for fungible tokens on the
                Bitcoin blockchain. — The Taproot and Ordinals protocol made the
                BRC-20 standard possible. — BRC-20 tokens unlock new
                capabilities for the Bitcoin network, such as their use in DeFi
                protocols and blockchain applications.
              </p>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row  lg:flex-none">
                <Link
                  href="https://t.me/INFINITEBTC"
                  target="_blank"
                  className="relative m-auto mt-8 h-[160px] w-[160px] "
                >
                  <ImageFallback
                    className="rounded-xl"
                    src="/images/tokens/AD1.png"
                    alt="AD"
                    unoptimized={true}
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Link>
              </div>

              <div className="mt-12 hidden w-full lg:block">
                <h2 className="text-center text-2xl">
                  Top BRC-20 Coins by Market Cap
                </h2>
                <p className="mt-4 px-8">
                  — BRC-20 is an experimental standard for fungible tokens on
                  the Bitcoin blockchain. — The Taproot and Ordinals protocol
                  made the BRC-20 standard possible. — BRC-20 tokens unlock new
                  capabilities for the Bitcoin network, such as their use in
                  DeFi protocols and blockchain applications.
                </p>
              </div>

              <div className="block">
                <Link
                  href="https://www.okx.com/web3/marketplace/inscription/ordinals/token/wgmi"
                  target="_blank"
                  className="relative m-auto mt-8 flex h-[160px] w-[160px]"
                >
                  <ImageFallback
                    className="rounded-xl"
                    src="/images/tokens/wgmi.gif"
                    unoptimized={true}
                    alt="logo"
                    width={200}
                    height={200}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Link>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2 lg:grid-cols-3">
              <div className="rounded-md bg-gray-700/10 p-5">
                <p
                  className="text-xl font-semibold"
                  id="total"
                  data-count="24677"
                >
                  {ranking.stats.marketCapChange ? (
                    <AnimatedNumber
                      value={unisat.total}
                      startValue={0}
                      duration={3000}
                      generateCommas={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-700/10">
                      <div className="animate-pluse rounded-lg p-4"></div>
                    </div>
                  )}
                </p>
                <p className="mt-2 text-sm">Total Tokens</p>
              </div>

              <div className="rounded-md bg-gray-700/10 p-5">
                <p
                  className="text-xl font-semibold"
                  id="total"
                  data-count="24677"
                >
                  {ranking.stats.marketCap ? `$ ` : ""}
                  {ranking.stats.marketCap ? (
                    <AnimatedNumber
                      value={ranking.stats.marketCap}
                      startValue={0}
                      duration={3000}
                      generateCommas={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-700/10">
                      <div className="animate-pluse rounded-lg p-4"></div>
                    </div>
                  )}
                </p>
                <p className="mt-2 text-sm">Market Cap</p>
              </div>

              <div className="rounded-md bg-gray-700/10 p-5">
                <p
                  className="text-xl font-semibold"
                  id="total"
                  data-count="24677"
                >
                  {ranking.stats.volume ? "$ " : ""}
                  {ranking.stats.volume ? (
                    <AnimatedNumber
                      value={ranking.stats.volume}
                      startValue={0}
                      duration={3000}
                      generateCommas={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-700/10">
                      <div className="animate-pluse rounded-lg p-4"></div>
                    </div>
                  )}
                </p>
                <p className="mt-2 text-sm">Trading Volume</p>
              </div>
            </div>

            <div className="mb-12 w-full overflow-auto">
              <div className="md:min-w-[800px]">
                <div className="w-full overflow-hidden rounded-xl">
                  <div className="mr-1 mt-6 flex items-center justify-end">
                    <p className="mr-2 font-semibold">Sort By:</p>
                    <select
                      name=""
                      id=""
                      className="block rounded-md border border-gray-700/20 py-1.5 text-sm text-gray-900 shadow-sm  dark:bg-gray-700 dark:text-white"
                      onChange={(e) => setSortBy(e.target.value)}
                      value={sortBy}
                    >
                      <option value="price">Price</option>
                      <option value="24h">24h</option>
                      <option value="market">Market Cap</option>
                      <option value="volume">Volume</option>
                    </select>
                  </div>

                  <div className="roundex-xl mt-4 flex justify-between gap-3 px-1 py-4 transition-all duration-200 ease-linear">
                    <div className="min-w-[50%] font-semibold md:min-w-[20%]">
                      Name
                    </div>
                    <div className="min-w-[50%] font-semibold md:min-w-[25%]">
                      Price
                    </div>
                    <div className="hidden font-semibold md:block md:min-w-[15%]">
                      24h
                    </div>
                    <div className="hidden font-semibold md:block md:min-w-[20%]">
                      Market Cap
                    </div>
                    <div className="hidden font-semibold md:block md:min-w-[20%]">
                      Volume(24h)
                    </div>
                  </div>
                  <div id="tokenList"></div>
                  <div className="mx-4 mt-2 flex justify-end gap-2">
                    <div
                      className="text-24 fonrt-bold flex h-12 w-12  items-center justify-center rounded-lg border border-gray-700  transition ease-in-out hover:cursor-pointer hover:bg-[#2BA283] hover:text-white"
                      onClick={() => goPage(1)}
                    >
                      &laquo;
                    </div>
                    <div
                      className="text-24 fonrt-bold flex h-12 w-12  items-center justify-center rounded-lg border border-gray-700  transition ease-in-out hover:cursor-pointer hover:bg-[#2BA283] hover:text-white"
                      onClick={() => goPage(2)}
                    >
                      &lt;
                    </div>
                    <div
                      className="text-24 fonrt-bold flex h-12 w-12  items-center justify-center rounded-lg border border-gray-700  transition ease-in-out hover:cursor-pointer hover:bg-[#2BA283] hover:text-white"
                      onClick={() => goPage(3)}
                    >
                      &gt;
                    </div>
                    <div
                      className="text-24 fonrt-bold on flex h-12  w-12 items-center justify-center rounded-lg border border-gray-700 ease-in-out hover:cursor-pointer hover:bg-[#2BA283] hover:text-white"
                      onClick={() => goPage(4)}
                    >
                      &raquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const homepage = await getListPage("content/_index.md");
  const posts = getSinglePage(`content/${blog_folder}`);
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {},
  };
};
