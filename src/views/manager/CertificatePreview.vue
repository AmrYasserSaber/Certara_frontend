<template>
  <StubView
    title="معاينة شهادة الموافقة"
    eyebrow="شهادة"
    :description="`معاينة قابلة للطباعة ثم إصدار الشهادة الرسمية (ID: ${id}).`"
    owner="DEV 4"
    icon="workspace_premium"
    :endpoints="['POST /api/manager/research/{id}/certificate']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
