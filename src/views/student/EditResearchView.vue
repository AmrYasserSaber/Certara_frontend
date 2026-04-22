<template>
  <StubView
    title="تعديل بحث"
    eyebrow="تعديل"
    :description="`إتاحة تعديل البروتوكول بناءً على طلب المراجع (ID: ${id}).`"
    owner="DEV 2"
    icon="edit_note"
    :endpoints="['PUT /api/research/{id}', 'POST /api/research/{id}/documents']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
