// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./libs/Structs.sol";
import "./libs/Events.sol";

contract Campaign is Pausable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _donationIds;
    Counters.Counter private _withdrawalIds;
    Counters.Counter private _donorCount;

    address public beneficiary;
    mapping(address => uint) private _donors;
    mapping(address => mapping(uint => Structs.Donation)) private _donations;
    mapping(uint => Structs.Withdrawal) private _withdrawals;

    constructor(address _owner) {
        beneficiary = msg.sender;
        transferOwnership(_owner);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateBeneficiary(
        address _newBeneficiary
    ) external onlyOwner whenNotPaused {
        require(
            _newBeneficiary != address(0),
            "Campaign: new beneficiary cannot be the zero address"
        );

        beneficiary = _newBeneficiary;

        emit Events.BeneficiaryUpdated(_newBeneficiary, block.timestamp);
    }

    function donate(string memory _message) external payable whenNotPaused {
        require(
            msg.value > 0,
            "Campaign: donation amount must be greater than 0"
        );

        // if _message is empty, it will be "No message"
        if (bytes(_message).length == 0) {
            _message = "No message";
        }
        _donationIds.increment();
        uint _id = _donationIds.current();
        _donations[msg.sender][_id] = Structs.Donation(
            _id,
            msg.sender,
            msg.value,
            _message,
            uint32(block.timestamp)
        );

        if (_donors[msg.sender] == 0) {
            _donorCount.increment();
        }
        _donors[msg.sender] += msg.value;

        payable(address(this)).transfer(msg.value);

        emit Events.DonationMade(
            _id,
            msg.sender,
            msg.value,
            _message,
            block.timestamp
        );
    }

    function withdraw(
        uint _amount,
        string calldata _message
    ) external whenNotPaused nonReentrant {
        require(
            msg.sender == beneficiary,
            "Campaign: only the beneficiary can withdraw"
        );
        require(
            _amount > 0,
            "Campaign: withdrawal amount must be greater than 0"
        );
        require(
            address(this).balance >= _amount,
            "Campaign: insufficient balance"
        );

        _withdrawalIds.increment();
        uint _id = _withdrawalIds.current();
        _withdrawals[_id] = Structs.Withdrawal(
            _id,
            msg.sender,
            _amount,
            _message,
            uint32(block.timestamp)
        );

        payable(msg.sender).transfer(_amount);

        emit Events.WithdrawalMade(
            _id,
            msg.sender,
            _amount,
            _message,
            block.timestamp
        );
    }

    function donations() external view returns (Structs.Donation[] memory) {
        Structs.Donation[] memory donationsArray = new Structs.Donation[](
            _donationIds.current()
        );

        for (uint i = 0; i < _donationIds.current(); i++) {
            donationsArray[i] = _donations[msg.sender][i];
        }

        return donationsArray;
    }

    function withdrawals() external view returns (Structs.Withdrawal[] memory) {
        Structs.Withdrawal[] memory withdrawalsArray = new Structs.Withdrawal[](
            _withdrawalIds.current()
        );

        for (uint i = 0; i < _withdrawalIds.current(); i++) {
            withdrawalsArray[i] = _withdrawals[i];
        }

        return withdrawalsArray;
    }

    function donors() external view returns (address[] memory) {
        address[] memory _tempDonors = new address[](_donorCount.current());

        for (uint i = 0; i < _donorCount.current(); i++) {
            _tempDonors[i] = _donations[msg.sender][i].donor;
        }

        return _tempDonors;
    }
}
