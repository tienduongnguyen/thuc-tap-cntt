// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteContract is ERC721, ERC721Enumerable, Ownable {
    struct Vote {
        string hashId;
        uint256 option;
    }

    mapping(uint256 => Vote) public voteIndex;

    constructor() ERC721("2022 Presidential Election", "GOV") {}

    function stringToBytes(string memory a) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(a));
    }

    function exists(string memory _hashId) internal view returns (bool) {
        bytes32 _bytesTokenURI = stringToBytes(_hashId);
        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (stringToBytes(hashIdOfTokenId(i)) == _bytesTokenURI) return true; 
        }
        return false;
    }

    function mint(uint256 tokenId, string memory _hashId, uint256 option) public onlyOwner {
        require(!exists(_hashId), "Already Voted");
        _mint(_msgSender(), tokenId);
        voteIndex[tokenId-1] = Vote(_hashId, option);
    }

    function hashIdOfTokenId(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return voteIndex[tokenId-1].hashId;
    }

    function optionOfTokenId(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return voteIndex[tokenId-1].option;
    }

    function optionOfHashId(string memory _hashId)
        public
        view
        returns (uint256)
    {
        bytes32 _bytesHashId = stringToBytes(_hashId);
        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (stringToBytes(hashIdOfTokenId(i)) == _bytesHashId) return voteIndex[i-1].option; 
        }
        return 0;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
