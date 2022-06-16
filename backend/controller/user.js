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
  VOTE_CONTRACT_ADDRESS,
  VOTE_ABI,
  IMG_PATH,
} = require("../utils/constants");
const keccak256 = require("keccak256");
const web3 = new Web3(RINKEBY_URL);
const contract = new web3.eth.Contract(VOTE_ABI, VOTE_CONTRACT_ADDRESS);

const listCandidates = [1, 2, 3, 4, 5];

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

const normalizeDate = (str) => {
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

const readTimestamp = async (timestamp) => {
  const time = new Date(parseInt(timestamp));
  const dateStr = time.toLocaleDateString();
  const timeStr = time.toLocaleTimeString();
  const gmt = time.toString().substring(25, 31);
  const res = dateStr + " " + timeStr + " " + gmt;
  return res;
};

module.exports = {
  Scan: async (req, res) => {
    try {
      const image_url = req.query.image_url;
      const data = await scan(image_url);
      const info = {
        Id: data[0],
        "Old Id": data[1],
        Name: data[2],
        "Date of Birth": normalizeDate(data[3]),
        Gender: data[4],
        Address: data[5],
        "Issued Date": normalizeDate(data[6]),
      };
      res.json(onSuccess(info));
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  Voting: async (req, res) => {
    try {
      const signAndSendTransaction = async (data) => {
        try {
          const txObj = {
            from: MY_ADDRESS,
            to: VOTE_CONTRACT_ADDRESS,
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

      const vote = async (hashId, option, time) => {
        try {
          const data = contract.methods.vote(hashId, option, time).encodeABI();
          const tx = await signAndSendTransaction(data);
          return tx;
        } catch (error) {
          console.log(error);
        }
      };

      const { image_url, option } = req.body;
      const data = await scan(image_url);
      const hashId = "0x" + keccak256(data[0]).toString("hex");
      console.log(hashId);
      const status = await contract.methods.exist(hashId).call();
      if (status) {
        res.json(onError("You have already voted"));
      } else {
        const txhash = await vote(hashId, option, new Date().getTime());
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
      const image_url = req.query.image_url;
      const data = await scan(image_url);
      const hashId = "0x" + keccak256(data[0]).toString("hex");
      const status = await contract.methods.exist(hashId).call();
      let info = {
        Id: data[0],
        Name: data[2],
        "Date of Birth": normalizeDate(data[3]),
        "Hash-id": hashId,
        "Is Voted": false,
        "Vote for": null,
        "Vote at": null,
      };
      if (!status) {
        res.json(onSuccess(info));
      } else {
        const vote = await contract.methods.hashIdVote(hashId).call();
        info["Is Voted"] = vote["voted"];
        info["Vote for"] = parseInt(vote["option"]);
        info["Vote at"] = await readTimestamp(parseInt(vote["time"]));
        res.json(onSuccess(info));
      }
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  CountVoted: async (req, res) => {
    try {
      let result = {};
      for (let i = 0; i < listCandidates.length; i++) {
        const option = listCandidates[i];
        const count = await contract.methods.optionCounter(option).call();
        result[option] = parseInt(count);
      }
      res.json(onSuccess(result));
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  ListVoted: async (req, res) => {
    try {
      let data = {};
      const supply = await contract.methods.supply().call();
      for (let i = supply - 1; i >= supply - 10; i--) {
        const hashId = await contract.methods.hashIdByIndex(i).call();
        const vote = await contract.methods.voteByIndex(i).call();
        data[hashId] = {
          "Vote for": vote["option"],
          "Vote at": await readTimestamp(vote["time"]),
        };
      }
      res.json(onSuccess(data));
    } catch (error) {
      res.json(onError(error));
      console.log(error);
    }
  },
  TotalVoted: async (req, res) => {
    try {
      const supply = await contract.methods.supply().call();
      res.json(onSuccess(parseInt(supply)));
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
};
