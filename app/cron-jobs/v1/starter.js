const CronHelper = require("./cron-helper");
const Helper = require("../../utils/helper");
const logger = require('../../utils/logger');
const { CronJob } = require("cron");

const DailyCronJob = require("./jobs/daily/index");
const MinWiseCronJob = require('./jobs/every-minute/index');

module.exports = () => {

    const appStartTime = CronHelper.getMoment();
    logger.info('Scheduling CRON Jobs Started at ', appStartTime.format("dddd, MMMM Do YYYY, h:mm:ss a"));

    const scheduledJobRefs = [];

    try {
        let iteration = 1;
        if (DailyCronJob.isActive) {
            logger.info(`Scheduling DAILY JOBS '${DailyCronJob.expression}'`);
            const jobRef = new CronJob(DailyCronJob.expression, async () => {
                // Perfrom Job Action Here
                await DailyCronJob.scheduleJobs();
                logger.info(`JOB -> Daily Cron Job\'s Iteration = ${iteration++}, at = `, CronHelper.getMoment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
            });
            jobRef.start();
            scheduledJobRefs.push(jobRef);
        } 
        if(MinWiseCronJob.isActive) {
            logger.info(`Scheduling EverY Min JOBS '${MinWiseCronJob.expression}'`);
            const jobRef = new CronJob(MinWiseCronJob.expression, async () => {
                // Perfrom Job Action Here
                await MinWiseCronJob.scheduleJobs();
                logger.info(`JOB -> Per Minute Cron Job\'s Iteration = ${iteration++}, at = `, CronHelper.getMoment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
            });
            jobRef.start();
            scheduledJobRefs.push(jobRef);
        }

    } catch (e) {
        logger.error("Scheduling CRON JOB failed");
        logger.info(e);
        const msg = `Verify the error Log, for the cause of Failure`;
        try {
            (async () => {
                await Helper.sendEMail(Helper.getMaintainer(), `FS: Failed to Schedule CRON Job`, msg, msg  );
            })();
        } catch(e) {
            logger.error("Unable to notify Maintainer, on the Failure of Scheduling CRON Job");
        }
    }

    //  console.log('JOB -> JobRefs = ', scheduledJobRefs);


    const waitTime = 5000;
    logger.info(`JOB -> CRON Scheduler is about to complete in next ${waitTime / 1000} sec`);
    setTimeout(() => {
        // App Closing

        const appEndTime = CronHelper.getMoment();
        logger.info('JOB -> CRON Scheduler Ends at ' + appEndTime.format("dddd, MMMM Do YYYY, h:mm:ss a"));

        logger.info('JOB -> CRON Scheduing took ' + appEndTime.diff(appStartTime, 's') + ' sec');

    }, waitTime);

};

