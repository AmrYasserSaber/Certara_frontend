<template>
  <StubView
    title="تفاصيل البحث"
    eyebrow="بحث"
    :description="`يعرض الحالة، الوثائق، الخط الزمني، وتعليقات المراجع (ID: ${id}).`"
    owner="DEV 2"
    icon="description"
    :endpoints="['GET /api/research/{id}', 'GET /api/research/{id}/documents']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
