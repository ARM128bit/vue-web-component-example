<template>
  <div class="app-weather">
    <loading-icon v-if="loading" class="app-weather__loading" />
    <div v-if="deniedPosition && currentComponent === 'feed'" class="app-weather__denied-position">
      <p>
        You should allow geoposition at address bar or go to settings and add
        what you want
      </p>
      <w-button class="app-weather__allow-position-btn" @click="handlePermission">
        Allow geoposition
      </w-button>
    </div>
    <w-button v-if="currentComponent !== 'settings'" class="app-weather__settings-btn" @click="openSettings">
      <gear-btn />
    </w-button>
    <w-button v-if="currentComponent !== 'feed'" class="app-weather__feed-btn" icon="close"
      @click="currentComponent = 'feed'">
      <close-btn />
    </w-button>
    <component :key="currentComponent" :is="componentRendering[currentComponent]" />
  </div>
</template>

<script setup lang="ts">
import { inject, onUnmounted, ref, watch } from "vue";
import WeatherFeed from "@/pages/WeatherFeed.ce.vue";
import WeatherSettings from "@/pages/WeatherSettings.ce.vue";
import useSettingsStore from "@/shared/composables/settingsStore";
import GearBtn from "@/shared/assets/icons/gear.vue";
import CloseBtn from "@/shared/assets/icons/close.vue";
import LoadingIcon from "@/shared/assets/icons/loading.vue";

const settingsStore = useSettingsStore();

const loading = ref<boolean>(false);
const deniedPosition = ref<boolean>(false);
let abortController: AbortController | undefined;

const currentComponent = ref<DisplayedComponent>("feed");
const componentRendering = {
  feed: WeatherFeed,
  settings: WeatherSettings,
};

// Inject api methods
const api = inject("api") as IMethods;

const openSettings = () => {
  currentComponent.value = "settings";
};

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (
      (result.state === "granted" || result.state === "prompt") &&
      settingsStore.locations.value.length === 0
    ) {
      deniedPosition.value = false;
      loading.value = true;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            abortController = new AbortController();
            const res = await api.getWeatherState(
              {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                units: settingsStore.unit.value,
              },
              abortController.signal
            );
            settingsStore.addLocation(res.data);
            settingsStore.refreshSettings();
          } catch (e: unknown) {
            console.log(e);
          }
          abortController = undefined;
          loading.value = false;
        },
        (e: GeolocationPositionError) => {
          deniedPosition.value = true;
          loading.value = false;
        }
      );
    }
    if (result.state === "denied") {
      deniedPosition.value = true;
    }
  });
}

watch(
  currentComponent,
  () => {
    settingsStore.refreshSettings();
    handlePermission();
  },
  { immediate: true }
);

onUnmounted(() => {
  abortController?.abort();
});
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.app-weather {
  position: relative;
  width: 100%;
  min-height: 285px;

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__denied-position {
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__allow-position-btn {
    background-color: #007bff;
    border-radius: 0;
    padding: 5px 10px;
    color: #fff;
  }

  &__settings-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }

  &__feed-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }
}
</style>
