const env_mode = "TEST"; // DEV STAGING PROD STAGING = DEV

const configVars = {
    TEST: {
        firebaseConfig: {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""

        },
        BASE_URL: "",
        TWILIO_URL: "",
        TWILIO_AUTH: "",
        TWILIO_NUM: "",
        APP_URL: "",
        USERID: "",
        PASSWORD: "",
        PUBLICUSERNAME: "",
        PUBLICUSERPASSWORD: "",
        GOOGLEMAPKEY: ""
    }
}


export default configVars[env_mode];