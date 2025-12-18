const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          name: 1, // We need the name
          email: 1, // We might need email (optional)
          solvedCount: { $size: "$solvedProblems" } // 👈 MAGIC: Count the array length
        }
      },
      {
        $sort: { solvedCount: -1 } // Sort descending (Highest score first)
      },
      {
        $limit: 20 // Only show top 20 users
      }
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getLeaderboard };