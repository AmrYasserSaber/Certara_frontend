<template>
  <StubView
    title="تفاصيل البحث (الإدارة)"
    eyebrow="بحث"
    :description="`عرض تفاصيل البحث الإداري مع إجراءات الإسناد والتسلسل (ID: ${id}).`"
    owner="DEV 4"
    icon="article"
    :endpoints="['GET /api/admin/research/{id}']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';

defineProps({ id: { type: [String, Number], required: true } });
</script>
