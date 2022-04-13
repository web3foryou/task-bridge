import { ethers, network } from "hardhat";
import {Contracts} from "../../app/config/contracts"

async function main() {
  let contracts = new Contracts(network.name);

  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(contracts.ERC20_ONE, contracts.PK);

  await bridge.deployed();

  console.log("Bridge deployed to:", bridge.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
