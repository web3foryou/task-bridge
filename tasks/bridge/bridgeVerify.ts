import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/config/contracts";

task("bridgeVerify", "bridgeVerify")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        await hre.run("verify:verify", {
            address: contracts.BRIDGE_ONE,
            constructorArguments: [
                contracts.ERC20_ONE,
                contracts.PK
            ],
        });
    });

