import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Cause", function () {
  const causeId = 1;
  const causeName = "Test Cause";
  const causeDescription = "This is a test cause.";
  const causeImage = "";
  const causeGoal = 1000;

  async function deployCauseFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const causeDeadline = 365 * 24 * 60 * 60 + (await time.latest());
    const Cause = await ethers.getContractFactory("Cause");
    const cause = await Cause.deploy(
      causeId,
      causeName,
      causeDescription,
      causeImage,
      owner,
      causeGoal,
      causeDeadline
    );

    return {
      cause,
      owner,
      otherAccount,
      causeId,
      causeName,
      causeDescription,
      causeImage,
      causeGoal,
      causeDeadline,
    };
  }

  describe("Deployment", function () {
    it("should set the right values", async function () {
      const {
        cause,
        owner,
        causeId,
        causeName,
        causeDescription,
        causeImage,
        causeGoal,
        causeDeadline,
      } = await loadFixture(deployCauseFixture);

      expect(await cause.deadline()).to.equal(causeDeadline);
      expect(await cause.owner()).to.equal(owner.address);
      expect(await cause.id()).to.equal(causeId);
      expect(await cause.name()).to.equal(causeName);
      expect(await cause.description()).to.equal(causeDescription);
      expect(await cause.deadline()).to.equal(causeDeadline);
      expect(await cause.image()).to.equal(causeImage);
      expect(await cause.goal()).to.equal(causeGoal);
      expect(await cause.balance()).to.equal(0);
    });

    it("should fail if the deadline is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const [owner] = await ethers.getSigners();
      const latestTime = await time.latest();
      const Cause = await ethers.getContractFactory("Cause");
      await expect(
        Cause.deploy(
          causeId,
          causeName,
          causeDescription,
          causeImage,
          owner,
          causeGoal,
          latestTime
        )
      ).to.be.revertedWith("Cause: deadline must be in the future");
    });
  });

  describe("Methods", function () {
    describe("pause", function () {
      it("should pause smart contract", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.pause();
        expect(await cause.paused()).to.equal(true);
      });

      it("should fail if caller is not owner", async function () {
        const { otherAccount, cause } = await loadFixture(deployCauseFixture);
        await expect(cause.connect(otherAccount).pause()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should fail if contract is already paused", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.pause();
        await expect(cause.pause()).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("unpause", function () {
      it("should unpause smart contract", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.pause();
        await cause.unpause();
        expect(await cause.paused()).to.equal(false);
      });

      it("should fail if caller is not owner", async function () {
        const { otherAccount, cause } = await loadFixture(deployCauseFixture);
        await cause.pause();
        await expect(cause.connect(otherAccount).unpause()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should fail if contract is not paused", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await expect(cause.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
      });
    });

    describe("expired", function () {
      it("should fail if the caller is not the owner", async function () {
        const { otherAccount, cause } = await loadFixture(deployCauseFixture);
        await expect(cause.connect(otherAccount).expired()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should return true if deadline is in the past", async function () {
        const { cause, causeDeadline } = await loadFixture(deployCauseFixture);
        await time.increase(causeDeadline + 1);
        expect(await cause.expired()).to.equal(true);
      });

      it("should return false if deadline is in the future", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        expect(await cause.expired()).to.equal(false);
      });
    });

    describe("credit", function () {
      it("should fail if the caller is not the owner", async function () {
        const { otherAccount, cause } = await loadFixture(deployCauseFixture);
        await expect(
          cause.connect(otherAccount).credit(100)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("should add amount to balance", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.credit(100);
        expect(await cause.balance()).to.equal(100);
      });

      it("should fail if contract is paused", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.pause();
        await expect(cause.credit(100)).to.be.revertedWith("Pausable: paused");
      });

      it("should fail if deadline has passed", async function () {
        const { cause, causeDeadline } = await loadFixture(deployCauseFixture);
        await time.increase(causeDeadline + 1);
        await expect(cause.credit(100)).to.be.revertedWith(
          "Cause: deadline has passed"
        );
      });
    });

    describe("debit", function () {
      it("should fail if the caller is not the owner", async function () {
        const { otherAccount, cause } = await loadFixture(deployCauseFixture);
        await cause.credit(100);
        await expect(cause.connect(otherAccount).debit(100)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should fail if contract is paused", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.credit(100);
        await cause.pause();
        await expect(cause.debit(100)).to.be.revertedWith("Pausable: paused");
      });

      it("should fail if balance is less than amount", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.credit(100);
        await expect(cause.debit(200)).to.be.revertedWith(
          "Cause: insufficient balance"
        );
      });

      it("should subtract amount from balance", async function () {
        const { cause } = await loadFixture(deployCauseFixture);
        await cause.credit(100);
        await cause.debit(100);
        expect(await cause.balance()).to.equal(0);
      });
    });
  });
});
