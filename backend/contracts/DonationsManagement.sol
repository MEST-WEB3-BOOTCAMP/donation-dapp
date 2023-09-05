// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Counter.sol";

contract DonationsManagement {
    using Counter for Counter.Value;
    Counter.Value private campaignId;
    Counter.Value private donationId;
    Counter.Value private withdrawalId;
    Counter.Value private totalDonations;
    mapping(uint => Campaign) private campaigns;
    mapping(uint => uint) private totalDonationsByCampaignId;
    mapping(uint => mapping(address => uint)) private donationsByCampaignId;
    mapping(uint => address[]) private donorsByCampaignId;
    address public immutable owner = msg.sender;

    struct Campaign {
        uint id;
        string title;
        address beneficiary;
        uint balance;
        bool active;
        uint timestamp;
    }

    event Donation(
        uint id,
        uint campaignId,
        address donor,
        uint amount,
        string message,
        uint timestamp
    );

    event Withdrawal(
        uint id,
        uint campaignId,
        address beneficiary,
        uint amount,
        string reason,
        uint timestamp
    );

    event CampaignCreated(
        uint indexed id,
        string title,
        address indexed beneficiary,
        uint balance,
        bool active,
        uint timestamp
    );

    event CampaignDeactivated(uint indexed campaignId);

    event CampaignReactivated(uint indexed campaignId);

    event CampaignBeneficiaryUpdated(
        uint indexed campaignId,
        address beneficiary
    );

    modifier activeCampaign(uint _campaignId) {
        require(campaigns[_campaignId].active, "Campaign is not active");
        _;
    }

    modifier campaignExists(uint _campaignId) {
        require(
            _campaignId > 0 && _campaignId <= campaignId.get(),
            "Campaign does not exist"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function createCampaign(string calldata _title) external {
        require(bytes(_title).length > 0, "Campaign title cannot be empty");
        campaignId.increment();
        uint _campaignId = campaignId.get();
        campaigns[_campaignId] = Campaign(
            _campaignId,
            _title,
            msg.sender,
            0,
            true,
            block.timestamp
        );
        emit CampaignCreated(
            _campaignId,
            _title,
            msg.sender,
            0,
            true,
            block.timestamp
        );
    }

    function deactivateCampaign(
        uint _campaignId
    )
        external
        onlyOwner
        campaignExists(_campaignId)
        activeCampaign(_campaignId)
    {
        campaigns[_campaignId].active = false;
        emit CampaignDeactivated(_campaignId);
    }

    function reactivateCampaign(
        uint _campaignId
    ) external onlyOwner campaignExists(_campaignId) {
        require(!campaigns[_campaignId].active, "Campaign already active");
        campaigns[_campaignId].active = true;
        emit CampaignReactivated(_campaignId);
    }

    function updateCampaignBeneficiary(
        uint _campaignId,
        address _beneficiary
    )
        external
        onlyOwner
        campaignExists(_campaignId)
        activeCampaign(_campaignId)
    {
        require(
            _beneficiary != address(0),
            "Beneficiary address cannot be 0x0"
        );
        require(
            _beneficiary != campaigns[_campaignId].beneficiary,
            "Beneficiary address cannot be the same"
        );
        campaigns[_campaignId].beneficiary = _beneficiary;
        emit CampaignBeneficiaryUpdated(_campaignId, _beneficiary);
    }

    function getCampaign(
        uint _campaignId
    ) external view campaignExists(_campaignId) returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        uint totalCampaigns = campaignId.get();
        Campaign[] memory _campaigns = new Campaign[](totalCampaigns);
        for (uint i = 1; i <= totalCampaigns; i++) {
            _campaigns[i - 1] = campaigns[i];
        }
        return _campaigns;
    }

    function getCampaignDonors(
        uint _campaignId
    ) external view campaignExists(_campaignId) returns (address[] memory) {
        return donorsByCampaignId[_campaignId];
    }

    function getCampaignTotalDonations(
        uint _campaignId
    ) external view campaignExists(_campaignId) returns (uint) {
        return totalDonationsByCampaignId[_campaignId];
    }

    function donateToCampaign(
        uint _campaignId,
        string memory _message
    ) external payable campaignExists(_campaignId) activeCampaign(_campaignId) {
        require(msg.value > 0, "Donation amount should be more than 0");
        if (bytes(_message).length == 0) {
            _message = "Anonymous donation";
        }
        donationId.increment();
        uint _donationId = donationId.get();
        totalDonations.add(msg.value);
        if (donationsByCampaignId[_campaignId][msg.sender] == 0) {
            donorsByCampaignId[_campaignId].push(msg.sender);
        }
        donationsByCampaignId[_campaignId][msg.sender] += msg.value;
        totalDonationsByCampaignId[_campaignId] += msg.value;
        campaigns[_campaignId].balance += msg.value;
        emit Donation(
            _donationId,
            _campaignId,
            msg.sender,
            msg.value,
            _message,
            block.timestamp
        );
    }

    function withdrawFromCampaign(
        uint _campaignId,
        uint _amount,
        string calldata _message
    ) external campaignExists(_campaignId) activeCampaign(_campaignId) {
        require(
            campaigns[_campaignId].beneficiary == msg.sender,
            "Only beneficiary can withdraw"
        );
        require(_amount > 0, "Withdrawal amount should be more than 0");
        require(
            campaigns[_campaignId].balance >= _amount,
            "Withdrawal amount is more than available balance"
        );
        require(
            bytes(_message).length > 0,
            "Withdrawal reason cannot be empty"
        );

        campaigns[_campaignId].balance -= _amount;
        withdrawalId.increment();
        payable(campaigns[_campaignId].beneficiary).transfer(_amount);
        emit Withdrawal(
            withdrawalId.get(),
            _campaignId,
            msg.sender,
            _amount,
            _message,
            block.timestamp
        );
    }
}
