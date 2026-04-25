<template>
  <AppShellLayout page-title="الأبحاث المعلقة" active-variant="teal">
    <div class="sample-page" dir="rtl">
      <header class="stats-bar">
        <div class="stats">
          <div class="stat">
            <small>إجمالي الانتظار</small>
            <strong>{{ totalCount }}</strong>
          </div>
        </div>
      </header>

      <section class="panel">
        <h1>قائمة التقديمات في انتظار الحساب</h1>

        <div class="table-header">
          <span>المعرف (ID)</span>
          <span>عنوان البحث</span>
          <span>القسم</span>
          <span>تاريخ الدفع</span>
          <span>الإجراء</span>
        </div>

        <p v-if="loading" class="state-text">جاري تحميل الطلبات...</p>

        <p v-else-if="!pendingRows.length" class="state-text">
          لا توجد طلبات بانتظار الحساب حالياً
        </p>

        <div v-else class="rows">
          <PendingResearchCard
            v-for="row in pendingRows"
            :key="row.id"
            :item="row"
            :expanded="Number(expandedId) === Number(row.id)"
            :submit-action="submitSampleResult"
            @toggle="toggleRow"
            @submitted="onRowSubmitted"
          />
        </div>
      </section>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import PendingResearchCard from '@/components/sample-size/PendingResearchCard.vue';
import { useToast } from '@/composables/useToast';
import { sampleService } from '@/services/sample.service';

const toast = useToast();

const pendingRows = ref([]);
const loading = ref(false);
const expandedId = ref(null);

onMounted(async () => {
  await fetchPending();
});

const totalCount = computed(() => pendingRows.value.length);

async function fetchPending() {
  loading.value = true;
  try {
    const response = await sampleService.getPending();
    pendingRows.value = response?.data?.data?.data ?? [];
  } catch {
    toast.error('تعذر تحميل قائمة الأبحاث المنتظرة');
  } finally {
    loading.value = false;
  }
}

function toggleRow(id) {
  expandedId.value = Number(expandedId.value) === Number(id) ? null : id;
}

async function submitSampleResult(researchId, payload) {
  await sampleService.submit(researchId, payload);
  toast.success('تم تسجيل حجم العينة بنجاح');
}

function onRowSubmitted(researchId) {
  pendingRows.value = pendingRows.value.filter((item) => Number(item.id) !== Number(researchId));
  if (Number(expandedId.value) === Number(researchId)) {
    expandedId.value = null;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

.sample-page {
  background: radial-gradient(circle at 20% 0, #e8edf5 0, #f8fafc 42%, #eef2f7 100%);
  font-family: 'Cairo', 'Tahoma', sans-serif;
  color: #0f172a;
  text-align: right;
  padding: 18px;
}

.stats-bar {
  background: #ffffff;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat {
  min-width: 140px;
}

.stat small {
  display: block;
  color: #64748b;
}

.stat strong {
  font-size: 1.8rem;
  color: #0f1f2e;
}

.stat.danger strong {
  color: #f59e0b;
}

.panel {
  background: #ffffff;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  padding: 14px;
}

.panel h1 {
  margin: 0 0 14px;
  color: #0f1f2e;
  font-size: 1.8rem;
}

.table-header {
  display: grid;
  grid-template-columns: 1.4fr 3fr 1.4fr 1.2fr 60px;
  gap: 10px;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 12px 10px;
  color: #475569;
  font-weight: 700;
}

.rows {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.state-text {
  margin: 0;
  color: #64748b;
  padding: 10px 4px;
}

@media (max-width: 980px) {
  .stats-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-header {
    grid-template-columns: 1fr;
  }
}
</style>
