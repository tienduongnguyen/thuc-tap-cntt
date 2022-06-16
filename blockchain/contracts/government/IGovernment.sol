// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGovernment {
    function _isAllowed(address _address) external view returns (bool);

    function _nameToAddress(string memory addressName) external view returns (address);

    function _addressToName(address _address) external view returns (string memory);
}
