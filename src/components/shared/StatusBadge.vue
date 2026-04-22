<template>
  <span :class="badgeClass">
    <AppIcon
      v-if="icon"
      :name="icon"
      size="xs"
      :filled="true"
    />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import { RESEARCH_STATUS_BADGE_VARIANT, RESEARCH_STATUS_LABELS_AR } from '@/utils/constants';

const props = defineProps({
  status: { type: String, default: '' },
  variant: {
    type: String,
    default: '',
    validator: (v) => ['', 'neutral', 'info', 'success', 'warning', 'error', 'pending'].includes(v),
  },
  icon: { type: String, default: '' },
});

const resolvedVariant = computed(
  () => props.variant || RESEARCH_STATUS_BADGE_VARIANT[props.status] || 'neutral',
);

const label = computed(() => RESEARCH_STATUS_LABELS_AR[props.status] || '');

const badgeClass = computed(
  () =>
    ({
      neutral: 'badge-neutral',
      info: 'badge-info',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      pending: 'badge-pending',
    })[resolvedVariant.value] || 'badge-neutral',
);
</script>
