// require("../assets/script/smtp");
// import Email from "../assets/script/smtp.js";
import getConfigVars from "./config-env.js";
import axios from 'axios';
import firebase from 'firebase';

// function sendMail(emailId, content, callback) {
//     const emailBody = `
//     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head></head><body>
//     Hi ${content.firstName}, <br /><br />
// Welcome to your AgriLedger account set up! We are excited to have you onboard for your journey to <b>"Building Trust”</b> in the Agricultural Value Chain. <br /><br />

// Please find your login details below<br />
// <b>User Name: </b> ${emailId} <br />
// <b>Password: </b> ${content.userPassword} <br /><br />

// Please click here <a href="${getConfigVars().APP_URL}"> ${getConfigVars().APP_URL}</a>  to log into your account.<br /><br />

// If you have any problems signing in or any other queries, please write to us at <a href="mailto:haiti_support@agriledger.com"> haiti_support@agriledger.com </a> <br /><br />

// Kind regards,<br />
// Agriledger UK Ltd.<br />
// <br /></body></html>

// `;
// Email.send({
//         //      Host: "smtp.gmail.com",
//         //    Username: "divyamandya@gmail.com",
//         //Password: "Divya@1108",
//         // SecureToken: "496778b9-3672-442a-8f13-27eed1f46a90",
//         // To: emailId,
//         // From: "agriledger.io@gmail.com",
//         // Subject: "Agriledger Credentials",
//         // Body: emailBody,
//         // SSL: "Enable",
//         // Port: "587"
//         SecureToken: "b2f2bc37-1c8e-4dbc-9f81-d791602d0618",
//               To: emailId,

//              Cc:["divya.d@agriledger.com"],
//            //    Cc:["mansi.sanghvi@agriledger.com","genevieve.leveille@agriledger.com","divya.d@agriledger.com"],
//                 From: "haiti_support@hffvc.com",
//                 Subject: "Agriledger Credentials",
//                 Body: emailBody,
//                SSL: "Enable",
//               Port:"587"
//     }).then(
//         message => {
//             console.log(message);
//             callback(message);
//         }
//     );
// }

function sendMail(emailId, userFullName, password) {
  const vm = this;
  return new Promise((resolve, reject) => {
    let data = {
      emailId,
      userFullName,
      password,
    };
    axios
      .post(
        `${
            getConfigVars().BASE_URL
          }50007/api/v1.0/send-user-creation-email`,
        data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken,
          },
        }
      )
      .then((sent) => {
        console.log(sent);
        resolve(sent);
      })
      .catch(function (error) {
        let errorObject = JSON.parse(JSON.stringify(error));
        if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
          firebase
            .auth()
            .currentUser.getIdToken(true)
            .then((idtoken) => {
              localStorage.IDtoken = "";
              localStorage.IDtoken = idtoken;

              sendMail(emailId, userFullName, password)
                .then((resolvedData) => resolve(resolvedData))
                .catch((error) => reject(error));
            });
        } else {
          reject(error);
        }
      });
  });
}
export default sendMail;