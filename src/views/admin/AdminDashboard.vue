<template>
  <AppShellLayout page-title="لوحة الإدارة">
    <SectionHeader
      eyebrow="الإدارة"
      title="نظرة عامة على الإدارة"
      description="إحصائيات المستخدمين والأبحاث مع إجراءات سريعة."
    >
      <template #actions>
        <BaseButton variant="ghost" icon-left="how_to_reg" to="/admin/users/pending">
          عرض المستخدمين المعلقين
        </BaseButton>
        <BaseButton variant="primary" icon-left="description" to="/admin/research">
          عرض جميع الأبحاث
        </BaseButton>
      </template>
    </SectionHeader>

    <DashboardStatsGrid :items="statsCards" />

    <BaseCard
      title="المستخدمون المعلقون حديثًا"
      subtitle="آخر 5 طلبات تسجيل بانتظار اعتماد الإدارة"
      icon="person_add"
      class="mt-8"
    >
      <BaseTable
        :columns="columns"
        :rows="latestPending"
        :loading="loading"
        empty-title="لا توجد طلبات معلقة"
      >
        <template #row="{ row }">
          <td class="font-bold text-on-background">{{ row.name }}</td>
          <td class="font-mono text-xs">{{ row.email }}</td>
          <td>{{ row.department || '—' }}</td>
          <td>{{ row.faculty || '—' }}</td>
          <td class="font-mono text-xs">{{ formatDate(row.created_at) }}</td>
          <td>
            <BaseButton variant="ghost" size="sm" icon-left="open_in_new" to="/admin/users/pending">
              إدارة
            </BaseButton>
          </td>
        </template>
      </BaseTable>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseTable from '@/components/shared/BaseTable.vue';
import DashboardStatsGrid from '@/components/admin/DashboardStatsGrid.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/helpers';

const loading = ref(false);
const pendingUsers = ref([]);

const stats = ref({
  totalUsers: 0,
  pendingUsers: 0,
  totalResearch: 0,
  inReview: 0,
  approved: 0,
  rejected: 0,
});

const columns = [
  { key: 'name', label: 'الاسم' },
  { key: 'email', label: 'البريد' },
  { key: 'department', label: 'القسم' },
  { key: 'faculty', label: 'الكلية' },
  { key: 'created_at', label: 'تاريخ التسجيل' },
  { key: 'actions', label: '' },
];

const latestPending = computed(() => pendingUsers.value.slice(0, 5));

const statsCards = computed(() => [
  {
    key: 'users-total',
    label: 'إجمالي المستخدمين',
    value: stats.value.totalUsers,
    icon: 'groups',
    variant: 'primary',
  },
  {
    key: 'users-pending',
    label: 'في انتظار التفعيل',
    value: stats.value.pendingUsers,
    icon: 'person_add',
    variant: 'warning',
  },
  {
    key: 'research-total',
    label: 'إجمالي الأبحاث',
    value: stats.value.totalResearch,
    icon: 'folder_open',
    variant: 'info',
  },
  {
    key: 'research-in-review',
    label: 'الأبحاث قيد المراجعة',
    value: stats.value.inReview,
    icon: 'pending_actions',
    variant: 'secondary',
  },
  {
    key: 'research-approved',
    label: 'الأبحاث المعتمدة',
    value: stats.value.approved,
    icon: 'task_alt',
    variant: 'success',
  },
  {
    key: 'research-rejected',
    label: 'الأبحاث المرفوضة',
    value: stats.value.rejected,
    icon: 'cancel',
    variant: 'error',
  },
]);

function totalFrom(envelope) {
  return Number(envelope?.meta?.total || 0);
}

async function loadDashboard() {
  loading.value = true;
  try {
    const [
      pendingRes,
      activeRes,
      rejectedRes,
      allResearchRes,
      inReviewRes,
      approvedRes,
      rejectedResearchRes,
    ] = await Promise.all([
      adminService.pendingUsers({ page: 1, limit: 20, status: 'pending' }),
      adminService.pendingUsers({ page: 1, limit: 1, status: 'active' }),
      adminService.pendingUsers({ page: 1, limit: 1, status: 'rejected' }),
      adminService.allResearch({ page: 1, limit: 1 }),
      adminService.allResearch({ page: 1, limit: 1, status: 'in_review' }),
      adminService.allResearch({ page: 1, limit: 1, status: 'approved' }),
      adminService.allResearch({ page: 1, limit: 1, status: 'rejected' }),
    ]);

    pendingUsers.value = pendingRes?.data?.data?.items || [];

    const pendingTotal = totalFrom(pendingRes?.data);
    const activeTotal = totalFrom(activeRes?.data);
    const rejectedTotal = totalFrom(rejectedRes?.data);

    stats.value.totalUsers = pendingTotal + activeTotal + rejectedTotal;
    stats.value.pendingUsers = pendingTotal;
    stats.value.totalResearch = totalFrom(allResearchRes?.data);
    stats.value.inReview = totalFrom(inReviewRes?.data);
    stats.value.approved = totalFrom(approvedRes?.data);
    stats.value.rejected = totalFrom(rejectedResearchRes?.data);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    // Consider using a toast/notification service to inform the user
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>
