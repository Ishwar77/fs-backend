const UserDao = require("./user-module/user.dao");
const Helper = require("../utils/helper");
const logger = require("../utils/logger");

// NOTE: In the future the complexity will be more, if the user base expands
// We will have to purcase a mass mailer then

/**
 * Utility function to sent Emails to all Active clients
 * @param {*} subject String
 * @param {*} emailBody String
 */
module.exports = async (subject, emailBody) => {
    if (!emailBody || !emailBody.length) {
        return;
    }
    const users = await UserDao.findAll({
        where: {
            isActive: true,
            user_role_id: 3
        }
    });

    if (!users && !users.length) {
        return null;
    }
    logger.info(`Sending Mass Mail, to ${users.length} clients, subject line "${subject}" `);
    const bcc = users.map(u => u.email_id)
  //  console.log('BCC = ', bcc);

    Helper.sendEMail(null, subject, emailBody, emailBody, null, null, false, false, { bcc: bcc, isMassMailer: true }).then(res => {
        logger.info(`Mass Mail, SUCCESS`);
    }).catch(e => {
        logger.error(`Mass Mail, FAILED`);
        logger.info(JSON.stringify(e));
    });
    return;
};