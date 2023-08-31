// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Cause.sol";

contract DonationApp is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _donationIds;
    Counters.Counter private _causeIds;

    struct Donation {
        uint256 causeId;
        uint256 amount;
        string message;
        address payable donor;
        uint256 date;
    }

    struct Withdrawal {
        uint256 causeId;
        uint256 amount;
        string reason;
        uint256 date;
    }

    event DonationMade(
        uint256 indexed causeId,
        uint256 amount,
        string message,
        address indexed donor,
        uint256 date
    );

    event WithdrawalMade(
        uint256 indexed causeId,
        uint256 amount,
        string reason,
        uint256 date
    );

    mapping(uint256 => Donation) public donations;
    mapping(uint256 => Cause) public causes;
    mapping(address => uint256) donors;
    uint256 public totalDonations;
    address[] public donorsList;

    modifier amountGreaterThanZero(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }

    function addCause(
        string memory _name,
        string memory _description,
        string memory _image,
        uint256 _goal,
        uint256 _deadline
    ) public {
        _causeIds.increment();
        uint256 _id = _causeIds.current();
        Cause cause = new Cause(
            _id,
            _name,
            _description,
            _image,
            msg.sender,
            _goal,
            _deadline
        );
        causes[_id] = cause;
    }

    function donateToCause(
        uint256 _causeId,
        uint256 _amount,
        string calldata _message // optional
    ) public payable amountGreaterThanZero(_amount) {
        Cause cause = causes[_causeId];
        require(address(cause) != address(0), "Cause does not exist");
        require(cause.paused() == false, "Donations are paused for this cause");
        require(cause.expired() == false, "This cause has already expired");
        require(_amount > msg.value, "Insufficient funds");

        _donationIds.increment();
        uint256 _id = _donationIds.current();
        Donation memory donation = Donation(
            _causeId,
            _amount,
            _message,
            payable(msg.sender),
            block.timestamp
        );
        donations[_id] = donation;
        cause.addDonation(_amount);
        totalDonations += _amount;
        if (donors[msg.sender] == 0) {
            donors[msg.sender] = _amount;
            donorsList.push(msg.sender);
        } else {
            donors[msg.sender] += _amount;
        }
        emit DonationMade(
            _causeId,
            _amount,
            _message,
            msg.sender,
            block.timestamp
        );
    }

    function withdrawFromCause(
        uint256 _causeId,
        uint256 _amount,
        string calldata _reason //required
    ) public payable amountGreaterThanZero(_amount) onlyOwner {
        require(
            causes[_causeId].beneficiary() == msg.sender,
            "Only the beneficiary can withdraw donations"
        );
        require(
            causes[_causeId].balance() >= _amount,
            "Withdrawal amount must be less than or equal to total donations"
        );
        require(
            keccak256(abi.encode(_reason)) != keccak256(""),
            "Withdrawal reason cannot be empty"
        );
        Cause cause = causes[_causeId];
        cause.deductDonation(_amount);
        payable(msg.sender).transfer(_amount);
        emit WithdrawalMade(_causeId, _amount, _reason, block.timestamp);
    }

    function getAllCauses() public view returns (Cause[] memory) {
        Cause[] memory _causes = new Cause[](_causeIds.current());
        for (uint256 i = 1; i <= _causeIds.current(); i++) {
            _causes[i - 1] = causes[i];
        }
        return _causes;
    }
}
