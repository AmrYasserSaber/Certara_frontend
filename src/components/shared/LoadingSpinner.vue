<template>
  <div class="inline-flex items-center gap-2 text-on-surface-variant">
    <AppIcon
      name="progress_activity"
      :size="size"
      class="animate-spin text-primary"
    />
    <span
      v-if="label"
      class="text-sm"
    >{{ label }}</span>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  size: { type: String, default: 'md' },
  label: { type: String, default: '' },
});
</script>
