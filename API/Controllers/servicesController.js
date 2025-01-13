const offersModel = require("../Models/offersModel");
const PageLog = require("../Models/pageLogsModel");
const telemetryClient = require("../utils/azureLogsConnection");


module.exports = {
    logperformance: async (req , res) => {
        try {
            const { metricName,metricValue,properties,message,pageUrl,timestamp} = req.body;
            const userId = req.session.user?._id?? null;
            
            // Send response in database
            const log = new PageLog({
                metricName,
                metricValue,
                properties,
                pageUrl,
                message,
                userId,
                pageUrl,
                timestamp,
            });

            await log.save();

            telemetryClient.trackMetric({
                name: metricName,
                value: metricValue,
                properties: {...properties, pageUrl, timestamp, userId, message },
            });

            return res.status(200).json({ success: true, message: "Log added successfully", data: log });
        } catch (error) {
            console.error("Error sending page render time logs to Azure:", error);
        }
    },
    addOffer: async (req , res) => {
        try {
            const { pageName, title, description, discount, startDate, endDate, cuponCode, termsConditions, otherDetails } = req.body;

            // Validate required fields
            if (!pageName || !title || !description) {
                return res.status(400).json({ success: false, message: "Please enter all required fields" });
            }

            // Create a new offer
            const newOffer = new offersModel({
                pageName,
                title,
                description,
                discount,
                startDate,
                endDate,
                cuponCode,
                termsConditions,
                otherDetails
            });

            // Save the offer to the database
            await newOffer.save();

            res.status(200).json({ success: true, message: "Offer added successfully", data: newOffer });
        } catch (error) {
            console.error("Error adding offer:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    getofferbypagename: async (req , res) => {
        try {
            const { pageName } = req.query;
            const offer = await offersModel.findOne({ pageName });
            if (!offer) {
                return res.status(404).json({ success: false, message: "Offer not found" });
            }
            res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
        } catch (error) {
            console.error("Error fetching offer by pageName:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}