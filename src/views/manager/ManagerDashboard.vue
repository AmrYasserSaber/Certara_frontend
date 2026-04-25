<template>
  <AppShellLayout page-title="لوحة مدير اللجنة" :nav-items="managerNavItems">
    <SectionHeader
      eyebrow="المدير"
      title="طلبات بانتظار القرار النهائي"
      description="الأبحاث المعتمدة من المراجعين وتحتاج اعتمادًا نهائيًا من المدير."
    />

    <DashboardStatsGrid :items="statsItems" />

    <BaseCard title="قائمة الأبحاث الجاهزة للقرار" icon="fact_check" class="mt-6">
      <div v-if="loading" class="py-16 flex justify-center">
        <LoadingSpinner />
      </div>

      <div v-else-if="queue.length" class="space-y-4">
        <article
          v-for="item in queue"
          :key="item.id"
          class="card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="min-w-0 flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="chip chip-teal font-mono text-xs">
                {{ item.serial_number || `#${item.id}` }}
              </span>
              <StatusBadge :status="item.status" />
            </div>

            <h3 class="font-headline font-bold text-on-background text-base lg:text-lg truncate">
              {{ item.title || 'بدون عنوان' }}
            </h3>

            <p class="text-sm text-on-surface-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-base">apartment</span>
              {{ item.department || 'قسم غير محدد' }}
            </p>

            <p class="text-sm text-on-surface-variant leading-7 line-clamp-2">
              {{ reviewSummary(item) }}
            </p>
          </div>

          <div class="flex items-center gap-2 lg:self-end">
            <BaseButton
              variant="ghost"
              size="sm"
              icon-left="workspace_premium"
              :to="`/manager/research/${item.id}/certificate`"
            >
              الشهادة
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              icon-left="gavel"
              :to="`/manager/research/${item.id}`"
            >
              مراجعة واتخاذ قرار
            </BaseButton>
          </div>
        </article>
      </div>

      <div v-else class="py-12 text-center text-on-surface-variant">
        لا توجد أبحاث بانتظار القرار النهائي حاليًا.
      </div>

      <template #footer>
        <BasePagination
          v-model="page"
          :total-items="total"
          :per-page="limit"
          @update:model-value="loadData"
        />
      </template>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePagination from '@/components/shared/BasePagination.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import DashboardStatsGrid from '@/components/admin/DashboardStatsGrid.vue';
import adminService from '@/services/admin.service';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const loading = ref(false);
const queue = ref([]);
const stats = ref({});
const page = ref(1);
const limit = ref(20);
const total = ref(0);

const managerNavItems = [{ to: '/manager', label: 'لوحة التحكم', icon: 'dashboard' }];

const statsItems = computed(() => [
  {
    key: 'queue',
    label: 'قائمة الانتظار',
    value: Number(stats.value.queue || queue.value.length || 0),
    icon: 'pending_actions',
    variant: 'warning',
  },
  {
    key: 'approved',
    label: 'معتمد نهائيًا',
    value: Number(stats.value.approved || 0),
    icon: 'check_circle',
    variant: 'success',
  },
  {
    key: 'rejected',
    label: 'مرفوض',
    value: Number(stats.value.rejected || 0),
    icon: 'cancel',
    variant: 'error',
  },
  {
    key: 'issuance_rate',
    label: 'معدل الإصدار',
    value: `${Number(stats.value.issuance_rate || 0)}%`,
    icon: 'speed',
    variant: 'info',
  },
]);

function reviewSummary(item) {
  const latest =
    Array.isArray(item.review_comments) && item.review_comments.length
      ? item.review_comments[0]?.comment_text
      : '';

  if (latest) return `ملخص المراجعة: ${latest}`;
  if (item.review?.decision) return `قرار المراجع: ${item.review.decision}`;
  return 'ملخص المراجعة غير متوفر بعد، لكن البحث جاهز للقرار النهائي.';
}

async function loadQueue() {
  const res = await adminService.managerReviewed({ page: page.value, limit: limit.value });
  const payload = res?.data?.data || {};
  const items = payload.items || [];
  const allowedStatuses = new Set(['reviewer_approved', 'manager_reviewing']);
  queue.value = items.filter((item) => allowedStatuses.has(String(item?.status || '')));
  total.value = Number(res?.data?.meta?.total || payload.total || queue.value.length || 0);
}

async function loadStats() {
  const res = await adminService.managerStats();
  stats.value = res?.data?.data || {};
}

async function loadData() {
  loading.value = true;
  try {
    await Promise.all([loadQueue(), loadStats()]);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل بيانات لوحة المدير');
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>
