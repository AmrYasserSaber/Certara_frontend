<template>
  <div
    class="flex items-center gap-3"
    :class="orientation === 'reverse' ? 'flex-row-reverse' : ''"
  >
    <div
      :class="[
        'rounded-full bg-primary-container text-white flex items-center justify-center font-headline font-bold overflow-hidden border border-outline-variant/30',
        sizeClass,
      ]"
    >
      <img
        v-if="src"
        :key="src"
        :src="src"
        :alt="name"
        class="w-full h-full object-cover"
      >
      <span v-else>{{ initials }}</span>
    </div>
    <div
      v-if="showName"
      class="min-w-0"
    >
      <p class="text-sm font-bold font-headline text-white truncate">
        {{ name || '—' }}
      </p>
      <p
        v-if="subtitle"
        class="text-xs text-gray-300 truncate"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
  },
  showName: { type: Boolean, default: true },
  orientation: { type: String, default: '' },
});

const sizeClass = computed(
  () =>
    ({
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    })[props.size],
);

const initials = computed(() => {
  if (!props.name) return '?';
  const parts = props.name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
});
</script>
