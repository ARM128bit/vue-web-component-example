<template>
  <label class="field">
    <span>{{ label }}</span>
    <input :value="modelValue" class="field__input" type="text" name="location" :placeholder="placeholder" @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      " />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  placeholder?: string;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style lang="scss">
.field {
  display: grid;
  width: 100%;

  &__input {
    height: 30px;
  }
}
</style>
