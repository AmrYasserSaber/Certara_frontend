<template>
  <AppShellLayout page-title="كل الأبحاث">
    <SectionHeader
      eyebrow="الإدارة"
      title="جميع الأبحاث"
      description="فلترة الأبحاث ومتابعة الحالة وتعيين المراجعين."
    />

    <ResearchFilterBar
      v-model="filters"
      :status-options="statusOptions"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <BaseTable
      class="mt-6"
      :columns="columns"
      :rows="rows"
      :loading="loading"
      empty-title="لا توجد أبحاث مطابقة"
    >
      <template #row="{ row }">
        <td class="text-xs font-bold text-on-background" :title="row.title">
          {{ row.title }}
        </td>
        <td>{{ row.student?.name || row.student_name || '—' }}</td>
        <td>{{ row.department || '—' }}</td>
        <td><StatusBadge :status="row.status" /></td>
        <td class="font-mono text-xs">{{ formatDate(row.created_at) }}</td>
        <td>
          <div class="flex items-center gap-2">
            <BaseButton
              variant="ghost"
              size="sm"
              icon-left="visibility"
              :to="`/admin/research/${row.id}`"
            >
              عرض التفاصيل
            </BaseButton>
            <BaseButton
              v-if="row.status === RESEARCH_STATUS.IN_REVIEW"
              variant="secondary"
              size="sm"
              icon-left="person_add"
              @click="openAssignModal(row)"
            >
              تعيين مراجع
            </BaseButton>
          </div>
        </td>
      </template>

      <template #footer>
        <BasePagination
          v-model="page"
          :total-items="total"
          :per-page="limit"
          @update:model-value="loadResearch"
        />
      </template>
    </BaseTable>

    <BaseModal
      v-model="assignModalOpen"
      title="تعيين مراجع"
      subtitle="اختر مراجعًا لهذا البحث"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-sm text-on-surface-variant">
          <span class="font-bold text-on-background">البحث:</span>
          {{ selectedResearch?.title || '—' }}
        </p>

        <BaseSelect
          v-model="selectedReviewerId"
          label="المراجع"
          :options="reviewerOptions"
          placeholder="اختر مراجعًا"
        />
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="assignModalOpen = false"> إلغاء </BaseButton>
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
import BaseTable from '@/components/shared/BaseTable.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import BasePagination from '@/components/shared/BasePagination.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import ResearchFilterBar from '@/components/admin/ResearchFilterBar.vue';
import adminService from '@/services/admin.service';
import { RESEARCH_STATUS, RESEARCH_STATUS_LABELS_AR } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const loading = ref(false);
const assigning = ref(false);
const rows = ref([]);
const reviewers = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(20);

const filters = ref({
  q: '',
  status: '',
  department: '',
  from: '',
  to: '',
});

const assignModalOpen = ref(false);
const selectedResearch = ref(null);
const selectedReviewerId = ref('');

const columns = [
  { key: 'title', label: 'العنوان' },
  { key: 'student', label: 'اسم الطالب' },
  { key: 'department', label: 'القسم' },
  { key: 'status', label: 'الحالة' },
  { key: 'created_at', label: 'تاريخ التقديم' },
  { key: 'actions', label: 'الإجراءات' },
];

const statusOptions = [
  { value: '', label: 'كل الحالات' },
  ...Object.values(RESEARCH_STATUS).map((status) => ({
    value: status,
    label: RESEARCH_STATUS_LABELS_AR[status] || status,
  })),
];

const reviewerOptions = computed(() =>
  reviewers.value.map((r) => ({
    value: String(r.id),
    label: `${r.name} (${r.email})`,
  })),
);

function buildParams() {
  const { q, status, department, from, to } = filters.value;
  const date = from && !to ? from : '';
  return {
    page: page.value,
    limit: limit.value,
    q: q || '',
    status: status || '',
    department: department || '',
    date,
    from,
    to,
  };
}

async function loadResearch() {
  loading.value = true;
  try {
    const res = await adminService.allResearch(buildParams());
    rows.value = res?.data?.data?.items || [];
    total.value = Number(res?.data?.meta?.total || 0);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل الأبحاث');
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

function openAssignModal(research) {
  selectedResearch.value = research;
  selectedReviewerId.value = '';
  assignModalOpen.value = true;
}

async function submitAssignReviewer() {
  if (!selectedResearch.value?.id || !selectedReviewerId.value) {
    toast.warning('اختر مراجعًا أولًا');
    return;
  }
  assigning.value = true;
  try {
    await adminService.assignReviewer(selectedResearch.value.id, Number(selectedReviewerId.value));
    toast.success('تم تعيين المراجع بنجاح');
    assignModalOpen.value = false;
    await loadResearch();
  } catch (err) {
    // Extract error details from response
    const errorData = err?.response?.data;
    const status = err?.response?.status;
    const errorMessage = errorData?.error?.message || 'تعذر تعيين المراجع';
    const validationErrors = errorData?.error?.errors || {};

    // Log full error to console for debugging
    console.error('Assign Reviewer Error:', {
      status,
      message: errorMessage,
      validationErrors,
      fullResponse: errorData,
      requestData: {
        research_id: selectedResearch.value.id,
        reviewer_id: Number(selectedReviewerId.value),
      },
    });

    // Show error message with validation details if available
    if (status === 422 && Object.keys(validationErrors).length > 0) {
      const details = Object.entries(validationErrors)
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`,
        )
        .join('\n');
      toast.error(`خطأ في البيانات:\n${details}`);
    } else {
      toast.error(errorMessage);
    }
  } finally {
    assigning.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  loadResearch();
}

function resetFilters() {
  filters.value = {
    q: '',
    status: '',
    department: '',
    from: '',
    to: '',
  };
  page.value = 1;
  loadResearch();
}

onMounted(async () => {
  await Promise.all([loadResearch(), loadReviewers()]);
});
</script>
