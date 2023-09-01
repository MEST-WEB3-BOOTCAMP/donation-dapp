import { ethers } from "hardhat";

async function main() {
  const donationsMgt = await ethers.deployContract("DonationsManagement", []);

  await donationsMgt.waitForDeployment();

  console.log(`DonationManagement is deployed to ${donationsMgt.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
