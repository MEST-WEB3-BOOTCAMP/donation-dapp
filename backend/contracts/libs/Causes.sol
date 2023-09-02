// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Causes {
    struct State {
        uint id;
        mapping(uint => Cause) causes;
    }

    struct Cause {
        uint id;
        string title;
        address beneficiary;
        uint balance;
        bool paused;
        uint timestamp;
    }

    function add(
        State storage state,
        string calldata _title
    ) internal returns (uint) {
        state.id++;
        state.causes[state.id] = Cause(
            state.id,
            _title,
            msg.sender,
            0,
            false,
            block.timestamp
        );
        return state.id;
    }

    modifier causeExists(State storage state, uint _causeId) {
        require(state.causes[_causeId].id != 0, "Cause does not exist");
        _;
    }

    function all(State storage state) internal view returns (Cause[] memory) {
        Cause[] memory _causes = new Cause[](state.id);
        for (uint i = 0; i < state.id; i++) {
            _causes[i] = state.causes[i + 1];
        }
        return _causes;
    }

    function get(
        State storage state,
        uint _causeId
    ) internal view causeExists(state, _causeId) returns (Cause memory) {
        return state.causes[_causeId];
    }

    function pause(
        State storage state,
        uint _causeId
    ) internal causeExists(state, _causeId) {
        require(!state.causes[_causeId].paused, "Cause is already paused");
        state.causes[_causeId].paused = true;
    }

    function unPause(
        State storage state,
        uint _causeId
    ) internal causeExists(state, _causeId) {
        require(state.causes[_causeId].paused, "Cause is not paused");
        state.causes[_causeId].paused = false;
    }

    function updateBeneficiary(
        State storage state,
        uint _causeId,
        address _beneficiary
    ) internal causeExists(state, _causeId) {
        state.causes[_causeId].beneficiary = payable(_beneficiary);
    }

    function increaseBalance(
        State storage state,
        uint _causeId,
        uint _amount
    ) internal causeExists(state, _causeId) {
        state.causes[_causeId].balance += _amount;
    }

    function decreaseBalance(
        State storage state,
        uint _causeId,
        uint _amount
    ) internal causeExists(state, _causeId) {
        state.causes[_causeId].balance -= _amount;
    }

    function isPaused(
        State storage state,
        uint _causeId
    ) internal view causeExists(state, _causeId) returns (bool) {
        return state.causes[_causeId].paused;
    }
}
