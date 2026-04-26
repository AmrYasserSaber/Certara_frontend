<template>
  <AppShellLayout page-title="مركز المراجعة العمياء" active-variant="gold">
    <div dir="rtl" class="space-y-4">
      <span class="blind-badge">وضع الهوية المخفية نشط 🔒</span>

      <section class="grid-layout">
        <article class="detail-panel">
          <template v-if="selectedResearch">
            <div class="detail-header">
              <div class="badges-row">
                <span class="version-badge">V. 1.2</span>
                <span class="protocol-badge">{{
                  selectedResearch.serial_number || `PRT-${selectedResearch.id}`
                }}</span>
              </div>

              <div class="header-actions">
                <button class="icon-btn" type="button" @click="printView">
                  <span class="material-symbols-outlined">print</span>
                </button>
                <button class="icon-btn" type="button" @click="downloadFirstDocument">
                  <span class="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <h2 class="research-title">{{ selectedResearch.title }}</h2>

            <section class="text-section">
              <h3>1. ملخص البحث (Abstract)</h3>
              <p>
                هذا الملخص مخصص للمراجعة العمياء ويعرض وصفاً مختصراً لهدف الدراسة ومنهجها دون أي
                بيانات تعريفية للطالب. الباحث الرئيسي:
                {{ selectedResearch.principal_investigator || 'غير محدد' }}.
              </p>
            </section>

            <section class="text-section">
              <h3>2. المنهجية والأدوات (Methodology)</h3>
              <p>
                يوضح هذا القسم التصميم البحثي، أدوات القياس، وخطة التحليل الإحصائي بصورة عامة لضمان
                تقييم علمي منصف. القسم العلمي: {{ selectedResearch.department || 'غير محدد' }}.
              </p>
            </section>

            <section class="text-section">
              <h3>تفاصيل العينة البيولوجية:</h3>
              <p>
                لا يحتوي العرض الحالي على بيانات شخصية، ويتم التركيز فقط على الجوانب العلمية
                المرتبطة بالعينة وآلية اختيارها.
              </p>
            </section>

            <ResearchDocumentList :documents="documents" />

            <CommentThread :comments="comments" />

            <CommentComposer :submit-action="submitComment" @comment-added="refreshDetail" />

            <DecisionPanel
              :submit-action="submitDecision"
              @decision-submitted="onDecisionSubmitted"
            />
          </template>

          <p v-else-if="loading" class="state-text">جاري تحميل بيانات البحث...</p>

          <p v-else class="state-text">لا يوجد بحث مسند حالياً</p>
        </article>

        <aside class="list-panel">
          <h3>الأبحاث المسندة</h3>

          <p v-if="loading && !assignedReviews.length" class="state-text">جاري التحميل...</p>

          <ul v-else class="research-list">
            <li v-for="item in assignedReviews" :key="item.id">
              <button
                :class="['research-card', { active: Number(item.id) === Number(selectedId) }]"
                type="button"
                @click="selectResearch(item.id)"
              >
                <div class="card-head">
                  <span class="card-date">{{ formatDate(item.created_at) }}</span>
                  <span class="card-badge">{{ item.serial_number || `PRT-${item.id}` }}</span>
                </div>
                <strong class="card-title">{{ item.title }}</strong>
                <span class="card-dept">🏛 {{ item.department || 'غير محدد' }}</span>
              </button>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import CommentComposer from '@/components/reviewer/CommentComposer.vue';
import CommentThread from '@/components/reviewer/CommentThread.vue';
import DecisionPanel from '@/components/reviewer/DecisionPanel.vue';
import ResearchDocumentList from '@/components/reviewer/ResearchDocumentList.vue';
import { useToast } from '@/composables/useToast';
import { useReviewStore } from '@/stores/review.store';
import researchService from '@/services/research.service';

const router = useRouter();
const toast = useToast();
const reviewStore = useReviewStore();

const selectedId = ref(null);
const loading = computed(() => reviewStore.loading);

