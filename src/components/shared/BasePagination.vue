<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-between gap-3 text-sm"
    aria-label="pagination"
  >
    <span class="text-on-surface-variant font-mono">
      صفحة {{ modelValue }} من {{ totalPages }}
    </span>
    <div class="flex items-center gap-1">
      <BaseButton
        variant="ghost"
        size="sm"
        icon-right="chevron_right"
        :disabled="modelValue <= 1"
        @click="goTo(modelValue - 1)"
      >
        السابق
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="sm"
        icon-left="chevron_left"
        :disabled="modelValue >= totalPages"
        @click="goTo(modelValue + 1)"
      >
        التالي
      </BaseButton>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
});

const emit = defineEmits(['update:modelValue']);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / Math.max(1, props.perPage))),
);

function goTo(page) {
  if (page < 1 || page > totalPages.value) return;
  emit('update:modelValue', page);
}
</script>
