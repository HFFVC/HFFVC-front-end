<template>
  <div>
    <span>QRCode stream</span>
    <p class="error">{{ error }}</p>
    <p>
      Last result:
      <b>{{ result }}</b>
    </p>
    <div style="width: 300px; height: 200px; border: 2px solid red">
      <qrcode-stream @decode="onDecode" @init="onInit">{{ result }}</qrcode-stream>
    </div>

    <span>QR code dropzone</span>
    <div style="width: 300px; height: 200px; border: 2px solid red">
      <qrcode-drop-zone @detect="onDetect" @dragover="onDragOver" @init="logErrors">
        <div class="drop-area" :class="{ 'dragover': dragover }">DROP SOME IMAGES HERE</div>
      </qrcode-drop-zone>
    </div>
    <br />
    <br />
    <span>Qr code capture</span>
    <div style="width: 300px; height: 200px; border: 2px solid red">
      <qrcode-capture @decode="onDecode" />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(VueQrcodeReader);
export default {
  data() {
    return {
      error: null,
      result: null,
      dragover: false
    };
  },
  methods: {
    onDecode(result) {
      this.result = result;
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
    async onDetect(promise) {
      try {
        const { content } = await promise;

        this.result = content;
        this.error = null;
      } catch (error) {
        if (error.name === "DropImageFetchError") {
          this.error = "Sorry, you can't load cross-origin images :/";
        } else if (error.name === "DropImageDecodeError") {
          this.error = "Ok, that's not an image. That can't be decoded.";
        } else {
          this.error = "Ups, what kind of error is this?! " + error.message;
        }
      }
    },

    logErrors(promise) {
      promise.catch(console.error);
    },

    onDragOver(isDraggingOver) {
      this.dragover = isDraggingOver;
    }
  }
};
</script>

<style scoped>
@import "@import '~vue-qrcode-reader/dist/vue-qrcode-reader.css";
.drop-area {
  height: 200px;
  color: greenyellow;
  text-align: center;
  font-weight: bold;
  padding: 10px;

  background-color: rgba(0, 0, 0, 0.5);
}

.dragover {
  background-color: rgba(0, 0, 0, 0.6);
}

.drop-error {
  color: red;
  font-weight: bold;
}
.overlay {
  height: 200px;
  width: 200px;
  border: 2px solid red;
  text-align: center;
  font-weight: bold;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
