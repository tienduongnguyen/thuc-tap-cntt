const { onError, onSuccess } = require("../utils/utils");

const Web3 = require("web3");
const {
  RINKEBY_URL,
  PRIVATE_KEY,
  MY_ADDRESS,
  GOV_ABI,
  GOV_CONTRACT_ADDRESS,
  ALL_ACCOUNTS,
  AUTH_ACCOUNTS,
} = require("../utils/constants");

const web3 = new Web3(RINKEBY_URL);
const contract = new web3.eth.Contract(GOV_ABI, GOV_CONTRACT_ADDRESS);

const addAccountToList = (path, address, privateKey) => {
  removeAccountFromList(path, address);
  const fs = require("fs");
  let json = require(path);
  let accounts = json.accounts;
  accounts.push({
    address: address,
    privateKey: privateKey,
  });
  json.accounts = accounts;
  fs.writeFileSync(path, JSON.stringify(json));
};

const removeAccountFromList = (path, address) => {
  const fs = require("fs");
  let json = require(path);
  let accounts = json.accounts;
  json.accounts = accounts.filter((account) => {
    return account.address !== address;
  });
  fs.writeFileSync(path, JSON.stringify(json));
};

const signAndSendTransaction = async (data) => {
  try {
    const txObj = {
      from: MY_ADDRESS,
      to: GOV_CONTRACT_ADDRESS,
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

    return tx.transactionHash;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  GenerateAccount: async (req, res) => {
    try {
      const { address, privateKey } = web3.eth.accounts.create();
      addAccountToList(ALL_ACCOUNTS, address, privateKey);
      res.json(
        onSuccess({
          address: address,
          privateKey: privateKey,
        })
      );
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  NameOfAddress: async (req, res) => {
    try {
      const address = req.query.address;
      const status = await contract.methods._isAllowed(address).call();
      if (status) {
        const name = await contract.methods._addressToName(address).call();
        res.json(onSuccess(name));
      } else {
        res.json(onError("Address haven't added yet"));
      }
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  AddressOfName: async (req, res) => {
    try {
      const name = req.query.name;
      if (name == "root") {
        res.json(onSuccess("0x0000000000000000000000000000000000000000"));
      } else {
        const address = await contract.methods._nameToAddress(name).call();
        if (address == "0x0000000000000000000000000000000000000000") {
          res.json(onError("Name not found"));
        } else res.json(onSuccess(address));
      }
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  AddAuthorizedAccount: async (req, res) => {
    try {
      const add = async (address, name) => {
        try {
          const data = contract.methods.addAllowance(address, name).encodeABI();
          const tx = await signAndSendTransaction(data);
          return tx;
        } catch (error) {
          console.log(error);
        }
      };
      const { address, name } = req.body;
      const status = await contract.methods._isAllowed(address).call();
      if (status) res.json(onError("Address have already added"));
      else {
        const result = await add(address, name);
        const privateKey = require(ALL_ACCOUNTS).accounts.filter(
          (account) => account.address == address
        )[0].privateKey;
        addAccountToList(AUTH_ACCOUNTS, address, privateKey);
        res.json(onSuccess(result));
      }
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  ChangeAuthorizedAccount: async (req, res) => {
    try {
      const change = async (address, name) => {
        try {
          const data = contract.methods
            .changeAllowance(address, name)
            .encodeABI();
          const tx = await signAndSendTransaction(data);
          return tx;
        } catch (error) {
          console.log(error);
        }
      };
      const { address, name } = req.body;
      if (address == MY_ADDRESS) res.json(onError("Can not change Admin"));
      else {
        const status = await contract.methods._isAllowed(address).call();
        if (!status) res.json(onError("Address haven't added yet"));
        else {
          const result = await change(address, name);
          res.json(onSuccess(result));
        }
      }
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  DeleteAuthorizedAccount: async (req, res) => {
    try {
      const deletes = async (address) => {
        try {
          const data = contract.methods.deleteAllowance(address).encodeABI();
          const tx = await signAndSendTransaction(data);
          return tx;
        } catch (error) {
          console.log(error);
        }
      };
      const { address } = req.body;
      if (address == MY_ADDRESS) res.json(onError("Can not delete Admin"));
      else {
        const status = await contract.methods._isAllowed(address).call();
        if (!status) res.json(onError("Address haven't added yet"));
        else {
          const result = await deletes(address);
          removeAccountFromList(AUTH_ACCOUNTS, address);
          res.json(onSuccess(result));
        }
      }
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
  ListAuthorizedAccount: async (req, res) => {
    try {
      let result = {};
      const supply = await contract.methods.supply().call();
      for (let i = 0; i < supply; i++) {
        const address = await contract.methods.addressIndex(i).call();
        if (address == "0x0000000000000000000000000000000000000000") continue;
        let name = await contract.methods._addressToName(address).call();
        if (name == "admin") name = "Chinh Phu";
        result[name] = address;
      }
      res.json(onSuccess(result));
    } catch (error) {
      console.log(error);
      res.json(onError(error));
    }
  },
};
