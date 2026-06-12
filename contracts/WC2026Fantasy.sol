// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title WC2026Fantasy — on-chain match result recorder
/// @notice Gas-only, no fee. Anyone can record and read results.
contract WC2026Fantasy {

    struct MatchResult {
        string teamName;
        string opponent;
        uint8 homeScore;
        uint8 awayScore;
        string winner;
        string formation;
        uint256 timestamp;
    }

    struct PlayerProfile {
        string name;
        string nation;
        uint256 wins;
        uint256 losses;
        uint256 totalMatches;
    }

    // address => their profile
    mapping(address => PlayerProfile) public profiles;
    // address => their match history
    mapping(address => MatchResult[]) private matchHistory;
    // All addresses that have played (for leaderboard)
    address[] public players;
    mapping(address => bool) private hasPlayed;

    event ProfileUpdated(address indexed player, string name, string nation);
    event MatchRecorded(address indexed player, string teamName, string winner, uint8 homeScore, uint8 awayScore);

    /// @notice Set or update your display name and nation
    function setProfile(string calldata _name, string calldata _nation) external {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_name).length <= 32, "Name too long");

        if (!hasPlayed[msg.sender]) {
            players.push(msg.sender);
            hasPlayed[msg.sender] = true;
        }

        profiles[msg.sender].name = _name;
        profiles[msg.sender].nation = _nation;

        emit ProfileUpdated(msg.sender, _name, _nation);
    }

    /// @notice Record the result of a match
    function recordResult(
        string calldata _teamName,
        string calldata _opponent,
        uint8 _homeScore,
        uint8 _awayScore,
        string calldata _winner,
        string calldata _formation
    ) external {
        require(hasPlayed[msg.sender], "Set your profile first");
        require(bytes(_teamName).length > 0, "Team name required");

        MatchResult memory result = MatchResult({
            teamName: _teamName,
            opponent: _opponent,
            homeScore: _homeScore,
            awayScore: _awayScore,
            winner: _winner,
            formation: _formation,
            timestamp: block.timestamp
        });

        matchHistory[msg.sender].push(result);
        profiles[msg.sender].totalMatches++;

        // Determine if caller won — compare winner string to teamName
        if (keccak256(bytes(_winner)) == keccak256(bytes(_teamName))) {
            profiles[msg.sender].wins++;
        } else {
            profiles[msg.sender].losses++;
        }

        emit MatchRecorded(msg.sender, _teamName, _winner, _homeScore, _awayScore);
    }

    /// @notice Get full match history for an address
    function getMatchHistory(address _player) external view returns (MatchResult[] memory) {
        return matchHistory[_player];
    }

    /// @notice Get total number of registered players
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }

    /// @notice Get a slice of the leaderboard
    function getLeaderboard(uint256 offset, uint256 limit)
        external view
        returns (address[] memory addrs, PlayerProfile[] memory profs)
    {
        uint256 total = players.length;
        if (offset >= total) return (new address[](0), new PlayerProfile[](0));
        uint256 end = offset + limit > total ? total : offset + limit;
        uint256 size = end - offset;
        addrs = new address[](size);
        profs = new PlayerProfile[](size);
        for (uint256 i = 0; i < size; i++) {
            addrs[i] = players[offset + i];
            profs[i] = profiles[players[offset + i]];
        }
    }
}
