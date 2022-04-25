// Require web3 to instantiate
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

// declare web3 globally
let web3;

// Get elements from DOM
// // Elements of the signing process
const dataToSign = document.getElementById("data-to-sign");
const accountInput = document.getElementById("account");
const signButton = document.getElementById("sign-button");
const dataSigned = document.getElementById("data-signed");

// // Elements of the recover process
const signature = document.getElementById("signature");
const originalText = document.getElementById("original-text");
const accountThatSigned = document.getElementById("account-that-signed");
const recoverButton = document.getElementById("recover-button");

// Event handlers
// // Method that signs data
const signData = () => {
  // sign receives three parameters:
  // 1.- Data that will be signed
  // 2.- Account that will sign the data
  // 3.- Web3 provider password to unlock accounts (not needed in this case)
  web3.eth.personal
    .sign(dataToSign.value, accountInput.value, "")
    .then(signature => {
      // This function retrieves a signature
      dataSigned.value = signature;
    });
};

// // Method that recovers signer public key
const recoverAccount = () => {
  // ecRecover receives two parameters:
  // 1.- The original message signed
  // 2.- The signature
  web3.eth.personal
    .ecRecover(originalText.value, signature.value)
    .then(accountRecovered => {
      // This function retrieves the original signer account
      accountThatSigned.value = accountRecovered;
    });
};

window.onload = async () => {
  // Set provider options
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "6d29bfc4d9ce44debdc5e8a8e4714608"
      }
    }
  };
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions
  });

  const provider = await web3Modal.connect();
  web3 = new Web3(provider);

  // Request the user account and save it into input
  web3.eth.requestAccounts().then(accounts => {
    accountInput.value = accounts[0];
  });

  // Add listeners to clicks that handle the sign and recover process's
  signButton.addEventListener("click", signData);
  recoverButton.addEventListener("click", recoverAccount);
};
