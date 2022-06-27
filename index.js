(async () => {


    const logger = require('./app/utils/logger');
    logger.info("The FitSocials app has started");
    const path = require('path');

    // 1. Create Express App instance
    const express = require("express");
    const app = new express();

    // STATIC PATHS
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

    // 2. Add the body Parser
    const bodyParser = require('body-parser');
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // File Uploading Support
    const fileUpload = require('express-fileupload');
    app.use(fileUpload({
        createParentPath: true,
        preserveExtension: 5,
        abortOnLimit: true,
        responseOnLimit: 'The file size is too large, try with files lesser than 1Mb',
        limitHandler: (req, res, next) => {
            logger.error('Prevented bulk file uploading');
            next();
        },
        tempFileDir: 'tmp',
        debug: false
    }));

    // 3. Inject the bootstrap Scripts
    const ScriptBundler = require('./app/utils/script-bundler');
    const bundlerObj = new ScriptBundler();
    try {
        await bundlerObj.bootstrapActionScripts(app);
    } catch (w) {
        console.log("Failed to Bootstrap");
        logger.error("Unable to Bootstrap the app");
        logger.error(w);
        process.exit(1);
    }

    // 5. Manage Routing, based on versions
    const mainRouter = require('./app/v1/route-controller-v1');
    app.use('/api/v1/', mainRouter);


    // 6. Inject CRON
    const fsCronJobs = require('./app/cron-jobs/v1/starter');
    // try {
        fsCronJobs();
    // } catch(e) {
    //     logger.error("Failed to Manage CRON Jobs");
    //     logger.info(e);
    // }

   // throw new Error("Error");


    /// TEST


    //  const  pm = require('./app/utils/razorpay/paymets-manager');
    //  const users = require('./data/users.json');

    //  const order = await pm.createOrder(100, 'TestRec101', {
    //      eventId: 1, barchesId: "2,4", userId: 10, couponCode: 120, discountAmt: 200, subscriptionId: 10
    //  });
    //  logger.info("Order = ", order);

    //  setTimeout( async () => {
    //     const o = await pm.getOrderInfoByOrderId(order.metadata.id);
    //     console.log( o);
    //  }, 1000)
    // const payments = await pm.getAllPayment("2020-01-01", "2020-08-04");
    // console.log( "payments = ", payments );

    // const invObj = require("./app/utils/razorpay/invoice-obj");
    // invObj.amount = 30000
    // invObj.customer = users[5];
    // invObj.notes = {
    //           eventId: 1, barchesId: "[2,4]", userId: 10, couponCode: 120, discountAmt: 200, subscriptionId: 10
    //       };
    // invObj.description = 'This is a sample invoice';
    // invObj.receipt = `Billing-${invObj.customer.name}-${new Date().getTime()}`;

    // const inv = await pm.createInvoice(invObj);
    // console.log( "inv = ", inv );


    // const invInf = await pm.getInvoiceById('inv_FMyp1SKfZocqXD');
    // console.log( "invInf = ", invInf );

    // const allInvs = await pm.getAllInvocies();
    // console.log( "allInvs = ", allInvs );

    // const allOrders = await pm.getAllOrders('2020-01-01', '2020-08-05');
    // console.log( "allOrders = ", allOrders );
    //  if(allOrders && allOrders.metadata) {
    //      const items = allOrders.metadata.items;
    //      items.forEach(e => {
    //          console.log(e);
    //      })
    //  }

    // // require('./test/mapping');
    // const JWTHelper = require('./app/utils/jwtHelper');
    // const key = await JWTHelper.getSecretKey();
    // const JwtPayload = require('./app/models/jwtPayload');
    // console.log("KEY = ", key);

    // const data = JSON.stringify(new JwtPayload(-1, new Date(), true, null));
    // console.log('Token Input = ', data);
    // const token = await JWTHelper.create(data, key, '10000ms'); // 60 sec
    // console.log("TOKEN = ", token);
    // // const verify0 = await JWTHelper.verify(token, key);
    // // console.log('30 second Verify1 = ', verify0);

    // setTimeout(async () => {
    //     const decoded = await JWTHelper.decode(token);
    //     console.log("Decoded = ", decoded);

    //     const verify1 = await JWTHelper.verify(token, key);
    //     console.log('30 second Verify1 = ', verify1);
    // }, 8000); // 20 sec

    // setTimeout(async () => {
    //     const verify2 = await JWTHelper.verify(token, key);
    //     console.log('60 Verify2 = ', verify2);
    // }, 61000);

    // const decoded = await JWTHelper.decode(token);
    // console.log("Decoded = ", decoded);



    //// TEST



})();