<template>
  <section :class="['relative overflow-hidden', rootClass]">
    <div
      v-if="accentRail"
      :class="accentRailClass"
    />
    <header
      v-if="$slots.header || title"
      class="flex items-center justify-between gap-3 px-6 pt-6 pb-4 relative z-10"
    >
      <div>
        <h3
          v-if="title"
          class="font-headline font-bold text-on-background flex items-center gap-2"
          :class="titleSizeClass"
        >
          <AppIcon
            v-if="icon"
            :name="icon"
            size="md"
            class="text-primary"
          />
          {{ title }}
        </h3>
        <p
          v-if="subtitle"
          class="text-sm text-on-surface-variant mt-1"
        >
          {{ subtitle }}
        </p>
        <slot name="header" />
      </div>
      <div
        v-if="$slots.actions"
        class="flex items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </header>
    <div :class="bodyClass">
      <slot />
    </div>
    <footer
      v-if="$slots.footer"
      class="px-6 pb-6 pt-4 border-t border-surface-container-high"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'flat',
    validator: (v) => ['flat', 'elevated', 'ghost', 'inverse'].includes(v),
  },
  accentRail: {
    type: [Boolean, String],
    default: false,
    // true => primary, 'gold' | 'primary' | 'error'
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  titleSize: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
});

const rootClass = computed(() => ({
  'card-flat': props.variant === 'flat',
  'card-elevated': props.variant === 'elevated',
  card: props.variant === 'ghost',
  'card-inverse': props.variant === 'inverse',
}));

const bodyClass = computed(() => [
  'relative z-10',
  {
    'p-6': props.padding === 'md',
    'p-4': props.padding === 'sm',
    'p-8': props.padding === 'lg',
    'p-0': props.padding === 'none',
  },
]);

const accentRailClass = computed(() => {
  const color =
    props.accentRail === 'gold'
      ? 'bg-gold-accent'
      : props.accentRail === 'error'
        ? 'bg-error'
        : 'bg-primary-container';
  return `absolute top-0 right-0 w-1.5 h-full ${color} rounded-r-xl`;
});

const titleSizeClass = computed(
  () => ({ sm: 'text-base', md: 'text-lg', lg: 'text-xl' })[props.titleSize],
);
</script>
