<template>
  <div class="sample-page" dir="rtl">
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">
          <span class="material-symbols-outlined">account_balance</span>
        </div>
        <h2>البوابة العلمية</h2>
        <p>إدارة البحوث المؤسسية</p>
      </div>

      <nav class="nav-list">
        <a
          v-for="item in sidebarItems"
          :key="item.key"
          href="#"
          :class="{ active: item.key === activeSidebarKey }"
        >
          {{ item.label }}
        </a>
      </nav>

      <BaseButton variant="primary" icon-left="add" class="new-btn">
        + بدء بروتوكول جديد
      </BaseButton>
    </aside>

    <main class="content-area">
      <header class="stats-bar">
        <div class="crumbs">IRB-SYS &gt; W-QUEUE-08</div>

        <div class="stats">
          <div class="stat">
            <small>إجمالي الانتظار</small>
            <strong>{{ totalCount }}</strong>
          </div>
          <div class="stat danger">
            <small>أولوية قصوى</small>
            <strong>{{ highPriorityCount.toString().padStart(2, '0') }}</strong>
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
            @open-protocol="openProtocol"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseButton from '@/components/shared/BaseButton.vue';
import PendingResearchCard from '@/components/sample-size/PendingResearchCard.vue';
import { useToast } from '@/composables/useToast';
import { sampleService } from '@/services/sample.service';

const route = useRoute();
const toast = useToast();

const pendingRows = ref([]);
const loading = ref(false);
const expandedId = ref(null);

onMounted(async () => {
  await fetchPending();
});

const totalCount = computed(() => pendingRows.value.length);

const highPriorityCount = computed(() => {
  const len = pendingRows.value.length;
  if (!len) return 0;
  return Math.max(1, Math.ceil(len * 0.2));
});

const sidebarItems = [
  { key: 'dashboard', label: 'لوحة القيادة' },
  { key: 'sample-management', label: 'إدارة العينات' },
  { key: 'committee-review', label: 'مراجعة اللجنة' },
  { key: 'certificates', label: 'إصدار الشهادات' },
  { key: 'archive', label: 'الأرشيف' },
];

const activeSidebarKey = computed(() => {
  if (route.path.startsWith('/sample-size')) return 'sample-management';
  return 'dashboard';
});

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

function openProtocol(item) {
  toast.info(`فتح البروتوكول: ${item.serial_number || item.id}`);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

.sample-page {
  --color-navy: #1a2332;
  --color-teal: #1a7a6e;
  --color-gold: #c9a84c;
  --color-amber: #f59e0b;
  --color-danger: #dc2626;
  --color-surface: #f8fafc;
  --color-card: #ffffff;

  min-height: 100vh;
  background: radial-gradient(circle at 20% 0, #e8edf5 0, #f8fafc 42%, #eef2f7 100%);
  font-family: 'Cairo', 'Tahoma', sans-serif;
  color: #0f172a;
  text-align: right;
}

.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: var(--color-navy);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 12px;
}

.logo-area {
  text-align: right;
}

.logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.logo-area h2 {
  margin: 0;
  color: #ffffff;
  font-size: 1.08rem;
}

.logo-area p {
  margin: 5px 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.nav-list {
  display: grid;
  gap: 5px;
}

.nav-list a {
  color: #cbd5e1;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 10px;
}

.nav-list a:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-list a.active {
  color: var(--color-gold);
  border-right: 3px solid var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
  font-weight: 700;
}

.new-btn {
  margin-top: auto;
  background: #16a34a !important;
  border-color: #16a34a !important;
}

.content-area {
  margin-right: 240px;
  padding: 18px;
}

.stats-bar {
  background: var(--color-card);
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.crumbs {
  color: #475569;
  font-weight: 700;
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
  color: var(--color-amber);
}

.panel {
  background: var(--color-card);
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
  .sidebar {
    width: 100%;
    position: static;
    height: auto;
  }

  .content-area {
    margin-right: 0;
  }

  .stats-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-header {
    grid-template-columns: 1fr;
  }
}
</style>
