import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/config/contracts"

task("swap", "swap")
    .setAction(async (taskArgs, hre) => {
       let contracts = new Contracts(hre.hardhatArguments.network as string);

        const ContractArtifact = require('../../artifacts/contracts/Bridge.sol/Bridge.json');

        const [signer, user2] = await hre.ethers.getSigners();

        let bridgeOne = new hre.ethers.Contract(contracts.BRIDGE_ONE, ContractArtifact.abi, signer);

        let bridgeOneSigner = bridgeOne.connect(signer);

        let amount = hre.ethers.utils.parseEther("1.0");

        let tx = await bridgeOneSigner.swap(user2.address, amount);
        await tx.wait();

        console.log("lastId: " + await bridgeOneSigner.lastId());

        console.log("DONE")
    });

