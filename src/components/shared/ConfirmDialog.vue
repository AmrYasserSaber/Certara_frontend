<template>
  <BaseModal
    :model-value="state.open"
    :title="state.title"
    size="sm"
    :closable="false"
    @close="onCancel"
  >
    <p class="text-on-surface-variant leading-relaxed">
      {{ state.message }}
    </p>
    <template #footer>
      <BaseButton
        variant="ghost"
        @click="onCancel"
      >
        {{ state.cancelText }}
      </BaseButton>
      <BaseButton
        :variant="state.variant === 'danger' ? 'danger' : 'primary'"
        @click="onConfirm"
      >
        {{ state.confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import { useConfirm } from '@/composables/useConfirm';

const { state, confirm, cancel } = useConfirm();

function onConfirm() {
  confirm();
}
function onCancel() {
  cancel();
}
</script>
