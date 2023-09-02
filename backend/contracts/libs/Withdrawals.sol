// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Withdrawals {
    struct State {
        uint id;
        mapping(uint => Withdrawal[]) withdrawals;
    }

    struct Withdrawal {
        uint id;
        uint causeId;
        address beneficiary;
        uint amount;
        string reason;
        uint timestamp;
    }

    function add(
        State storage state,
        uint _causeId,
        address _beneficiary,
        uint _amount,
        string calldata _reason
    ) internal returns (uint) {
        state.id++;
        state.withdrawals[_causeId].push(
            Withdrawal(
                state.id,
                _causeId,
                _beneficiary,
                _amount,
                _reason,
                block.timestamp
            )
        );
        return state.id;
    }

    function get(
        State storage state,
        uint _causeId
    ) internal view returns (Withdrawal[] memory) {
        return state.withdrawals[_causeId];
    }
}
