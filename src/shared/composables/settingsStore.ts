import { computed, ref, watch } from "vue";
import useLocalStorage from "./localStorage";
import {
  LOCAL_STORAGE_UNIT_KEY,
  LOCAL_STORAGE_LOCATIONS_KEY,
} from "@/shared/constants";

const unit = ref<Unit>("metric");
const locations = ref<IWeatherState[]>([]);

export default function useSettingsStore() {
  const localStorage = useLocalStorage();

  const addLocation = (location: IWeatherState) => {
    // Just unique values
    const newLocations = [
      ...new Map(
        [...locations.value, location].map((item) => [item.id, item])
      ).values(),
    ];
    localStorage.saveValue(LOCAL_STORAGE_LOCATIONS_KEY, newLocations);
  };

  const removeLocation = (
    index: number,
    newLocation: IWeatherState | undefined = undefined
  ) => {
    if (newLocation) {
      locations.value.splice(index, 1, newLocation);
    } else {
      locations.value.splice(index, 1);
    }
    localStorage.saveValue(LOCAL_STORAGE_LOCATIONS_KEY, locations.value);
  };

  const setLocations = (newLocations: IWeatherState[]) => {
    localStorage.saveValue(
      LOCAL_STORAGE_LOCATIONS_KEY,
      (locations.value = newLocations)
    );
  };

  const refreshSettings = () => {
    unit.value = localStorage.getValue(LOCAL_STORAGE_UNIT_KEY) ?? "";
    locations.value = localStorage.getValue(LOCAL_STORAGE_LOCATIONS_KEY) ?? [];
  };

  watch(unit, () => {
    localStorage.saveValue(LOCAL_STORAGE_UNIT_KEY, unit.value);
  });

  return {
    locations: computed(() => locations.value),
    unit,
    addLocation,
    setLocations,
    removeLocation,
    refreshSettings,
  };
}
