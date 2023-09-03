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
      describe("Validations", function () {
        it("should revert if campaign title is empty", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await expect(donationsMgt.createCampaign("")).to.be.revertedWith(
            "Campaign title cannot be empty"
          );
        });
      });

      describe("Functionality", function () {
        it("should create a campaign", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          expect((await donationsMgt.getCampaign(1)).title).to.equal(
            "Campaign 1"
          );
        });
      });
      describe("Events", function () {
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
    });

    describe("deactivateCampaign", function () {
      describe("Validations", function () {
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
      });

      describe("Functionality", function () {
        it("should deactivate campaign", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.deactivateCampaign(1);
          expect((await donationsMgt.getCampaign(1)).active).to.equal(false);
        });
      });

      describe("Events", function () {
        it("should emit CampaignDeactivated event", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          await expect(donationsMgt.deactivateCampaign(1))
            .to.emit(donationsMgt, "CampaignDeactivated")
            .withArgs(1);
        });
      });
    });

    describe("reactivateCampaign", function () {
      describe("Validations", function () {
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
      });

      describe("Functionality", function () {
        it("should reactivate campaign", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.deactivateCampaign(1);
          await donationsMgt.reactivateCampaign(1);
          expect((await donationsMgt.getCampaign(1)).active).to.equal(true);
        });
      });

      describe("Events", function () {
        it("should emit CampaignReactivated event", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.deactivateCampaign(1);
          await expect(donationsMgt.reactivateCampaign(1))
            .to.emit(donationsMgt, "CampaignReactivated")
            .withArgs(1);
        });
      });
    });

    describe("updateCampaignBeneficiary", function () {
      describe("Validations", function () {
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
      });

      describe("Functionality", function () {
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
      });

      describe("Events", function () {
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
    });

    describe("getCampaign", function () {
      describe("Validations", function () {
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
      });

      describe("Functionality", function () {
        it("should return campaign", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          expect((await donationsMgt.getCampaign(1)).title).to.equal(
            "Campaign 1"
          );
        });
      });
    });

    describe("getAllCampaigns", function () {
      describe("Functionality", function () {
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
    });

    describe("getCampaignDonors", function () {
      describe("Validations", function () {
        it("should revert if campaign does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await expect(donationsMgt.getCampaignDonors(1)).to.be.revertedWith(
            "Campaign does not exist"
          );
        });
      });

      describe("Functionality", function () {
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
    });

    describe("getCampaignDonations", function () {
      describe("Validations", function () {
        it("should revert if campaign does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await expect(donationsMgt.getCampaignDonations(1)).to.be.revertedWith(
            "Campaign does not exist"
          );
        });
      });

      describe("Functionality", function () {
        it("should return list of donations", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
            value: 100,
          });

          expect(await donationsMgt.getCampaignDonations(1)).to.have.lengthOf(
            1
          );
        });
      });
    });

    describe("getCampaignTotalDonations", function () {
      describe("Validations", function () {
        it("should revert if campaign does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await expect(
            donationsMgt.getCampaignTotalDonations(1)
          ).to.be.revertedWith("Campaign does not exist");
        });
      });

      describe("Functionality", function () {
        it("should return total donations", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await donationsMgt.createCampaign("Campaign 1");
          expect(await donationsMgt.getCampaignTotalDonations(1)).to.equal(0);
        });
      });
    });

    describe("getCampaignWithdrawals", function () {
      describe("Validations", function () {
        it("should revert if campaign does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);
          await expect(
            donationsMgt.getCampaignWithdrawals(1)
          ).to.be.revertedWith("Campaign does not exist");
        });
      });

      describe("Functionality", function () {
        it("should return list of withdrawals", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.createCampaign("Campaign 2");
          await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
            value: 100,
          });
          await donationsMgt.withdrawFromCampaign(1, 50, "Withdrawal 1");
          await donationsMgt.withdrawFromCampaign(1, 10, "Withdrawal 2");
          expect(
            await donationsMgt.connect(otherAccount).getCampaignWithdrawals(1)
          ).to.have.lengthOf(2);
        });
      });
    });

    describe("donateToCampaign", function () {
      describe("Validations", function () {
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
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");
          await expect(
            donationsMgt.donateToCampaign(1, "", {
              value: 0,
            })
          ).to.be.revertedWith("Donation amount should be more than 0");
        });
      });

      describe("Functionality", function () {
        it("should increase total donations", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");
          const totalDonations = await donationsMgt.getCampaignTotalDonations(
            1
          );
          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          expect(totalDonations).to.equal(0);
          expect(await donationsMgt.getCampaignTotalDonations(1)).to.equal(100);
        });

        it("should increase campaign balance", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          expect((await donationsMgt.getCampaign(1)).balance).to.equal(100);
        });

        it("should add donation to campaign donations", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          expect(await donationsMgt.getCampaignDonations(1)).to.have.lengthOf(
            1
          );
        });

        it("should add donation to campaign donations with message", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "Test", {
            value: 100,
          });

          expect(await donationsMgt.getCampaignDonations(1)).to.have.lengthOf(
            1
          );
          expect(
            (await donationsMgt.getCampaignDonations(1))[0].message
          ).to.equal("Test");
        });

        it("should add donation with empty message with default message", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          expect(await donationsMgt.getCampaignDonations(1)).to.have.lengthOf(
            1
          );
          expect(
            (await donationsMgt.getCampaignDonations(1))[0].message
          ).to.equal("Anonymous donation");
        });
      });
    });

    describe("withdrawFromCampaign", function () {
      describe("Validations", function () {
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
              .withdrawFromCampaign(1, otherAccount.address, 100)
          ).to.be.revertedWith("Only beneficiary can withdraw");
        });

        it("should revert if campaign does not exist", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await expect(
            donationsMgt.withdrawFromCampaign(1, otherAccount.address, 100)
          ).to.be.revertedWith("Campaign does not exist");
        });

        it("should revert if campaign is not active", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");
          await donationsMgt.deactivateCampaign(1);
          await expect(
            donationsMgt.withdrawFromCampaign(1, otherAccount.address, 100)
          ).to.be.revertedWith("Campaign is not active");
        });

        it("should revert if withdrawal amount is 0", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");

          await expect(
            donationsMgt.withdrawFromCampaign(1, 0, "Test")
          ).to.be.revertedWith("Withdrawal amount should be more than 0");
        });

        it("should revert if withdrawal amount is more than available balance", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          await expect(
            donationsMgt.withdrawFromCampaign(1, otherAccount.address, 200)
          ).to.be.revertedWith(
            "Withdrawal amount is more than available balance"
          );
        });

        it("should revert if withdrawal reason is empty", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );
          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.donateToCampaign(1, "", {
            value: 100,
          });

          await expect(
            donationsMgt.withdrawFromCampaign(1, 50, "")
          ).to.be.revertedWith("Withdrawal reason cannot be empty");
        });
      });

      describe("Functionality", function () {
        it("should decrease campaign balance", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

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

          expect(await donationsMgt.getCampaignWithdrawals(1)).to.have.lengthOf(
            1
          );
        });
      });

      describe("Events", function () {
        it("should emit WithdrawalMade event", async function () {
          const { donationsMgt, otherAccount, owner } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCampaign("Campaign 1");

          await donationsMgt.connect(otherAccount).donateToCampaign(1, "", {
            value: 100,
          });

          await expect(donationsMgt.withdrawFromCampaign(1, 50, "Withdrawal 1"))
            .to.emit(donationsMgt, "WithdrawalMade")
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
});
