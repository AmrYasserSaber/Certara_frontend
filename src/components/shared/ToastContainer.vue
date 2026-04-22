<template>
  <Teleport to="body">
    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 pointer-events-none"
    >
      <div
        v-for="t in state.items"
        :key="t.id"
        class="pointer-events-auto"
      >
        <ToastNotification
          :type="t.type"
          :title="t.title"
          :message="t.message"
          @close="remove(t.id)"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
import ToastNotification from './ToastNotification.vue';

const { state, remove } = useToast();
</script>
