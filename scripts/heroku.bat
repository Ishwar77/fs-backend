heroku config:set NODE_ENV=dev
heroku config:set DEBUG=app:logger
heroku config:set APP_SECRETKEY=This_is_the_Real_Secret_Key
heroku config:set DB_USERNAME=maiora
heroku config:set DB_NAME=fs-dev
heroku config:set DB_PASSWORD=Madmin@6977
heroku config:set SENDGRID_API_KEY=''
heroku config:set RAZORPAY_APP_KEY=rzp_test_7QB26I8c2fGbMk
heroku config:set RAZORPAY_APP_SECRET=pKcHmJyQSTKs14VyY3I0tANb
heroku config:set EMAIL_ADDRESS=yesho@maiora.co
heroku config:set EMAIL_PASSWORD=Madmin@123
heroku config:set EMAIL_PROVIDER=outlook
heroku config:set TZ=Asia/Calcutta