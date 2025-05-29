import { UserCollection } from "./models/user.model.js";
import { Events } from "./models/event.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    // 1. Get Event Details
    const event = await Events.findById(eventId)
      .populate("assignedTo", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 2. Get User Statistics
    const userStats = await UserCollection.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: null,
          totalAttendees: { $sum: 1 },
          giftsCollected: {
            $sum: { $cond: [{ $eq: ["$giftCollected", true] }, 1, 0] },
          },
          statusCounts: {
            $push: {
              status: "$status",
              count: 1,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAttendees: 1,
          giftsCollected: 1,
          statusSummary: {
            $arrayToObject: {
              $map: {
                input: "$statusCounts",
                as: "item",
                in: {
                  k: "$$item.status",
                  v: {
                    $sum: ["$$item.count"],
                  },
                },
              },
            },
          },
        },
      },
    ]);

    // 3. Get Company-wise Distribution
    const companyStats = await UserCollection.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Top 5 companies
    ]);

    // 4. Get Selection Stats (selectedBy)
    const selectionStats = await UserCollection.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } },
      { $unwind: "$selectedBy" },
      {
        $group: {
          _id: "$selectedBy",
          count: { $sum: 1 },
        },
      },
    ]);

    // 5. Response Structure
    const dashboardData = {
      eventDetails: {
        title: event.title,
        description: event.description,
        image: event.image,
        startDate: event.startDate,
        endDate: event.endDate,
        assignedTo: event.assignedTo,
        createdBy: event.createdBy,
      },
      statistics: {
        totalAttendees: userStats[0]?.totalAttendees || 0,
        giftsCollected: userStats[0]?.giftsCollected || 0,
        statusDistribution: userStats[0]?.statusSummary || {},
        topCompanies: companyStats,
        selectionDistribution: selectionStats,
      },
    };

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};