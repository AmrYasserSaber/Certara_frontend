<template>
  <component
    :is="tag"
    v-bind="rootAttrs"
    :class="classes"
    :disabled="isDisabled"
    @click="onClick"
  >
    <AppIcon
      v-if="loading"
      name="progress_activity"
      size="sm"
      class="animate-spin"
    />
    <AppIcon
      v-else-if="iconLeft"
      :name="iconLeft"
      :size="size === 'sm' ? 'sm' : 'md'"
    />
    <span
      v-if="$slots.default"
      class="inline-flex items-center"
    ><slot /></span>
    <AppIcon
      v-if="iconRight && !loading"
      :name="iconRight"
      :size="size === 'sm' ? 'sm' : 'md'"
    />
  </component>
</template>

<script setup>
import { computed, useAttrs } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) =>
      ['primary', 'secondary', 'ghost', 'outline', 'danger', 'icon', 'icon-dark'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  iconLeft: { type: String, default: '' },
  iconRight: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  type: { type: String, default: 'button' },
});

const emit = defineEmits(['click']);

const attrs = useAttrs();

const isDisabled = computed(() => props.disabled || props.loading);

const tag = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

const rootAttrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return { type: props.type, ...attrs };
});

const classes = computed(() => [
  {
    'btn-primary': props.variant === 'primary',
    'btn-secondary': props.variant === 'secondary',
    'btn-ghost': props.variant === 'ghost',
    'btn-outline': props.variant === 'outline',
    'btn-danger': props.variant === 'danger',
    'btn-icon': props.variant === 'icon',
    'btn-icon-dark': props.variant === 'icon-dark',
    'btn-sm': props.size === 'sm' && !props.variant.startsWith('icon'),
    'btn-lg': props.size === 'lg' && !props.variant.startsWith('icon'),
    'w-full': props.block,
  },
]);

function onClick(event) {
  if (isDisabled.value) return;
  emit('click', event);
}
</script>
