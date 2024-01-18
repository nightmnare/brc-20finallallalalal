import config from "@config/config.json";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const ConnectWallet = () => {
  const wallet = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const [network, setNetwork] = useState("livenet");
  const [walletModalShow, setWalletModalShow] = useState(false);

  const truncateAddress = (address) => {
    return address.slice(0, 5) + "..." + address.substr(address.length - 3);
  };
  const handleAccountsChanged = (_accounts) => {
    if (_accounts.length > 0) {
      dispatch({ type: "ADDRESS", payload: _accounts[0] });

      getBasicInfo();
    } else {
      dispatch({ type: "DISCONNECT" });
    }
  };

  const getBasicInfo = async () => {
    const [address] = await unisat.getAccounts();
    dispatch({ type: "ADDRESS", payload: address });

    const balance = await unisat.getBalance();
    dispatch({ type: "BALANCE", payload: balance.total });

    const network = await unisat.getNetwork();
    setNetwork(network);
  };

  const handleNetworkChanged = (network) => {
    setNetwork(network);
    getBasicInfo();
  };

  const connectWallet = async () => {
    if (window.unisat) {
      try {
        const unisat = window.unisat;
        const accounts = await unisat.getAccounts();
        handleAccountsChanged(accounts);

        const result = await unisat.requestAccounts();
        handleAccountsChanged(result);

        unisat.on("accountsChanged", handleAccountsChanged);
        unisat.on("networkChanged", handleNetworkChanged);
        setWalletModalShow(false);

        return () => {
          unisat.removeListener("accountsChanged", handleAccountsChanged);
          unisat.removeListener("networkChanged", handleNetworkChanged);
        };
      } catch (error) {
        alert(error.message);
      }
    } else {
      return false;
    }
  };

  return (
    <>
      {wallet.isConnected ? (
        <>
          <button className="btn btn-primary hidden md:block">
            {truncateAddress(wallet.address)}
          </button>
          <button
            className="btn btn-outline-primary block md:hidden"
            style={{
              paddingTop: "4px",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            <Image
              src="/images/unisat.png"
              alt="wallet icon"
              width={30}
              height={20}
              className="wallet-icon mx-2"
            />
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary  hidden text-xs sm:text-base md:block"
            onClick={() => setWalletModalShow(true)}
          >
            Connect
          </button>
          <button
            type="button"
            className="md:hidden border border-[#2ba283] rounded-full py-[7px] flex justify-center items-center px-0.5"
            onClick={() => setWalletModalShow(true)}
          >
            <Image
              src="/images/unisat.png"
              alt="wallet icon"
              width={20}
              height={20}
              className="mx-2"
            />
          </button>
        </>
      )}
      <Modal
        open={walletModalShow}
        onClose={() => setWalletModalShow(false)}
        classNames={{ modal: "rounded-xl mt-12" }}
      >
        <div className="text-black min-w-[300px]">
          <h3 className="mb-4 text-center dark:text-black text-xl">Select Wallet</h3>
          <div className="py-2">
            <div
              className="flex items-center border py-1 rounded hover:bg-slate-200 hover:cursor-pointer transition ease-in-out"
              onClick={() => connectWallet()}
            >
              <Image
                src="/images/unisat.png"
                alt="wallet icon"
                width={30}
                height={30}
                className="mx-2"
              />
              <h4 className="dark:text-black pl-3 text-lg font-semibold">Unisat Wallet</h4>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConnectWallet;
