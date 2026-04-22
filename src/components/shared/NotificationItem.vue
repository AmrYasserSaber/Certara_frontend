<template>
  <article
    :class="[
      'relative flex gap-3 p-4 rounded-lg transition-colors cursor-pointer',
      notification.is_read
        ? 'bg-surface-container-lowest ghost-border hover:bg-surface-container-low'
        : 'bg-surface-container-lowest ambient-shadow border-r-4 border-secondary-container',
    ]"
    @click="$emit('click', notification)"
  >
    <span
      v-if="!notification.is_read"
      class="absolute left-3 top-4 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(253,186,73,0.6)]"
    />
    <div :class="['w-10 h-10 rounded-full shrink-0 flex items-center justify-center', iconBg]">
      <AppIcon
        :name="icon"
        :filled="true"
        size="md"
      />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-bold text-on-background font-headline leading-snug">
          {{ notification.title }}
        </p>
        <span class="text-[10px] text-on-surface-variant font-mono whitespace-nowrap">
          {{ relative }}
        </span>
      </div>
      <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">
        {{ notification.message }}
      </p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import { formatRelative } from '@/utils/helpers';
import { NOTIFICATION_TYPES } from '@/utils/constants';

const props = defineProps({
  notification: { type: Object, required: true },
});

defineEmits(['click']);

const relative = computed(() => formatRelative(props.notification.created_at));

const ICONS = {
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVATED]: { icon: 'verified', bg: 'bg-primary/10 text-primary' },
  [NOTIFICATION_TYPES.PAYMENT_CONFIRMED]: {
    icon: 'payments',
    bg: 'bg-primary-fixed text-on-primary-fixed',
  },
  [NOTIFICATION_TYPES.REVIEW_REQUESTED]: {
    icon: 'rate_review',
    bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
  [NOTIFICATION_TYPES.REVISION_REQUESTED]: {
    icon: 'edit_note',
    bg: 'bg-secondary-container/30 text-on-secondary-container',
  },
  [NOTIFICATION_TYPES.RESEARCH_APPROVED]: {
    icon: 'check_circle',
    bg: 'bg-primary-fixed text-on-primary-fixed',
  },
  [NOTIFICATION_TYPES.RESEARCH_REJECTED]: {
    icon: 'cancel',
    bg: 'bg-error-container text-on-error-container',
  },
  [NOTIFICATION_TYPES.CERTIFICATE_READY]: {
    icon: 'workspace_premium',
    bg: 'bg-secondary-container/30 text-on-secondary-container',
  },
};

const icon = computed(() => ICONS[props.notification.type]?.icon || 'notifications');
const iconBg = computed(
  () => ICONS[props.notification.type]?.bg || 'bg-surface-container-high text-on-surface-variant',
);
</script>
