<template>
  <label
    :for="cid"
    class="inline-flex items-center gap-2 cursor-pointer select-none"
  >
    <input
      :id="cid"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
      @change="emit('update:modelValue', $event.target.checked)"
    >
    <span class="text-sm text-on-surface">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const uid = Math.random().toString(36).slice(2, 10);
const cid = computed(() => props.id || `chk-${uid}`);
</script>
