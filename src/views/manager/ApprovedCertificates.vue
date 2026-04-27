<template>
  <AppShellLayout page-title="الشهادات المعتمدة">
    <SectionHeader
      eyebrow="المدير"
      title="الأبحاث المعتمدة والشهادات"
      description="قائمة بجميع الأبحاث التي حصلت على الموافقة النهائية وجاهزة للطباعة."
    />

    <BaseCard title="الأبحاث المجازة" icon="verified" class="mt-6">
      <div v-if="loading" class="py-16 flex justify-center">
        <LoadingSpinner />
      </div>

      <div v-else-if="items.length" class="space-y-4">
        <article
          v-for="item in items"
          :key="item.id"
          class="card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="min-w-0 flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="chip chip-teal font-mono text-xs">
                {{ item.serial_number || `#${item.id}` }}
              </span>
              <StatusBadge :status="item.status" />
              <span v-if="item.certificate" class="chip chip-gold text-xs">
                شهادة رقم: {{ item.certificate.certificate_number }}
              </span>
            </div>

            <h3 class="font-headline font-bold text-on-background text-base lg:text-lg truncate">
              {{ item.title || 'بدون عنوان' }}
            </h3>

            <p class="text-sm text-on-surface-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-base">person</span>
              الباحث: {{ item.student?.name || '—' }}
            </p>

            <p class="text-sm text-on-surface-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-base">apartment</span>
              {{ item.department || '—' }} / {{ item.faculty || '—' }}
            </p>
          </div>

          <div class="flex items-center gap-2 lg:self-end">
            <BaseButton
              variant="primary"
              size="sm"
              icon-left="visibility"
              :to="`/manager/research/${item.id}`"
            >
              التفاصيل
            </BaseButton>
          </div>
        </article>
      </div>

      <div v-else class="py-12 text-center text-on-surface-variant">
        لا توجد أبحاث معتمدة حاليًا.
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
import { onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePagination from '@/components/shared/BasePagination.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import adminService from '@/services/admin.service';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const loading = ref(false);
const items = ref([]);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

async function loadData() {
  loading.value = true;
  try {
    const res = await adminService.managerApprovedCertificates({ page: page.value, limit: limit.value });
    const payload = res?.data?.data || {};
    items.value = payload.items || [];
    total.value = Number(res?.data?.meta?.total || payload.total || items.value.length || 0);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل قائمة الشهادات');
  } finally {
    loading.value = false;
  }
}

function printCertificate(researchId) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const host = apiBase.replace(/\/api\/?$/, '');
  const url = `${host}/api/research/${researchId}/certificate`;
  
  // Open in new tab and trigger print
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.focus();
    // Since it's a PDF or HTML from the server, we might need a small delay or 
    // just let the user use the browser's print function.
    // If it's HTML, we can trigger print() once loaded.
  }
}

async function issueAndPrint(researchId) {
  try {
    loading.value = true;
    await adminService.issueCertificate(researchId);
    toast.success('تم إصدار الشهادة بنجاح');
    await loadData();
    printCertificate(researchId);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'فشل إصدار الشهادة');
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>
