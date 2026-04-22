<template>
  <article class="card relative overflow-hidden group p-6 transition-all hover:shadow-ambient">
    <div
      class="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-80"
      :class="blobClass"
    />
    <div class="relative z-10 flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-wide text-on-surface-variant font-medium mb-1">
          {{ label }}
        </p>
        <p class="text-3xl font-bold font-headline text-on-background font-mono">
          {{ value }}
        </p>
        <p
          v-if="trend"
          :class="trendClass"
          class="text-xs mt-2 flex items-center gap-1"
        >
          <AppIcon
            :name="trendIcon"
            size="xs"
          />
          <span class="font-mono">{{ trend }}</span>
          <span
            v-if="trendLabel"
            class="text-on-surface-variant"
          >{{ trendLabel }}</span>
        </p>
      </div>
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
        :class="iconBgClass"
      >
        <AppIcon
          :name="icon"
          :filled="true"
          size="lg"
          :class="iconClass"
        />
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'bar_chart' },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'info', 'success', 'warning', 'error'].includes(v),
  },
  trend: { type: String, default: '' },
  trendLabel: { type: String, default: '' },
  trendDirection: {
    type: String,
    default: 'up',
    validator: (v) => ['up', 'down', 'flat'].includes(v),
  },
});

const blobClass = computed(
  () =>
    ({
      primary: 'bg-primary/10',
      secondary: 'bg-secondary-container/25',
      info: 'bg-tertiary-fixed/30',
      success: 'bg-primary-fixed/30',
      warning: 'bg-secondary-container/25',
      error: 'bg-error-container/40',
    })[props.variant],
);

const iconBgClass = computed(
  () =>
    ({
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary-container/20 text-on-secondary-container',
      info: 'bg-tertiary-fixed text-on-tertiary-fixed',
      success: 'bg-primary-fixed text-on-primary-fixed',
      warning: 'bg-secondary-container/30 text-on-secondary-container',
      error: 'bg-error-container text-on-error-container',
    })[props.variant],
);

const iconClass = computed(() => '');

const trendIcon = computed(
  () => ({ up: 'trending_up', down: 'trending_down', flat: 'trending_flat' })[props.trendDirection],
);

const trendClass = computed(
  () =>
    ({
      up: 'text-primary-container',
      down: 'text-error',
      flat: 'text-on-surface-variant',
    })[props.trendDirection],
);
</script>
