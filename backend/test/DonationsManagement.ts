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
    describe("createCause", function () {
      describe("Actions", function () {
        it("should create a new cause", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          const causes = await donationsMgt.getAllCauses();

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          const causesAfter = await donationsMgt.getAllCauses();

          expect(causes.length).to.equal(0);
          expect(causesAfter.length).to.equal(1);
        });

        it('should emit "CauseAdded" event', async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await expect(
            donationsMgt.connect(otherAccount).createCause("Cause 1")
          ).to.emit(donationsMgt, "CauseAdded");
        });
      });
    });

    describe("pauseCause", function () {
      describe("Validations", function () {
        it("should revert if cause is already paused", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          await expect(donationsMgt.pauseCause(1)).to.be.revertedWith(
            "Cause is already paused"
          );
        });

        it("should revert if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await expect(donationsMgt.pauseCause(100)).to.be.revertedWith(
            "Cause does not exist"
          );
        });

        it("should revert if caller is not owner", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");

          await expect(
            donationsMgt.connect(otherAccount).pauseCause(1)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });

      describe("Actions", function () {
        it("should pause a cause", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          const cause = await donationsMgt.getCause(1);
          await donationsMgt.pauseCause(1);
          const causeAfter = await donationsMgt.getCause(1);

          expect(cause.paused).to.equal(false);
          expect(causeAfter.paused).to.equal(true);
        });

        it('should emit "CausePaused" event', async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");

          await expect(donationsMgt.pauseCause(1))
            .to.emit(donationsMgt, "CausePaused")
            .withArgs(1);
        });
      });
    });

    describe("unPauseCause", function () {
      describe("Validations", function () {
        it("should revert if cause is not paused", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");

          await expect(donationsMgt.unPauseCause(1)).to.be.revertedWith(
            "Cause is not paused"
          );
        });

        it("should revert if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await expect(donationsMgt.unPauseCause(100)).to.be.revertedWith(
            "Cause does not exist"
          );
        });

        it("should revert if caller is not owner", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          await expect(
            donationsMgt.connect(otherAccount).unPauseCause(1)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });

      describe("Actions", function () {
        it("should unpause a cause", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          const cause = await donationsMgt.getCause(1);
          await donationsMgt.unPauseCause(1);
          const causeAfter = await donationsMgt.getCause(1);

          expect(cause.paused).to.equal(true);
          expect(causeAfter.paused).to.equal(false);
        });

        it('should emit "CauseUnPaused" event', async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          await expect(donationsMgt.unPauseCause(1))
            .to.emit(donationsMgt, "CauseUnPaused")
            .withArgs(1);
        });
      });
    });

    describe("updateCauseBeneficiary", function () {
      describe("Validations", function () {
        it("should revert if cause does not exist", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await expect(
            donationsMgt.updateCauseBeneficiary(100, otherAccount.address)
          ).to.be.revertedWith("Cause does not exist");
        });

        it("should revert if caller is not owner", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          await expect(
            donationsMgt
              .connect(otherAccount)
              .updateCauseBeneficiary(1, otherAccount.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });

      describe("Actions", function () {
        it("should update cause beneficiary", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");

          const cause = await donationsMgt.getCause(1);
          await donationsMgt.updateCauseBeneficiary(1, otherAccount.address);
          const causeAfter = await donationsMgt.getCause(1);

          expect(cause.beneficiary).to.not.equal(otherAccount.address);
          expect(causeAfter.beneficiary).to.equal(otherAccount.address);
        });

        it('should emit "CauseBeneficiaryUpdated" event', async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");

          await expect(
            donationsMgt.updateCauseBeneficiary(1, otherAccount.address)
          )
            .to.emit(donationsMgt, "CauseBeneficiaryUpdated")
            .withArgs(1, otherAccount.address);
        });
      });
    });

    describe("donateToCause", function () {
      describe("Validations", function () {
        it("should revert if cause paused", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          await expect(
            donationsMgt.connect(otherAccount).donateToCause(1, "", {
              value: ethers.parseEther("0.01"),
            })
          ).to.be.revertedWith("Cause paused");
        });

        it("should revert if cause does not exist", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await expect(
            donationsMgt.connect(otherAccount).donateToCause(100, "", {
              value: ethers.parseEther("0.01"),
            })
          ).to.be.revertedWith("Cause does not exist");
        });

        it("should revert if donation amount is 0", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          await expect(
            donationsMgt.connect(otherAccount).donateToCause(1, "", {
              value: ethers.parseEther("0"),
            })
          ).to.be.revertedWith("Donation amount should be greater than 0");
        });
      });

      describe("Actions", function () {
        it("should receive donation to a cause", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          const value = ethers.parseEther("0.01");
          const donations = await donationsMgt.getDonations(1);
          await donationsMgt.donateToCause(1, "", {
            value,
          });
          const donationsAfter = await donationsMgt.getDonations(1);
          expect(donations.length).to.equal(0);
          expect(donationsAfter.length).to.equal(1);
          expect(await donationsMgt.totalDonations()).to.equal(value);
          // expect wallet balance to be 0.01
          expect(await donationsMgt.getBalance()).to.equal(value);
        });

        it('should emit "DonationMade" event', async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          const value = ethers.parseEther("0.01");
          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          await expect(
            donationsMgt.connect(otherAccount).donateToCause(1, "", {
              value,
            })
          ).to.emit(donationsMgt, "DonationMade");
        });

        it('should set "Anonymous donation" as donation reason if reason is empty', async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          const value = ethers.parseEther("0.01");
          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value,
          });

          const donations = await donationsMgt.getDonations(1);

          expect(donations[0].message).to.equal("Anonymous donation");
        });

        it("should set donation reason", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          const value = ethers.parseEther("0.01");
          await donationsMgt.connect(otherAccount).createCause("Cause 1");

          await donationsMgt.connect(otherAccount).donateToCause(1, "test", {
            value,
          });

          const donations = await donationsMgt.getDonations(1);

          expect(donations[0].message).to.equal("test");
        });
      });
    });

    describe("withdrawFromCause", function () {
      describe("Validations", function () {
        it("should revert if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await expect(
            donationsMgt.withdrawFromCause(100, 1, "test")
          ).to.be.revertedWith("Cause does not exist");
        });

        it("should revert if caller is not beneficiary", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");

          await expect(
            donationsMgt.connect(otherAccount).withdrawFromCause(1, 1, "test")
          ).to.be.revertedWith(
            "Only the beneficiary can withdraw from the cause"
          );
        });

        it("should revert if amount is greater than balance", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");

          await expect(
            donationsMgt.withdrawFromCause(1, 1, "test")
          ).to.be.revertedWith(
            "Withdrawal amount should be less than or equal to the cause balance"
          );
        });

        it("should revert if amount is 0", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");

          await expect(
            donationsMgt.withdrawFromCause(1, 0, "test")
          ).to.be.revertedWith("Withdrawal amount should be greater than 0");
        });

        it("should revert if cause is paused", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(otherAccount).createCause("Cause 1");
          await donationsMgt.pauseCause(1);

          await expect(
            donationsMgt.withdrawFromCause(1, 1, "test")
          ).to.be.revertedWith("Cause paused");
        });

        it("should revert if reason is empty", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");

          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value: ethers.parseEther("100"),
          });

          await expect(
            donationsMgt.withdrawFromCause(1, 1, "")
          ).to.be.revertedWith("Withdrawal reason cannot be empty");
        });
      });

      describe("Actions", function () {
        it("should withdraw from a cause", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          const value = ethers.parseEther("1");
          await donationsMgt.createCause("Cause 1");
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value,
          });
          const cause = await donationsMgt.getCause(1);
          await donationsMgt.withdrawFromCause(1, value, "test");
          const causeAfter = await donationsMgt.getCause(1);

          expect(cause.balance).to.equal(value);
          expect(causeAfter.balance).to.equal(0);
          expect(await donationsMgt.totalDonations()).to.equal(value);
          // expect wallet balance to be 0
          expect(await donationsMgt.getBalance()).to.equal(0);
        });

        it('should emit "WithdrawalMade" event', async function () {
          const { donationsMgt, otherAccount, owner } = await loadFixture(
            deployDonationsMgtFixture
          );

          const value = ethers.parseEther("0.01");
          await donationsMgt.connect(owner).createCause("Cause 1");
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value,
          });

          await expect(
            donationsMgt.connect(owner).withdrawFromCause(1, value, "test")
          ).to.emit(donationsMgt, "WithdrawalMade");
        });
      });
    });

    describe("getAllCauses", function () {
      describe("Actions", function () {
        it("should get all causes", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");
          await donationsMgt.createCause("Cause 2");
          await donationsMgt.createCause("Cause 3");

          const causes = await donationsMgt.getAllCauses();

          expect(causes.length).to.equal(3);
        });
      });
    });

    describe("getCause", function () {
      describe("Actions", function () {
        it("should get cause", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await donationsMgt.createCause("Cause 1");
          await donationsMgt.createCause("Cause 2");
          await donationsMgt.createCause("Cause 3");

          const cause = await donationsMgt.getCause(2);

          expect(cause.id).to.equal(2);
          expect(cause.title).to.equal("Cause 2");
        });
      });

      describe("Validations", function () {
        it("should revert if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          await expect(donationsMgt.getCause(100)).to.be.revertedWith(
            "Cause does not exist"
          );
        });
      });
    });

    describe("getDonations", function () {
      describe("Actions", function () {
        it("should get donations", async function () {
          const { donationsMgt, otherAccount } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.createCause("Cause 1");
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value: ethers.parseEther("0.01"),
          });
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value: ethers.parseEther("0.02"),
          });
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value: ethers.parseEther("0.03"),
          });

          const donations = await donationsMgt.getDonations(1);

          expect(donations.length).to.equal(3);
        });

        it("should return empty array if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          const donations = await donationsMgt.getDonations(100);

          expect(donations.length).to.equal(0);
        });
      });
    });

    describe("getWithdrawals", function () {
      describe("Actions", function () {
        it("should get withdrawals for a specific cause", async function () {
          const { donationsMgt, otherAccount, owner } = await loadFixture(
            deployDonationsMgtFixture
          );

          await donationsMgt.connect(owner).createCause("Cause 1");
          await donationsMgt.connect(otherAccount).donateToCause(1, "", {
            value: ethers.parseEther("0.01"),
          });
          await donationsMgt.connect(owner).withdrawFromCause(1, 1, "test");
          await donationsMgt.connect(owner).withdrawFromCause(1, 1, "test");
          await donationsMgt.connect(owner).withdrawFromCause(1, 1, "test");

          const withdrawals = await donationsMgt.getWithdrawals(1);

          expect(withdrawals.length).to.equal(3);
        });

        it("should return empty array if cause does not exist", async function () {
          const { donationsMgt } = await loadFixture(deployDonationsMgtFixture);

          const withdrawals = await donationsMgt.getWithdrawals(100);

          expect(withdrawals.length).to.equal(0);
        });
      });
    });
  });
});
