// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../government/IGovernment.sol";
import "./IVote.sol";

contract Vote is IVote {
    
    mapping(string => VoteInfo) private TheVote;
    mapping(uint256 => string) private VoteIndex;
    mapping(uint256 => uint256) private Counter;
    string private _name;
    uint256 private _supply;
    address private _governmentContract;

    constructor(address governmentAddress) {
        _name = "2022 Presidential Election";
        _supply = 0;
        _governmentContract = governmentAddress;
    }

    function exist(string memory hashId) public view returns (bool) {
        return TheVote[hashId].voted;
    }

    function vote(string memory hashId, uint256 option, uint256 time) public {
        require(isAllowed(msg.sender), "You're not allowed !!!");
        require(!exist(hashId), "You have already voted !!!");
        TheVote[hashId] = VoteInfo(true, option, time);
        VoteIndex[_supply++] = hashId;
        Counter[option]++;
    }

    function hashIdVote(string memory hashId) public override view returns (VoteInfo memory) {
        require(exist(hashId), "You haven't voted yet !!!");
        return TheVote[hashId];
    }

    function hashIdOption(string memory hashId) public override view returns (uint256) {
        require(exist(hashId), "You haven't voted yet !!!");
        return TheVote[hashId].option;
    }

    function voteByIndex(uint256 index) public override view returns (VoteInfo memory) {
        require(index < supply(), "Index is out of range !!!");
        string memory hashId = VoteIndex[index];
        return TheVote[hashId];
    }

    function hashIdByIndex(uint256 index) public override view returns (string memory) {
        require(index < supply(), "Index is out of range !!!");
        return VoteIndex[index];
    }

    function optionCounter(uint256 option) public view returns (uint256) {
        return Counter[option];
    }

    function name() public override view returns (string memory) {
        return _name;
    }

    function supply() public override view returns (uint256) {
        return _supply;
    }

    function isAllowed(address _address) public view returns (bool) {
        return IGovernment(_governmentContract)._isAllowed(_address);
    }

    function addressName(string memory _addressName) public view returns (address) {
        return IGovernment(_governmentContract)._nameToAddress(_addressName);
    }

    function nameAddress(address _address) public view returns (string memory) {
        return IGovernment(_governmentContract)._addressToName(_address);
    }
}
