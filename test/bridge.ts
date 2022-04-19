import {expect} from "chai";
import {ethers, network} from "hardhat";
import {Contracts} from "../app/config/contracts"
import { solidityKeccak256, arrayify } from "ethers/lib/utils";

describe("Bridge", function () {
    it("all", async function () {
        let contracts = new Contracts(network.name);

        const [user, user2, user3, user4] = await ethers.getSigners();

        let wallet = new ethers.Wallet(contracts.SK);

        const nameErc20 = "ERC20 Token";
        const symbolErc20 = "ERC20";
        let mintBalance = ethers.utils.parseEther("1000000.0");
        const Erc20One = await ethers.getContractFactory("ERC20Token");
        const erc20One = await Erc20One.deploy(nameErc20, symbolErc20, mintBalance);
        await erc20One.deployed();

        const Erc20Two = await ethers.getContractFactory("ERC20Token");
        const erc20Two = await Erc20Two.deploy(nameErc20, symbolErc20, mintBalance);
        await erc20Two.deployed();

        const BridgeOne = await ethers.getContractFactory("Bridge");
        const bridgeOne = await BridgeOne.deploy(erc20One.address, wallet.address);
        await bridgeOne.deployed();

        const BridgeTwo = await ethers.getContractFactory("Bridge");
        const bridgeTwo = await BridgeTwo.deploy(erc20Two.address, wallet.address);
        await bridgeTwo.deployed();

        let amount = ethers.utils.parseEther("1.0");

        await erc20One.addMember(bridgeOne.address);
        await erc20Two.addMember(bridgeTwo.address);

        //SWAP:
        await expect(bridgeOne.swap(user2.address, amount))
            .to.emit(bridgeOne, 'Swap')
            .withArgs(user2.address, amount);

        let data = await bridgeOne.swap(user2.address, amount)
        const nonce = data.nonce;

        // swap -> No have tokens.
        await expect(bridgeOne.connect(user3).swap(user2.address, amount))
            .to.be.revertedWith('No have tokens.');

        //REDEEM:
        let message = arrayify(solidityKeccak256( ["address", "uint", "uint"], [user2.address, amount, nonce]));

        let flatSig = await wallet.signMessage(message);

        let sig = ethers.utils.splitSignature(flatSig);

        await bridgeTwo.redeem(user2.address, amount, nonce, sig.v, sig.r, sig.s);

        expect(await erc20Two.balanceOf(user2.address)).to.equal(amount);

        // redeem -> Not valid
        await expect(bridgeTwo.redeem(user2.address, amount, 2, sig.v, sig.r, sig.s))
            .to.be.revertedWith('Not valid.');

        // redeem -> The transaction has already been approved.
        await expect(bridgeTwo.redeem(user2.address, amount, nonce, sig.v, sig.r, sig.s))
            .to.be.revertedWith('The transaction has already been approved.');
    });


});
