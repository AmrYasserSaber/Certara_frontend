<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 mb-6">
      <h3 class="font-headline font-bold text-lg mb-4 text-on-surface">ملخص الدفع</h3>
      
      <div class="flex justify-between items-center py-2 border-b border-outline-variant/30 text-on-surface-variant">
        <span>رقم البحث التسلسلي</span>
        <span class="font-bold text-on-surface font-mono">{{ serialNumber || 'غير متوفر' }}</span>
      </div>
      
      <div class="flex justify-between items-center py-2 border-b border-outline-variant/30 text-on-surface-variant">
        <span>نوع الرسوم</span>
        <span class="font-bold text-on-surface">{{ feeLabel }}</span>
      </div>
      
      <div class="flex justify-between items-center py-4 mt-2">
        <span class="text-lg font-bold text-on-surface">الإجمالي المطلوب</span>
        <span class="text-2xl font-bold font-mono text-primary">{{ amount }} ج.م</span>
      </div>
    </div>

    <div>
      <p class="font-bold text-sm mb-3">اختر وسيلة الدفع</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label 
          class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
          :class="paymentMethod === 'fawry' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/50 hover:border-primary/50 text-on-surface'"
        >
          <input type="radio" v-model="paymentMethod" value="fawry" class="hidden">
          <AppIcon name="storefront" />
          <span class="font-bold">فوري (Fawry)</span>
        </label>
        
        <label 
          class="flex items-center gap-3 p-4 border rounded-lg cursor-not-allowed opacity-50 border-outline-variant/50 text-on-surface bg-surface-container-high"
        >
          <input type="radio" value="card" disabled class="hidden">
          <AppIcon name="credit_card" />
          <span class="font-bold">بطاقة ائتمان (قريباً)</span>
        </label>
      </div>
    </div>

    <div v-if="error" class="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
      {{ error }}
    </div>

    <BaseButton
      type="submit"
      variant="primary"
      class="w-full"
      size="lg"
      :loading="loading"
      :disabled="!paymentMethod"
    >
      تأكيد الدفع ({{ amount }} ج.م)
    </BaseButton>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  researchId: { type: [String, Number], required: true },
  serialNumber: { type: String, default: '' },
  type: { type: String, required: true },
  amount: { type: [Number, String], required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const paymentMethod = ref('fawry');

const feeLabel = computed(() => {
  if (props.type === 'first') return 'الرسوم المبدئية (الدفع الأول)';
  if (props.type === 'second') return 'رسوم المراجعة (الدفع الثاني)';
  return 'رسوم البحث';
});

function submit() {
  emit('submit', { 
    method: paymentMethod.value,
  });
}
</script>
