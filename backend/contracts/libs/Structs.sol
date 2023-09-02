// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Structs {
    struct Cause {
        uint id;
        string title;
        address campaign;
        uint32 createdAt;
    }

    struct Donation {
        uint id;
        address donor;
        uint amount;
        string message;
        uint32 timestamp;
    }

    struct Withdrawal {
        uint id;
        address beneficiary;
        uint amount;
        string message;
        uint32 timestamp;
    }
}
