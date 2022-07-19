const { assert, expert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")

describe("VersusToken", async function () {
    console.log("test starting...")
    let versusToken, deployer, test1, test2
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        test1 = (await getNamedAccounts()).test1
        test2 = (await getNamedAccounts()).test2
        // console.log(`deployer: ${deployer}`)
        // console.log(`test1: ${test1}`)
        // console.log(`test2: ${test2}`)
        await deployments.fixture(["all"])
        versusToken = await ethers.getContract("VersusToken", deployer)
    })
    describe("constructor", function () {
        it("Initializes the versus token correctly", async function () {
            // console.log(deployer)
            // console.log(versusToken.address)
            const initialSupply = await versusToken.totalSupply()
            const name = await versusToken.name()
            const symbol = await versusToken.symbol()
            const balance = await versusToken.balanceOf(deployer)
            assert.equal(initialSupply.toString(), "1000000000")
            assert.equal(name, "VersusToken")
            assert.equal(symbol, "versus")
            assert.equal(balance.toString(), initialSupply.toString())
        })
    })
    describe("versus token totalSupply", function () {
        it("totalSupply", async function () {
            await versusToken.mint(1000000000)
            const totalSupply = await versusToken.totalSupply()
            assert.equal(totalSupply.toString(), "2000000000")
        })
    })
    describe("mint token", function () {
        it("mint new tokens", async function () {
            const latestSupply = await versusToken.totalSupply()
            await versusToken.mint(2000000000)
            const currentSupply = await versusToken.totalSupply()
            const ownerBalance = await versusToken.balanceOf(deployer)
            assert.equal(currentSupply.toString(), latestSupply.add(2000000000).toString())
            assert.equal(ownerBalance.toString(), currentSupply.toString())
        })
        it("only owner could mint", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            console.log(attacker.address)
            const attackerConnectContract = await versusToken.connect(attacker)
            await expect(attackerConnectContract.mint(1000000000)).to.be.revertedWith("Not__Owner")
        })
    })

    describe("transfer", function () {
        it("transfer amount value to 'to' address", async function () {
            beforeTransferBalance = await versusToken.balanceOf(deployer)
            await versusToken.transfer(test1, 5000)
            const toBalance = await versusToken.balanceOf(test1)
            const currentBalance = await versusToken.balanceOf(deployer)
            assert.equal("5000", toBalance.toString())
            assert.equal(currentBalance.toString(), beforeTransferBalance.sub(5000).toString())
        })
        it("transfer amount exceeds balance", async function () {
            await expect(versusToken.transfer(test1, 200000000000)).to.be.revertedWith(
                "Transfer__Exceed"
            )
        })
    })
    describe("approve", function () {
        it("approve successfull", async function () {
            await versusToken.approve(test1, 1000)
            const allowance = await versusToken.allowance(deployer, test1)
            assert.equal(allowance.toString(), "1000")
        })
    })

    describe("transferFrom", function () {
        it("_spendAllowance not enough allowance", async function () {
            await expect(versusToken.transferFrom(test1, test2, 10000)).to.be.revertedWith(
                "Insufficent__Allowance"
            )
        })

        it("transfer from 'test1' to 'test2' success", async function () {
            await versusToken.transfer(test1, 1000000)
            const accounts = await ethers.getSigners()
            const fromAccount = accounts[1]
            const fromContract = await versusToken.connect(fromAccount)

            const tx = await fromContract.approve(deployer, 1000000)
            tx.wait(1)
            versusToken = await fromContract.connect(accounts[0])
            await versusToken.transferFrom(test1, test2, 100000)
            const senderBalance = await versusToken.balanceOf(test1)
            const receiverBalance = await versusToken.balanceOf(test2)
            const deployerBalance = await versusToken.balanceOf(deployer)
            console.log(`receiver balance:${receiverBalance}`)
            console.log(`sender balance:${senderBalance}`)
            console.log(`sender balance:${deployerBalance}`)
        })
    })

    describe("inscreaseAllowance", function () {
        it("increase spender allowance", async function () {
            await versusToken.approve(test1, 100000)
            const beforeAllowance = await versusToken.allowance(deployer, test1)
            await versusToken.increaseAllowance(test1, 500000)
            const currentAllowance = await versusToken.allowance(deployer, test1)
            assert.equal(beforeAllowance.add(500000).toString(), currentAllowance.toString())
        })
    })

    describe("decreaseAllowance", function () {
        it("decrease spender allowance", async function () {
            await versusToken.approve(test1, 100000)
            const beforeAllowance = await versusToken.allowance(deployer, test1)
            await versusToken.decreaseAllowance(test1, 500)
            const currentAllowance = await versusToken.allowance(deployer, test1)
            assert.equal(beforeAllowance.sub(500).toString(), currentAllowance.toString())
        })

        it("descreased value > allowance,should failed", async function () {
            await versusToken.approve(test1, 100000)
            await expect(versusToken.decreaseAllowance(test1, 10000000)).to.be.revertedWith(
                "DecreaseAllowance__BelowZero"
            )
        })
    })
})
