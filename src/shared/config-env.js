import configVars from "./config_vars";

function getConfigVars() {
    var config = {
        APP_URL: configVars.APP_URL,
        BASE_URL: configVars.BASE_URL,
        FIREBASE_CONFIG: configVars.firebaseConfig,
        TWILIO_AUTH: configVars.TWILIO_AUTH,
        TWILIO_NUM: configVars.TWILIO_NUM,
        TWILIO_URL: configVars.TWILIO_URL,
        USERID: configVars.USERID,
        PASSWORD: configVars.PASSWORD,
        PUBLICUSERNAME: configVars.PUBLICUSERNAME,
        PUBLICUSERPASSWORD: configVars.PUBLICUSERPASSWORD,
        GOOGLEMAPKEY: configVars.GOOGLEMAPKEY
    }
    return config;
}

export default getConfigVars;