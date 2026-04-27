<template>
  <div class="bg-surface border border-outline-variant/30 rounded-xl max-w-md mx-auto shadow-sm overflow-hidden relative">
    <!-- Receipt Header -->
    <div class="bg-primary/5 p-6 border-b border-outline-variant/30 text-center">
      <div class="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <AppIcon
          name="check_circle"
          size="xl"
        />
      </div>
      <h2 class="text-xl font-headline font-bold text-on-surface mb-1">
        إيصال دفع
      </h2>
      <p class="text-on-surface-variant text-sm">
        تم الدفع بنجاح
      </p>
    </div>

    <!-- Details -->
    <div class="p-6 space-y-4">
      <div class="flex flex-col gap-1 text-center mb-6">
        <span class="text-on-surface-variant text-sm">المبلغ المدفوع</span>
        <span class="text-3xl font-bold font-mono text-on-surface">{{ amount }} ج.م</span>
      </div>

      <div class="space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">رقم الإيصال</span>
          <span class="font-mono font-bold text-on-surface">{{ receiptNumber }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">تاريخ الدفع</span>
          <span class="font-mono text-on-surface">{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">نوع الرسوم</span>
          <span class="text-on-surface">{{ translatedType }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-on-surface-variant">رقم البحث</span>
          <span class="font-mono font-bold text-primary">{{ serialNumber || 'غير متوفر' }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="p-6 bg-surface-container-lowest border-t border-outline-variant/30 mt-2 flex gap-3">
      <BaseButton
        variant="outline"
        class="flex-1"
        icon="print"
        @click="printReceipt"
      >
        طباعة الإيصال
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { formatDate } from '@/utils/helpers';

const props = defineProps({
  receiptNumber: { type: String, required: true },
  amount: { type: [Number, String], required: true },
  date: { type: String, required: true },
  type: { type: String, required: true }, // 'first' or 'second'
  serialNumber: { type: String, default: '' },
});

const formattedDate = computed(() => {
  return formatDate(props.date);
});

const translatedType = computed(() => {
  return props.type === 'first' ? 'الرسوم المبدئية' : 'رسوم المراجعة (الدفع الثاني)';
});

function printReceipt() {
  window.print();
}
</script>

<style scoped>
@media print {
  .btn, button, a { display: none !important; }
  .bg-primary\/5 { background-color: #f0fdf4 !important; }
  .border { border-color: #e5e7eb !important; }
}
</style>
