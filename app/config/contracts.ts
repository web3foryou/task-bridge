export class Contracts {
    BRIDGE_ONE: string;
    BRIDGE_TWO: string;
    ERC20_ONE: string;
    ERC20_TWO: string;
    SK: string;
    PK: string;

    constructor(network: string) {
        this.BRIDGE_ONE = process.env.CONTRACT_BRIDGE_ONE as string;
        this.BRIDGE_TWO = process.env.CONTRACT_BRIDGE_TWO as string;
        this.ERC20_ONE = process.env.CONTRACT_ERC20_ONE as string;
        this.ERC20_TWO = process.env.CONTRACT_ERC20_TWO as string;
        this.SK = process.env.SK as string;
        this.PK = process.env.PK as string;

        if (network == "rinkeby") {
            this.BRIDGE_ONE = process.env.CONTRACT_BRIDGE_ONE_RINKEBY as string;
            this.BRIDGE_TWO = process.env.CONTRACT_BRIDGE_TWO_RINKEBY as string;
            this.ERC20_ONE = process.env.CONTRACT_ERC20_ONE_RINKEBY as string;
            this.ERC20_TWO = process.env.CONTRACT_ERC20_TWO_RINKEBY as string;
        }
    }
}