import firebase from 'firebase'
var data = [];
    var ref = firebase.database().ref().child("ServiceRequests");

ref.on("value", function(snapshot) {
  console.log(snapshot.val());
   snapshot.forEach(requestData => {
     var status = "";
if(requestData.val().Status == "New")
{
status = "Pending Assign";
}
data.push({
   "RequestedON":requestData.val().RequestedOn,
    "Producer":requestData.val().Producer,
     "Location":requestData.val().Location,
      "Product":requestData.val().Product,
      "EstimatedNoFruits":requestData.val().EstimatedNoFruits,
      "Status":status,
      "EditIcon":""
});

   });
}, function (error) {
   console.log("Error: " + error.code);
});
export default data;