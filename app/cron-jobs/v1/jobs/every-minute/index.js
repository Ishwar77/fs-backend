const minJob = require("./minute");
const CRON_PATTERNS = require("../../cron-patterns");

class MinWiseCronJob {
    static isActive = true;
    static expression = CRON_PATTERNS.EVERY_MINUTE;

    static async scheduleJobs() {
        console.log('Minute-Wise Job Started');

        // 1. Admin's End of Day email Job
        await minJob();
    }
}

// Daily CRON Jobs
module.exports = MinWiseCronJob;