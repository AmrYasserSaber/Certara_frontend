<template>
  <StubView
    title="إيصال الدفع"
    eyebrow="إيصال"
    :description="`عرض إيصال الدفع مع إمكانية التنزيل (ID: ${id}).`"
    owner="DEV 2"
    icon="receipt_long"
    :endpoints="['GET /api/research/{id}/payment/receipt']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
