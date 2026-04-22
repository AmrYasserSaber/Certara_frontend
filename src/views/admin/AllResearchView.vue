<template>
  <StubView
    title="جميع الأبحاث"
    eyebrow="الإدارة"
    description="عرض موحد لكل الأبحاث مع الفلاتر، الإسناد، وتوليد الرقم التسلسلي."
    owner="DEV 4"
    icon="description"
    :endpoints="[
      'GET  /api/admin/research',
      'PUT  /api/admin/research/{id}/assign-reviewer',
      'POST /api/admin/research/{id}/serial',
    ]"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';
</script>
