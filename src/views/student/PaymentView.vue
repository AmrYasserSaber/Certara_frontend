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

        <PaymentForm
          v-if="requiredPayment"
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
    // Success -> redirect to receipt or back to research details
    router.push({ name: 'student.research.receipt', params: { id: props.id }, query: { paymentId: result.payment?.id }});
  } catch (err) {
    paymentError.value = store.error || 'فشلت عملية الدفع. يرجى مراجعة البطاقة والمحاولة مرة أخرى.';
  } finally {
    processing.value = false;
  }
}
</script>
