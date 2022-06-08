// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract VoteContract is ERC721, ERC721URIStorage, ERC721Enumerable {
    mapping(string => uint256) internal voteFor;

    constructor() ERC721("2022 Presidential Election", "GOV") {}

    function stringToBytes(string memory a) internal pure returns(bytes32){
        return keccak256(abi.encodePacked(a));
    }

    function mint(uint256 tokenId, string memory _tokenURI, uint256 option) public {
        require(_msgSender() == 0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6, "You are not allowed");
        bytes32 _bytesTokenURI = stringToBytes(_tokenURI);
        for (uint256 i = 1; i <= totalSupply(); i++) {
            require(stringToBytes(tokenURI(i)) != _bytesTokenURI, "Already Voted!!!");
        }
        _mint(_msgSender(), tokenId);
        _setTokenURI(tokenId, _tokenURI);
        voteFor[_tokenURI] = option;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function voteOfTokenId(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        string memory uri = tokenURI(tokenId);
        return voteFor[uri];
    }

    function voteOfURI(string memory uri)
        public
        view
        returns (uint256)
    {
        return voteFor[uri];
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
        override(ERC721, ERC721URIStorage)
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
