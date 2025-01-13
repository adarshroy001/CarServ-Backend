const appInsights = require('applicationinsights');
require('dotenv').config();
const key = process.env.AZURE_LOGS_CONNECTION_KEY;

appInsights.setup(key)
    .setAutoCollectRequests(true)
    .setAutoCollectDependencies(true)
    .setInternalLogging(true, true)
    .start();

const telemetryClient = appInsights.defaultClient;

// Log a test event to verify initialization
telemetryClient.trackTrace({ message: 'Application Insights Initialized' });

module.exports = telemetryClient;