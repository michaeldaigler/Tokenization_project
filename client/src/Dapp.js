import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";

import DToken from "./contracts/DToken.json";
import DTokenSale from "./contracts/DTokenSale.json";
import KycContract from "./contracts/KycContract.json";
const Dapp = () => {
  const [state, setState] = useState({
    web3: null,
    accounts: [],
    contract: null,
  });

  const setUpWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const tokenInstance = new web3.eth.Contract(
        DToken.abi,
        DToken.networks[networkId] && DToken.networks[networkId].address
      );

      const tokenSaleInstance = new web3.eth.Contract(
        DTokenSale.abi,
        DTokenSale.networks[networkId] && DTokenSale.networks[networkId].address
      );

      const kycInstance = new web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[networkId] &&
          KycContract.networks[networkId].address
      );
      setState((prevState) => ({
        ...prevState,
        web3: web3,
        accounts: accounts,
        contract: tokenInstance,
      }));
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  useEffect(() => {
    setUpWeb3();
  }, []);

  return (
    <div>
      {!state.web3 ? (
        <h1>Loading Web3, accounts, contracts, etc....</h1>
      ) : (
                  <div>{ state.accounts[0]}</div>
      )}
    </div>
  );
};

export default Dapp;
