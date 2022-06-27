
(async () => {
    const AddressDao = require('./address-module/address.dao');
    const BatchesDAO = require('./batch/batch.dao');
    const UserDao = require('./user-module/user.dao');
    const UserRoleMaster = require('./user-role-master/user-role-master.dao');
    const UserFitnessDao = require('./fitness-info-module/fitnessinfo.dao');
    const FitnessCenterDao = require('./fitness-center-module/fitnesscenter.dao');
    const SubscriptionDAO = require('./subscription/subscription.dao');
    const EventDAO = require('./events-module/event.dao');
    const PaymentDao = require('./payment/payment.dao');
    const AuthDao = require('./authentication-module/authentication.dao');
    const GalleryDao = require('./gallery/gallery.dao');
    const GalleryItemDao = require('./gallery-items-module/galleryitems.dao');
    const MediaTypeMasterDao = require('./media-type-master-module/mediamaster.dao');
    const EventRegistrationDAO = require('./event-registration/eventregistration.dao');
    const EventMasterDao = require('./event-master-module/eventmaster.dao');
    const CouponDao = require('./coupon-module/coupon.dao');
    const ReviewDao = require('./review-module/review.dao');
    const BatchDao = require('./batch/batch.dao');
    const FrequencyDao = require('./batch-frequency-module/frequency.dao');
    const ReferralsDao = require('./user-referral-module/user-referral.dao');
    const RegistrationBatchDao = require("./event-registration-batches/event-reg-batch.dao");
    const UserPointsDao = require("./user-points/user-points.dao");
    const attendanceDao = require("./attendance-tracking/attendance-tracking.dao");
    const BatchSwitchDAO = require('./batch-switch-module/batchswitch.dao');
    const sessionDao = require('./session/session.dao');
    const TrainerRatingsDao = require('./trainer-ratings/trainer-ratings.dao');
    const PointRedemptionDao = require('./points-redemption/points-redemption.dao');

    // 1. User To Address and Role -------------------------
    UserDao.belongsTo(AddressDao, {
        as: 'Address',
        foreignKey: 'address_id',
        allowNull: true
    });

    UserDao.belongsTo(UserRoleMaster, {
        as: 'UserRoleMaster',
        foreignKey: 'user_role_id',
        allowNull: true
    });

    // 2. FitnessInfo To User -------------------------
    UserFitnessDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });


    // 3. Fitness Center to Address -----------------
    FitnessCenterDao.belongsTo(AddressDao, {
        as: 'Address',
        foreignKey: 'place_id',
        allowNull: true
    });

    // 4. Subscription to Event -----------------
    EventDAO.hasMany(SubscriptionDAO, {
        as: 'Subscription',
        foreignKey: 'event_id',
        allowNull: true
    })

    SubscriptionDAO.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    SubscriptionDAO.belongsTo(BatchesDAO, {
        as: 'Batch',
        foreignKey: 'subscription_id',
        allowNull: true
    });

    // 5. Payment to Subscription and User -----------------
    PaymentDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });

    PaymentDao.belongsTo(SubscriptionDAO, {
        as: 'Subscription',
        foreignKey: 'subscription_id',
        allowNull: true
    });

    PaymentDao.belongsTo(EventRegistrationDAO, {
        as: 'Registration',
        foreignKey: 'registration_id',
        allowNull: true
    });

    // 5. Auth to User -----------------
    AuthDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });

    // 6. Gallery to Event -----------------
    EventDAO.hasMany(GalleryDao, {
        as: 'Gallery',
        foreignKey: 'event_id',
        allowNull: true
    })

    GalleryDao.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    // 7. GalleryItem to Gallery -----------------

    GalleryDao.hasMany(GalleryItemDao, {
        as: 'Gallery',
        foreignKey: 'gallery_id',
        allowNull: true
    })

    GalleryItemDao.belongsTo(GalleryDao, {
        as: 'GalleryItem',
        foreignKey: 'gallery_id',
        allowNull: true
    });

    GalleryItemDao.belongsTo(MediaTypeMasterDao, {
        as: 'MediaMaster',
        foreignKey: 'media_type_id',
        allowNull: true
    });

    // 8. EventRegistration to Subscription and User -----------------
    EventRegistrationDAO.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });

    EventRegistrationDAO.belongsTo(SubscriptionDAO, {
        as: 'Subscription',
        foreignKey: 'subscription_id',
        allowNull: true
    });

    EventRegistrationDAO.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    EventRegistrationDAO.belongsTo(CouponDao, {
        as: 'Coupon',
        foreignKey: 'coupon_id',
        allowNull: true
    });


    // 9. Event to Gallery and EventMaster -----------------
    // (Event to Gallery already done)

    EventDAO.belongsTo(EventMasterDao, {
        as: 'EventMaster',
        foreignKey: 'event_master_id',
        allowNull: true
    });

    EventDAO.belongsTo(UserDao, {
        as: 'Instructor',
        foreignKey: 'instructor_id',
        allowNull: true
    });

    // 10. Coupon to Event
    CouponDao.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    //11. Review to User and Review to Event
    ReviewDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });

    ReviewDao.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    //12. Batch to Frequency
    BatchDao.belongsTo(FrequencyDao, {
        as: 'Frequency',
        foreignKey: 'frequency',
        allowNull: true
    });

    BatchDao.belongsTo(SubscriptionDAO, {
        as: 'Subscription',
        foreignKey: 'subscription_id',
        allowNull: true
    });

    // 13. Referral
    ReferralsDao.belongsTo(UserDao, {
        as: 'Referrering_User',
        foreignKey: 'referrering_user',
        allowNull: true
    });

    ReferralsDao.belongsTo(UserDao, {
        as: 'Invited_User',
        foreignKey: 'invited_user',
        allowNull: true
    });


    // 14. Registration Batch

    RegistrationBatchDao.belongsTo(EventRegistrationDAO, {
        as: 'Registration',
        foreignKey: 'registration_id',
        allowNull: true
    });

    RegistrationBatchDao.belongsTo(BatchDao, {
        as: 'Batch',
        foreignKey: 'batch_id',
        allowNull: true
    });


    // 15. User Points
    UserPointsDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });

    attendanceDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    })

    attendanceDao.belongsTo(BatchDao, {
        as: 'Batch',
        foreignKey: 'batch_id',
        allowNull: true
    });

    BatchDao.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });

    BatchSwitchDAO.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });
    BatchSwitchDAO.belongsTo(EventRegistrationDAO, {
        as: 'Registration',
        foreignKey: 'registration_id',
        allowNull: true
    });
    BatchSwitchDAO.belongsTo(BatchDao, {
        as: 'Batch',
        foreignKey: 'batch_id',
        allowNull: true
    });
    BatchSwitchDAO.belongsTo(RegistrationBatchDao, {
        as: 'RegisteredBatch',
        foreignKey: 'reg_batch_id',
        allowNull: true
    });
    sessionDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });
    PointRedemptionDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });
    PointRedemptionDao.belongsTo(EventDAO, {
        as: 'Event',
        foreignKey: 'event_id',
        allowNull: true
    });


    // Trainer Ratings Relationship
    TrainerRatingsDao.belongsTo(UserDao, {
        as: 'User',
        foreignKey: 'user_id',
        allowNull: true
    });
    TrainerRatingsDao.belongsTo(UserDao, {
        as: 'Trainer',
        foreignKey: 'trainer_id',
        allowNull: true
    });



})();