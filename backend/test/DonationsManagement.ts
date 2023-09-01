import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationsManagement", function () {
  async function deployDonationAppFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const DonationApp = await ethers.getContractFactory("DonationsManagement");
    const donationApp = await DonationApp.deploy();

    return {
      donationApp,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      const { donationApp, owner, otherAccount } = await loadFixture(
        deployDonationAppFixture
      );

      expect(await donationApp.owner()).to.equal(owner.address);
      expect(await donationApp.owner()).to.not.equal(otherAccount.address);
    });
  });

  describe("Methods", function () {
    describe("addCause", function () {
      it("should add a new cause", async function () {
        const { donationApp, owner } = await loadFixture(
          deployDonationAppFixture
        );

        await donationApp.addCause(
          "Test Cause",
          "This is a test cause",
          "",
          100,
          (await time.latest()) + time.duration.days(10)
        );

        expect(await donationApp.causeCount()).to.equal(1);
        expect(await donationApp.causeCount()).to.not.equal(0);
      });

      it("should emit a CauseAdded event", async function () {
        const { donationApp, otherAccount } = await loadFixture(
          deployDonationAppFixture
        );
        const causeName = "Test Cause";
        const causeDescription = "This is a test cause";
        const causeImage = "";
        const deadline = (await time.latest()) + time.duration.days(10);
        const causeGoal = 100;

        await expect(
          donationApp
            .connect(otherAccount)
            .addCause(
              causeName,
              causeDescription,
              causeImage,
              causeGoal,
              deadline
            )
        )
          .to.emit(donationApp, "CauseAdded")
          .withArgs(
            1,
            causeName,
            causeDescription,
            causeImage,
            causeGoal,
            deadline,
            0
          );
      });
    });

    describe("donateToCause", function () {});

    describe("withdrawFromCause", function () {});

    describe("getAllCauses", function () {});

    describe("donorsList", function () {});
  });
});
