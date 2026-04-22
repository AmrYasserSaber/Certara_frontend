<template>
  <AppShellLayout
    page-title="لوحة المراجع"
    active-variant="gold"
  >
    <SectionHeader
      eyebrow="المراجع"
      title="الأبحاث المسندة إليك"
      description="قائمة الأبحاث التي تنتظر مراجعتك. لا تظهر أي بيانات تعريفية عن الطالب."
    />

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="قائمة العمل"
        :value="store.assigned.length"
        icon="inbox"
        variant="primary"
      />
      <StatCard
        label="قيد المراجعة"
        value="0"
        icon="rate_review"
        variant="info"
      />
      <StatCard
        label="مكتملة"
        value="0"
        icon="check_circle"
        variant="success"
      />
      <StatCard
        label="طلبات تعديل"
        value="0"
        icon="edit_note"
        variant="warning"
      />
    </section>

    <BaseCard
      title="قائمة الأبحاث (Blind)"
      icon="rate_review"
    >
      <BaseTable
        :columns="columns"
        :rows="store.assigned"
        :loading="store.loading"
        empty-title="لا توجد أبحاث مسندة"
        empty-description="ستظهر هنا الأبحاث التي يسندها المدير إليك."
      >
        <template #row="{ row }">
          <td class="font-mono text-sm text-on-surface-variant">
            {{ row.serial || row.id }}
          </td>
          <td class="font-headline font-bold text-on-background">
            {{ row.title }}
          </td>
          <td><StatusBadge :status="row.status" /></td>
          <td class="text-on-surface-variant font-mono">
            {{ formatDate(row.assigned_at) }}
          </td>
          <td>
            <BaseButton
              variant="primary"
              size="sm"
              icon-left="arrow_back"
              :to="`/reviewer/research/${row.id}`"
            >
              بدء المراجعة
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
import { useReviewStore } from '@/stores/review.store';
import { formatDate } from '@/utils/helpers';

const store = useReviewStore();

const columns = [
  { key: 'serial', label: 'الرقم التسلسلي' },
  { key: 'title', label: 'العنوان' },
  { key: 'status', label: 'الحالة' },
  { key: 'assigned_at', label: 'تاريخ الإسناد' },
  { key: 'actions', label: '' },
];

onMounted(() => store.fetchAssigned());
</script>
