import { useRef, useState, useEffect } from "react";
import { db } from "services/firebase";
import { onValue, ref, query, orderByChild, equalTo } from "firebase/database";
import moment from "moment";
import {
  FaForwardFast,
  FaPlay,
  FaBackwardFast,
  FaPause,
} from "react-icons/fa6";
import Base from "@layouts/Baseof";
import AudioSpectrum from "react-audio-spectrum";

export default function Radio() {
  const [inscription, setInscription] = useState();
  const [latestBlock, setLatestBlock] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [state, setState] = useState({
    loading: true,
    playing: false,
    currentTime: 0,
    duration: 0,
    repeat: false,
  });

  const audioPlayer = useRef(null);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handlePlay = () => {
    audioPlayer.current?.play();
    setState({ ...state, playing: true });
  };

  const handlePause = () => {
    audioPlayer.current?.pause();
    setState({ ...state, playing: false });
  };

  const prevBlock = () => {
    setCurrentBlock((currentBlock) => Number(currentBlock) - 1);
  };

  const nextBlock = () => {
    setCurrentBlock((currentBlock) => Number(currentBlock) + 1);
  };

  const changeBlock = (e) => {
    if (e.key === "Enter") {
      if (
        Number(e.target.value) < 0 ||
        e.target.value === "" ||
        e.target.value > latestBlock
      )
        return false;
      setCurrentBlock(e.target.value);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayer.current?.ended) {
      setState({
        ...state,
        currentTime: 0,
        playing: false,
      });
    } else if (audioPlayer.current)
      setState({
        ...state,
        currentTime: audioPlayer.current?.currentTime,
        duration: audioPlayer.current?.duration,
      });
  };

  const getLatestBlockInfo = async () => {
    try {
      const response = await fetch(`/blocks/latestblock`);
      const result = await response.json();
      if (result) setLatestBlock(result.height);
    } catch (error) {
      console.log("Backend API error");
    }
  };

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    });
    setInscription();
    const dbQuery = query(
      ref(db, "inscriptions"),
      orderByChild("block_no"),
      equalTo(Number(currentBlock))
    );

    onValue(dbQuery, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists() && data) {
        setInscription(Object.values(data)[0]);
      } else {
        setInscription(null);
      }
    });
    setState({
      ...state,
      loading: false,
    });
  }, [currentBlock]);

  useEffect(() => {
    getLatestBlockInfo();
  }, []);

  return (
    <Base>
      <section className="section table-body mt-3">
        {inscription?.ipfs_cid && (
          <audio
            ref={audioPlayer}
            src={`https://ipfs.io/ipfs/${inscription.ipfs_cid}`}
            onTimeUpdate={handleTimeUpdate}
            onAbort={() => setState({ ...state, playing: false })}
            onCanPlay={handleTimeUpdate}
          ></audio>
        )}

        <div className="relative m-auto mt-12 max-w-[700px] p-10">
          <div className="mb-10 text-center">
            <p className="text-sm">Search block. Max 987234</p>
            <input
              type="number"
              min={0}
              className="rounded-md border-none bg-[#c2c2c2] p-0 px-3 py-1 text-center text-gray-800"
              onKeyDown={(e) => changeBlock(e)}
            />
          </div>

          <div className="lcd-backbround rounded-lg p-1">
            {/* LCD screen start */}
            <div className="lcd-screen rounded-md border-2 border-gray-800 bg-[#2e2e2e] px-10 py-5">
              {state.loading ? (
                <p className="digital-font my-5 text-center text-lg text-[#0f0]">
                  Loading. Please wait...
                </p>
              ) : (
                <>
                  {inscription ? (
                    inscription.ipfs_cid ? (
                      <>
                        {" "}
                        <div>
                          <div className="text-md mb-1 flex items-center justify-between text-[#0f0]">
                            <p className="digital-font">00:00:00</p>
                            <p className="digital-font">
                              {moment
                                .utc(state.duration * 1000)
                                .format("HH:mm:ss")}
                            </p>
                          </div>
                          <div className="h-3 w-full rounded bg-gray-800">
                            <div
                              className="rounedd-lg relative h-3 rounded-bl rounded-br rounded-tl rounded-tr bg-green-500"
                              style={{
                                width: `${
                                  (state.currentTime / state.duration) * 100
                                }%`,
                              }}
                            >
                              <span className="absolute right-0 top-[50%] h-[20px] w-[20px] translate-x-[50%] translate-y-[-50%] rounded-full bg-green-500 bg-opacity-60"></span>
                            </div>
                          </div>

                          <div className="mt-1 flex items-center justify-between text-[#0f0]">
                            <p className="text-md digital-font">
                              #{currentBlock}
                            </p>
                            <p className="text-md digital-font">
                              {moment
                                .utc(
                                  (state.duration - state.currentTime) * 1000
                                )
                                .format("HH:mm:ss")}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="digital-font my-5 text-center text-lg text-[#0f0]">
                          Block &nbsp; #{currentBlock} &nbsp; has no
                          audio.
                        </p>
                      </>
                    )
                  ) : (
                    <p className="digital-font my-5 text-center text-lg text-[#0f0]">
                      Block &nbsp; #{currentBlock} &nbsp; has no inscription.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 p-10 sm:grid-cols-3">
              <div className="flex items-center justify-center">
                <div className="radio-speaker relative flex h-36 w-36 items-center justify-center rounded-full">
                  {inscription?.ipfs_cid && state.playing && (
                    <>
                      <span className="absolute z-50 h-[40px] w-[40px] animate-ping rounded-full bg-black bg-opacity-40"></span>
                      <span className="absolute z-50 h-[30px] w-[30px] animate-ping rounded-full bg-gray-800 bg-opacity-20"></span>
                      <span className="absolute z-50 h-[20px] w-[20px] animate-ping rounded-full bg-gray-700 bg-opacity-10"></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="radio-button cursor-pointer rounded-md bg-[#2c2c2c] px-2 py-1 text-white"
                    disabled={Number(currentBlock) === 1 || state.loading}
                    onClick={prevBlock}
                  >
                    <FaBackwardFast />
                  </button>

                  <button
                    className="radio-button cursor-pointer rounded-md bg-[#2c2c2c] px-2 py-1 text-white"
                    onClick={state.playing ? handlePause : handlePlay}
                    disabled={!inscription || state.loading}
                  >
                    {state.playing ? <FaPause /> : <FaPlay />}
                  </button>

                  <button
                    className="radio-button cursor-pointer rounded-md bg-[#2c2c2c] px-2 py-1 text-white"
                    disabled={
                      currentBlock === latestBlock ||
                      latestBlock === 0 ||
                      state.loading
                    }
                    onClick={nextBlock}
                  >
                    <FaForwardFast />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="radio-speaker relative flex h-36 w-36 items-center justify-center rounded-full">
                  {inscription?.ipfs_cid && state.playing && (
                    <>
                      <span className="absolute z-50 h-[40px] w-[40px] animate-ping rounded-full bg-black bg-opacity-40"></span>
                      <span className="absolute z-50 h-[30px] w-[30px] animate-ping rounded-full bg-gray-800 bg-opacity-20"></span>
                      <span className="absolute z-50 h-[20px] w-[20px] animate-ping rounded-full bg-gray-700 bg-opacity-10"></span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
}
