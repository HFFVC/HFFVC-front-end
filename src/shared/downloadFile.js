import Vue from "vue";
import firebase from "firebase";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

function downloadFile(uuid)
{
    const storageRef = firebase.storage();  
storageRef.ref('/profile_images/'+uuid+'.jpg').getDownloadURL().then(function(url,callback) {
  
    if(url != undefined)
    {
       return url;
    }
});
}
export default downloadFile;