<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div
      class="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4"
    >
      <AppIcon
        :name="icon"
        size="xl"
        class="text-on-surface-variant"
      />
    </div>
    <h4 class="font-headline text-lg font-bold text-on-background mb-1">
      {{ title }}
    </h4>
    <p
      v-if="description"
      class="text-sm text-on-surface-variant max-w-md"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.actions"
      class="mt-5 flex items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  title: { type: String, default: 'لا توجد بيانات' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'inbox' },
});
</script>
