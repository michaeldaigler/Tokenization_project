import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";

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
    background: "linear-gradient(to right, #355c7d, #6c5b7b, #c06c84)",
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
    border: `5px solid ${theme.palette.secondary.light}`,
    padding: theme.spacing(2),
    borderRadius: 10,
    height: 350,
    width: 400,
    boxShadow: theme.shadows[11],
    backgroundColor: "white",
    color: theme.palette.primary.light,
  },
  whiteListStuff: {
    display: "grid",
    flexDirection: "row",
  },
  whiteListButton: {
    height: 35,
    width: 250,
    backgroundColor: theme.palette.secondary.light,
    marginTop: theme.spacing(2),
    textTransform: "none",
  },
  buyCoinButton: {
    height: 35,
    width: 250,
    backgroundColor: theme.palette.secondary.light,
    marginTop: theme.spacing(2),
    textTransform: "none",
  },
  tokenAmountInput: {
    height: 30,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
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
    tokenSaleAddress: null,
  });
  const [dTokenInstance, setDTokenInstance] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [userTokens, setUserTokens] = useState(null);
  const [tokensRequested, setTokenRequested] = useState("");

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

      setState(
        (prevState) => ({
          ...prevState,
          web3: web3,
          accounts: accounts,
          tokenInstance: tokenInstance,
          tokenSaleInstance: tokenSaleInstance,
          kycInstance: kycInstance,
          tokenSaleAddress: DTokenSale.networks[networkId].address,
        }),
        updateUserTokens(tokenInstance, accounts[0])
      );
      listenToTokenTransfer(tokenInstance, accounts[0]);

      setUpListeners(tokenInstance, accounts);

      console.log(accounts);
    } catch (error) {
      console.error(error);
    }
  };
  const setUpListeners = (tokenInstance, accounts) => {
    window.ethereum.on("accountsChanged", (_accounts) => {
      updateUserTokens(tokenInstance, _accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId) => {
      updateUserTokens(tokenInstance, accounts[0]);

      window.location.reload();
    });
  };
  const handleInputChanges = (event) => {
    const { value, name } = event.target;
    setState((prevState) => ({
      ...prevState,
      kycAddress: value,
    }));
  };

  const handleAddToWhiteListButtonClicked = async () => {
    await state.kycInstance.methods
      .setKycCompleted(state.kycAddress)
      .send({ from: state.accounts[0] });
    alert(`KYC for ${state.kycAddress} is completed`);
  };

  const listenToTokenTransfer = (tokenInstance, account) => {
    tokenInstance.events
      .Transfer({ to: account })
      .on("data", () => updateUserTokens(tokenInstance, account));
  };

  const handleBuyTokenClicked = async () => {
    console.log(state);
    await state.tokenSaleInstance.methods.buyTokens(state.accounts[0]).send({
      from: state.accounts[0],
      value: state.web3.utils.toWei(`${tokensRequested}`, "wei"),
    });
  };

  const handleTokensRequestedChanged = (event) => {
    const { value } = event.target;
    setTokenRequested(value);
  };

  const updateUserTokens = async (tokenInstance, account) => {
    console.log(tokenInstance);
    console.log(account);
    let userTokens = await tokenInstance.methods.balanceOf(account).call();
    setUserTokens(userTokens);
  };

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
            <h1>DCoin </h1>
          </Grid>
          <Grid className={classes.input}>
            <h2>Kyc Whitelisting:</h2>
            <div className={classes.whiteListStuff}>
              Address to allow:
              <input
                type="text"
                placeholder="0x1234...."
                value={state.kycAddress}
                name="kycAddress"
                onChange={(e) => handleInputChanges(e)}
              />
              <Button
                className={classes.whiteListButton}
                onClick={handleAddToWhiteListButtonClicked}
              >
                Add to Whitelist
              </Button>
            </div>
            <Grid xs={8} item>
              <h2>Buy some!</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  className={classes.buyCoinButton}
                  onClick={handleBuyTokenClicked}
                >
                  Cop dat Coin! 😎
                </Button>{" "}
                <TextField
                  size="small"
                  id="outlined-number"
                  label="Wei"
                  type="number"
                  value={tokensRequested}
                  className={classes.tokenAmountInput}
                  InputLabelProps={{
                    shrink: true,
                    padding: 0,
                  }}
                  InputProps={{
                    padding: 0,
                  }}
                  inputProps={{ padding: 0 }}
                  variant="outlined"
                  onChange={handleTokensRequestedChanged}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <h3>Your DDD: {!userTokens ? "---" : userTokens}</h3>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Dapp;
