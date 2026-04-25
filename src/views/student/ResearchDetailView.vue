<template>
  <AppShellLayout :page-title="store.current?.title || 'تفاصيل البحث'">
    <template v-if="store.loading">
      <div class="flex justify-center p-12"><LoadingSpinner /></div>
    </template>
    
    <template v-else-if="store.error">
      <div class="p-4 bg-error-container text-on-error-container rounded-lg">
        {{ store.error }}
      </div>
    </template>

    <template v-else-if="current">
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-headline font-bold text-on-background mb-2">
            {{ current.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-3">
            <StatusBadge :status="current.status" />
            <span v-if="current.serial_number" class="text-sm font-mono font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded">
              {{ current.serial_number }}
            </span>
            <span class="text-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded flex items-center gap-1">
              <AppIcon name="update" size="xs" /> {{ formatDate(current.updated_at) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <router-link
            v-if="['DRAFT', 'REVISION_REQUESTED'].includes(current.status)"
            :to="{ name: 'student.research.edit', params: { id: current.id } }"
          >
            <BaseButton variant="primary" icon="edit">تعديل البحث</BaseButton>
          </router-link>

          <router-link
            v-if="current.status === 'AWAITING_PAYMENT_1' || current.status === 'AWAITING_PAYMENT_2'"
            :to="{ name: 'student.research.pay', params: { id: current.id } }"
          >
            <BaseButton variant="primary" icon="payments">إكمال الدفع</BaseButton>
          </router-link>
        </div>
      </div>

      <!-- Timeline Tracking -->
      <BaseCard class="mb-6 border-none shadow-sm pb-10">
        <ResearchTimeline :status="current.status" />
      </BaseCard>

      <!-- Reviewer Comments Block -->
      <div v-if="current.status === 'REVISION_REQUESTED' && comments.length" class="mb-6">
        <ReviewerComments :comments="comments" />
      </div>

      <!-- Research Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <BaseCard title="معلومات البحث" icon="info">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p class="text-xs text-on-surface-variant font-bold mb-1">الباحث الرئيسي</p>
                <p class="text-sm font-medium text-on-surface">{{ current.principal_investigator }}</p>
              </div>
              <div v-if="current.co_investigators">
                <p class="text-xs text-on-surface-variant font-bold mb-1">الباحثون المشاركون</p>
                <p class="text-sm font-medium text-on-surface">{{ current.co_investigators }}</p>
              </div>
              <div>
                <p class="text-xs text-on-surface-variant font-bold mb-1">الكلية</p>
                <p class="text-sm font-medium text-on-surface">{{ current.faculty }}</p>
              </div>
              <div>
                <p class="text-xs text-on-surface-variant font-bold mb-1">القسم</p>
                <p class="text-sm font-medium text-on-surface">{{ current.department }}</p>
              </div>
            </div>
          </BaseCard>

          <!-- Documents List -->
          <BaseCard title="المستندات المرفقة" icon="folder">
            <div class="divide-y divide-outline-variant/20">
              <div v-for="doc in documents" :key="doc.id" class="py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-primary/10 text-primary p-2 rounded-lg">
                    <AppIcon name="picture_as_pdf" />
                  </div>
                  <div>
                    <p class="font-bold text-sm text-on-surface">{{ getDocumentTypeName(doc.type) }}</p>
                    <p class="text-xs text-on-surface-variant">{{ doc.original_name }}</p>
                  </div>
                </div>
                <a :href="getFileUrl(doc.file_path)" target="_blank" class="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" title="تحميل">
                  <AppIcon name="download" />
                </a>
              </div>
            </div>
            <div v-if="!documents || documents.length === 0" class="text-center py-4 text-on-surface-variant text-sm">
              لم يتم العثور على مستندات.
            </div>
          </BaseCard>
        </div>

        <!-- Sidebar Activity / Payment History -->
        <div class="space-y-6">
          <BaseCard title="سجل الدفع" icon="receipt">
             <div v-if="payments && payments.length > 0" class="space-y-3">
                <div v-for="payment in payments" :key="payment.id" class="p-3 border border-outline-variant/30 rounded-lg flex flex-col gap-2">
                  <div class="flex justify-between">
                    <span class="text-xs font-bold">{{ payment.type === 'first' ? 'رسوم مبدئية' : 'رسوم المراجعة' }}</span>
                    <span class="text-xs font-mono" :class="payment.status === 'paid' ? 'text-success' : 'text-warning'">{{ payment.status }}</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <span class="font-mono font-bold text-lg">{{ payment.amount }} EGP</span>
                    <router-link v-if="payment.status === 'paid'" :to="`/student/research/${current.id}/receipt?paymentId=${payment.id}`" class="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                      عرض الإيصال
                    </router-link>
                  </div>
                </div>
             </div>
             <div v-else class="text-center py-4 text-on-surface-variant text-sm">
               لا يوجد سجل دفع حتى الآن.
             </div>
          </BaseCard>
        </div>
      </div>
    </template>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useResearchStore } from '@/stores/research.store';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import ResearchTimeline from '@/components/shared/ResearchTimeline.vue';
import ReviewerComments from '@/components/student/ReviewerComments.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { formatDate } from '@/utils/helpers';

const props = defineProps({
  id: { type: [String, Number], required: true }
});

const store = useResearchStore();

// Some structured data placeholders depending on what is returned by fetchOne
const documents = ref([]);
const comments = ref([]);
const payments = ref([]);

onMounted(async () => {
  try {
    const data = await store.fetchOne(props.id);
    if(data) {
      documents.value = data.documents || [];
      comments.value = data.reviewer_comments || []; // Assumption of API response
      payments.value = data.payments || []; // Assumption of API response
    }
  } catch(e) {}
});

const current = computed(() => store.current);

function getDocumentTypeName(type) {
  const map = {
    protocol: 'البروتوكول البحثي',
    application: 'نموذج التقديم',
    coi: 'تضارب المصالح',
    checklist: 'قائمة المراجعة',
    consent: 'الموافقة المستنيرة'
  };
  return map[type] || type;
}

function getFileUrl(path) {
  return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${path}`;
}
</script>
