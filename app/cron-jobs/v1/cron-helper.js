const moment = require("moment");

class CronHelper {
    /**
 * Method to get the moment object with specific timezone
 * @param timeZone String, OPTIONA, DEFAILT = 'Asia/Calcutta'
 * @returns moment 
 */
    static getMoment(timeZone = 'Asia/Calcutta') {
        return moment().tz(timeZone);
    }
}

module.exports = CronHelper;