<template>
  <AppShellLayout page-title="تفاصيل البحث">
    <SectionHeader
      eyebrow="الإدارة"
      :title="research?.title || `تفاصيل البحث #${id}`"
      description="عرض كامل للبحث، بيانات الطالب، المستندات، السداد، وخط زمني للحالة."
    >
      <template #actions>
        <BaseButton variant="ghost" icon-left="arrow_back" to="/admin/research"> رجوع </BaseButton>
        <BaseButton
          v-if="research?.status === RESEARCH_STATUS.IN_REVIEW"
          variant="secondary"
          icon-left="person_add"
          @click="assignModalOpen = true"
        >
          تعيين مراجع
        </BaseButton>
        <BaseButton
          v-if="research?.status === RESEARCH_STATUS.PENDING_ACTIVATION"
          variant="primary"
          icon-left="tag"
          :loading="serialLoading"
          @click="generateSerial"
        >
          توليد رقم تسلسلي
        </BaseButton>
      </template>
    </SectionHeader>

    <div v-if="loading" class="card-flat p-12 flex justify-center">
      <LoadingSpinner />
    </div>

    <template v-else-if="research">
      <BaseCard title="الحالة الحالية" icon="hub">
        <div class="mb-4 flex items-center gap-3">
          <StatusBadge :status="research.status" />
          <span class="text-sm text-on-surface-variant"
            >الرقم التسلسلي:
            <span class="font-mono">{{ research.serial_number || '—' }}</span></span
          >
        </div>
        <ResearchTimeline :status="research.status" />
      </BaseCard>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <BaseCard title="بيانات البحث" icon="description">
          <div class="space-y-3 text-sm">
            <p><span class="font-bold">العنوان:</span> {{ research.title || '—' }}</p>
            <p>
              <span class="font-bold">الباحث الرئيسي:</span>
              {{ research.principal_investigator || '—' }}
            </p>
            <p><span class="font-bold">المشاركون:</span> {{ research.co_investigators || '—' }}</p>
            <p><span class="font-bold">القسم:</span> {{ research.department || '—' }}</p>
            <p><span class="font-bold">الكلية:</span> {{ research.faculty || '—' }}</p>
            <p>
              <span class="font-bold">تاريخ التقديم:</span>
              {{ formatDate(research.created_at) || '—' }}
            </p>
          </div>
        </BaseCard>

        <BaseCard title="بيانات الطالب" icon="person">
          <div class="space-y-3 text-sm">
            <p><span class="font-bold">الاسم:</span> {{ research.student?.name || '—' }}</p>
            <p><span class="font-bold">البريد:</span> {{ research.student?.email || '—' }}</p>
            <p><span class="font-bold">الهاتف:</span> {{ research.student?.phone || '—' }}</p>
            <p><span class="font-bold">القسم:</span> {{ research.student?.department || '—' }}</p>
            <p><span class="font-bold">الكلية:</span> {{ research.student?.faculty || '—' }}</p>
            <p>
              <span class="font-bold">التخصص:</span> {{ research.student?.specialization || '—' }}
            </p>
          </div>
        </BaseCard>
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <BaseCard title="المستندات" icon="attach_file">
          <div v-if="documents.length" class="space-y-2">
            <a
              v-for="doc in documents"
              :key="doc.id || doc.file_path"
              :href="doc.file_url || doc.file_path"
              target="_blank"
              rel="noopener"
              class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div>
                <p class="font-bold text-sm">{{ doc.type || 'مستند' }}</p>
                <p class="text-xs text-on-surface-variant font-mono">
                  {{ doc.original_name || doc.file_path }}
                </p>
              </div>
              <span class="material-symbols-outlined">download</span>
            </a>
          </div>
          <p v-else class="text-sm text-on-surface-variant">
            لا توجد قائمة مستندات مفصلة من هذا endpoint حاليًا.
          </p>
        </BaseCard>

        <BaseCard title="سجل المدفوعات" icon="payments">
          <div class="space-y-3 text-sm">
            <div class="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <span>الدفع الأول</span>
              <StatusBadge :status="mapPaymentStatus(research.payment_statuses?.first)" />
            </div>
            <div class="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <span>الدفع الثاني</span>
              <StatusBadge :status="mapPaymentStatus(research.payment_statuses?.second)" />
            </div>
          </div>
        </BaseCard>
      </section>
    </template>

    <BaseCard v-else title="غير متوفر" icon="info" class="mt-6">
      <p class="text-sm text-on-surface-variant">لم يتم العثور على البحث المطلوب.</p>
    </BaseCard>

    <BaseModal v-model="assignModalOpen" title="تعيين مراجع" size="md">
      <div class="space-y-4">
        <BaseSelect
          v-model="selectedReviewerId"
          label="المراجع"
          :options="reviewerOptions"
          placeholder="اختر مراجعًا"
        />
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="assignModalOpen = false">إلغاء</BaseButton>
        <BaseButton variant="primary" :loading="assigning" @click="submitAssignReviewer">
          حفظ التعيين
        </BaseButton>
      </template>
    </BaseModal>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import ResearchTimeline from '@/components/shared/ResearchTimeline.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/composables/useToast';
import { RESEARCH_STATUS } from '@/utils/constants';

const props = defineProps({ id: { type: [String, Number], required: true } });

const toast = useToast();

const loading = ref(false);
const serialLoading = ref(false);
const assigning = ref(false);

const research = ref(null);
const reviewers = ref([]);
const assignModalOpen = ref(false);
const selectedReviewerId = ref('');

const reviewerOptions = computed(() =>
  reviewers.value.map((r) => ({
    value: String(r.id),
    label: `${r.name} (${r.email})`,
  })),
);

const documents = computed(() => {
  if (Array.isArray(research.value?.documents)) return research.value.documents;
  if (research.value?.document) return [research.value.document];
  return [];
});

function mapPaymentStatus(value) {
  if (!value) return 'draft';
  if (value === 'paid') return 'approved';
  if (value === 'failed') return 'rejected';
  return 'awaiting_payment_1';
}

async function loadResearchDetail() {
  loading.value = true;
  try {
    const res = await adminService.researchDetail(Number(props.id));
    const payload = res?.data?.data || {};
    research.value = payload.research || payload || null;
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل تفاصيل البحث');
    research.value = null;
  } finally {
    loading.value = false;
  }
}

async function loadReviewers() {
  try {
    const res = await adminService.reviewers();
    reviewers.value = res?.data?.data?.items || [];
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل المراجعين');
  }
}

async function submitAssignReviewer() {
  if (!selectedReviewerId.value) {
    toast.warning('اختر مراجعًا');
    return;
  }

  assigning.value = true;
  try {
    await adminService.assignReviewer(Number(props.id), Number(selectedReviewerId.value));
    toast.success('تم تعيين المراجع بنجاح');
    assignModalOpen.value = false;
    await loadResearchDetail();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تعيين المراجع');
  } finally {
    assigning.value = false;
  }
}

async function generateSerial() {
  serialLoading.value = true;
  try {
    await adminService.generateSerial(Number(props.id));
    toast.success('تم توليد الرقم التسلسلي');
    await loadResearchDetail();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر توليد الرقم التسلسلي');
  } finally {
    serialLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadResearchDetail(), loadReviewers()]);
});
</script>
