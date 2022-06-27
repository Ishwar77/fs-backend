const BatchModel = require("../../../../v1/batch/batch.model");
const CronHelper = require("../../cron-helper");

module.exports = async () => {

    const currentDate = CronHelper.getMoment().format("HH:mm").toString();
    // console.log(currentDate);
    const batchEnding = await BatchModel.batchesEnding(currentDate);
    // console.log('Batch Ending = ', batchEnding);
};

