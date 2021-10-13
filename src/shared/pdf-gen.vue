<template>
  <div>
    <p id="ignorePDF">don't print this to pdf</p>
    <div>
      <p>
        <font size="3" color="red">print this to pdf</font>
      </p>
      <table style="width:100%">
        <tr>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Age</th>
        </tr>
        <tr>
          <td>Jill</td>
          <td>Smith</td>
          <td>50</td>
        </tr>
        <tr>
          <td>Eve</td>
          <td>Jackson</td>
          <td>94</td>
        </tr>
      </table>
    </div>
    <button @click="showPDF">Show PDF</button>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import firebase, { storage } from "firebase";
export default {
  name: "pdf-gen",
  data() {
    return {};
  },
  mounted () {
      this.showPDF();
  },
  methods: {
    showPDF() {
      var doc = new jsPDF();
      var elementHandler = {
        "#ignorePDF": function(element, renderer) {
          return true;
        }
      };
      var source = window.document.getElementsByTagName("body")[0];
      doc.fromHTML(source, 15, 15, {
        width: 180,
        elementHandlers: elementHandler
      });
    //   const storageRef = firebase.storage().ref("uploaded-files/testingpdfupload");
    //   console.log(doc);
    //   const storageTask = storageRef.put(doc)
    //   storageTask.on("state_changed",
    //   snapshot => console.log(snapshot),
    //   error => console.log(error)
    //   )
      doc.output("dataurlnewwindow");
    // doc.save("some_file_name.pdf");
    console.log(doc);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
