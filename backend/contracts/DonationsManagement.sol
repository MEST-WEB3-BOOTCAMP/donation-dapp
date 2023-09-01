// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Cause.sol";

contract DonationsManagement is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _donationIds;
    Counters.Counter private _causeIds;

    struct Donation {
        uint256 causeId;
        address donor;
        uint256 amount;
        string message;
        uint256 date;
    }

    struct Withdrawal {
        uint256 causeId;
        address beneficiary;
        uint256 amount;
        string reason;
        uint256 date;
    }

    event CauseAdded(
        uint256 indexed id,
        string name,
        string description,
        string image,
        uint256 goal,
        uint256 deadline,
        uint256 balance
    );

    event CausePaused(uint256 indexed causeId);

    event CauseUnPaused(uint256 indexed causeId);

    event CauseUpdated(
        uint256 indexed causeId,
        string name,
        string description,
        string image,
        uint256 goal,
        uint256 deadline,
        uint256 balance
    );

    event DonationMade(
        uint256 indexed causeId,
        address indexed donor,
        uint256 amount,
        string message,
        uint256 date
    );

    event WithdrawalMade(
        uint256 indexed causeId,
        address indexed beneficiary,
        uint256 amount,
        string reason,
        uint256 date
    );

    mapping(uint256 => Donation) public donations;
    mapping(uint256 => Cause) public causes;
    mapping(address => uint256) donors;
    uint256 public totalDonations;
    address[] public donorsList;

    modifier whenAmountGreaterThanZero(uint256 _amount) {
        require(_amount > 0, "Amount must be greater than 0");
        _;
    }

    modifier whenCauseExists(uint256 _causeId) {
        require(address(causes[_causeId]) != address(0), "DonationApp: cause does not exist");
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
        emit CauseAdded(_id, _name, _description, _image, _goal, _deadline, 0);
    }

    function donateToCause(
        uint256 _causeId,
        uint256 _amount,
        string calldata _message // optional
    )
        public
        payable
        whenAmountGreaterThanZero(_amount)
        whenCauseExists(_causeId)
    {
        Cause cause = causes[_causeId];
        require(cause.paused() == false, "DonationApp: cause paused");
        require(cause.expired() == false, "DonationApp: cause expired");
        require(_amount > msg.value, "DonationApp: insufficient funds");

        _donationIds.increment();
        uint256 _id = _donationIds.current();
        Donation memory donation = Donation(
            _causeId,
            msg.sender,
            _amount,
            _message,
            block.timestamp
        );
        donations[_id] = donation;
        cause.credit(_amount);
        totalDonations += _amount;
        if (donors[msg.sender] == 0) {
            donors[msg.sender] = _amount;
            donorsList.push(msg.sender);
        } else {
            donors[msg.sender] += _amount;
        }
        emit DonationMade(
            _causeId,
            msg.sender,
            _amount,
            _message,
            block.timestamp
        );
    }

    function withdrawFromCause(
        uint256 _causeId,
        uint256 _amount,
        string calldata _reason //required
    )
        public
        payable
        whenAmountGreaterThanZero(_amount)
        whenCauseExists(_causeId)
    {
        require(
            causes[_causeId].beneficiary() == msg.sender, "Only the beneficiary can withdraw donations"
        );
        require(
            causes[_causeId].balance() >= _amount, "Withdrawal amount must be less than or equal to total donations"
        );
        require(
            keccak256(abi.encode(_reason)) != keccak256(""), "Withdrawal reason cannot be empty"
        );
        Cause cause = causes[_causeId];
        cause.debit(_amount);
        payable(msg.sender).transfer(_amount);
        emit WithdrawalMade(
            _causeId,
            msg.sender,
            _amount,
            _reason,
            block.timestamp
        );
    }

    function getAllCauses() public view returns (Cause[] memory) {
        Cause[] memory _causes = new Cause[](_causeIds.current());
        for (uint256 i = 1; i <= _causeIds.current(); i++) {
            _causes[i - 1] = causes[i];
        }
        return _causes;
    }

    function causeCount() public view virtual returns (uint256) {
        return _causeIds.current();
    }

    function donationCount() public view virtual returns (uint256) {
        return _donationIds.current();
    }
}
