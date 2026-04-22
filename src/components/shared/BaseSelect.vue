<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="form-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error mr-0.5"
      >*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="['input appearance-none pl-10', error ? 'input-error' : '']"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
        >
          {{ placeholder }}
        </option>
        <slot>
          <option
            v-for="opt in options"
            :key="valueOf(opt)"
            :value="valueOf(opt)"
          >
            {{ labelOf(opt) }}
          </option>
        </slot>
      </select>
      <AppIcon
        name="expand_more"
        size="md"
        class="absolute top-1/2 -translate-y-1/2 left-3 text-on-surface-variant pointer-events-none"
      />
    </div>

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
  modelValue: { type: [String, Number, Boolean, null], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  valueKey: { type: String, default: 'value' },
  labelKey: { type: String, default: 'label' },
});

const emit = defineEmits(['update:modelValue']);

const uid = Math.random().toString(36).slice(2, 10);
const selectId = computed(() => props.id || `sel-${uid}`);

function valueOf(opt) {
  return typeof opt === 'object' && opt !== null ? opt[props.valueKey] : opt;
}
function labelOf(opt) {
  return typeof opt === 'object' && opt !== null ? opt[props.labelKey] : opt;
}
</script>