const assignedReviews = computed(() => reviewStore.assignedReviews);
const selectedReview = computed(() => reviewStore.currentReview);
const selectedResearch = computed(() => selectedReview.value?.research || null);
const documents = computed(() =>
  Array.isArray(selectedReview.value?.documents) ? selectedReview.value.documents : [],
);
const comments = computed(() => selectedReview.value?.comments || []);

onMounted(async () => {
  try {
    await reviewStore.fetchAssigned();
    if (assignedReviews.value.length > 0) {
      await selectResearch(assignedReviews.value[0].id);
    }
  } catch {
    toast.error('تعذر تحميل قائمة الأبحاث المسندة');
  }
});

async function selectResearch(researchId) {
  selectedId.value = researchId;
  try {
    await reviewStore.fetchOne(researchId);
  } catch {
    toast.error('تعذر تحميل تفاصيل البحث');
  }
}

async function refreshDetail() {
  if (!selectedId.value) return;
  await reviewStore.fetchOne(selectedId.value);
}

async function submitComment(text) {
  if (!selectedId.value) return null;
  const created = await reviewStore.addComment(selectedId.value, text);
  toast.success('تم إضافة التعليق');
  return created;
}

async function submitDecision(decision, comment) {
  if (!selectedId.value) return;
  await reviewStore.submitDecision(selectedId.value, decision, comment);
}

async function onDecisionSubmitted() {
  await router.push('/reviewer/assigned');
  if (assignedReviews.value.length > 0) {
    await selectResearch(assignedReviews.value[0].id);
  } else {
    selectedId.value = null;
  }
}

function printView() {
  window.print();
}

async function downloadFirstDocument() {
  if (!documents.value.length) {
    toast.info('لا يوجد مستندات للتنزيل');
    return;
  }

  try {
    const first = documents.value[0];
    const response = await researchService.getDocumentSignedUrl(first.research_id, first.id);
    const url = response?.data?.data?.url;
    if (!url) {
      toast.error('تعذر إنشاء رابط تنزيل للمستند');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    toast.error('تعذر تنزيل المستند حالياً');
  }
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(value));
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

.icon-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #dbe4ee;
  border-radius: 10px;
  background: #ffffff;
  color: #334155;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.blind-badge {
  background: #e0f2f1;
  color: #1a7a6e;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  display: inline-flex;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  gap: 14px;
}

.detail-panel,
.list-panel {
  background: #ffffff;
  border: 1px solid #dbe4ee;
  border-radius: 16px;
}

.detail-panel {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badges-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.version-badge {
  background: #e2e8f0;
  color: #334155;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 0.82rem;
}

.protocol-badge {
  background: #dcfce7;
  color: #1a7a6e;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.research-title {
  margin: 0;
  color: #0f1f2e;
  font-size: 1.35rem;
}

.text-section {
  border-left: 4px solid #c9a84c;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.text-section h3 {
  margin: 0 0 8px;
  color: #0f1f2e;
}

.text-section p {
  margin: 0;
  line-height: 1.9;
  color: #334155;
}

.list-panel {
  padding: 14px;
  max-height: calc(100vh - 110px);
  overflow: auto;
}

.list-panel h3 {
  margin: 0 0 10px;
}

.research-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.research-card {
  width: 100%;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #ffffff;
  padding: 10px;
  text-align: right;
  display: grid;
  gap: 8px;
  cursor: pointer;
}

.research-card.active {
  border-color: #c9a84c;
  box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.2);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-date {
  color: #64748b;
  font-size: 0.82rem;
}

.card-badge {
  background: #d1fae5;
  color: #1a7a6e;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
}

.card-title {
  color: #0f1f2e;
  line-height: 1.6;
}

.card-dept {
  color: #475569;
  font-size: 0.86rem;
}

.state-text {
  margin: 0;
  color: #64748b;
}

@media (max-width: 1200px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }

  .list-panel {
    max-height: 420px;
  }
}
</style>
