<template>
  <div class="weather-settings">
    <h1 class="weather-settings__header">Settings</h1>
    <div class="weather-settings__unit">
      <label for="unit-metric">
        <input v-model="settingsStore.unit.value" id="unit-metric" value="metric" type="radio" />
        Celsius
      </label>
      <label for="unit-imperial">
        <input v-model="settingsStore.unit.value" id="unit-imperial" value="imperial" type="radio" />
        Fahrenheit
      </label>
      <label for="unit-kelvin">
        <input v-model="settingsStore.unit.value" id="unit-kelvin" value="" type="radio" />
        Kelvin
      </label>
    </div>
    <div class="weather-settings__locations">
      <ul>
        <li v-for="(location, index) in settingsStore.locations.value" :key="index" class="weather-settings__location"
          :class="{
            'weather-settings__location--dragging': index === dragIndex,
          }" :draggable="settingsStore.locations.value.length > 1" @dragstart="onDragLocationStart($event, index)"
          @dragover="onDragLocationOver($event, index)" @dragend="onDragLocationEnd">
          <w-button class="weather-settings__hamburger" @mousedown="onMouseDownIcon">
            <hamburger-icon />
          </w-button>
          <span>{{ location.name }}, {{ location.sys.country }}</span>
          <w-button @click="() => onDeleteLocation(index)">
            <trash-icon />
          </w-button>
        </li>
      </ul>
    </div>
    <div class="weather-settings__location-adding">
      <w-input v-model="location" label="Add location" placeholder="Input new location" @keyup.enter="onAddLocation" />
      <w-button icon="enter" @click="onAddLocation">
        <enter-icon />
      </w-button>
    </div>

    <span v-if="error" class="weather-settings__location-adding-error">{{
      error
      }}</span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import { AxiosError } from "axios";
import useSettingsStore from "@/shared/composables/settingsStore";
import EnterIcon from "@/shared/assets/icons/enter.vue";
import TrashIcon from "@/shared/assets/icons/trash.vue";
import HamburgerIcon from "@/shared/assets/icons/hamburger.vue";

const api = inject("api") as IMethods;

const location = ref<string>("");
const error = ref<string>("");
const settingsStore = useSettingsStore();

const dragAllowed = ref(false);
const dragIndex = ref<number | undefined>();

const onMouseDownIcon = () => {
  dragAllowed.value = true;
};

const onDragLocationStart = (event: Event, idx: number) => {
  if (!dragAllowed.value) {
    event.preventDefault();
    return;
  }
  dragIndex.value = idx;
};

const onDragLocationOver = (event: Event, idx: number) => {
  event.preventDefault();

  if (dragIndex.value === undefined || dragIndex.value === idx) return;

  const arr = [...settingsStore.locations.value];
  const dragged = arr.splice(dragIndex.value, 1)[0];
  arr.splice(idx, 0, dragged);

  dragIndex.value = idx;
  settingsStore.setLocations(arr);
  settingsStore.refreshSettings();
};

const onDragLocationEnd = () => {
  dragIndex.value = undefined;
  dragAllowed.value = false;
};

const onAddLocation = async () => {
  error.value = "";
  if (!location.value) return;
  if (
    settingsStore.locations.value?.length > 0 &&
    settingsStore.locations.value.some((item) => item.name === location.value)
  ) {
    error.value =
      "Location is added right now. You can try to add some country by comma, for example 'Moscow, us'";
    return;
  }
  try {
    const res = await api.getWeatherState({ q: location.value });
    settingsStore.addLocation(res.data);
    settingsStore.refreshSettings();
    location.value = "";
  } catch (e: unknown) {
    console.dir(e);
    if (e instanceof AxiosError) {
      if (e.response?.data.message) {
        error.value = e.response.data.message;
      }
    }
  }
};

const onDeleteLocation = (index: number) => {
  settingsStore.removeLocation(index);
  settingsStore.refreshSettings();
};
</script>

<style lang="scss">
.weather-settings {
  &__unit {
    display: grid;
    width: fit-content;
    grid-template-columns: auto auto auto;
    gap: 10px;
  }

  &__locations {
    width: 100%;
  }

  &__location {
    min-height: 40px;
    margin: 10px 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: center;
    background-color: #edebe9;
    transition: transform 0.18s ease, background 0.18s ease;
  }

  &__location--dragging {
    opacity: 0.3;
    transform: scale(1.02);
  }

  &__location-adding {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 50px;
    height: 50px;
    align-items: end;
  }

  &__location-adding-error {
    color: red;
    font-size: 12px;
  }

  &__hamburger {
    height: 32px;
    cursor: grab;
  }
}
</style>
