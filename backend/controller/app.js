const { onError, onSuccess } = require("../utils/utils");
const QrCode = require("qrcode-reader");
const Jimp = require("jimp");
const fs = require("fs");
const https = require("https");

const Web3 = require("web3");
const {
  RINKEBY_URL,
  PRIVATE_KEY,
  MY_ADDRESS,
  CONTRACT_ADDRESS,
  IMG_PATH,
} = require("../utils/constants");
const keccak256 = require("keccak256");
const web3 = new Web3(RINKEBY_URL);
const abi = require("../utils/VoteContract.json").abi;
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

module.exports = {
  Voting: async (req, res) => {
    try {
      const downloadImage = (url, path) => {
        return new Promise((resolve, reject) => {
          https.get(url, (res) => {
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on("finish", () => {
              filePath.close();
              // console.log("Download Completed");
              resolve(path);
            });
          });
        });
      };

      const readQrCode = async (src) => {
        let image = fs.readFileSync(src);
        image = await Jimp.read(image);

        let res = "";
        const qr = new QrCode();
        qr.callback = function (err, value) {
          if (err) {
            console.error(err);
          }
          res = value.result;
        };
        qr.decode(image.bitmap);

        return res.split("|");
      };

      const scan = async (url) => {
        const path = await downloadImage(url, IMG_PATH);
        const result = await readQrCode(path);
        return result;
      };

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
          const tx = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction
          );
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
          return tx;
        } catch (error) {
          console.log(error);
        }
      };

      const isVoted = async (id) => {
        try {
          const listToken = await contract.methods.allTokens().call();
          for (let i = 0; i < listToken.length; i++) {
            let uri = await contract.methods.tokenURI(listToken[i]).call();
            if (uri == id) return true;
          }
          return false;
        } catch (error) {
          console.log(error);
        }
      };

      const { image_url, option } = req.body;
      const data = await scan(image_url);
      const hashId = "0x" + keccak256(data[0]).toString("hex");
      const status = await isVoted(hashId);
      if (status) {
        res.json(onError("You have already voted"));
      } else {
        const tokenId =
          parseInt(await contract.methods.totalSupply().call()) + 1;
        const txhash = await mint(tokenId, hashId, option);
        res.json(
          onSuccess({
            "Transaction hash": txhash.toString(),
            "Your hash-id": hashId,
          })
        );
      }
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  CheckMyVote: async (req, res) => {
    try {
      const downloadImage = (url, path) => {
        return new Promise((resolve, reject) => {
          https.get(url, (res) => {
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on("finish", () => {
              filePath.close();
              // console.log("Download Completed");
              resolve(path);
            });
          });
        });
      };

      const readQrCode = async (src) => {
        let image = fs.readFileSync(src);
        image = await Jimp.read(image);

        let res = "";
        const qr = new QrCode();
        qr.callback = function (err, value) {
          if (err) {
            console.error(err);
          }
          res = value.result;
        };
        qr.decode(image.bitmap);

        return res.split("|");
      };

      const scan = async (url) => {
        const path = await downloadImage(url, IMG_PATH);
        const result = await readQrCode(path);
        return result;
      };

      const isVoted = async (id) => {
        try {
          const listToken = await contract.methods.allTokens().call();
          for (let i = 0; i < listToken.length; i++) {
            let uri = await contract.methods.tokenURI(listToken[i]).call();
            if (uri == id) return true;
          }
          return false;
        } catch (error) {
          console.log(error);
        }
      };

      const toDate = (str) => {
        return (
          str[0] +
          str[1] +
          "/" +
          str[2] +
          str[3] +
          "/" +
          str[4] +
          str[5] +
          str[6] +
          str[7]
        );
      };

      const image_url = req.query.image_url;
      const data = await scan(image_url);
      const hashId = "0x" + keccak256(data[0]).toString("hex");
      let info = {
        Id: data[0],
        Name: data[2],
        "Date of Birth": toDate(data[3]),
        "Hash-id": hashId,
      };
      const status = await isVoted(hashId);
      if (!status) {
        info["Is Voted"] = false;
        info["Vote for"] = null;
        res.json(onSuccess(info));
      } else {
        info["Is Voted"] = true;
        const voteFor = await contract.methods.voteOfURI(hashId).call();
        info["Vote for"] = parseInt(voteFor);
        res.json(onSuccess(info));
      }
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  CountVoted: async (req, res) => {
    try {
      const listToken = await contract.methods.allTokens().call();
      let count = [0, 0, 0, 0];
      for (let i = 0; i < listToken.length; i++) {
        const voteFor = await contract.methods
          .voteOfTokenId(listToken[i])
          .call();
        if (voteFor == 1) {
          count[0]++;
        }
        if (voteFor == 2) {
          count[1]++;
        }
        if (voteFor == 3) {
          count[2]++;
        }
        if (voteFor == 4) {
          count[3]++;
        }
      }
      res.json(
        onSuccess({ 1: count[0], 2: count[1], 3: count[2], 4: count[3] })
      );
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  ListVoted: async (req, res) => {
    try {
      let data = {};
      const listToken = await contract.methods.allTokens().call();
      for (let i = 0; i < listToken.length; i++) {
        let hashId = await contract.methods.tokenURI(listToken[i]).call();
        let option = await contract.methods.voteOfURI(hashId).call();
        data[hashId] = option;
      }
      res.json(onSuccess(data));
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
};
