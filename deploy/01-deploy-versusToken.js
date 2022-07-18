const { network, ethers } = require("hardhat")
require("dotenv").config()

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // console.log(`contract deployer:${deployer}`)
    // console.log(`starting deploy...`)
    const args = [1000000000, "VersusToken", "versus"]

    const versusToken = await deploy("VersusToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "versusToken"]
