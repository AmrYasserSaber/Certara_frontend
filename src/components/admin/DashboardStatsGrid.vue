<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <StatCard
      v-for="item in items"
      :key="item.key"
      :label="item.label"
      :value="item.value"
      :icon="item.icon || 'analytics'"
      :variant="item.variant || 'primary'"
      :trend="item.trend || ''"
      :trend-label="item.trendLabel || ''"
      :trend-direction="item.trendDirection || 'flat'"
    />
  </section>
</template>

<script setup>
import StatCard from '@/components/shared/StatCard.vue';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
