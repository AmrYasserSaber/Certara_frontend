<template>
  <StubView
    title="إدخال حجم العينة"
    eyebrow="نموذج"
    :description="`نموذج إدخال الحجم المحسوب للبحث (ID: ${id}).`"
    owner="DEV 3"
    icon="calculate"
    :endpoints="['POST /api/sample-size/{research_id}']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
