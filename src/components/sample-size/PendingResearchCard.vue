<template>
  <article
    class="pending-card"
    dir="rtl"
  >
    <button
      class="row-header"
      type="button"
      @click="$emit('toggle', item.id)"
    >
      <span class="cell id">{{ item.serial_number || item.id }}</span>
      <span class="cell title">{{ item.title }}</span>
      <span class="cell department">{{ item.department || 'غير محدد' }}</span>
      <span class="cell date">{{ formatDate(item.created_at) }}</span>
      <span class="cell action">
        <span :class="['chevron', { open: expanded }]">▼</span>
      </span>
    </button>

    <section
      v-if="expanded"
      class="expanded"
    >
      <div class="expanded-grid">
        <div class="form-panel">
          <h4>إدخال حجم العينة المعتمد</h4>

          <label class="label">حجم العينة المطلوب (N)</label>
          <input
            v-model.number="calculatedSize"
            class="input"
            type="number"
            min="1"
            placeholder="مثال: 384"
          >
          <div class="big-number">
            {{ calculatedSize || 0 }} مشارك
          </div>

          <label class="label">قيمة الرسوم (EGP)</label>
          <input
            v-model.number="feeAmount"
            class="input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="500.00"
          >

          <label class="label">ملاحظات الحساب المنهجي (اختياري)</label>
          <textarea
            v-model.trim="notes"
            class="textarea"
            rows="4"
            placeholder="اكتب ملاحظاتك هنا..."
          />

          <div class="buttons">
            <BaseButton
              variant="primary"
              icon-right="arrow_back"
              :loading="submitting"
              :disabled="!canSubmit"
              @click="onSubmit"
            >
              إرسال نتيجة الحساب
            </BaseButton>
          </div>
        </div>

        <div class="summary-panel">
          <h4>الملخص البحثي</h4>
          <p>
            {{ placeholderAbstract }}
          </p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  submitAction: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(['toggle', 'submitted', 'open-protocol']);

const calculatedSize = ref(null);
const feeAmount = ref(null);
const notes = ref('');
const submitting = ref(false);

const canSubmit = computed(() => Number(calculatedSize.value) > 0 && Number(feeAmount.value) > 0);

const placeholderAbstract = computed(
  () =>
    `هذا البحث مقدم من ${props.item.principal_investigator || 'الباحث الرئيسي'} ضمن قسم ${props.item.department || 'غير محدد'}، ويخضع حالياً لمرحلة حساب حجم العينة قبل استكمال الإجراءات المالية.`,
);

async function onSubmit() {
  if (!canSubmit.value || submitting.value || !props.submitAction) return;

  submitting.value = true;
  try {
    await props.submitAction(props.item.id, {
      calculated_size: Number(calculatedSize.value),
      notes: notes.value,
      fee_amount: Number(feeAmount.value),
    });

    emit('submitted', props.item.id);

    calculatedSize.value = null;
    feeAmount.value = null;
    notes.value = '';
  } finally {
    submitting.value = false;
  }
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(value));
}
</script>

<style scoped>
.pending-card {
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
}

.row-header {
  width: 100%;
  border: 0;
  background: #ffffff;
  padding: 14px 12px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1.4fr 3fr 1.4fr 1.2fr 60px;
  gap: 10px;
  text-align: right;
}

.cell {
  color: #0f1f2e;
}

.id,
.date {
  font-family: 'Cairo', 'Tahoma', sans-serif;
  color: #334155;
}

.title {
  font-weight: 700;
}

.action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.expanded {
  border-top: 1px solid #e2e8f0;
  padding: 14px;
  background: #f8fafc;
}

.expanded-grid {
  direction: ltr;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
}

.form-panel,
.summary-panel {
  direction: rtl;
  text-align: right;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
}

.form-panel h4,
.summary-panel h4 {
  margin: 0 0 10px;
  color: #0f1f2e;
}

.label {
  display: block;
  margin: 10px 0 6px;
  font-weight: 700;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 9px;
  font-family: inherit;
}

.big-number {
  margin-top: 6px;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a7a6e;
}

.buttons {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.summary-panel p {
  margin: 0;
  color: #334155;
  line-height: 1.9;
}

.metrics {
  margin-top: 14px;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.metrics h5 {
  margin: 0 0 8px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

@media (max-width: 960px) {
  .row-header {
    grid-template-columns: 1fr;
    text-align: right;
  }

  .expanded-grid {
    grid-template-columns: 1fr;
  }
}
</style>
