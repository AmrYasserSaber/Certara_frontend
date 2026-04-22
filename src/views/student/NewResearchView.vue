<template>
  <StubView
    title="تقديم بروتوكول جديد"
    eyebrow="بحث جديد"
    description="نموذج متعدد الخطوات لتقديم البروتوكول البحثي ورفع الوثائق الخمس."
    owner="DEV 2"
    icon="post_add"
    :endpoints="['POST /api/research', 'POST /api/research/{id}/documents']"
  />
</template>

<script setup>
import StubView from '@/components/shared/StubView.vue';
</script>
