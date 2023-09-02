// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libs/Structs.sol";
import "./libs/Causes.sol";

contract DonationsManagement is Ownable {
    using Causes for Causes.State;
    Causes.State private _causes;

    uint public totalDonations;

    modifier whenCauseExists(uint _causeId) {
        require(_causes.exists(_causeId), "Cause does not exist");
        _;
    }

    function addCause(string calldata _name) external {
        _causes.add(_name, owner());
    }

    function causes() external view returns (Structs.Cause[] memory) {
        return _causes.all();
    }

    function donateToCause(
        uint _causeId,
        string memory _message
    ) external payable whenCauseExists(_causeId) {
        totalDonations += msg.value;
        Structs.Cause memory cause = _causes.get(_causeId);
        Campaign campaign = Campaign(cause.campaign);
        campaign.donate(_message);
    }

    function withdrawFromCause(
        uint _causeId,
        uint _amount,
        string calldata _message
    ) external payable whenCauseExists(_causeId) {
        Structs.Cause memory cause = _causes.get(_causeId);
        Campaign campaign = Campaign(cause.campaign);
        campaign.withdraw(_amount, _message);
    }

    function getDonationsForCause(
        uint _causeId
    )
        external
        view
        whenCauseExists(_causeId)
        returns (Structs.Donation[] memory)
    {
        Structs.Cause memory cause = _causes.get(_causeId);
        Campaign campaign = Campaign(cause.campaign);
        return campaign.donations();
    }

    function getWithdrawalsForCause(
        uint _causeId
    )
        external
        view
        whenCauseExists(_causeId)
        returns (Structs.Withdrawal[] memory)
    {
        Structs.Cause memory cause = _causes.get(_causeId);
        Campaign campaign = Campaign(cause.campaign);
        return campaign.withdrawals();
    }
}
