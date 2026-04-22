<template>
  <StubView
    title="قرار مدير اللجنة"
    eyebrow="قرار"
    :description="`مراجعة نتائج المراجعين وإصدار القرار النهائي (ID: ${id}).`"
    owner="DEV 4"
    icon="gavel"
    :endpoints="['GET  /api/manager/research/{id}', 'PUT  /api/manager/research/{id}/decision']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
