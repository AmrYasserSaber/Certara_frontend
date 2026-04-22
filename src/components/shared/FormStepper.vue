<template>
  <ol class="flex items-center justify-between w-full relative gap-2">
    <li
      v-for="(step, idx) in steps"
      :key="step.key || idx"
      class="flex-1 flex flex-col items-center relative"
    >
      <div
        v-if="idx < steps.length - 1"
        class="absolute top-4 right-1/2 w-full h-0.5"
        :class="idx < modelValue ? 'bg-primary-container' : 'bg-outline-variant/30'"
      />
      <button
        type="button"
        :disabled="idx > modelValue && !canJumpAhead"
        :class="[
          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm transition-all',
          idx < modelValue
            ? 'bg-primary-container text-white ring-4 ring-primary-fixed-dim/30'
            : idx === modelValue
              ? 'bg-primary text-on-primary ring-4 ring-primary-fixed-dim/40 shadow-md'
              : 'bg-surface-container-high border-2 border-outline-variant text-outline',
        ]"
        @click="$emit('update:modelValue', idx)"
      >
        <AppIcon
          v-if="idx < modelValue"
          name="check"
          size="sm"
        />
        <span
          v-else
          class="font-mono"
        >{{ idx + 1 }}</span>
      </button>
      <p
        class="text-xs font-headline font-bold mt-3 text-center max-w-[7rem]"
        :class="idx <= modelValue ? 'text-on-background' : 'text-on-surface-variant'"
      >
        {{ step.label }}
      </p>
    </li>
  </ol>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

defineProps({
  modelValue: { type: Number, default: 0 },
  steps: { type: Array, required: true },
  canJumpAhead: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);
</script>
