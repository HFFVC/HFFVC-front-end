require("../assets/script/smtp");
import Email from "../assets/script/smtp.js";
import getConfigVars from "./config-env.js";


function sendMail(emailId, content, callback) {
    const emailBody = `
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head></head><body>
    Hello ${content.name}, <br /><br />
Greetings!<br /><br />


We are excited to have you onboard for your journey to <b>"Building Trust”</b> in the Agricultural Value Chain. <br /><br />


Please click <a href="${getConfigVars().APP_URL}broker-invoice/${content.sellId}"> here </a>  to view and download the invoice for your purchase. <br /><br />


You may extend your contribution by filling in a few details in the form <a href="${getConfigVars().APP_URL}buyer-screen/${content.sellId}">here</a> <br /><br />

If you have any problems viewing the details or any other queries, please write to us at  <a href="mailto:haiti_support@agriledger.com"> haiti_support@agriledger.com </a> <br /><br />

Kind regards,<br />
Agriledger UK Ltd.<br />
<img src="${getConfigVars().APP_URL}logo/footer-image.jpg" style="height: 67px; width: 101px" alt="footer image"><br />
<p style="color: gray;">
&copy; 2019 Agriledger UK Ltd.<br />
To find out more about us, you can visit our website here. <br />
Follow us on <a href="https://www.linkedin.com/company/agriledger/">Linkedin</a>, <a href="https://twitter.com/Agriledger"> Twitter</a> or <a href="https://www.facebook.com/agriledger/"> Facebook</a></p><br />
</body></html>
`;
    Email.send({
        //      Host: "smtp.gmail.com",
        //    Username: "divyamandya@gmail.com",
        //Password: "Divya@1108",
        // SecureToken: "496778b9-3672-442a-8f13-27eed1f46a90",
        // To: emailId,
        // From: "agriledger.io@gmail.com",
        // Subject: "Agriledger Credentials",
        // Body: emailBody,
        // SSL: "Enable",
        // Port: "587"
        SecureToken: "b2f2bc37-1c8e-4dbc-9f81-d791602d0618",
        To: emailId,
        Cc:["divya.d@agriledger.com","pramod.ks@sysfore.com"],
      //Cc:["mansi.sanghvi@agriledger.com","genevieve.leveille@agriledger.com","divya.d@agriledger.com"],
        From: "agriledger.io@gmail.com",
        Subject: `AgriLedger: Your Invoice ${content.sellId}`,
        Body: emailBody,
        SSL: "Enable",
        Port: "587"
    }).then(
        message => {
            console.log(message);
            callback(message);
        }
    );
}

export default sendMail;