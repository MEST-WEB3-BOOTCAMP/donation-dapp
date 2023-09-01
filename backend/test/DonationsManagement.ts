import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationsManagement", function () {
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
    describe("addCause", function () {
      it("should add a new cause", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );

        await donationsMgt.addCause(
          "Test Cause",
          "This is a test cause",
          "",
          100,
          (await time.latest()) + time.duration.days(10)
        );

        expect(await donationsMgt.causeCount()).to.equal(1);

        await donationsMgt
          .connect(otherAccount)
          .addCause(
            "Test Cause 1",
            "This is another test cause",
            "",
            50,
            (await time.latest()) + time.duration.days(10)
          );
        expect(await donationsMgt.causeCount()).to.not.equal(0);
        expect(await donationsMgt.causeCount()).to.equal(2);
      });

      it("should emit a CauseAdded event", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        const causeName = "Test Cause";
        const causeDescription = "This is a test cause";
        const causeImage = "";
        const deadline = (await time.latest()) + time.duration.days(10);
        const causeGoal = 100;

        await expect(
          donationsMgt
            .connect(otherAccount)
            .addCause(
              causeName,
              causeDescription,
              causeImage,
              causeGoal,
              deadline
            )
        )
          .to.emit(donationsMgt, "CauseAdded")
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
