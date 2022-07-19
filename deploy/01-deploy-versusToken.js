const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // console.log(`contract deployer:${deployer}`)
    // console.log(`starting deploy...`)
    const args = [1000000000, "VersusToken", "VERSUS"]

    const versusToken = await deploy("VersusToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "versusToken"]
