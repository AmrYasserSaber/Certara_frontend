<template>
  <StubView
    title="الدفع الإلكتروني"
    eyebrow="دفع"
    :description="`نافذة الدفع الأول/الثاني حسب حالة البحث (ID: ${id}).`"
    owner="DEV 2"
    icon="payments"
    :endpoints="['POST /api/research/{id}/payment']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
