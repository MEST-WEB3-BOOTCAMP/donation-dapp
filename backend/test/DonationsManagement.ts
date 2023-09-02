import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

async function deployDonationsMgtFixture() {
  const [owner, otherAccount] = await ethers.getSigners();
  const DonationsMgt = await ethers.getContractFactory("DonationsManagement");
  const donationsMgt = await DonationsMgt.deploy();

  return {
    donationsMgt,
    owner,
    otherAccount,
  };
}

describe("DonationsManagement", function () {
  describe("Deployment", function () {
    it("should set the right owner", async function () {
      const { donationsMgt, owner, otherAccount } = await loadFixture(
        deployDonationsMgtFixture
      );

      expect(await donationsMgt.owner()).to.equal(owner.address);
      expect(await donationsMgt.owner()).to.not.equal(otherAccount.address);
    });
  });

  describe("Methods", function () {
    describe("donateToCause", function () {});

    describe("withdrawFromCause", function () {});

    describe("getAllCauses", function () {});

    describe("donorsList", function () {});
  });
});
