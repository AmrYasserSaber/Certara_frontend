<template>
  <section class="composer">
    <label class="label" for="review-comment-text">إضافة تعليق</label>

    <textarea
      id="review-comment-text"
      v-model.trim="text"
      class="textarea"
      maxlength="2000"
      rows="4"
      placeholder="اكتب تعليقك هنا..."
    />

    <div class="footer">
      <span class="counter">{{ text.length }} / 2000</span>
      <BaseButton
        variant="primary"
        icon-left="send"
        :loading="submitting || loading"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        إرسال التعليق
      </BaseButton>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  submitAction: {
    type: Function,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'comment-added']);

const text = ref('');
const submitting = ref(false);

const canSubmit = computed(() => text.value.length > 0 && text.value.length <= 2000);

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return;

  submitting.value = true;
  try {
    let result = null;
    if (props.submitAction) {
      result = await props.submitAction(text.value);
    }
    emit('submit', text.value);
    emit('comment-added', result);
    text.value = '';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.composer {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  text-align: right;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  color: #0f1f2e;
}

.textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  resize: vertical;
  min-height: 96px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
}

.textarea:focus {
  border-color: #1a7a6e;
  box-shadow: 0 0 0 3px rgba(26, 122, 110, 0.12);
}

.footer {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.counter {
  font-size: 0.85rem;
  color: #64748b;
}
</style>
