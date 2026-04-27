<template>
  <section class="decision-panel">
    <h3 class="heading">
      لجنة المراجعة: القرار النهائي
    </h3>

    <div class="actions">
      <BaseButton
        variant="primary"
        :loading="submitting && selectedDecision === 'approved'"
        @click="openModal('approved')"
      >
        قبول
      </BaseButton>

      <BaseButton
        variant="outline"
        class="amber"
        :loading="submitting && selectedDecision === 'revision_requested'"
        @click="openModal('revision_requested')"
      >
        طلب تعديل
      </BaseButton>

      <BaseButton
        variant="danger"
        :loading="submitting && selectedDecision === 'rejected'"
        @click="openModal('rejected')"
      >
        رفض
      </BaseButton>
    </div>

    <BaseModal
      v-model="showModal"
      title="تأكيد إرسال القرار"
      size="md"
    >
      <div class="modal-body">
        <p class="modal-text">
          سيتم اعتماد هذا القرار كقرار نهائي.
        </p>

        <label
          class="comment-label"
          for="decision-comment"
        >
          ملاحظات القرار
          <span v-if="requiresComment">(إجباري)</span>
          <span v-else>(اختياري)</span>
        </label>

        <textarea
          id="decision-comment"
          v-model.trim="comment"
          class="comment-box"
          maxlength="2000"
          rows="5"
          placeholder="اكتب سبب القرار أو الملاحظات النهائية..."
        />

        <small class="hint">{{ comment.length }} / 2000</small>
      </div>

      <template #footer>
        <BaseButton
          variant="ghost"
          :disabled="submitting"
          @click="closeModal"
        >
          إلغاء
        </BaseButton>
        <BaseButton
          variant="primary"
          :disabled="!canConfirm"
          :loading="submitting"
          @click="confirm"
        >
          تأكيد الإرسال
        </BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  submitAction: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(['decision-submitted']);

const toast = useToast();
const showModal = ref(false);
const selectedDecision = ref('approved');
const comment = ref('');
const submitting = ref(false);

const requiresComment = computed(() =>
  ['rejected', 'revision_requested'].includes(selectedDecision.value),
);

const canConfirm = computed(() => {
  if (submitting.value) return false;
  if (!requiresComment.value) return true;
  return comment.value.length > 0;
});

function openModal(decision) {
  selectedDecision.value = decision;
  comment.value = '';
  showModal.value = true;
}

function closeModal() {
  if (submitting.value) return;
  showModal.value = false;
}

async function confirm() {
  if (!canConfirm.value) return;
  if (!props.submitAction) return;

  submitting.value = true;
  try {
    await props.submitAction(selectedDecision.value, comment.value);
    toast.success('تم إرسال القرار بنجاح.');
    emit('decision-submitted', {
      decision: selectedDecision.value,
      comment: comment.value,
    });
    showModal.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.decision-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  text-align: right;
}

.heading {
  margin: 0 0 14px;
  color: #0f1f2e;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.amber {
  border-color: #f59e0b !important;
  color: #92400e !important;
}

.modal-body {
  display: grid;
  gap: 10px;
}

.modal-text {
  margin: 0;
  color: #334155;
}

.comment-label {
  font-weight: 700;
  color: #0f1f2e;
}

.comment-box {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.comment-box:focus {
  outline: none;
  border-color: #1a7a6e;
  box-shadow: 0 0 0 3px rgba(26, 122, 110, 0.12);
}

.hint {
  color: #64748b;
}
</style>
