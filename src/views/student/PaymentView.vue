<template>
  <AppShellLayout page-title="دفع الرسوم">
    <div class="max-w-2xl mx-auto space-y-6">
      
      <div v-if="store.loading" class="flex justify-center p-12"><LoadingSpinner /></div>
      <div v-else-if="store.error" class="p-4 bg-error-container text-on-error-container rounded-lg">{{ store.error }}</div>
      
      <div v-else-if="currentResearch">
        <SectionHeader
          title="دفع الرسوم"
          description="إتمام عملية الدفع للانتقال للخطوة التالية من مراجعة البحث."
          icon="payments"
          class="mb-6"
        />

        <div v-if="fawryReference" class="p-8 text-center bg-surface-container-high rounded-xl border border-primary/20 shadow-sm mt-6">
          <AppIcon name="receipt_long" size="xl" class="text-primary mb-4" />
          <h3 class="text-2xl font-bold font-headline mb-2 text-on-surface">طلب الدفع قيد الانتظار</h3>
          <p class="text-on-surface-variant mb-6 text-lg max-w-md mx-auto">
            يرجى التوجه إلى أقرب منفذ فوري واستخدام الرقم المرجعي التالي لسداد الرسوم:
          </p>
          
          <div class="bg-surface p-6 rounded-lg inline-block border-2 border-dashed border-primary mb-6">
            <span class="text-4xl font-mono font-bold tracking-widest text-primary block">{{ fawryReference }}</span>
          </div>
          
          <div class="flex justify-center gap-4">
            <BaseButton variant="primary" to="/student">العودة للرئيسية</BaseButton>
            <BaseButton variant="outline" :to="{ name: 'student.research.detail', params: { id: currentResearch.id } }">تفاصيل البحث</BaseButton>
          </div>
        </div>

        <PaymentForm
          v-else-if="requiredPayment"
          :research-id="currentResearch.id"
          :serial-number="currentResearch.serial_number"
          :type="requiredPayment.type"
          :amount="requiredPayment.amount"
          :loading="processing"
          :error="paymentError"
          @submit="handlePayment"
        />

        <div v-else class="p-8 text-center bg-surface-container-high rounded-lg border border-outline-variant/30">
          <AppIcon name="check_circle" size="xl" class="text-success mb-2" />
          <h3 class="text-xl font-bold font-headline mb-1 text-on-surface">لا توجد رسوم مطلوبة</h3>
          <p class="text-on-surface-variant">جميع الرسوم الحالية مسددة أو أن البحث ليس جاهزاً للدفع.</p>
          <BaseButton class="mt-6" variant="primary" to="/student">العودة للرئيسية</BaseButton>
        </div>
      </div>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useResearchStore } from '@/stores/research.store';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import PaymentForm from '@/components/payment/PaymentForm.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  id: { type: [String, Number], required: true }
});

const store = useResearchStore();
const router = useRouter();
const processing = ref(false);
const paymentError = ref('');
const fawryReference = ref(null);

const currentResearch = computed(() => store.current);

onMounted(async () => {
  await store.fetchOne(props.id);
});

// Calculate required payment based on status.
// Actually backend should create the payment record and it should be "pending".
// Assume first fee is 500, second is 1500 if not provided, or better use what is returned in API.
const requiredPayment = computed(() => {
  if (!currentResearch.value) return null;
  const status = currentResearch.value.status;
  
  // Find a pending payment in the research relations if available
  const pendingPayment = currentResearch.value.payments?.find(p => p.status === 'pending');
  if (pendingPayment) {
     return pendingPayment;
  }
  
  // Implicit fallback logic if API just returns standard status but no pending payment in relationships yet
  if (status === 'AWAITING_PAYMENT_1') return { type: 'first', amount: 500 };
  if (status === 'AWAITING_PAYMENT_2') return { type: 'second', amount: 1500 };
  
  return null;
});

async function handlePayment(payload) {
  processing.value = true;
  paymentError.value = '';
  
  try {
    const feeType = requiredPayment.value.type;
    const amount = requiredPayment.value.amount;
    
    // In actual implementation, payload.method is sent, perhaps the form can handle it
    const requestPayload = {
      type: feeType,
      amount: amount,
      method: payload.method
    };

    const result = await store.submitPayment(props.id, requestPayload);
    
    if (result && result.fawry_reference) {
      fawryReference.value = result.fawry_reference;
    } else {
      // Direct redirect if no reference number or another method was used
      router.push({ name: 'student.research.receipt', params: { id: props.id }, query: { paymentId: result.payment_id || result.payment?.id }});
    }
  } catch (err) {
    paymentError.value = store.error || 'فشلت عملية الدفع. يرجى مراجعة البطاقة والمحاولة مرة أخرى.';
  } finally {
    processing.value = false;
  }
}
</script>
