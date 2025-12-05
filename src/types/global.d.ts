import App from "./App.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    "weather-widget": typeof import("@/App.ce.vue")["default"];
    "w-input": typeof import("@/shared/ui/WInput.ce.vue")["default"];
    "w-button": typeof import("@/shared/ui/WButton.ce.vue")["default"];
  }
}

declare global {
  type DisplayedComponent = "feed" | "settings";

  type IconName = "enter" | "gear" | "trash" | "hamburger";

  type Unit = "metric" | "imperial" | "";

  interface IStoredLocation {
    id: number;
    name: string;
    country: string;
  }

  interface IRequstParams {
    lat?: number;
    lon?: number;
    q?: string;
    id?: number;
    units?: Unit;
  }

  interface IWeatherState {
    coord: {
      lon: number;
      lat: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    base: string;
    main: {
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
    };
    rain?: {
      "1h": number;
    };
    snow?: {
      "1h": number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type: number;
      id: number;
      message: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    id: number;
    name: string;
    cod: number;
  }

  interface IMethods {
    getWeatherState: (
      params: IRequstParams,
      signal?: AbortController["signal"]
    ) => Promise<AxiosResponse<IWeatherState>>;
    getWeatherImg: (code: string) => Promise<AxiosResponse<string>> 
  }
}
