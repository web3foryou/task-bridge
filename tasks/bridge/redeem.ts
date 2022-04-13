import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/config/contracts"

task("redeem", "redeem")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        const [signer, user2] = await hre.ethers.getSigners();

        const ContractArtifactERC = require('../../artifacts/contracts/ERC20Token.sol/ERC20Token.json');
        let erc20Two = new hre.ethers.Contract(contracts.ERC20_TWO, ContractArtifactERC.abi, signer);
        let erc20TwoSigner = erc20Two.connect(signer);

        const ContractArtifact = require('../../artifacts/contracts/Bridge.sol/Bridge.json');
        let bridgeOnw = new hre.ethers.Contract(contracts.BRIDGE_ONE, ContractArtifact.abi, signer);
        let bridgeOneSigner = bridgeOnw.connect(signer);

        let bridgeTwo = new hre.ethers.Contract(contracts.BRIDGE_TWO, ContractArtifact.abi, signer);
        let bridgeTwoSigner = bridgeTwo.connect(signer);

        let amount = hre.ethers.utils.parseEther("1.0");
        let lastId = await bridgeOneSigner.lastId();

        let wallet = new hre.ethers.Wallet(contracts.SK);
        let message = (user2.address + "-" + amount + "-" + lastId).toLowerCase();
        let flatSig = await wallet.signMessage(message);
        let sig = hre.ethers.utils.splitSignature(flatSig);
        console.log("balanceOf: " + await erc20TwoSigner.balanceOf(user2.address))
        let tx = await bridgeTwoSigner.redeem(user2.address, amount, lastId, sig.v, sig.r, sig.s);
        await tx.wait();
        console.log("balanceOf: " + await erc20TwoSigner.balanceOf(user2.address))

        console.log("DONE")
    });

