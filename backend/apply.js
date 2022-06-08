const Web3 = require("web3");
const {
  RINKEBY_URL,
  PRIVATE_KEY,
  MY_ADDRESS,
  CONTRACT_ADDRESS,
} = require("./utils/constants");
const keccak256 = require("keccak256");
const web3 = new Web3(RINKEBY_URL);
const abi = require("./utils/VoteContract.json").abi;
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const signAndSendTransaction = async (data) => {
  try {
    const txObj = {
      from: MY_ADDRESS,
      to: CONTRACT_ADDRESS,
      value: "0x00",
      data: data,
    };
    const gas = await web3.eth.estimateGas(txObj);
    txObj.gas = gas;

    const signedTx = await web3.eth.accounts.signTransaction(
      txObj,
      PRIVATE_KEY
    );
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    // const tokenId = web3.utils.hexToNumberString(tx.logs[0].topics[3]);

    return tx.transactionHash;
  } catch (error) {
    console.log(error);
  }
};

const mint = async (tokenId, uri, option) => {
  try {
    const data = contract.methods.mint(tokenId, uri, option).encodeABI();
    const tx = await signAndSendTransaction(data);
    console.log(tx);
    return tx;
  } catch (error) {
    console.log(error);
  }
};

mint(2, "duong", 3);
