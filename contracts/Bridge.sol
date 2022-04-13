//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Verifier.sol";
import "./ERC20Token.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Bridge is Verifier{
    event Swap(address to, uint amount, uint id);

    address private _token;

    uint public lastId;

    address private _pk;

    mapping(uint => bool) private approveTransactions;

    constructor(address token, address pk) {
        _token = token;
        _pk = pk;
    }

    function swap(address to, uint amount) public {
        require(ERC20Token(_token).balanceOf(msg.sender) >= amount, "No have tokens.");

        ERC20Token(_token).burn(msg.sender, amount);

        lastId++;

        emit Swap(to, amount, lastId);
    }

    function redeem(
        address to,
        uint amount,
        uint id,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        string memory message = string(abi.encodePacked(
                toString(to),
                "-",
                Strings.toString(amount),
                "-",
                Strings.toString(id)
            ));

        require(verifyString(message, v, r, s) == _pk, "Not valid.");

        require(approveTransactions[id] == false, "The transaction has already been approved.");

        approveTransactions[id] = true;

        ERC20Token(_token).mint(to, amount);
    }

    function toString(address account) public pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(bytes memory data) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
}
