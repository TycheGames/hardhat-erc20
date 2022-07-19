/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-deploy")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const BNBTESTNET_RPC_URL = process.env.BNBTESTNET_RPC_URL
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        rinkeby: {
            chainId: 4,
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        bnbtestnet: {
            url: BNBTESTNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 97,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        //apiKey: ETHERSCAN_API_KEY,
        //ether api key
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
            bnbtestnet: BSCSCAN_API_KEY,
        },
    },

    namedAccounts: {
        deployer: 0,
        test1: 1,
        test2: 2,
    },

    solidity: "0.8.9",
}
