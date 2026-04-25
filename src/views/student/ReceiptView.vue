<template>
  <AppShellLayout page-title="إيصال الدفع">
    <div class="max-w-2xl mx-auto">
      <div v-if="loading" class="flex justify-center p-12"><LoadingSpinner /></div>
      <div v-else-if="error" class="p-4 bg-error-container text-on-error-container rounded-lg text-center">{{ error }}</div>
      
      <div v-else-if="receiptData" class="space-y-6">
        <ReceiptCard
          :receipt-number="receiptData.gateway_ref || receiptData.id.toString()"
          :amount="receiptData.amount"
          :date="receiptData.paid_at || receiptData.updated_at"
          :type="receiptData.type"
          :serial-number="research?.serial_number"
        />

        <div class="text-center">
          <BaseButton 
            variant="ghost" 
            icon-left="arrow_back"
            :to="{ name: 'student.research.detail', params: { id: researchId } }"
          >
            العودة لتفاصيل البحث
          </BaseButton>
        </div>
      </div>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useResearchStore } from '@/stores/research.store';
import paymentService from '@/services/payment.service';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import ReceiptCard from '@/components/payment/ReceiptCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  id: { type: [String, Number], required: true }
});

const route = useRoute();
const store = useResearchStore();
const paymentId = route.query.paymentId; 

const loading = ref(true);
const error = ref('');
const receiptData = ref(null);

const researchId = computed(() => props.id);
const research = computed(() => store.current);

onMounted(async () => {
  loading.value = true;
  try {
    // 1. Make sure research is loaded to get serial number
    if (!store.current || store.current.id != researchId.value) {
      await store.fetchOne(researchId.value);
    }
    
    // 2. Fetch Receipt from Payment Service
    const response = await paymentService.getReceipt(researchId.value, paymentId);
    receiptData.value = response.data?.receipt || response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'تعذر تحميل بيانات الإيصال. قد يكون الدفع لم يكتمل بعد.';
  } finally {
    loading.value = false;
  }
});
</script>
