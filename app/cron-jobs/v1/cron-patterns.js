/**
 * ref https://crontab.guru/
 * @see https://crontab.guru/#<pattern>
 */

module.exports = CRON_PATTERNS = {
    /**
     * At every second
     */
    EVERY_SECOND: '* * * * *',

    /**
     * At every minute
     */
    EVERY_MINUTE: '*/1 * * * *',

    /**
     * At every hour
     */
    EVERY_HALF_HOUR: '*/30 * * * *',
    /**
     * At 23:59 on every day-of-month.
     */
    EVERY_END_OF_DAY: '59 23 */1 * *',

    /**
     * At 00:00 on day-of-month 1.
     */
    FIRST_DAY_OF_MONTH: '0 0 1 * *',

    /**
     * At 00:00 on every 15th day-of-month.
     */
    EVERY_FIFTEENTH_DAY: '0 0 */15 * *'
};
