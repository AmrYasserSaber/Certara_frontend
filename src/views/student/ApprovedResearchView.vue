<template>
  <AppShellLayout page-title="الأبحاث المعتمدة">
    <SectionHeader
      eyebrow="الطالب"
      title="أبحاثي المعتمدة"
      description="هنا تجد جميع أبحاثك التي حصلت على الموافقة النهائية والشهادات الخاصة بها."
    />

    <BaseCard title="قائمة الموافقات" icon="verified" class="mt-6">
      <div v-if="loading" class="py-16 flex justify-center">
        <LoadingSpinner />
      </div>

      <div v-else-if="approvedList.length" class="space-y-4">
        <article
          v-for="item in approvedList"
          :key="item.id"
          class="card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="min-w-0 flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="chip chip-teal font-mono text-xs">
                {{ item.serial_number || `#${item.id}` }}
              </span>
              <StatusBadge status="approved" />
            </div>

            <h3 class="font-headline font-bold text-on-background text-base lg:text-lg truncate">
              {{ item.title }}
            </h3>

            <p class="text-sm text-on-surface-variant flex items-center gap-2">
              <span class="material-symbols-outlined text-base">calendar_today</span>
              تاريخ التقديم: {{ formatDate(item.created_at) }}
            </p>
          </div>

          <div class="flex items-center gap-2 lg:self-end">
            <BaseButton
              v-if="item.certificate"
              variant="primary"
              size="sm"
              icon-left="download"
              @click="downloadCertificate(item.id)"
            >
              تحميل الشهادة
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              icon-left="visibility"
              :to="`/student/research/${item.id}`"
            >
              عرض التفاصيل
            </BaseButton>
          </div>
        </article>
      </div>

      <div v-else class="py-12 text-center text-on-surface-variant">
        لا توجد أبحاث معتمدة بعد.
      </div>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import { useResearchStore } from '@/stores/research.store';
import { formatDate } from '@/utils/helpers';

const store = useResearchStore();
const loading = ref(false);

const approvedList = computed(() => 
  store.list.filter(r => r.status?.toLowerCase() === 'approved')
);

async function downloadCertificate(researchId) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const host = apiBase.replace(/\/api\/?$/, '');
  const url = `${host}/api/research/${researchId}/certificate`;
  window.open(url, '_blank');
}

onMounted(async () => {
  loading.value = true;
  await store.fetchList();
  loading.value = false;
});
</script>
