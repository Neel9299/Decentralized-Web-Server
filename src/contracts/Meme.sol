pragma solidity 0.5.0;

contract Meme {
	// Smart Contract Code 

	string memeHash;
	string memeHash1;
	string memeHash2;
	//Write Function
	function set(string memory _memeHash) public {
       memeHash = _memeHash;
	}
	
	function set1(string memory _memeHash1) public {
       memeHash1 = _memeHash1;
	}
	
	function set2(string memory _memeHash2) public {
       memeHash2 = _memeHash2;
	}

	//Read Function

	function get() public view returns (string memory) {
	  return memeHash;
	}
	
	function get1() public view returns (string memory) {
	  return memeHash1;
	}
	
	function get2() public view returns (string memory) {
	  return memeHash2;
	}
}
