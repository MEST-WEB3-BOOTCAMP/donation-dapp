// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Counter {
    struct Value {
        uint256 _value;
    }

    function increment(Value storage value) internal {
        value._value += 1;
    }

    function get(Value storage value) internal view returns (uint256) {
        return value._value;
    }

    function add(Value storage value, uint256 _value) internal {
        value._value += _value;
    }
}
