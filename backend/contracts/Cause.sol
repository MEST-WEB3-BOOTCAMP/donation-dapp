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
    uint256 public totalDonations;

    event CauseCreated(
        uint256 indexed id,
        string name,
        string description,
        string image,
        uint256 goal,
        uint256 deadline
    );

    event CausePaused(uint256 indexed causeId);

    event CauseUnpaused(uint256 indexed causeId);

    constructor(
        uint256 _id,
        string memory _name,
        string memory _description,
        string memory _image,
        address _beneficiary,
        uint256 _goal,
        uint256 _deadline
    ) {
        id = _id;
        name = _name;
        description = _description;
        image = _image;
        goal = _goal;
        deadline = _deadline;
        beneficiary = _beneficiary;
        totalDonations = 0;
        emit CauseCreated(id, name, description, image, goal, deadline);
    }

    function pause() public onlyOwner {
        _pause();
        emit CausePaused(id);
    }

    function unpause() public onlyOwner {
        _unpause();
        emit CauseUnpaused(id);
    }

    function expired() public view returns (bool) {
        return block.timestamp > deadline;
    }

    function addDonation(uint256 _amount) public onlyOwner {
        totalDonations += _amount;
    }

    function deductDonation(uint256 _amount) public onlyOwner {
        totalDonations -= _amount;
    }
}
