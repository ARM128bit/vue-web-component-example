import { defineCustomElement } from "vue";
import App from "@/App.ce.vue";

import WInput from "@/shared/ui/WInput.ce.vue";
import WButton from "@/shared/ui/WButton.ce.vue";

import apiPlugin from "./app/api";

const app = defineCustomElement(App, {
  configureApp(app) {
    app.use(apiPlugin);
    app.component("w-input", WInput);
    app.component("w-button", WButton);
  },
});

customElements.define("weather-widget", app);
