async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Government = await ethers.getContractFactory("Government");
  const government = await Government.deploy();
  const Vote = await ethers.getContractFactory("Vote");
  const vote = await Vote.deploy(government.address);

  console.log("Government contract address:", government.address);
  console.log("Vote contract address:", vote.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
