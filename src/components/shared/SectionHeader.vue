<template>
  <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
    <div>
      <p
        v-if="eyebrow"
        class="text-xs text-on-surface-variant uppercase tracking-wider font-medium mb-1"
      >
        {{ eyebrow }}
      </p>
      <h1
        class="font-headline font-bold text-on-background"
        :class="titleClass"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </h1>
      <p
        v-if="description"
        class="text-on-surface-variant text-sm mt-1"
      >
        {{ description }}
      </p>
    </div>
    <div
      v-if="$slots.actions"
      class="flex items-center gap-2 flex-wrap"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['md', 'lg', 'xl'].includes(v),
  },
});

const titleClass = computed(
  () =>
    ({
      md: 'text-xl',
      lg: 'text-2xl md:text-3xl',
      xl: 'text-3xl md:text-4xl',
    })[props.size],
);
</script>
