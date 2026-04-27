<template>
  <article class="card-flat p-4 space-y-3">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h4 class="font-bold text-on-background">
          {{ user?.name || '—' }}
        </h4>
        <p class="text-xs text-on-surface-variant font-mono">
          {{ user?.email || '—' }}
        </p>
      </div>
      <StatusBadge :status="user?.status || 'pending'" />
    </div>

    <div
      v-if="!compact"
      class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-on-surface-variant"
    >
      <p><span class="font-bold text-on-background">القسم:</span> {{ user?.department || '—' }}</p>
      <p><span class="font-bold text-on-background">الكلية:</span> {{ user?.faculty || '—' }}</p>
      <p>
        <span class="font-bold text-on-background">تاريخ التسجيل:</span>
        {{ formatDate(user?.created_at) || '—' }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <BaseButton
        variant="ghost"
        size="sm"
        icon-left="badge"
        @click="$emit('view-id', user)"
      >
        عرض الهوية
      </BaseButton>

      <BaseButton
        variant="secondary"
        size="sm"
        icon-left="check_circle"
        :loading="activating"
        @click="$emit('activate', user)"
      >
        تفعيل
      </BaseButton>

      <div class="flex-1 min-w-[220px] flex items-center gap-2">
        <BaseInput
          v-model="localReason"
          placeholder="سبب الرفض (اختياري)"
          class="w-full"
        />
        <BaseButton
          variant="danger"
          size="sm"
          icon-left="cancel"
          :loading="rejecting"
          @click="emitReject"
        >
          رفض
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import { formatDate } from '@/utils/helpers';

const props = defineProps({
  user: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  activating: { type: Boolean, default: false },
  rejecting: { type: Boolean, default: false },
  reason: { type: String, default: '' },
});

const emit = defineEmits(['activate', 'reject', 'view-id', 'update:reason']);

const localReason = ref(props.reason || '');

watch(
  () => props.reason,
  (v) => {
    if (v !== localReason.value) localReason.value = v || '';
  },
);

watch(localReason, (v) => emit('update:reason', v));

function emitReject() {
  emit('reject', { user: props.user, reason: localReason.value || '' });
}
</script>
