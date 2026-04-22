<template>
  <StubView
    title="تفعيل المستخدمين"
    eyebrow="الإدارة"
    description="مراجعة صور البطاقة، اعتماد أو رفض طلبات التسجيل."
    owner="DEV 4"
    icon="how_to_reg"
    :endpoints="[
      'GET  /api/admin/users/pending',
      'PUT  /api/admin/users/{id}/activate',
      'PUT  /api/admin/users/{id}/reject',
    ]"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';
</script>
