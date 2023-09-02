// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libs/Causes.sol";
import "./libs/Donations.sol";
import "./libs/Withdrawals.sol";

contract DonationsManagement is Ownable {
    using Causes for Causes.State;
    using Donations for Donations.State;
    using Withdrawals for Withdrawals.State;
    Causes.State private _causes;
    Donations.State private _donations;
    Withdrawals.State private _withdrawals;

    uint public totalDonations;

    event CauseAdded(
        uint indexed id,
        string title,
        address indexed beneficiary,
        uint balance,
        uint timestamp
    );

    event CausePaused(uint indexed causeId);

    event CauseUnPaused(uint indexed causeId);

    event CauseBeneficiaryUpdated(uint indexed causeId, address beneficiary);

    event DonationMade(
        uint indexed donationId,
        uint indexed causeId,
        address indexed donor,
        uint amount,
        string message,
        uint timestamp
    );

    event WithdrawalMade(
        uint indexed withdrawalId,
        uint indexed causeId,
        address indexed beneficiary,
        uint amount,
        string reason,
        uint timestamp
    );

    modifier causeNotPaused(uint _causeId) {
        require(!_causes.isPaused(_causeId), "Cause paused");
        _;
    }

    function createCause(string calldata _title) external {
        uint _id = _causes.add(_title);
        emit CauseAdded(_id, _title, msg.sender, 0, block.timestamp);
    }

    function pauseCause(uint _causeId) external onlyOwner {
        _causes.pause(_causeId);
        emit CausePaused(_causeId);
    }

    function unPauseCause(uint _causeId) external onlyOwner {
        _causes.unPause(_causeId);
        emit CauseUnPaused(_causeId);
    }

    function updateCauseBeneficiary(
        uint _causeId,
        address payable _beneficiary
    ) external onlyOwner causeNotPaused(_causeId) {
        require(
            _beneficiary != address(0),
            "Beneficiary address cannot be 0x0"
        );
        require(
            _beneficiary != _causes.get(_causeId).beneficiary,
            "Beneficiary address cannot be the same"
        );
        _causes.updateBeneficiary(_causeId, _beneficiary);
        emit CauseBeneficiaryUpdated(_causeId, _beneficiary);
    }

    function donateToCause(
        uint _causeId,
        string calldata _message
    ) external payable causeNotPaused(_causeId) {
        require(msg.value > 0, "Donation amount should be greater than 0");

        totalDonations += msg.value;
        _causes.donateToCause(_causeId, msg.value);
        _donations.add(_causeId, msg.sender, msg.value, _message);
        emit DonationMade(
            _donations.id,
            _causeId,
            msg.sender,
            msg.value,
            _message,
            block.timestamp
        );
    }

    function withdrawFromCause(
        uint _causeId,
        uint _amount,
        string calldata _message
    ) external payable causeNotPaused(_causeId) {
        require(
            _causes.get(_causeId).beneficiary == msg.sender,
            "Only the beneficiary can withdraw from the cause"
        );
        require(_amount > 0, "Withdrawal amount should be greater than 0");
        require(
            _amount <= _causes.get(_causeId).balance,
            "Withdrawal amount should be less than or equal to the cause balance"
        );
        require(
            bytes(_message).length > 0,
            "Withdrawal reason cannot be empty"
        );

        _causes.withdrawFromCause(_causeId, _amount);
        uint _id = _withdrawals.add(_causeId, msg.sender, _amount, _message);

        payable(msg.sender).transfer(_amount);

        emit WithdrawalMade(
            _id,
            _causeId,
            msg.sender,
            _amount,
            _message,
            block.timestamp
        );
    }

    function getAllCauses() external view returns (Causes.Cause[] memory) {
        return _causes.all();
    }

    function getCause(
        uint _causeId
    ) external view returns (Causes.Cause memory) {
        return _causes.get(_causeId);
    }

    function getDonations(
        uint _causeId
    ) external view returns (Donations.Donation[] memory) {
        return _donations.get(_causeId);
    }

    function getWithdrawals(
        uint _causeId
    ) external view returns (Withdrawals.Withdrawal[] memory) {
        return _withdrawals.get(_causeId);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
