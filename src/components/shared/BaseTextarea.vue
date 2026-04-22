<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="areaId"
      class="form-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error mr-0.5"
      >*</span>
    </label>
    <textarea
      :id="areaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :class="['input resize-y', error ? 'input-error' : '']"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p
      v-if="error"
      class="form-error"
    >
      <AppIcon
        name="error"
        size="xs"
      />
      <span>{{ error }}</span>
    </p>
    <p
      v-else-if="hint"
      class="form-help"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  rows: { type: [String, Number], default: 4 },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const uid = Math.random().toString(36).slice(2, 10);
const areaId = computed(() => props.id || `txt-${uid}`);
</script>
