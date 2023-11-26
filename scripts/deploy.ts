import { ethers, network, upgrades } from "hardhat";

const hre = require("hardhat");

async function main() {

  const cappedSetFactory = await ethers.getContractFactory("CappedSet");
  const cappedSet = await cappedSetFactory.deploy(5);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await cappedSet.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`Contract deployed to ${cappedSet.address} on ${network.name}`);

  console.log(`Verifying contract on Etherscan...`);
  await hre.run("verify:verify", {
    address: cappedSet.address,
    constructorArguments: [5]
  });
  console.log(
    `deployed to ${cappedSet.address},`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
