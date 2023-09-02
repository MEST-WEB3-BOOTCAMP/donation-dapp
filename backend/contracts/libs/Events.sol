// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Events {
    event BeneficiaryUpdated(address indexed beneficiary, uint timestamp);

    event CauseAdded(string name, address indexed beneficiary, uint createdAt);

    event DonationMade(
        uint id,
        address donor,
        uint amount,
        string message,
        uint timestamp
    );

    event WithdrawalMade(
        uint id,
        address beneficiary,
        uint amount,
        string message,
        uint timestamp
    );
}
