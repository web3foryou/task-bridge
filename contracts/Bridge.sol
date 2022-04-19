//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./ERC20Token.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Bridge {
    event Swap(address to, uint amount);

    address private _token;

    address private _pk;

    mapping(uint => bool) private approveTransactions;

    constructor(address token, address pk) {
        _token = token;
        _pk = pk;
    }

    function swap(address to, uint amount) public {
        require(ERC20Token(_token).balanceOf(msg.sender) >= amount, "No have tokens.");

        ERC20Token(_token).burn(msg.sender, amount);

        emit Swap(to, amount);
    }

    function redeem(
        address to,
        uint amount,
        uint nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        bytes32 message = keccak256(abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(
                    to,
                    amount,
                    nonce
                ))
            ));

        (address addr,) = ECDSA.tryRecover(message, v, r, s);
        require(addr == _pk, "Not valid.");

        require(approveTransactions[nonce] == false, "The transaction has already been approved.");

        approveTransactions[nonce] = true;

        ERC20Token(_token).mint(to, amount);
    }
}
