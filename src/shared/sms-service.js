import axios from "axios";
import getConfigVars from "./config-env";

function sendSMS(contact, msg, countryCode) {
  return new Promise(function(resolve, reject) {
    var bodyFormData = new FormData();
    if (countryCode != null && countryCode != undefined) {
      bodyFormData.set("To", countryCode + contact);
    } else {
      bodyFormData.set("To", "+509" + contact);
    }

    bodyFormData.set("Body", msg);

    bodyFormData.set("From", `${getConfigVars().TWILIO_NUM}`);

    axios({
      method: "post",

      url: `${getConfigVars().TWILIO_URL}`,
      data: bodyFormData,
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      headers: {
        authorization: `${getConfigVars().TWILIO_AUTH}`,
      },
    })
      .then(function(response) {
        console.log(response);
        resolve(response);
      })
      .catch(function(response) {
        console.log(response);
        reject(response);
      });
  });
}

export default sendSMS;
