// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./IVote.sol";

contract Vote is IVote {
    using Counters for Counters.Counter;
    Counters.Counter private _index;

    modifier onlyGovernment() {
        require(msg.sender == 0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6, "You're not allowed");
        _;
    }

    mapping(uint256 => address) public government;
    uint256 private indexGOV;
    mapping(string => address) public local;
    mapping(uint256 => TheVote) public voteIndex;
    string private _name;

    constructor() {
        _name = "2022 Presidential Election";
        indexGOV = 0;
        government[indexGOV++] = msg.sender;
    }

    function stringToBytes(string memory a) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(a));
    }

    function isAllowed(address _address) internal view returns (bool) {
        for (uint256 i=0; i<=indexGOV; i++) {
            if (_address == government[i]) return true;
        }
        return false;
    }

    function exists(string memory hashId) public view returns (bool) {
        bytes32 _bytesHashId = stringToBytes(hashId);
        for (uint256 i = 0; i < supply(); i++) {
            if (stringToBytes(hashIdByIndex(i)) == _bytesHashId) return true; 
        }
        return false;
    }

    function addAllowance(address _address, string memory _local) 
        public onlyGovernment 
    {
        government[indexGOV++] = _address;
        local[_local] = _address;
    }

    function vote(string memory hashId, uint256 option) public onlyGovernment {
        require(!exists(hashId), "This Hash Id have already voted !!!");
        uint256 index = _index.current();
        voteIndex[index] = TheVote(hashId, option, block.timestamp);
        _index.increment();
    }

    function hashIdOption(string memory hashId) public view returns (uint256) {
        require(exists(hashId), "This Hash Id haven't voted yet !!!"); 
        bytes32 _bytesHashId = stringToBytes(hashId);
        for (uint256 i = 0; i < supply(); i++) {
            if (stringToBytes(hashIdByIndex(i)) == _bytesHashId) 
                return optionByIndex(i);
        }
        return 666;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function supply() public view returns (uint256) {
        return _index.current();
    }

    function voteByIndex(uint256 index) public view returns (TheVote memory) {
        return voteIndex[index];
    }

    function hashIdByIndex(uint256 index) public view returns (string memory) {
        return voteIndex[index].hashId;
    }

    function optionByIndex(uint256 index) public view returns (uint256) {
        return voteIndex[index].option;
    }
}
