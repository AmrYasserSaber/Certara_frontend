<template>
  <router-link
    v-if="to"
    v-slot="{ isActive, navigate }"
    :to="to"
    custom
  >
    <a
      :class="rootClass(isActive)"
      :href="to"
      @click="navigate"
    >
      <AppIcon
        :name="icon"
        :filled="isActive"
        size="md"
      />
      <span class="flex-1 truncate">{{ label }}</span>
      <span
        v-if="badge"
        class="font-mono text-[10px] bg-error text-on-error w-5 h-5 rounded-full flex items-center justify-center"
      >{{ badge }}</span>
    </a>
  </router-link>

  <button
    v-else
    type="button"
    :class="rootClass(false)"
    @click="$emit('click')"
  >
    <AppIcon
      :name="icon"
      size="md"
    />
    <span class="flex-1 truncate text-right">{{ label }}</span>
  </button>
</template>

<script setup>
import AppIcon from './AppIcon.vue';

const props = defineProps({
  to: { type: [String, Object], default: null },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  badge: { type: [String, Number], default: '' },
  activeVariant: {
    type: String,
    default: 'gold',
    validator: (v) => ['gold', 'teal', 'light'].includes(v),
  },
});

defineEmits(['click']);

function rootClass(active) {
  const base = 'nav-item';
  if (!active) return base;
  if (props.activeVariant === 'teal') return `${base} nav-item-active-teal`;
  if (props.activeVariant === 'light') return `${base} nav-item-active-light`;
  return `${base} nav-item-active-gold`;
}
</script>
