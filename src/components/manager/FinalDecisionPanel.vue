<template>
  <BaseCard title="القرار النهائي" icon="gavel" class="mt-6" accent-rail="gold">
    <div class="space-y-4">
      <p class="text-sm text-on-surface-variant">
        يرجى كتابة تعليق واضح قبل اعتماد القرار النهائي.
      </p>

      <BaseTextarea
        v-model="note"
        label="تعليق القرار"
        placeholder="اكتب مبررات الموافقة أو الرفض..."
        :rows="5"
        required
      />

      <div class="flex flex-wrap items-center gap-3">
        <BaseButton
          variant="primary"
          class="!bg-green-600 hover:!bg-green-700 !text-white"
          icon-left="check_circle"
          :loading="submitting && pendingDecision === 'approved'"
          :disabled="disabled || submitting"
          @click="requestDecision('approved')"
        >
          اعتماد البحث
        </BaseButton>

        <BaseButton
          variant="danger"
          icon-left="cancel"
          :loading="submitting && pendingDecision === 'rejected'"
          :disabled="disabled || submitting"
          @click="requestDecision('rejected')"
        >
          رفض البحث
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseTextarea from '@/components/shared/BaseTextarea.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import adminService from '@/services/admin.service';

const props = defineProps({
  researchId: {
    type: [String, Number],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['decision-made']);

const toast = useToast();
const { ask } = useConfirm();

const note = ref('');
const submitting = ref(false);
const pendingDecision = ref('');

function validationMessage() {
  if (!String(props.researchId || '').trim()) return 'معرّف البحث غير صالح';
  if (!note.value.trim()) return 'تعليق القرار مطلوب';
  return '';
}

async function requestDecision(decision) {
  const invalid = validationMessage();
  if (invalid) {
    toast.warning(invalid);
    return;
  }

  const ok = await ask({
    title: decision === 'approved' ? 'تأكيد الموافقة النهائية' : 'تأكيد الرفض النهائي',
    message:
      decision === 'approved'
        ? 'بعد الموافقة لا يمكن التراجع إلا بإجراء إداري. هل أنت متأكد؟'
        : 'سيتم إرسال قرار الرفض إلى الطالب مع هذا التعليق. هل تريد المتابعة؟',
    confirmText: decision === 'approved' ? 'نعم، اعتماد' : 'نعم، رفض',
    cancelText: 'إلغاء',
    variant: decision === 'approved' ? 'primary' : 'danger',
  });

  if (!ok) return;

  pendingDecision.value = decision;
  submitting.value = true;

  try {
    await adminService.managerDecision(Number(props.researchId), decision, note.value.trim());

    toast.success(decision === 'approved' ? 'تم اعتماد البحث بنجاح' : 'تم رفض البحث بنجاح');

    emit('decision-made', {
      researchId: Number(props.researchId),
      decision,
      note: note.value.trim(),
    });

    note.value = '';
  } catch (err) {
    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      'تعذر إرسال القرار النهائي';
    toast.error(message);
  } finally {
    submitting.value = false;
    pendingDecision.value = '';
  }
}
</script>
