<template>
  <AppShellLayout page-title="سجل النشاط">
    <SectionHeader
      eyebrow="الإدارة"
      title="سجل نشاط النظام"
      description="عرض الفاعل، الإجراء، الهدف، والتوقيت — 20 صف في الصفحة."
    />

    <div class="card-flat p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <BaseInput
          v-model="filters.action"
          label="الإجراء"
          placeholder="مثال: admin.serial_generated"
        />
        <BaseInput
          v-model="filters.target_type"
          label="نوع الهدف"
          placeholder="research / user"
        />
        <BaseInput
          v-model="filters.actor_id"
          label="رقم الفاعل"
          placeholder="مثال: 1"
        />
        <div class="flex items-end gap-2">
          <BaseButton
            variant="ghost"
            icon-left="restart_alt"
            @click="resetFilters"
          >
            إعادة
          </BaseButton>
          <BaseButton
            variant="primary"
            icon-left="search"
            @click="applyFilters"
          >
            بحث
          </BaseButton>
        </div>
      </div>
    </div>

    <BaseTable
      :columns="columns"
      :rows="logs"
      :loading="loading"
      empty-title="لا يوجد نشاط مطابق"
    >
      <template #row="{ row }">
        <td>{{ row.actor_name || `User #${row.actor_id || '-'}` }}</td>
        <td class="font-mono text-xs">
          {{ row.action }}
        </td>
        <td>
          <div class="text-sm">
            <p class="font-bold">
              {{ row.target_type || '—' }}
            </p>
            <p class="text-xs text-on-surface-variant font-mono">
              #{{ row.target_id || '—' }}
            </p>
          </div>
        </td>
        <td class="font-mono text-xs">
          {{ formatDate(row.created_at, 'DD/MM/YYYY HH:mm') }}
        </td>
      </template>

      <template #footer>
        <BasePagination
          v-model="page"
          :total-items="total"
          :per-page="limit"
          @update:model-value="loadLogs"
        />
      </template>
    </BaseTable>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseTable from '@/components/shared/BaseTable.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePagination from '@/components/shared/BasePagination.vue';
import adminService from '@/services/admin.service';
import { useToast } from '@/composables/useToast';
import { formatDate } from '@/utils/helpers';

const toast = useToast();

const loading = ref(false);
const logs = ref([]);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

const filters = ref({
  action: '',
  target_type: '',
  actor_id: '',
});

const columns = [
  { key: 'actor', label: 'الفاعل' },
  { key: 'action', label: 'الإجراء' },
  { key: 'target', label: 'الهدف' },
  { key: 'created_at', label: 'التوقيت' },
];

function buildParams() {
  return {
    page: page.value,
    limit: limit.value,
    action: filters.value.action || '',
    target_type: filters.value.target_type || '',
    actor_id: filters.value.actor_id || '',
  };
}

async function loadLogs() {
  loading.value = true;
  try {
    const res = await adminService.activityLogs(buildParams());
    logs.value = res?.data?.data?.items || [];
    total.value = Number(res?.data?.meta?.total || 0);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل سجل النشاط');
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  page.value = 1;
  loadLogs();
}

function resetFilters() {
  filters.value = { action: '', target_type: '', actor_id: '' };
  page.value = 1;
  loadLogs();
}

onMounted(loadLogs);
</script>
