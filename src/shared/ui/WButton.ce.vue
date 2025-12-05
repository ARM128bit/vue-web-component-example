<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.btn {
  height: 30px;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>