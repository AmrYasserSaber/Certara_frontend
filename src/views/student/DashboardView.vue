<template>
  <AppShellLayout page-title="لوحة الطالب">
    <SectionHeader
      eyebrow="لوحة الطالب"
      title="مرحباً بك في نظام IRB"
      description="تابع أبحاثك، قدم بروتوكولًا جديدًا، وأكمل الخطوات المطلوبة."
    >
      <template #actions>
        <BaseButton
          variant="primary"
          icon-left="add"
          to="/student/research/new"
        >
          بروتوكول جديد
        </BaseButton>
      </template>
    </SectionHeader>

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="إجمالي الأبحاث"
        :value="store.list.length"
        icon="folder"
        variant="primary"
      />
      <StatCard
        label="قيد المراجعة"
        value="0"
        icon="pending_actions"
        variant="info"
      />
      <StatCard
        label="موافقات"
        value="0"
        icon="verified"
        variant="success"
      />
      <StatCard
        label="بانتظار إجراء"
        value="0"
        icon="warning"
        variant="warning"
      />
    </section>

    <BaseCard
      title="أبحاثي"
      icon="assignment"
    >
      <BaseTable
        :columns="columns"
        :rows="store.list"
        :loading="store.loading"
        empty-title="لم تقدم أي بحث بعد"
        empty-description="ابدأ بتقديم بروتوكولك الأول للحصول على موافقة اللجنة."
      >
        <template #row="{ row }">
          <td class="font-headline font-bold text-on-background">
            {{ row.title }}
          </td>
          <td><StatusBadge :status="row.status" /></td>
          <td class="text-on-surface-variant font-mono">
            {{ formatDate(row.created_at) }}
          </td>
          <td class="flex items-center gap-2">
            <BaseButton
              variant="ghost"
              size="sm"
              icon-left="open_in_new"
              :to="`/student/research/${row.id}`"
            >
              عرض
            </BaseButton>
            <BaseButton
              v-if="['DRAFT', 'REVISION_REQUESTED'].includes(row.status)"
              variant="ghost"
              size="sm"
              icon-left="edit"
              :to="`/student/research/${row.id}/edit`"
            >
              تعديل
            </BaseButton>
            <BaseButton
              v-if="row.status === 'AWAITING_PAYMENT_1' || row.status === 'AWAITING_PAYMENT_2'"
              variant="outline"
              size="sm"
              icon-left="payments"
              :to="`/student/research/${row.id}/pay`"
            >
              الدفع
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
import { useResearchStore } from '@/stores/research.store';
import { formatDate } from '@/utils/helpers';

const store = useResearchStore();

const columns = [
  { key: 'title', label: 'عنوان البحث' },
  { key: 'status', label: 'الحالة' },
  { key: 'created_at', label: 'تاريخ التقديم' },
  { key: 'actions', label: '' },
];

onMounted(() => store.fetchList());
</script>
