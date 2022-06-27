
const UserModel = require("./user.model");
const RegistrationModel = require("../event-registration/eventregistration.model");
const UserUtil = require("./user.util");
const moment = require("moment");

class OnboardingUtility {
    //Adding a new Product to the database
    /**
     * To read data from an excel file
     * @param path string
     * @param vendorId number
     * @return { success: Product[], failed: Product[] }
     */
    static readExcelFileContent(excelFilePath, vendorId, userRole = 3, refCode = null) {
        if (!excelFilePath || !vendorId) {
            return null;
        }

        const XLSX = require('xlsx');

        const workbook = XLSX.readFile(excelFilePath,  { cellDates: true });
        const sheet_name_list = workbook.SheetNames;
       // console.log('sheet_name_list = ', sheet_name_list);
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        if (!xlData || !xlData.length) {
          //  console.log('No Data in the file');
            return {state: "ERROR", message: "Data in wrong format"};
        }

      //  console.log('File Data = ', xlData);
        const registrations = [];
        const batches = [];
        const success = [];
        const failed = [];
        xlData.forEach(data => {
            const o = new UserModel(
                null,
                userRole,
                null,
                data.name || null,
                data.mobile || null,
                data.email || null,
                null,
                refCode || null,
                1,
                null,
                null,
                data.gender || null,
                data.dob || null,
                data.designation || null,
                data.current_subscription_expiry_date || null
            );
            const valid = UserUtil.hasError(o);
            //  console.log('Valid = ', valid);
            (valid.error) ? failed.push(o) : success.push(o);

            // create registration object

            registrations.push( new RegistrationModel(null, null, data.subscription_id, 'PAID', null, null, null, 1, null, null) );
            batches.push({id:null, registration_id: null, batch_id: data['batch_id'], isActive: 1});
        });

//        return null;
        return {
            state: "SUCCESS",
            success: [...success],
            failed: [...failed],
            registrations: registrations,
            batches: batches
        };

    }

}

module.exports = OnboardingUtility;