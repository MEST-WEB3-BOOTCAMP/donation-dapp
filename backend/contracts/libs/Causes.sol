// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../Campaign.sol";
import "./Structs.sol";
import "./Events.sol";

library Causes {
    struct State {
        mapping(uint => Structs.Cause) causes;
        uint count;
    }

    function add(
        State storage self,
        string calldata _title,
        address _admin
    ) internal {
        uint32 _createdAt = uint32(block.timestamp);
        self.count++;
        self.causes[self.count] = Structs.Cause(
            self.count,
            _title,
            address(new Campaign(_admin)),
            _createdAt
        );

        emit Events.CauseAdded(_title, msg.sender, _createdAt);
    }

    function all(
        State storage self
    ) internal view returns (Structs.Cause[] memory) {
        Structs.Cause[] memory _causes = new Structs.Cause[](self.count);
        for (uint i = 1; i <= self.count; i++) {
            _causes[i - 1] = self.causes[i];
        }
        return _causes;
    }

    function count(State storage self) internal view returns (uint) {
        return self.count;
    }

    function get(
        State storage self,
        uint _id
    ) internal view returns (Structs.Cause memory) {
        return self.causes[_id];
    }

    function exists(State storage self, uint _id) internal view returns (bool) {
        return _id <= self.count;
    }
}
