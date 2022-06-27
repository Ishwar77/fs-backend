
class FileUploadInputs {
    entityType = 'USER' | 'EVENT' | 'COUPON' | 'ADVERTISE' ;
    entityId;

    constructor(type, id) {
        this.entityType = type;
        this.entityId = id;
    }

    static getDataFromRequest(reqBody) {
        if (!reqBody) {
            return null;
        }

       // console.log('reqBody = ', reqBody);

        const type = reqBody['type'] ? (reqBody['type']).toUpperCase() : null;
        const id = reqBody['key'] || -1;

        if (!type || !id) {
            return null;
        }

        return new FileUploadInputs(type, id);
    }

    static hasError(fileUploadInput) {
        if (!fileUploadInput) {
            return true;
        }
        if (!fileUploadInput.entityType || !fileUploadInput.entityId) {
            return true;
        }
        return false;
    }
}

module.exports = FileUploadInputs;