// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/// @title Contract for managing the set array.
contract CappedSet {
    /// TYPES ///

    /// @param value The value of one element
    /// @param addr The address who added the value.
    struct Element {
        uint256 value;
        address addr;
    }

    /// STORAGE ///

    /// @notice  maxElements is the number of max value of array length.
    /// @notice  lowestValue is the current lowest value of array.
    /// @notice  lowestAddress is the current lowest address of array.
    uint256 private maxElements;
    uint256 private lowestValue;
    address private lowestAddress;

    Element[] public eleArr;

    /// @notice Mapping to keep track the value by address.
    mapping(address => uint256) private element;

    /// ERRORS ///
    error NonZero();
    error AlreadyExist();
    error NotExist();

    /// CONSTRUCTOR ///
    /// @notice Initializes the contract with max number of element array length.
    /// @param num Maximum number of element array length.
    constructor(uint256 num) {
        maxElements = num;
    }

    /// EXTERNAL FUNCTIONS ///

    /// @notice Insert new element with address and value
    ///         and returns the lowest value and address of current list.
    /// @param addr The address who add the value.
    /// @param value The value of one element.
    /// @return newLowestAddress Return lowest address of array after insert
    /// @return newLowestValue Return lowest value of array after insert

    function insert(
        address addr,
        uint256 value
    ) external returns (address newLowestAddress, uint256 newLowestValue) {
        uint256 numLen = eleArr.length;

        if (value == 0) {
            revert NonZero();
        }
        if (element[addr] != 0) {
            revert AlreadyExist();
        }
        if (numLen >= maxElements && lowestValue > value) {
            return (lowestAddress, lowestValue);
        }

        element[addr] = value;
        eleArr.push(Element(value, addr));
        numLen++;
        if (numLen > maxElements) {
            (, , uint256 idx) = findMin(eleArr);
            element[eleArr[idx].addr] = 0;
            eleArr[idx] = eleArr[numLen - 1];
            eleArr.pop();
            (address minAddr, uint256 minValue, ) = findMin(eleArr);
            lowestAddress = minAddr;
            lowestValue = minValue;
        } else {
            if (lowestValue > value || numLen == 1) {
                lowestValue = value;
                lowestAddress = addr;
            }
        }

        return (lowestAddress, lowestValue);
    }

    /// @notice Update element with new value using address
    ///         and returns the lowest value and address of current list.
    /// @param addr The address who added the value.
    /// @param newVal The new value to update.
    /// @return newLowestAddress Return lowest address of array after update
    /// @return newLowestValue Return lowest value of array after update
    function update(
        address addr,
        uint256 newVal
    ) external returns (address newLowestAddress, uint256 newLowestValue) {
        if (element[addr] == 0) {
            revert NotExist();
        }

        uint256 numLen = eleArr.length;

        for (uint256 i = 0; i < numLen; i++) {
            if (addr == eleArr[i].addr) {
                eleArr[i].value = newVal;
                element[addr] = newVal;
            }
        }

        if (lowestValue > newVal) {
            lowestValue = newVal;
            lowestAddress = addr;
        }

        return (lowestAddress, lowestValue);
    }

    /// @notice Remove element using address
    ///         and returns the lowest value and address of current list.
    /// @param addr The address to remove.
    /// @return newLowestAddress Return lowest address of array after remove
    /// @return newLowestValue Return lowest value of array after remove
    function remove(
        address addr
    ) external returns (address newLowestAddress, uint256 newLowestValue) {
        if (element[addr] == 0) {
            revert NotExist();
        }

        uint256 numLen = eleArr.length;

        for (uint256 i = 0; i < numLen; i++) {
            if (addr == eleArr[i].addr) {
                eleArr[i] = eleArr[numLen - 1];
            }
        }

        eleArr.pop();

        if (element[addr] == lowestValue) {
            (address minAdd, uint256 minValue, ) = findMin(eleArr);
            lowestAddress = minAdd;
            lowestValue = minValue;
        }

        element[addr] = 0;
        return (lowestAddress, lowestValue);
    }

    /// PUBLIC FUNCTIONS ///

    /// @notice Returns the value of element using address
    /// @param addr Address which indicate the value

    function getValue(address addr) public view returns (uint256) {
        return element[addr];
    }

    /// INTERNAL FUNCTIONS ///

    /// @notice Find and return the minimum value, address and index number
    /// @param arr Array data to find the min value
    function findMin(
        Element[] memory arr
    ) internal pure returns (address, uint256, uint256) {
        uint256 pivot = arr[0].value;
        uint256 index;
        uint256 numLen = arr.length;

        for (uint256 i = 0; i < numLen; i++) {
            if (pivot > arr[i].value) {
                pivot = arr[i].value;
                index = i;
            }
        }

        return (arr[index].addr, arr[index].value, index);
    }
}
