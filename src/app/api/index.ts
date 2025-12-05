import axios, { AxiosResponse } from "axios";
import { App } from "vue";

export default {
  install(app: App) {
    const api = axios.create({
      baseURL: process.env.VUE_APP_WEATHER_API_URL,
    });

    api.interceptors.request.use((config) => {
      const api_key = process.env.VUE_APP_WEATHER_API_KEY;
      if (!config.params) config.params = {};
      config.params.appid = api_key;
      return config;
    });

    const imgAPI = axios.create({
      baseURL: process.env.VUE_APP_WEATHER_IMG_API_URL,
    });

    const methods: IMethods = {
      async getWeatherState(
        params: IRequstParams,
        signal?: AbortController["signal"]
      ): Promise<AxiosResponse<IWeatherState>> {
        return await api.get("weather", {
          params,
          signal,
        });
      },
      async getWeatherImg(code: string) {
        return await imgAPI.get(`${code}@2x.png`, { responseType: "blob" });
      },
    };

    app.config.globalProperties.$api = methods;
    app.provide("api", methods);
  },
};
