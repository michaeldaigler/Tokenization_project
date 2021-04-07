import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import { Button, Grid, makeStyles } from "@material-ui/core";

import DToken from "./contracts/DToken.json";
import DTokenSale from "./contracts/DTokenSale.json";
import KycContract from "./contracts/KycContract.json";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    background:"linear-gradient(to right, #355c7d, #6c5b7b, #c06c84)" ,
    boxShadow: theme.shadows[10],
  },
  heading: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    borderRadius: 10,
    width: "75%",
    textAlign: "center",
    color: theme.palette.primary.contrastText,
  },
  input: {
    alignItems: "center",
    border: `5px solid ${theme.palette.primary.light}`,
    padding: theme.spacing(2),
      borderRadius: 10,
      height: 300,
      width: 400,
      backgroundColor: "white",
    color: theme.palette.primary.light
    },
    whiteListButton: {
        height: 35,
        backgroundColor: theme.palette.secondary.light,
        marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Dapp = () => {
  const classes = useStyles();
    const [state, setState] = useState({
        web3: null,
        accounts: [],
        tokenInstance: null,
        tokenSaleInstance: null,
        kycInstance: null,
        kycAddress: "",
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
          tokenInstance: tokenInstance,
          tokenSaleInstance: tokenSaleInstance,
          kycInstance: kycInstance,

      }));
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const handleInputChanges = (event) => {
    const { value, name } = event.target;
    setState((prevState) => ({
      ...prevState,
      kycAddress: value,
    }));
  };

    const handleAddToWhiteListButtonClicked = async() => {
        await state.kycInstance.methods.setKycCompleted(state.kycAddress).send({ from: state.accounts[0] });
        alert(`KYC for ${state.kycAddress} is completed`)
    }

  useEffect(() => {
    setUpWeb3();
  }, []);

  return (
    <div>
      {!state.web3 ? (
        <h1>Loading Web3, accounts, contracts, etc....</h1>
      ) : (
        <div className={classes.paper}>
          <Grid className={classes.heading}>
            <h1>DCoin Sale!</h1>
            <p>Buy Today!</p>
          </Grid>
          <Grid className={classes.input}>
            <h2>Kyc Whitelisting:</h2>
            <div>
              Address to allow:
              <input
                type="text"
                placeholder="0x1234...."
                value={state.kycAddress}
                name="kycAddress"
                onChange={(e) => handleInputChanges(e)}
              />
            </div>
            <Button className={classes.whiteListButton} onClick={handleAddToWhiteListButtonClicked}>Add to Whitelist</Button>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Dapp;
