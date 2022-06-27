const EventDAO = require('./event.dao');
const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const logger = require('../../utils/logger');
const JWTHelper = require('../../utils/jwtHelper');
const EventRegistrationModel = require('../event-registration/eventregistration.model');

module.exports = class EventUtility {

    static async filterEvents(eventsList, httpRequestHeaders) {
        if (!eventsList || !httpRequestHeaders) {
            logger.error('Data missing, in filterEvents()');
            return [];
        }
        const userData = httpRequestHeaders.user || null;
      //  console.log('User data in header = ', userData);
      //  console.log('Event list = ', eventsList.length);
        if (!userData) {
            logger.error('In filterEvents(), UserData is missing');
            return [];
        }

        if (userData.userRole === 1) {
          //  console.log('Admin: No filters');
            // Dont filter anyting for an Admin
            return eventsList;
        } else if (userData.userRole === 6) {
            //  console.log('Admin: No filters');
              // Dont filter anyting for an Admin
              const mapped = [];
            const t = [...eventsList];
            t.forEach(event => {
                event['EventMaster'] = null;
            })
         //   console.log('Mapped = ', t);
            return t;
          } else if (userData.userRole === 2) {
          //  console.log('Guest: filter out  "EventMaster", "meeting_links"');

            // A guest dont need the properties like "EventMaster", "meeting_links"
            const mapped = [];
            const t = [...eventsList];
            t.forEach(event => {
                event['EventMaster'] = null;
            })
         //   console.log('Mapped = ', t);
            return t;
        } else if (userData.userRole === 3) {
            // Step 1: Clear all meeting links of all events by default
            const t = [...eventsList];

            // Step 2: Fetch all user's events 
           // console.log('Client: Selective filter  of "meeting_links"');
            // All the events subscribed by this user
            const subscriptions = await EventRegistrationModel.getEventRegistrationByUserId(userData.userId);
            let uniqueEvents = [];
            if(subscriptions && subscriptions.length) {
                const userEventList = subscriptions.map(sub => sub['Subscription']['Event'])
                // Filter out duplicates
                uniqueEvents = Array.from(new Set(userEventList));
            }
          //  console.log('userEvents = ', uniqueEvents.length);

            // Step 3: Merge data from step2 to step1
            const finalizedEvents = new Set();
            t.forEach(event => {
                const present = uniqueEvents.filter(e => e.event_id === event.event_id);
                finalizedEvents.add(event);
            })

            return Array.from(finalizedEvents);


            
        }

    }


    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = EventUtility.getJoiVerificationModel(action, model).validate(model);
        // console.log('Err =', error);
        return (error && error.error) ? error.error : null;
    }

    static getJoiVerificationModel(action = MyConst.ValidationModelFor.CREATE, reqBody = null) {
        if (action === MyConst.ValidationModelFor.CREATE) {
            return JOI.object({
                gallery_id: JOI.number(),
                event_master_id: JOI.number().required(),
                event_name: JOI.string().required().min(3),
                description: JOI.string().required().min(3),
                cover_image: JOI.string(),
                start_date: JOI.date(),
                end_date: JOI.date(),
                is_repetitive: JOI.number().min(1),
                repeat_every: JOI.string(),
                start_time: JOI.date(),
                end_time: JOI.date(),
                price: JOI.number().required().default(0),
                trial_period: JOI.number().required().default(0),
                uuid: JOI.string(),
                created_at: JOI.date(),
                updated_at: JOI.date(),
                isActive: JOI.number().default(1),
                instructor_id: JOI.number()
            });
        } else {
            return JOI.object(EventUtility.generateDynamicUpdateValidator(reqBody));
        }
    }


    static generateDynamicUpdateValidator(reqBody) {
        if (!reqBody) {
            return null;
        }

        const validator = {};
        const props = Object.getOwnPropertyNames(reqBody);
        props.forEach(prop => {
            switch (prop) {
                case "event_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "gallery_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "event_master_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "event_name":
                    validator[`${prop}`] = JOI.string().required().min(2); break;
                case "description":
                    validator[`${prop}`] = JOI.string().required().min(2); break;
                case "cover_image":
                    validator[`${prop}`] = JOI.string(); break;
                case "start_date":
                    validator[`${prop}`] = JOI.date(); break;
                case "end_date":
                    validator[`${prop}`] = JOI.date(); break;
                case "price":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "trial_period":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "instructor_id":
                    validator[`${prop}`] = JOI.number(); break;
            }
        });
        // console.log('validator = ', validator);
        return validator;
    }

}
