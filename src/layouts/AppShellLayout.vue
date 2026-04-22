<script setup>
/**
 * Thin re-export so consumers can import either path.
 * The real implementation lives in `@/components/shared/AppShellLayout.vue`.
 */
import Shell from '@/components/shared/AppShellLayout.vue';
</script>

<template>
  <Shell v-bind="$attrs">
    <slot />
  </Shell>
</template>

<script>
export default { inheritAttrs: false };
</script>
