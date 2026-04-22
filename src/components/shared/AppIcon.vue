<template>
  <span
    :class="['material-symbols-outlined', filled ? 'filled' : '', sizeClass]"
    :style="variationStyle"
    :aria-hidden="ariaHidden"
  >{{ name }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  filled: { type: Boolean, default: false },
  weight: { type: [String, Number], default: 400 },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(v),
  },
  ariaHidden: { type: Boolean, default: true },
});

const sizeClass = computed(
  () =>
    ({
      xs: 'text-[14px]',
      sm: 'text-[18px]',
      md: 'text-[20px]',
      lg: 'text-[24px]',
      xl: 'text-[32px]',
      '2xl': 'text-[48px]',
    })[props.size],
);

const variationStyle = computed(
  () => `font-variation-settings: 'FILL' ${props.filled ? 1 : 0}, 'wght' ${props.weight};`,
);
</script>
