<template>
  <AppShellLayout page-title="لوحة الإدارة">
    <SectionHeader
      eyebrow="الإدارة"
      title="نظرة عامة على النظام"
      description="ملخص الأبحاث، المستخدمين المعلقين، ونشاط النظام."
    />

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="مستخدمون للتفعيل"
        :value="store.pendingUsers.length"
        icon="how_to_reg"
        variant="warning"
      />
      <StatCard
        label="إجمالي الأبحاث"
        :value="store.researchList.length"
        icon="description"
        variant="primary"
      />
      <StatCard
        label="قيد المراجعة"
        value="0"
        icon="rate_review"
        variant="info"
      />
      <StatCard
        label="معتمدة"
        value="0"
        icon="verified"
        variant="success"
      />
    </section>

    <BaseCard
      title="آخر المستخدمين المعلقين"
      icon="person_add"
    >
      <BaseTable
        :columns="columns"
        :rows="store.pendingUsers.slice(0, 5)"
        :loading="store.loading"
        empty-title="لا توجد طلبات تفعيل"
      >
        <template #row="{ row }">
          <td>{{ row.name }}</td>
          <td class="font-mono text-sm">
            {{ row.email }}
          </td>
          <td>{{ row.faculty }}</td>
          <td class="font-mono">
            {{ formatDate(row.created_at) }}
          </td>
          <td>
            <BaseButton
              variant="ghost"
              size="sm"
              icon-left="open_in_new"
              to="/admin/users/pending"
            >
              مراجعة
            </BaseButton>
          </td>
        </template>
      </BaseTable>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseTable from '@/components/shared/BaseTable.vue';
import StatCard from '@/components/shared/StatCard.vue';
import { useAdminStore } from '@/stores/admin.store';
import { formatDate } from '@/utils/helpers';

const store = useAdminStore();

const columns = [
  { key: 'name', label: 'الاسم' },
  { key: 'email', label: 'البريد' },
  { key: 'faculty', label: 'الكلية' },
  { key: 'created_at', label: 'تاريخ الطلب' },
  { key: 'actions', label: '' },
];

onMounted(() => {
  store.fetchPendingUsers();
  store.fetchResearchList();
});
</script>
