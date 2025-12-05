<template>
  <w-feed-card
    v-for="(location, index) in settingsStore.locations.value"
    :key="location.id"
    :index="index"
    :location="location"
    :unit="settingsStore.unit.value"
    :unit-symbol="unitSymbol"
  />
</template>

<script setup lang="ts">
import useSettingsStore from "@/shared/composables/settingsStore";
import WFeedCard from "@/pages/WFeedCard.ce.vue";
import { computed } from "vue";

const settingsStore = useSettingsStore();

const unitSymbol = computed(() => {
  if (settingsStore.unit.value === "metric") return "°C";
  if (settingsStore.unit.value === "imperial") return "°F";
  return "K";
});
</script>

<style scoped></style>
