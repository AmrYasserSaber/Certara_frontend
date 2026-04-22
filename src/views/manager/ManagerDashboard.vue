<template>
  <AppShellLayout page-title="لوحة مدير اللجنة">
    <SectionHeader
      eyebrow="مدير اللجنة"
      title="القرارات النهائية"
      description="الأبحاث التي اكتمل دور المراجع فيها وتنتظر قرارك النهائي."
    />

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="قائمة الانتظار"
        :value="store.managerQueue.length"
        icon="hourglass_top"
        variant="warning"
      />
      <StatCard
        label="موافقة نهائية"
        value="0"
        icon="workspace_premium"
        variant="success"
      />
      <StatCard
        label="مرفوض"
        value="0"
        icon="do_not_disturb_on"
        variant="error"
      />
      <StatCard
        label="معدل الإصدار"
        value="0%"
        icon="insights"
        variant="info"
      />
    </section>

    <BaseCard
      title="قائمة القرارات المعلقة"
      icon="gavel"
    >
      <BaseTable
        :columns="columns"
        :rows="store.managerQueue"
        :loading="store.loading"
        empty-title="لا توجد أبحاث بانتظار القرار"
      >
        <template #row="{ row }">
          <td class="font-mono text-sm">
            {{ row.serial || row.id }}
          </td>
          <td class="font-headline font-bold text-on-background">
            {{ row.title }}
          </td>
          <td><StatusBadge :status="row.status" /></td>
          <td class="font-mono">
            {{ formatDate(row.updated_at) }}
          </td>
          <td>
            <BaseButton
              variant="primary"
              size="sm"
              icon-left="gavel"
              :to="`/manager/research/${row.id}`"
            >
              إصدار قرار
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
import StatusBadge from '@/components/shared/StatusBadge.vue';
import { useAdminStore } from '@/stores/admin.store';
import { formatDate } from '@/utils/helpers';

const store = useAdminStore();

const columns = [
  { key: 'serial', label: 'الرقم' },
  { key: 'title', label: 'العنوان' },
  { key: 'status', label: 'الحالة' },
  { key: 'updated_at', label: 'آخر تحديث' },
  { key: 'actions', label: '' },
];

onMounted(() => {
  store.fetchManagerQueue();
  store.fetchManagerStats();
});
</script>
