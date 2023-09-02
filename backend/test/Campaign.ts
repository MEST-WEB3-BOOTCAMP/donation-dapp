import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

function deployCampaignFixture(paused = false) {
  return async function campaignFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const title = "Test Campaign";

    const Campaign = await ethers.getContractFactory("Campaign");
    const campaign = await Campaign.deploy(owner.address);

    if (paused) {
      await campaign.pause();
    }

    return {
      campaign,
      owner,
      otherAccount,
      title,
    };
  };
}

describe("Campaign", function () {
  describe("Deployment", function () {
    it("should set the beneficiary", async function () {
      const { campaign, owner, otherAccount } = await loadFixture(
        deployCampaignFixture()
      );

      expect(await campaign.beneficiary()).to.equal(owner.address);
      expect(await campaign.beneficiary()).to.not.equal(otherAccount.address);
    });
  });

  describe("Methods", function () {
    describe("pause", function () {
      it("should pause the contract", async function () {
        const { campaign } = await loadFixture(deployCampaignFixture(false));

        await campaign.pause();

        expect(await campaign.paused()).to.equal(true);
      });

      it("should revert if not called by the owner", async function () {
        const { campaign, otherAccount } = await loadFixture(
          deployCampaignFixture(false)
        );

        await expect(campaign.connect(otherAccount).pause()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("should revert if the contract is already paused", async function () {
        const { campaign } = await loadFixture(deployCampaignFixture(true));

        await expect(campaign.pause()).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("unpause", function () {
      it("should unpause the contract", async function () {
        const { campaign } = await loadFixture(deployCampaignFixture(true));

        await campaign.unpause();

        expect(await campaign.paused()).to.equal(false);
      });

      it("should revert if not called by the owner", async function () {
        const { campaign, otherAccount } = await loadFixture(
          deployCampaignFixture(true)
        );

        await expect(
          campaign.connect(otherAccount).unpause()
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("should revert if the contract is not paused", async function () {
        const { campaign } = await loadFixture(deployCampaignFixture(false));

        await expect(campaign.unpause()).to.be.revertedWith(
          "Pausable: not paused"
        );
      });
    });

    describe("updateBeneficiary", function () {
      it("should update the beneficiary", async function () {
        const { campaign, otherAccount } = await loadFixture(
          deployCampaignFixture()
        );

        await campaign.updateBeneficiary(otherAccount.address);

        expect(await campaign.beneficiary()).to.equal(otherAccount.address);
      });

      it("should revert if not called by the owner", async function () {
        const { campaign, otherAccount } = await loadFixture(
          deployCampaignFixture()
        );

        await expect(
          campaign.connect(otherAccount).updateBeneficiary(otherAccount.address)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("should revert if the beneficiary is the zero address", async function () {
        const { campaign } = await loadFixture(deployCampaignFixture());

        await expect(campaign.updateBeneficiary(ethers.ZeroAddress)).to.be
          .reverted;
      });

      it("should revert if paused", async function () {
        const { campaign, otherAccount } = await loadFixture(
          deployCampaignFixture(true)
        );

        await expect(
          campaign.updateBeneficiary(otherAccount.address)
        ).to.be.revertedWith("Pausable: paused");
      });
    });

    describe("donate", function () {});

    describe("donors", function () {});

    describe("donations", function () {});

    describe("withdraw", function () {});

    describe("withdrawals", function () {});
  });
});
