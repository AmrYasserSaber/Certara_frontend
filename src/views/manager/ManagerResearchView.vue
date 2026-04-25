<template>
  <AppShellLayout page-title="تفاصيل قرار المدير">
    <SectionHeader
      eyebrow="المدير"
      :title="research?.title || `بحث رقم #${id}`"
      description="مراجعة شاملة قبل إصدار القرار النهائي."
    >
      <template #actions>
        <BaseButton variant="ghost" icon-left="arrow_back" to="/manager">رجوع</BaseButton>
        <BaseButton
          variant="secondary"
          icon-left="workspace_premium"
          :to="`/manager/research/${id}/certificate`"
        >
          معاينة الشهادة
        </BaseButton>
      </template>
    </SectionHeader>

    <div v-if="loading" class="card-flat p-12 flex justify-center">
      <LoadingSpinner />
    </div>

    <template v-else-if="research">
      <BaseCard title="معلومات البحث" icon="description">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p><span class="font-bold">العنوان:</span> {{ research.title || '—' }}</p>
          <p>
            <span class="font-bold">الرقم التسلسلي:</span>
            <span class="font-mono">{{ research.serial_number || '—' }}</span>
          </p>
          <p>
            <span class="font-bold">الباحث الرئيسي:</span>
            {{ research.principal_investigator || '—' }}
          </p>
          <p><span class="font-bold">القسم:</span> {{ research.department || '—' }}</p>
          <p><span class="font-bold">الكلية:</span> {{ research.faculty || '—' }}</p>
          <p>
            <span class="font-bold">آخر تحديث:</span> {{ formatDate(research.updated_at) || '—' }}
          </p>
        </div>
      </BaseCard>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <BaseCard title="المستندات المرفوعة" icon="folder_open">
          <div v-if="documents.length" class="space-y-2">
            <a
              v-for="doc in documents"
              :key="doc.id || doc.file_path"
              :href="resolveDownloadUrl(doc.file_url || doc.file_path)"
              target="_blank"
              rel="noopener"
              class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div>
                <p class="font-bold text-sm">{{ doc.type || 'document' }}</p>
                <p class="text-xs text-on-surface-variant font-mono">
                  {{ doc.original_name || doc.file_path }}
                </p>
              </div>
              <span class="material-symbols-outlined">download</span>
            </a>
          </div>
          <p v-else class="text-sm text-on-surface-variant">لا توجد مستندات متاحة.</p>
        </BaseCard>

        <BaseCard title="بيانات حجم العينة" icon="groups">
          <div v-if="sampleSize" class="space-y-3 text-sm">
            <p>
              <span class="font-bold">الحجم المحسوب:</span> {{ sampleSize.calculated_size || '—' }}
            </p>
            <p>
              <span class="font-bold">رسوم المراجعة:</span>
              {{ formatCurrency(sampleSize.fee_amount || 0) }}
            </p>
            <p><span class="font-bold">ملاحظات:</span> {{ sampleSize.notes || '—' }}</p>
            <p>
              <span class="font-bold">موظف العينة:</span>
              {{ sampleSize.officer?.name || sampleSize.officer?.email || '—' }}
            </p>
          </div>
          <p v-else class="text-sm text-on-surface-variant">لا توجد بيانات حجم عينة لهذا البحث.</p>
        </BaseCard>
      </section>

      <BaseCard title="تعليقات المراجعين" icon="forum" class="mt-6">
        <div v-if="reviewComments.length" class="space-y-3">
          <article v-for="comment in reviewComments" :key="comment.id" class="card p-4">
            <div class="flex items-center justify-between gap-3 mb-2">
              <p class="font-bold text-sm">{{ comment.reviewer_name || 'مراجع' }}</p>
              <p class="text-xs text-on-surface-variant font-mono">
                {{ formatDate(comment.created_at, 'DD MMM YYYY - HH:mm') }}
              </p>
            </div>
            <p class="text-sm text-on-surface leading-7 whitespace-pre-line">
              {{ comment.comment_text }}
            </p>
          </article>
        </div>
        <p v-else class="text-sm text-on-surface-variant">لا توجد تعليقات مراجعة مسجلة.</p>
      </BaseCard>

      <FinalDecisionPanel
        :research-id="Number(id)"
        :disabled="isFinalized"
        @decision-made="onDecisionMade"
      />
    </template>

    <BaseCard v-else title="غير متوفر" icon="info" class="mt-6">
      <p class="text-sm text-on-surface-variant">لم يتم العثور على البحث المطلوب.</p>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import FinalDecisionPanel from '@/components/manager/FinalDecisionPanel.vue';
import adminService from '@/services/admin.service';
import { useToast } from '@/composables/useToast';
import { formatCurrency, formatDate } from '@/utils/helpers';

const props = defineProps({ id: { type: [String, Number], required: true } });

const toast = useToast();
const loading = ref(false);
const research = ref(null);

const documents = computed(() =>
  Array.isArray(research.value?.documents) ? research.value.documents : [],
);
const sampleSize = computed(() => research.value?.sample_size || null);
const reviewComments = computed(() =>
  Array.isArray(research.value?.review_comments) ? research.value.review_comments : [],
);
const isFinalized = computed(() => ['approved', 'rejected'].includes(research.value?.status));

function resolveDownloadUrl(path) {
  if (!path) return '#';
  if (/^https?:\/\//i.test(path)) return path;
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const host = apiBase.replace(/\/api\/?$/, '');
  const clean = String(path).replace(/^\/+/, '');
  return `${host}/${clean}`;
}

async function loadResearch() {
  loading.value = true;
  try {
    const res = await adminService.managerResearch(Number(props.id));
    const payload = res?.data?.data || {};
    research.value = payload.research || payload || null;
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل تفاصيل البحث');
    research.value = null;
  } finally {
    loading.value = false;
  }
}

async function onDecisionMade() {
  await loadResearch();
}

onMounted(loadResearch);
</script>
