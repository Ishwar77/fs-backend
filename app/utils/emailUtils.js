/**
 * Use HTML minifier to simplify the HTML template strings
 * REF: http://beautifytools.com/html-minifier.php
 */
class EmailUtils {

    static emailFooter = `<div style="display:block;align-items:center;justify-content:center;margin-top:10px"><div style="text-align:center;line-height:1rem;border:1px solid #f4f4f4;padding:20px"><p style="color:silver;font-size:.5rem"><span style="font-weight:600;font-size:.7rem">This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span><br><span>This email was sent to you because you created an account with The Fit Socials.</span></p></div></div>`;

    static getFromAddress() {
        return "The Fit Socials <Thefitsocials@gmail.com>";
    }

    static getOnboardMessage() {
        let resp = `<p> Our mentor, has created a profile for you, with the Fit Socials. </p>`;
        resp += `<p> You are requested to RESET PASSWORD, by proceeding to the login section, before access your account. </p>`;
        resp += `<p> Copy paste the URL https://thefitsocials.com , to access, or click this link  <a hre="https://thefitsocials.com" target="__blank">https://thefitsocials.com</a></p>`;
        resp += `<br/><hr />`;
        resp += `<p>For any concerns contact us at +91 789 289 1430 </p>`;
        resp += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return resp;
    }

    static getRegistrationTemplate(name, email) {
        let response = "";
        response += "<div style='width: 100%;height: 100%;font-family: 'Helvetica Neue',Helvetica,Arial sans-serif;'> <div style='display: block; width: 100%;background: #fff;    border: 1px solid #f4f4f4;'> <div style='background: #3a90f8;color:#fff; text-align: center;border-bottom: 1px solid #f0f4f6;padding: 15px;font-weight:600;font-size: 1.5rem;'> Welcome to The FitSocial </div> <div style='color:#4e5262de;padding: 20px 10px 20px 10px;'>";
        response += "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>The Fit Socials team welcomes you to be a part of our family. You have taken your first step towards a happier and a heathier life. Explore our Fitness events and affordable sessions, from your home. We'll do everything we can to help and support you as you join us on the sessions. Together, let’s make the world fittest and finest. </p> <p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> Below is the login information, have Fun and achieve your Goals using The Fit Socials. </p><p style='line-height: 1.6;font-size: 0.95rem;'>Email Address: <span style='color:#000;font-size: 14px;font-weight: 500;'>" + email + "</span><br>Login : <span style='color:rgb(35, 133, 212);font-size: 14px;font-weight: 500;'><a href = 'https://thefitsocials.com' target = '_blank'>CLICK HERE</a></span> <br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static getEventSubscriptionTemplate(user, event) {
        // let response = ` <img src=" ${event['cover_image']}" alt="Event Cover Image" />`;
        // response += "<p> Hello " + user['diaplay_name'] + "</p>";
        // response += "<p>" + event['meeting_links'] || "Contact us" + "</p>";
        // response += "<br /><p> Event: " + event['event_name'] + "</p>";
        // response += "<p> Description: " + event['description'] + "</p>";
        // response += "<p> Start: " + event['start_date']  + "</p>";
        // response += "<br /><p> Login to The Fit Socials account, to know more</p>";
        // response += "<br /><br /><hr /><p>Contact: +91 789 289 1430</p>";
        // response += "<p> For any Concerns, reach out to us at our Support portal</p>";
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + user['diaplay_name'] + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>You have successfully registered for the event " + event['event_name'] + ".</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>The bellow meeting link leads you to the session.</p> <p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> " + "</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> Event Description:</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'>" + event['description'] + "</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'>Login, Have Fun and achieve your Goals using The Fit Socials.</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'>Enjoy Your Sessions.</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;

    }

