<template>
  <StubView
    title="مراجعة بحث"
    eyebrow="مراجعة"
    :description="`نموذج المراجعة (مخفي الهوية) مع عرض الوثائق والتعليقات (ID: ${id}).`"
    owner="DEV 3"
    icon="fact_check"
    :endpoints="[
      'GET  /api/reviews/{id}',
      'POST /api/reviews/{id}/comment',
      'PUT  /api/reviews/{id}/decision',
    ]"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
