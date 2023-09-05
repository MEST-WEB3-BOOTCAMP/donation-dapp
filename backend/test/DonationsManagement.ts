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
    describe("createCampaign", function () {
      it("should revert if campaign title is empty", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(donationsMgt.createCampaign("")).to.be.revertedWith(
          "Campaign title cannot be empty"
        );
      });

      it("should create a campaign", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        expect((await donationsMgt.getCampaign(1)).title).to.equal(
          "Campaign 1"
        );
      });

      it("should emit CampaignCreated event", async function () {
        const { donationsMgt, owner } = await loadFixture(
          deployDonationsMgtFixture
        );
        await expect(donationsMgt.createCampaign("Campaign 1"))
          .to.emit(donationsMgt, "CampaignCreated")
          .withArgs(
            1,
            "Campaign 1",
            owner.address,
            0,
            true,
            (await time.latest()) + 1
          );
      });
    });

    describe("deactivateCampaign", function () {
      it("should revert if campaign is not active", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(donationsMgt.deactivateCampaign(1)).to.be.revertedWith(
          "Campaign is not active"
        );
      });

      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(donationsMgt.deactivateCampaign(2)).to.be.revertedWith(
          "Campaign does not exist"
        );
      });

      it("should revert if caller is not owner", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt.connect(otherAccount).deactivateCampaign(1)
        ).to.be.revertedWith("Caller is not owner");
      });

      it("should deactivate campaign", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        expect((await donationsMgt.getCampaign(1)).active).to.equal(false);
      });

      it("should emit CampaignDeactivated event", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await expect(donationsMgt.deactivateCampaign(1))
          .to.emit(donationsMgt, "CampaignDeactivated")
          .withArgs(1);
      });
    });

    describe("reactivateCampaign", function () {
      it("should revert if campaign is active", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await expect(donationsMgt.reactivateCampaign(1)).to.be.revertedWith(
          "Campaign already active"
        );
      });

      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(donationsMgt.reactivateCampaign(2)).to.be.revertedWith(
          "Campaign does not exist"
        );
      });

      it("should revert if caller is not owner", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(
          donationsMgt.connect(otherAccount).reactivateCampaign(1)
        ).to.be.revertedWith("Caller is not owner");
      });

      it("should reactivate campaign", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await donationsMgt.reactivateCampaign(1);
        expect((await donationsMgt.getCampaign(1)).active).to.equal(true);
      });

      it("should emit CampaignReactivated event", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(donationsMgt.reactivateCampaign(1))
          .to.emit(donationsMgt, "CampaignReactivated")
          .withArgs(1);
      });
    });

    describe("updateCampaignBeneficiary", function () {
      it("should revert if caller is not owner", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt
            .connect(otherAccount)
            .updateCampaignBeneficiary(1, otherAccount.address)
        ).to.be.revertedWith("Caller is not owner");
      });

      it("should revert if campaign does not exist", async function () {
        const { donationsMgt, owner } = await loadFixture(
          deployDonationsMgtFixture
        );
        await expect(
          donationsMgt.updateCampaignBeneficiary(1, owner.address)
        ).to.be.revertedWith("Campaign does not exist");
      });

      it("should revert if campaign is not active", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(
          donationsMgt.updateCampaignBeneficiary(1, otherAccount.address)
        ).to.be.revertedWith("Campaign is not active");
      });

      it("should revert if beneficiary is ZeroAddress", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt.updateCampaignBeneficiary(1, ethers.ZeroAddress)
        ).to.be.revertedWith("Beneficiary address cannot be 0x0");
      });

      it("should revert if beneficiary is same", async function () {
        const { donationsMgt, owner } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt.updateCampaignBeneficiary(1, owner.address)
        ).to.be.revertedWith("Beneficiary address cannot be the same");
      });

      it("should set campaign beneficiary", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.updateCampaignBeneficiary(1, otherAccount.address);
        expect((await donationsMgt.getCampaign(1)).beneficiary).to.equal(
          otherAccount.address
        );
      });

      it("should emit CampaignBeneficiaryUpdated event", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt.updateCampaignBeneficiary(1, otherAccount.address)
        )
          .to.emit(donationsMgt, "CampaignBeneficiaryUpdated")
          .withArgs(1, otherAccount.address);
      });
    });

    describe("getCampaign", function () {
      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(donationsMgt.getCampaign(1)).to.be.revertedWith(
          "Campaign does not exist"
        );
      });

      it("should revert if campaign id is 0", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Test Campaign");
        await expect(donationsMgt.getCampaign(0)).to.be.revertedWith(
          "Campaign does not exist"
        );
      });

      it("should return campaign", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        expect((await donationsMgt.getCampaign(1)).title).to.equal(
          "Campaign 1"
        );
      });
    });

    describe("getAllCampaigns", function () {
      it("should return all campaigns", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.createCampaign("Campaign 2");
        await donationsMgt.createCampaign("Campaign 3");
        expect(await donationsMgt.getAllCampaigns()).to.have.lengthOf(3);
      });

      it("should return empty array if no campaigns", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        expect(await donationsMgt.getAllCampaigns()).to.have.lengthOf(0);
      });
    });

    describe("getCampaignDonors", function () {
      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(donationsMgt.getCampaignDonors(1)).to.be.revertedWith(
          "Campaign does not exist"
        );
      });

      it("should return list of donor addresses", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
          value: 100,
        });

        expect(await donationsMgt.getCampaignDonors(1)).to.have.lengthOf(1);
      });
    });

    describe("getCampaignTotalDonations", function () {
      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(
          donationsMgt.getCampaignTotalDonations(1)
        ).to.be.revertedWith("Campaign does not exist");
      });

      it("should return total donations", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        expect(await donationsMgt.getCampaignTotalDonations(1)).to.equal(0);
      });
    });

    describe("donateToCampaign", function () {
      it("should revert if campaign does not exist", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await expect(
          donationsMgt.donateToCampaign(1, otherAccount.address)
        ).to.be.revertedWith("Campaign does not exist");
      });

      it("should revert if campaign is not active", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(
          donationsMgt.donateToCampaign(1, otherAccount.address)
        ).to.be.revertedWith("Campaign is not active");
      });

      it("should revert if donation amount is 0", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await expect(
          donationsMgt.donateToCampaign(1, "", {
            value: 0,
          })
        ).to.be.revertedWith("Donation amount should be more than 0");
      });

      it("should add donor to campaign donors", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");

        const donors = await donationsMgt.getCampaignDonors(1);

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
          value: 100,
        });

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        expect(donors).to.have.lengthOf(0);
        expect(await donationsMgt.getCampaignTotalDonations(1)).to.equal(300);
        expect(await donationsMgt.getCampaignDonors(1)).to.have.lengthOf(2);
      });

      it("should increase total donations", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        const totalDonations = await donationsMgt.getCampaignTotalDonations(1);
        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        expect(totalDonations).to.equal(0);
        expect(await donationsMgt.getCampaignTotalDonations(1)).to.equal(100);
      });

      it("should increase campaign balance", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        expect((await donationsMgt.getCampaign(1)).balance).to.equal(100);
      });

      it("should add donation to campaign donations with message", async function () {
        const { donationsMgt, owner } = await loadFixture(
          deployDonationsMgtFixture
        );

        await donationsMgt.createCampaign("Campaign 1");

        expect(
          await donationsMgt.donateToCampaign(1, "Test", {
            value: 100,
          })
        )
          .to.emit(donationsMgt, "Donation")
          .withArgs(
            1,
            1,
            owner.address,
            100,
            "Test",
            (await time.latest()) + 1
          );
      });

      it("should add donation with empty message with default message", async function () {
        const { donationsMgt, owner } = await loadFixture(
          deployDonationsMgtFixture
        );

        await donationsMgt.createCampaign("Campaign 1");

        expect(
          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          })
        )
          .to.emit(donationsMgt, "Donation")
          .withArgs(
            1,
            1,
            owner.address,
            100,
            "Anonymous donation",
            (await time.latest()) + 1
          );
      });
    });

    describe("withdrawFromCampaign", function () {
      it("should revert if caller is not beneficiary", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );
        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await expect(
          donationsMgt
            .connect(otherAccount)
            .withdrawFromCampaign(1, 100, "Test")
        ).to.be.revertedWith("Only beneficiary can withdraw");
      });

      it("should revert if campaign does not exist", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await expect(
          donationsMgt.withdrawFromCampaign(1, 100, "Test")
        ).to.be.revertedWith("Campaign does not exist");
      });

      it("should revert if campaign is not active", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");
        await donationsMgt.deactivateCampaign(1);
        await expect(
          donationsMgt.withdrawFromCampaign(1, 100, "Test")
        ).to.be.revertedWith("Campaign is not active");
      });

      it("should revert if withdrawal amount is 0", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");

        await expect(
          donationsMgt.withdrawFromCampaign(1, 0, "Test")
        ).to.be.revertedWith("Withdrawal amount should be more than 0");
      });

      it("should revert if withdrawal amount is more than available balance", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await expect(
          donationsMgt.withdrawFromCampaign(1, 1000, "Test")
        ).to.be.revertedWith(
          "Withdrawal amount is more than available balance"
        );
      });

      it("should revert if withdrawal reason is empty", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await expect(
          donationsMgt.withdrawFromCampaign(1, 50, "")
        ).to.be.revertedWith("Withdrawal reason cannot be empty");
      });

      it("should decrease campaign balance", async function () {
        const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await donationsMgt.withdrawFromCampaign(1, 50, "Withdrawal 1");

        expect((await donationsMgt.getCampaign(1)).balance).to.equal(50);
      });

      it("should add withdrawal to campaign withdrawals", async function () {
        const { donationsMgt, otherAccount } = await loadFixture(
          deployDonationsMgtFixture
        );

        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.donateToCampaign(1, "", {
          value: 100,
        });

        await donationsMgt.withdrawFromCampaign(1, 50, "Withdrawal 1");
      });

      it("should emit Withdrawal event", async function () {
        const { donationsMgt, otherAccount, owner } = await loadFixture(
          deployDonationsMgtFixture
        );

        await donationsMgt.createCampaign("Campaign 1");

        await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
          value: 100,
        });

        await expect(donationsMgt.withdrawFromCampaign(1, 50, "Withdrawal 1"))
          .to.emit(donationsMgt, "Withdrawal")
          .withArgs(
            1,
            1,
            owner.address,
            50,
            "Withdrawal 1",
            (await time.latest()) + 1
          );
      });
    });
  });
});
