import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/config/contracts"

task("addMember", "addMember")
    .setAction(async (taskArgs, hre) => {
       let contracts = new Contracts(hre.hardhatArguments.network as string);

        const ContractArtifact = require('../../artifacts/contracts/ERC20Token.sol/ERC20Token.json');

        const [signer] = await hre.ethers.getSigners();

        let ercOne = new hre.ethers.Contract(contracts.ERC20_ONE, ContractArtifact.abi, signer);
        let ercTwo = new hre.ethers.Contract(contracts.ERC20_TWO, ContractArtifact.abi, signer);

        let ercOneSigner = ercOne.connect(signer);
        let ercTwoSigner = ercTwo.connect(signer);

        let tx = await ercOneSigner.addMember(contracts.BRIDGE_ONE);
        await tx.wait();

        let tx2 = await ercTwoSigner.addMember(contracts.BRIDGE_TWO);
        await tx2.wait();

        console.log("DONE")
    });

