<template>
  <label
    :for="rid"
    class="inline-flex items-center gap-2 cursor-pointer select-none"
  >
    <input
      :id="rid"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      class="h-4 w-4 border-outline-variant text-primary focus:ring-primary"
      @change="emit('update:modelValue', value)"
    >
    <span class="text-sm text-on-surface">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number, Boolean, Object, null], default: null },
  value: { type: [String, Number, Boolean, Object], required: true },
  name: { type: String, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const uid = Math.random().toString(36).slice(2, 10);
const rid = computed(() => props.id || `rad-${uid}`);
</script>
