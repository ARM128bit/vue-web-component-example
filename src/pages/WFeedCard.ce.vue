<template>
  <div class="weather-card">
    <h3 class="weather-card__name">{{ data.name }}, {{ data.sys.country }}</h3>
    <loading-icon v-if="loading" class="weather-card__loading" />
    <div class="weather-card__img"><img :src="imageSrc" /></div>
    <h1 class="weather-card__temp">
      {{ data.main.temp.toFixed(0) }} {{ unitSymbol }}
    </h1>
    <div class="weather-card__description">
      <span>
        Feels like {{ data.main.feels_like.toFixed(0) }} {{ unitSymbol }},
        {{ data.weather[0].description }}
      </span>
    </div>
    <div class="weather-card__wind">
      <direction-icon class="weather-card__wind-pic" :style="{ transform: `rotate(${data.wind.deg}deg)` }" />
      <span>{{ data.wind.speed.toString().padEnd(1, "0") }} m/s </span>
    </div>
    <div class="weather-card__hpa">
      <vertical-scale class="weather-card__hpa-pic" />
      <span> {{ data.main.pressure }} hPa </span>
    </div>
    <div class="weather-card__humidity">
      <humidity-icon class="" /><span>{{ data.main.humidity }} %</span>
    </div>
    <div class="weather-card__visibility">
      <binocular-icon />
      <span>
        Visibility:
        {{ (data.visibility / 1000).toFixed(1) }}
        km
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onUnmounted, ref, watch } from "vue";
import HumidityIcon from "@/shared/assets/icons/humidity.vue";
import DirectionIcon from "@/shared/assets/icons/direction.vue";
import VerticalScale from "@/shared/assets/icons/vertical-scale.vue";
import LoadingIcon from "@/shared/assets/icons/loading.vue";
import BinocularIcon from "@/shared/assets/icons/binocular.vue";
import useSettingsStore from "@/shared/composables/settingsStore";

const props = defineProps<{
  index: number;
  location: IWeatherState;
  unit?: Unit;
  unitSymbol: string;
}>();

const api = inject("api") as IMethods;

const settingsStore = useSettingsStore();

const data = ref<IWeatherState>(props.location);
const imageSrc = ref<string | undefined>();
const loading = ref<boolean>(false);
let abortController: AbortController | undefined;

const loadWeatherState = async () => {
  loading.value = true;
  try {
    abortController = new AbortController();
    const res = await api.getWeatherState(
      { id: props.location.id, units: props.unit },
      abortController.signal
    );
    data.value = res.data;
    settingsStore.removeLocation(props.index, data.value);
  } catch (e) {
    console.error(e);
  }
  abortController = undefined;
  loading.value = false;
};

const loadWeatherImage = async () => {
  const res = await api.getWeatherImg(data.value?.weather[0].icon);
  imageSrc.value = URL.createObjectURL(res.data);
};

watch(
  () => props.location,
  (val, prevVal) => {
    if (!val?.id || val.id === prevVal?.id) return;
    loadWeatherState();
  },
  { immediate: true }
);

watch(
  data,
  (val) => {
    if (!val) return;
    loadWeatherImage();
  },
  { immediate: true }
);

onUnmounted(() => {
  abortController?.abort();
});
</script>

<style lang="scss">
.weather-card {
  position: relative;
  min-height: 285px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 40px;

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__temp {
    align-self: center;
  }

  &__name {
    width: calc(100% - 30px);
    font-size: 16px;
    font-weight: 600;
    grid-column: 1 / 3;
  }

  &__description {
    grid-column: 1 / 3;
    font-weight: 300;
  }

  &__img {
    justify-self: end;
  }

  &__wind {
    height: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__wind-pic {
    width: 24px;
    height: 24px;
  }

  &__hpa {
    height: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__hpa-pic {
    height: 24px;
    width: 24px;
  }

  &__humidity {
    height: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__visibility {
    height: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
