<template>
  <AppShellLayout page-title="لوحة المراجع" active-variant="gold">
    <SectionHeader
      eyebrow="المراجع"
      title="الأبحاث المسندة إليك"
      description="قائمة الأبحاث التي تنتظر مراجعتك. لا تظهر أي بيانات تعريفية عن الطالب."
    />

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="قائمة العمل" :value="store.assigned.length" icon="inbox" variant="primary" />
      <StatCard label="قيد المراجعة" value="0" icon="rate_review" variant="info" />
      <StatCard label="مكتملة" value="0" icon="check_circle" variant="success" />
      <StatCard label="طلبات تعديل" value="0" icon="edit_note" variant="warning" />
    </section>

    <div class="flex flex-wrap gap-2 mb-4">
      <BaseButton
        :variant="activeTab === 'active' ? 'primary' : 'secondary'"
        icon-left="inbox"
        @click="selectTab('active')"
      >
        نشطة
      </BaseButton>
      <BaseButton
        :variant="activeTab === 'archived' ? 'primary' : 'secondary'"
        icon-left="inventory_2"
        @click="selectTab('archived')"
      >
        مؤرشفة (مقبولة/مرفوضة)
      </BaseButton>
    </div>

    <BaseCard
      :title="activeTab === 'active' ? 'الأبحاث النشطة (Blind)' : 'الأبحاث المؤرشفة (Blind)'"
      :icon="activeTab === 'active' ? 'rate_review' : 'inventory_2'"
    >
      <BaseTable
        :columns="columns"
        :rows="activeTab === 'active' ? store.assignedReviews : store.archivedReviews"
        :loading="store.loading"
        :empty-title="activeTab === 'active' ? 'لا توجد أبحاث نشطة' : 'لا توجد أبحاث مؤرشفة'"
        :empty-description="
          activeTab === 'active'
            ? 'ستظهر هنا الأبحاث التي تنتظر مراجعتك.'
            : 'ستظهر هنا الأبحاث التي اتخذت بشأنها قرار (موافقة/رفض).'
        "
      >
        <template #row="{ row }">
          <td class="font-mono text-sm text-on-surface-variant">
            {{ row.serial_number || row.id }}
          </td>
          <td class="font-headline font-bold text-on-background">
            {{ row.title }}
          </td>
          <td><StatusBadge :status="row.status" /></td>
          <td class="text-on-surface-variant font-mono">
            {{ formatDate(row.created_at) }}
          </td>
          <td>
            <BaseButton
              :variant="activeTab === 'active' ? 'primary' : 'secondary'"
              size="sm"
              icon-left="arrow_back"
              :to="`/reviewer/research/${row.id}?mode=${activeTab}`"
            >
              {{ activeTab === 'active' ? 'بدء المراجعة' : 'عرض الدورة' }}
            </BaseButton>
          </td>
        </template>
      </BaseTable>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
const activeTab = ref('active');

const columns = [
  { key: 'serial', label: 'الرقم التسلسلي' },
  { key: 'title', label: 'العنوان' },
  { key: 'status', label: 'الحالة' },
  { key: 'assigned_at', label: 'تاريخ الإسناد' },
  { key: 'actions', label: '' },
];

onMounted(async () => {
  await store.fetchAssigned();
});

async function selectTab(tab) {
  activeTab.value = tab;
  if (tab === 'active') {
    await store.fetchAssigned();
    return;
  }
  await store.fetchArchived();
}
</script>
