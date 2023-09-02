// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Donations {
    struct State {
        uint _total;
        uint id;
        mapping(uint => Donation[]) donations;
        mapping(uint => uint) causeTotal;
    }

    struct Donation {
        uint id;
        uint causeId;
        address donor;
        uint amount;
        string message;
        uint timestamp;
    }

    function add(
        State storage state,
        uint _causeId,
        address _donor,
        uint _amount,
        string memory _message
    ) internal returns (uint) {
        if (bytes(_message).length == 0) {
            _message = "Anonymous donation";
        }
        state._total += _amount;
        state.causeTotal[_causeId] += _amount;
        state.id++;
        state.donations[_causeId].push(
            Donation(
                state.id,
                _causeId,
                _donor,
                _amount,
                _message,
                block.timestamp
            )
        );
        return state.id;
    }

    function get(
        State storage state,
        uint _causeId
    ) internal view returns (Donation[] memory) {
        return state.donations[_causeId];
    }

    function total(State storage state) internal view returns (uint) {
        return state._total;
    }

    function getTotal(
        State storage state,
        uint _causeId
    ) internal view returns (uint) {
        return state.causeTotal[_causeId];
    }
}
