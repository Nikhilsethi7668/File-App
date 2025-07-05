import mongoose from "mongoose";
import { UserCollection } from "../model/filedata.model.js";
import { Events } from "../model/event.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const user = req.user
    const { timeRange, eventId } = req.query; // 'week', 'month', or undefined for all time
    if((user.role!=="admin")&&(!eventId)){
 return res.status(200).json({
      success: false,
      message:"Eventy id is required",
    })
    }
    // Calculate date ranges based on timeRange parameter
    let dateFilter = {};
    if (timeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: oneWeekAgo } };
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      dateFilter = { createdAt: { $gte: oneMonthAgo } };
    }

    // Base match conditions - include event filter if eventId is provided
    const baseMatch = { ...dateFilter };
    if (eventId) {
      baseMatch.event = mongoose.Types.ObjectId.createFromHexString(eventId);
    }

    // 1. Get Overall Statistics
    const userStats = await UserCollection.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          giftsCollected: {
            $sum: { $cond: [{ $eq: ["$giftCollected", true] }, 1, 0] },
          },
          statusCounts: {
            $push: {
              status: "$status",
              count: 1,
            },
          },
          eventsCount: { $addToSet: "$event" } // Count distinct events
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          giftsCollected: 1,
          totalEvents: { $size: "$eventsCount" },
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

    // 2. Get Company-wise Distribution
    const companyStats = await UserCollection.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 3. Get Event-wise Distribution (only if no specific eventId was requested)
    let eventStats = [];
    if (!eventId) {
      eventStats = await UserCollection.aggregate([
        { $match: baseMatch },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "eventDetails"
          }
        },
        { $unwind: "$eventDetails" },
        {
          $group: {
            _id: "$eventDetails.title",
            count: { $sum: 1 },
            eventId: { $first: "$eventDetails._id" }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
    } else {
      // If eventId is provided, get details for that specific event
      const eventDetails = await Events.findById(eventId);
      if (eventDetails) {
        eventStats = [{
          _id: eventDetails.title,
          count: userStats[0]?.totalUsers || 0,
          eventId: eventDetails._id
        }];
      }
    }

    // 4. Get Time-based registration data for graphs
    const registrationTrends = await UserCollection.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === 'week' ? "%Y-%m-%d" : "%Y-%m",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 },
          date: { $first: "$createdAt" }
        }
      },
      { $sort: { date: 1 } },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // 5. Get Selection Stats (selectedBy)
    const selectionStats = await UserCollection.aggregate([
      { $match: baseMatch },
      { $unwind: "$selectedBy" },
      {
        $group: {
          _id: "$selectedBy",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 6. Response Structure
    const dashboardData = {
      statistics: {
        totalUsers: userStats[0]?.totalUsers || 0,
        totalEvents: userStats[0]?.totalEvents || 0,
        giftsCollected: userStats[0]?.giftsCollected || 0,
        statusDistribution: userStats[0]?.statusSummary || {},
        topSelectors: selectionStats,
        registrationTrends: registrationTrends,
      },
      timeRange: timeRange || 'all',
      eventFilter: eventId || 'all'
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