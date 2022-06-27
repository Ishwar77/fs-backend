/**
 *
 * @see https://www.freeformatter.com/cron-expression-generator-quartz.html
 */

module.exports = class CronJobConfig {
    constructor(
        id = new Date().getTime(),
        description = null,
        expression = null,
        jobSrcFile = null,
        jobType = 'SHELL' | 'SQL',
        resultFilePath = null,
        optionalInput = null,
    ) {
        this.id = id;
        this.description = description || "No Description";
        this.expression = expression || '0 * * ? * * *';
        this.jobSrcFile = jobSrcFile;
        this.jobType = jobType || 'SHELL';
        this.resultFilePath = resultFilePath;
        this.optionalInput = optionalInput;
    }


    static mapBulk(jsonObjs) {
        if (!jsonObjs || !jsonObjs.length) {
            return null;
        }
        let parsedJobs  = [];
        jsonObjs.forEach(job => {
            parsedJobs.push(new CronJobConfig(
                job['id'] || null,
                job['description '] || null,
                job['expression'] || null,
                job['jobSrcFile'] || null,
                job['jobType'] || null,
                job['resultFilePath'] || null,
                job['optionalInput'] || null,
            ));
        });
        return parsedJobs;
    }
}