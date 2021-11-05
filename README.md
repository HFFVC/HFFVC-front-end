# HFFVC front-end

## Overview
The repository consists of the front-end component of the HFFVC solution. This application provides means of gathering, processing, and selling of the fruits along with providing end to end tracability.

The application has screens for:

## Harvest Planner
The harvest planner has the following set of functionalities:
>- Create and manage service requests.
>- View the lsit of registered producers.

## Packhouse Incharge
The packhouse incharge has the following set of functionalities:
>- Scheduling, and assigging of collectors to pickup the service requets.
>- Processing of the lots which are at the packhouse.
>- Creating and shipping of lots to the broker

## Collector
The collector's job is to:
>- Collect and validate the collected fruits.

## Broker
The broker has the following functionalities:
>- Receive and validate the incoming lots.
>- Maintain and sell the lots.
>- Generate invoices and collect payments.

## MCI / SPOC
These people are responsible for adding and maintaining of the users in the system. 

# Follow these steps for installation and usage instructions.
This application requires requires [Node.js](https://nodejs.org/) v10+ installed.
* clone the respository.
* Navigate to cloned repo from the terminal.
* Install the project dependencies using the command:

> npm install


Once the installation is complete, open the project in the IDE of your choice.
Open the file `/src/shared/config_vars.js` to set the application constants.

Below is the list of constants that needs to be updated along with a brief description.


| Constant Name | Description |
| ------ | ------ |
| firebaseConfig | Configuration of your Firebase project. For more refer [Google Firebase ](https://firebase.google.com/)|
|BASE_URL|URL where the backend APIs are hosted. Example https://my-app.com/ |
|TWILIO_URL|URL of your Twilio account. For more refer [Twilio SendGrid](https://sendgrid.com)|
|TWILIO_AUTH|Your [Twilio SendGrid](https://sendgrid.com) auth key. |
|TWILIO_NUM|[Twilio SendGrid](https://sendgrid.com) number.|
|APP_URL|Your domain address. Example: https://my-app.com/ |
|USERID|Super Admin email id.|
|PASSWORD|Super Admin password|
|PUBLICUSERNAME|Public user email id.|
|PUBLICUSERPASSWORD|Public user password.|
|GOOGLEMAPKEY|Your [Google Maps](https://developers.google.com/maps/documentation/javascript/get-api-key) API Key.|


Go to your [Google Firebase Console](console.firebase.com) and in your firebase project, go to **Authentication** section and **Add** two users. One for Super Admin and for general public.

**To start the application use the command:**
> npm run serve


The application can be loaded using the below URL 
```http://localhost:8080/```
