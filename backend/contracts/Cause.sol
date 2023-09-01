// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Cause is Pausable, Ownable {
    uint256 public id;
    string public name;
    string public description;
    string public image;
    address public beneficiary;
    uint256 public goal;
    uint256 public deadline;
    uint256 public balance;

    constructor(
        uint256 _id,
        string memory _name,
        string memory _description,
        string memory _image,
        address _beneficiary,
        uint256 _goal,
        uint256 _deadline
    ) {
        require(
            block.timestamp < _deadline,
            "Cause: deadline must be in the future"
        );

        id = _id;
        name = _name;
        description = _description;
        image = _image;
        goal = _goal;
        deadline = _deadline;
        beneficiary = _beneficiary;
        balance = 0;
    }

    modifier whenNotExpired() {
        require(expired() == false, "Cause: deadline has passed");
        _;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function expired() public view virtual onlyOwner returns (bool) {
        return block.timestamp > deadline;
    }

    function credit(
        uint256 _amount
    ) external onlyOwner whenNotPaused whenNotExpired {
        balance += _amount;
    }

    function debit(uint256 _amount) external onlyOwner whenNotPaused {
        require(balance >= _amount, "Cause: insufficient balance");
        balance -= _amount;
    }
}
