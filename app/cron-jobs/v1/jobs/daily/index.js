//const logFolders = require("./logFolder");
const adminEodMailer = require("./eod-email-admin");
const trainerEodMailer = require("./eod-email-trainer");
const clientEodMailer = require("./eod-email-client");

const CRON_PATTERNS = require("../../cron-patterns");
class DailyCronJob {
    static isActive = true;
    // static expression = CRON_PATTERNS.EVERY_END_OF_DAY; //'00 00 00 * * *';
    //CRON RUNS EVERY HOUR
    static expression = CRON_PATTERNS.EVERY_END_OF_DAY;

    static async scheduleJobs() {
        console.log('Daily Jobs Stating');

        // logFolders();

        // 1. Admin's End of Day email Job
        await adminEodMailer();

        // 2. Trainer's End of Day Jobs
        await trainerEodMailer();

        // 3. Client EOD Mailers
        await clientEodMailer();
    }
}

// Daily CRON Jobs
module.exports = DailyCronJob;