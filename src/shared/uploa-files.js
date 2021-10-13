import Vue from "vue";
import firebase from "firebase";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

function uploadFiles(files, selectedStage, id, inpData, currentValue,documentType, callback) {
  
  if (files && selectedStage && id) {
    if (files.length > 1) {
    
      files.forEach(_file => {
        const storageRef = firebase.storage()
          .ref(`uploaded-files/${selectedStage}/${id}/${_file.name}`);
        const uploadTask = storageRef.put(_file);
        uploadTask.on(
          "state_changed",
          snapshot => console.log(snapshot),
          error => console.log(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              
              // if (selectedStage == "Documents" || selectedStage == "Quality Inspection") {
              //   var ref = firebase
              //     .database()
              //     .ref("batch")
              //     .child(currentValue.selectedRow.Id)
              //     .child("invoice");
              //   ref.update(inpData)
              //     .then(() => {
                    callback(url,_file.name,documentType);
              //     })
              // } else {
              //   var dbRef = firebase
              //     .database()
              //     .ref()
              //     .child("serviceRequest");
              //   dbRef
              //     .orderByChild("serviceRequestId")
              //     .equalTo(currentValue.selectedRow.Id)
              //     .on("child_added", function (data) {
              //       var ref = firebase
              //         .database()
              //         .ref("serviceRequest/" + data.key);
              //       ref
              //         .update(inpData)
              //         .then(function () {
              //           callback(url,_file.name,documentType);
              //         })
              //         .catch(function (error) {
              //           currentValue.erroMessage = error.message;
              //           currentValue.seen = false;
              //         });
              //     });
              // }
            });
          }
        );
      });
    } else {


if(files[0] != undefined)
{

  console.log(files[0].name)
      const storageRef = firebase
        .storage()
        .ref(`uploaded-files/${selectedStage}/${id}/${files[0].name}`);
      const uploadTask = storageRef.put(files[0]);
      uploadTask.on(
        "state_changed",
        snapshot => console.log(snapshot),
        error => console.log(error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => callback(url,files[0].name,documentType))
        }
      )
}
else
{

  const storageRef = firebase
  .storage()
  .ref(`uploaded-files/${selectedStage}/${id}/${files.name}`);
const uploadTask = storageRef.put(files);
uploadTask.on(
  "state_changed",
  snapshot => console.log(snapshot),
  error => console.log(error),
  () => {
    uploadTask.snapshot.ref.getDownloadURL().then(url => callback(url,files.name,documentType))
  }
)
}
    }
  }
}
export default uploadFiles;