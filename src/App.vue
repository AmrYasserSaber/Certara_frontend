<template>
  <RouterView />
  <ToastContainer />
  <ConfirmDialog />
</template>

<script setup>
import { RouterView } from 'vue-router';
import ToastContainer from '@/components/shared/ToastContainer.vue';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
</script>
