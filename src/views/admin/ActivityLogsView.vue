<template>
  <StubView
    title="سجل النشاط"
    eyebrow="الإدارة"
    description="تاريخ جميع الإجراءات في النظام مع إمكانية الفلترة."
    owner="DEV 4"
    icon="history"
    :endpoints="['GET /api/admin/logs']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';
</script>
