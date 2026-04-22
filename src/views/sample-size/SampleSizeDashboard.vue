<template>
  <StubView
    title="لوحة حجم العينة"
    eyebrow="حجم العينة"
    description="قائمة الأبحاث التي تنتظر حساب حجم العينة."
    owner="DEV 3"
    icon="group"
    :endpoints="['GET /api/sample-size/pending']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';
</script>
