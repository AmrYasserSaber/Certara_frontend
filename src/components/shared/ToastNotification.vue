<template>
  <div
    :class="[
      'flex items-start gap-3 p-4 rounded-xl shadow-ambient ghost-border bg-surface-container-lowest min-w-[280px] max-w-[420px] animate-slide-up',
      borderClass,
    ]"
    role="alert"
  >
    <AppIcon
      :name="icon"
      :filled="true"
      size="lg"
      :class="iconClass"
    />
    <div class="flex-1 min-w-0">
      <p
        v-if="title"
        class="font-headline font-bold text-on-background text-sm mb-0.5"
      >
        {{ title }}
      </p>
      <p class="text-sm text-on-surface-variant">
        {{ message }}
      </p>
    </div>
    <button
      type="button"
      class="text-on-surface-variant hover:text-on-surface transition-colors"
      aria-label="close"
      @click="$emit('close')"
    >
      <AppIcon
        name="close"
        size="sm"
      />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  type: { type: String, default: 'info' },
  title: { type: String, default: '' },
  message: { type: String, required: true },
});

defineEmits(['close']);

const icon = computed(
  () =>
    ({
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info',
    })[props.type] || 'info',
);

const iconClass = computed(
  () =>
    ({
      success: 'text-primary-container',
      error: 'text-error',
      warning: 'text-secondary',
      info: 'text-tertiary',
    })[props.type] || 'text-on-surface-variant',
);

const borderClass = computed(
  () =>
    ({
      success: 'border-r-4 border-primary-container',
      error: 'border-r-4 border-error',
      warning: 'border-r-4 border-secondary-container',
      info: 'border-r-4 border-tertiary',
    })[props.type] || '',
);
</script>
