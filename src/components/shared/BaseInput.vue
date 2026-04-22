<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="form-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-error mr-0.5"
      >*</span>
    </label>

    <div class="relative">
      <AppIcon
        v-if="iconLeft"
        :name="iconLeft"
        size="md"
        class="absolute top-1/2 -translate-y-1/2 right-3 text-on-surface-variant pointer-events-none"
      />
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :dir="dir"
        :autocomplete="autocomplete"
        :class="[
          'input',
          iconLeft ? 'pr-10' : '',
          iconRight ? 'pl-10' : '',
          error ? 'input-error' : '',
        ]"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @keydown.enter="emit('enter', $event)"
      >
      <button
        v-if="iconRight"
        type="button"
        tabindex="-1"
        class="absolute top-1/2 -translate-y-1/2 left-3 text-on-surface-variant hover:text-on-surface transition-colors"
        @click="emit('icon-right-click')"
      >
        <AppIcon
          :name="iconRight"
          size="md"
        />
      </button>
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
import { computed, ref } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  iconLeft: { type: String, default: '' },
  iconRight: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  dir: { type: String, default: 'rtl' },
  autocomplete: { type: String, default: 'off' },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'enter', 'icon-right-click']);

const uid = Math.random().toString(36).slice(2, 10);
const inputId = computed(() => props.id || `inp-${uid}`);
const inputRef = ref(null);

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<script>
export default { inheritAttrs: false };
</script>