    static contactAdminForRefund() {
        let response = "";
        response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'></span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Event Registration failed</b> due to Batch Scheduling issues.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>In case of any amount deduction please contact the Admin for refund later your amount will be refunded to your account in 5-6 working days.</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> Tax and service charges will be retained and remaining amount will be refunded. </p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        // response += "<p> Hello " + user['diaplay_name'] + "</p>";
        // response += "<p> Event Registration failed due to Batch Scheduling issues.</p>";
        // response += "<br /><p>Please contact the admin for Refund. </p>";
        // response += "<p> For any other Concerns, reach out to us at our Support portal</p>";
        // response += "<br /><br /><hr /><p>Contact: +91 789 289 1430</p>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static getErrorReport() {
        let response = "";
        response += "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic;'></span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>We are sorry to Inform you that your account is currently experiencing errors and was unable to complete your request.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>But don't worry, your account data are safe and Our engineers are working to resolve this issue.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please try again after some time.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static getTrainerRegistrationTemplate(name) {
        let response = "";
        response += "<div style='width: 100%;height: 100%;font-family: 'Helvetica Neue',Helvetica,Arial sans-serif;'> <div style='display: block; width: 100%;background: #fff; border: 1px solid #f4f4f4;'> <div style='background: #3a90f8;color:#fff; text-align: center;border-bottom: 1px solid #f0f4f6;padding: 15px;font-weight:600;font-size: 1.5rem;'>CONGRATULATIONS. Welcome to The FitSocial </div> <div style='color:#4e5262de;padding: 20px 10px 20px 10px;'><p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>You just started a new business through The Fit Socials. The Fit Socials team welcomes you to be a part of our family. We have received your payment successfully. Becoming a Fitness trainer is not an easy task, there's no better place to start than The Fit Socials. We'll handle everything from Marketing to Payments.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Your account will be activated soon by the Admin and will receive a mail on the same.</p> <p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> Below is the login information, have Fun and achieve your Goals using The Fit Socials. </p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }


    static trainerAccountActivation(name) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Your Account has been Activated Successfully.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>So, what are you waiting for?</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Login to the Website, add your events, subscription, batches and start training.</p><a href = 'www.thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static eventActivation(name) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Your Event has been Activated Successfully.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Now the users can view your event and also subscribe to the batches that they are interested in.</p><a href = 'www.thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static userBlocked(name) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Your Account has been blocked on a temporary basis due to few security reasons.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>To regain the access please contact our Support Portal.</p><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static unblockUser(name) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Your Account has regained the access.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>You can continue enjoying our services by Logging into the Website.</p><a href = 'www.thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static couponAdded(name) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>Limited Period Offer!</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>There are Special offer waiting for you.</p> <p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Don't miss this chance of saving money.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>So, what are you thinking about? </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Login to our website and get exiting discounts on each event.</p><a href = 'www.thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static eventAdded(eventName, eventDescription) {
        let response = `<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'>Hello,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>A new event has been added, to our Fitness catalogue, why dont you check this out <b><u>${eventName}</u></b></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>${eventDescription}</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Login to our website and get exiting discounts on each event.</p><a href='www.thefitsocials.com' target='_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'>For further queries you can contact our team.</p> <br>Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b> <br><b><i>The Fit Socials Team</i></b> <br><a href='mailto:Thefitsocials@gmail.com' target='_blank'>Thefitsocials@gmail.com</a> <br></p></div></div>`;
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static couponMaxOut(couponTitle, eventTitle) {
        return `<p style="line-height: 1.6; font-size: 1.2rem; font-weight: bold;">Hello,</p><p style="line-height: 1.6; font-size: 0.95rem; text-align: justify;">COUPON <b>${couponTitle}</b> has maxed out</p><p style="line-height: 1.6; font-size: 0.95rem; text-align: justify;">This email is to inform you that a coupon, for the event <u>${eventTitle}</u> has reached the maximum usage limit. As a result, this coupon will be made hidden from public access.</p><p style="line-height: 1.6; font-size: 0.95rem; text-align: justify;">If you wish to re-activate this coupon, proceed to its settings and increase the maximum usage count.</p><p style="line-height: 1.6; font-size: 0.95rem; text-align: justify;">For further queries, you can contact our team.</p><p><br /> Contact:<span style="color: #000; font-size: 14px; font-weight: 500;">+91 789 289 1430</span></p><p style="line-height: 1.6; font-size: 0.95rem;"><strong>Thank you,</strong><br /><strong><em>The Fit Socials Team</em></strong><br /><a href="mailto:Thefitsocials@gmail.com" target="_blank" rel="noopener">Thefitsocials@gmail.com</a></p><div style="width: 100%; display: block; align-items: center; justify-content: center; margin-top: 10px;"><div style="text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4; padding: 20px;"><p style="color: silver; font-size: 0.5rem;"><span style="font-weight: 600; font-size: 0.7rem;">This is an automatically generated email.</span><br />Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.<br />Contact number: +91 789 289 1430 <br />This email was sent to you because you created an account with The Fit Socials.</p></div></div>`;
    }

    static eventExpirationNotification(name, event_name, expiry_date) {
        let response = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi, <span style='color:#000;font-size: 14px;font-weight: 700;font-style: italic; text-transform: capitalize'>" + name + "</span></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Your Subscription for the event " + event_name + "will expire on " + expiry_date + ".</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please Upgrade your subscription to continue the sessions.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Login to our website and get exiting discounts on each event.</p><a href = 'www.thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><p style='line-height: 1.6;font-size: 0.95rem; text-align: justify; color: #032aff;'> For further queries you can contact our team. </p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span></p><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div>";
        response += "<div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
        return response;
    }

    static adminEODReportingTemplate(dateTime, expiringEventsCount, expringRegistrationCount, newSignupCount, todaysPayments) {
        let response = `<h3>EOD Report</h3><p style="line-height:1.6;font-size:1rem;font-weight:700">Generated on <span style="color:#000;font-size:14px;font-weight:700;font-style:italic;text-transform:capitalize">${dateTime}</span></p><div style="background-color:#f4f4f4;padding:20px;border-radius:5px"><div style="line-height:1.6;font-size:.95rem;text-align:justify;border-bottom: solid silver 1px; margin-bottom: 5px; padding-bottom: 5px;"><span style="font-weight:600;color:#0b4a89">New Users :</span> &nbsp; <span>${newSignupCount}</span></div><div style="line-height:1.6;font-size:.95rem;text-align:justify;border-bottom: solid silver 1px; margin-bottom: 5px; padding-bottom: 5px;"><span style="font-weight:600;color:#0b4a89">Todays Credits :</span> &nbsp; <span>${todaysPayments}</span></div><div style="line-height:1.6;font-size:.95rem;text-align:justify;border-bottom: solid silver 1px; margin-bottom: 5px; padding-bottom: 5px;"><span style="font-weight:600;color:#0b4a89">Events expiring tomorrow :</span> &nbsp; <span>${expiringEventsCount}</span></div><div style="line-height:1.6;font-size:.95rem;text-align:justify;border-bottom: solid silver 1px; margin-bottom: 5px; padding-bottom: 5px;"><span style="font-weight:600;color:#0b4a89">Subscriptions expiring tomorrow :</span>&nbsp; <span>${expringRegistrationCount}</span></div></div>`;
        response += `<p style="color: grey;font-size: 0.7rem;"> This daily snapshot is sent by our automated engines </p>`;
        response += EmailUtils.emailFooter;
        return response;
    }

    static trainerEventExpireTemplate() {
        let response = `<h3>Your Event is about to expire tomorrow</h3></p><div style="background-color:#f4f4f4;padding:20px;border-radius:5px"><div style="line-height:1.6;font-size:.95rem;text-align:justify; margin-bottom: 5px; padding-bottom: 5px;"><p>This is an automated notification to inform you that, an event under your Mentorship, is about to <em>expire tomorrow.</em></p><p>We would request you to take appropriate action as soon as possible.</p><p> <b>NOTE:</b><ul><li> All expired events will be <em>de-listed</em> from our website and no user can have access to such events.</li><li> In the Trainer Dashboard, you can appeal for re-activating the expired events, <em>subjected to the Administrator's approval</em>.</li></ul></p></div></div>`;
        response += EmailUtils.emailFooter;
        return response;
    }

    static clientRegistrationExpiryNotification() {
        let response = `<h3>Your Subscription is about end tomorrow</h3></p><div style="background-color:#f4f4f4;padding:20px;border-radius:5px"><div style="line-height:1.6;font-size:.95rem;text-align:justify; margin-bottom: 5px; padding-bottom: 5px;"><p>This is an automated notification to inform you that, your event subscriptiont with Fit Socials, is about to <em>expire tomorrow.</em></p><p>You can re-purchars the subscription to continue the sessions.</p><p>You can also browse through our events section for more options,<p> remember to invite your friends and famil to join you and have a better training exprience</p><p> <b>NOTE:</b><ul><li> Once your subscription time ends, you will have no access to the event related updates</li></ul></p></div></div>`;
        response += EmailUtils.emailFooter;
        return response;
    }

    static invalidReferralCode(referralCode) {
        let response = `<h3>Invalid Referral Code</h3></p><div style="background-color:#f4f4f4;padding:20px;border-radius:5px"><div style="line-height:1.6;font-size:.95rem;text-align:justify; margin-bottom: 5px; padding-bottom: 5px;"><p>The referral code "${referralCode}" that was used by you seems invalid!</p></div></div>`;
        response += EmailUtils.emailFooter;
        return response;
    }

    /**
     * @param {*} referringUser  Name of the user who is inviting
     * @param {*} referredUser Name of the user, who was invited
     * @param {*} points Points got by the user for inviting
     */
    static referralSuccess(referringUser, referredUser, points) {
        let response = `<h3>A new member just used your referral</h3><div style=background-color:#f4f4f4;padding:20px;border-radius:5px><div style=line-height:1.6;font-size:.95rem;text-align:justify;margin-bottom:5px;padding-bottom:5px><strong>Hi <em>${referringUser}</em></strong><p>This new member <em>${referredUser}</em>, has used your referral code, and have registered successfully with us.<p>Your trust and loyalty are well appreciated by our team, as part of our referral program, we are granting you <strong>${points}</strong> reward points...!<p>Be Wise and be Fit!!!</div></div>`;
        response += EmailUtils.emailFooter;
        return response;
    }


    // Payment Success Mail
    static paymentSuccessMail(invoiceNumber, userName, userEmail, userMobileNumber, orderId, paymentId, eventName, eventDescription, eventAmount, coupon, tax, totalPayment, couponPercent, couponAmount, taxAmount) {
        let response = `<table class="x_table" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"
        style="line-height:20px; color:#58666E; width:100%; background-color:#fafafa">
        <tbody style="line-height:20px; color:#58666E">
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%; background-color:rgb(35,113,236); color:#ffffff">
                </td>
                <td colspan="2"
                    style="line-height:20px; padding-bottom:0; width:92%; background-color:rgb(35,113,236); color:#ffffff; padding:24px 0!important; border-left:0; border-right:0">
                    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"
                        style="line-height:20px; color:#212121; width:100%">
                        <tbody style="line-height:20px; color:#212121">
                            <tr style="line-height:20px; color:#212121">
                                <td class="x_text-center" style="line-height:20px; color:#212121; text-align:center">
                                    <div style="line-height:20px; color:#212121"></div>
                                </td>
                            </tr>
                            <tr style="line-height:20px; color:#212121">
                                <td class="x_text-center" style="line-height:20px; color:#212121; text-align:center">
                                    <h2 style="margin:0; font-size:20px; line-height:24px; color:#ffffff">The Fit Scoials
                                        Payment </h2>
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </td>
                <td class="x_last"
                    style="line-height:20px; padding:24px 4%; padding-bottom:0; border-right:1px solid #f2f2f2; width:3%; background-color:rgb(35,113,236); color:#ffffff">
                </td>
            </tr>
    
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" class="x_content"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; background-color:#fff; border-left:1px solid #f2f2f2; border-right:1px solid #f2f2f2; width:92%; border-top:1px solid #f2f2f2">
                    <div style="line-height:20px; color:#58666E">
                        <div style="display: flex;align-items: center;justify-content: space-between;">
                            <label
                                style="line-height:20px; font-size:12px; color:#9B9B9B; font-weight:bold; text-transform:uppercase">Invoice
                                No : ${invoiceNumber}
                            </label>
                        </div>
    
                        <div style="line-height:20px; color:#58666E; white-space:pre-wrap; word-wrap:break-word"></div>
                    </div>
                </td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-right:1px solid #f2f2f2; width:3%">
                </td>
            </tr>
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" class="x_content"
                    style="display: flex;align-items: center;justify-content: space-between;line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; background-color:#fff; border-left:1px solid #f2f2f2; border-right:1px solid #f2f2f2; width:92%; border-top:1px solid #f2f2f2">
                    <div style="line-height:20px; color:#58666E">
                        <label
                            style="line-height:20px; font-size:12px; color:#9B9B9B; font-weight:bold; text-transform:uppercase">PAYMENT
                            From</label>
                        <div>
                            <div>Name &nbsp;&nbsp;&nbsp;  : ${userName}</div>
                            <div>Email &nbsp;&nbsp;&nbsp; : ${userEmail}</div>
                            <div>Mobile &nbsp;&nbsp;: ${userMobileNumber}</div>
                        </div>
    
                        <div style="line-height:20px; color:#58666E; white-space:pre-wrap; word-wrap:break-word"></div>
                    </div>
                    <div style="line-height:20px; color:#58666E">
                        <label
                            style="line-height:20px; font-size:12px; color:#9B9B9B; font-weight:bold; text-transform:uppercase">
                            Order Details
                            </label>
                        <div>
                            <div>Order ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${orderId}</div>
                            <div>Payment ID &nbsp;&nbsp;: ${paymentId}</div>
                        </div>
    
                        <div style="line-height:20px; color:#58666E; white-space:pre-wrap; word-wrap:break-word"></div>
                    </div>
                </td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding-bottom:0; border-right:1px solid #f2f2f2;">
                </td>
            </tr>
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" class="x_content"
                    style="line-height:20px; color:#58666E; padding:24px 4%; background-color:#fff; border-left:1px solid #f2f2f2; border-right:1px solid #f2f2f2; width:92%">
                    <div style="line-height:20px; color:#58666E">
                        <table border="1" cellpadding="10" cellspacing="0" height="100%" width="100%">
                            <tr>
                                <th>Product Name</th>
                                <th>Product Desription</th>
                                <th>Amount</th>
                            </tr>
                            <tr>
                                <td>${eventName}</td>
                                <td style="max-width:100px !important;">${eventDescription}</td>
                                <td>Rs. + ${eventAmount}/-</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: right;">Coupon Applied ${coupon} - (${couponPercent} % Off)</td>
                                <td>Rs. -${couponAmount} </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: right;">Tax ${tax}%</td>
                                <td>Rs. +${taxAmount} </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="text-align: right;"> <span style="color:silver;font-size:.5rem"> (The total amount will be rounded up to the next higher value)</span>  Total Payable</td>
                                <td>Rs. ${totalPayment}/-</td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding:0 4%; border-right:1px solid #f2f2f2; width:3%"></td>
            </tr>
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" class="x_content x_footer"
                    style="line-height:20px; color:#58666E; border-bottom:1px solid #f2f2f2; border-top:1px dashed #e5e5e5; padding:24px 4%; padding-bottom:0; background-color:#fff; border-left:1px solid #f2f2f2; border-right:1px solid #f2f2f2; width:92%; padding-left:0; padding-right:0; padding-top:0">
                    <table class="x_table" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"
                        style="line-height:20px; color:#58666E; width:100%; background-color:#fafafa">
                        <tbody style="line-height:20px; color:#58666E">
                            <tr style="line-height:20px; color:#58666E">
                                <td style="text-align:right;line-height:20px; color:#58666E; padding:24px 4%; background-color:#fff"><label
                                        style="line-height:20px; font-size:12px; color:#9B9B9B; font-weight:bold; text-transform:uppercase">AMOUNT
                                        PAID </label>
                                    <div style="line-height:20px; color:#58666E; font-weight:bold; font-size:18px">INR ${totalPayment}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-right:1px solid #f2f2f2; width:3%">
                </td>
            </tr>
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" class="x_text-center"
                    style="line-height:20px; color:#58666E; text-align:center; padding:24px 4%; width:92%; padding-bottom:24px">
                </td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-right:1px solid #f2f2f2; width:3%">
                </td>
            </tr>
         
            <tr style="line-height:20px; color:#58666E">
                <td class="x_first"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-left:1px solid #f2f2f2; width:3%">
                </td>
                <td colspan="2" style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; width:92%"></td>
                <td class="x_last"
                    style="line-height:20px; color:#58666E; padding:24px 4%; padding-bottom:0; border-right:1px solid #f2f2f2; width:3%">
                </td>
            </tr>
        </tbody>
    </table>
    <div style="display:block;align-items:center;justify-content:center;margin-top:10px"><div style="text-align:center;line-height:1rem;border:1px solid #f4f4f4;padding:20px">
    <p style="color:silver;font-size:.5rem"><span style="font-weight:600;font-size:.7rem">This is an automatically generated email.</span><br>
    <span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span>
    <br><span>Contact number: +91 789 289 1430</span><br><span>This email was sent to you because you created an account with The Fit Socials.</span>
    </p></div></div>`;
        return response;
    }

}

module.exports = EmailUtils;