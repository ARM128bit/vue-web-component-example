declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


declare module "*.svg" {
  import Vue, { VueConstructor } from "vue";
  const content: VueConstructor<Vue>;
  export default content;
}

interface ImportMetaEnv {
  readonly VUE_APP_WEATHER_API_URL: string;
  readonly VUE_APP_WEATHER_IMG_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
