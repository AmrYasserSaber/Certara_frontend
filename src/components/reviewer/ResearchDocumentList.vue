<template>
  <section class="doc-list">
    <h3 class="title">المستندات المرفقة</h3>

    <p v-if="!documents.length" class="empty">لا توجد مستندات مرفقة.</p>

    <ul v-else class="items">
      <li v-for="doc in documents" :key="doc.id" class="item">
        <div class="meta">
          <strong class="name">{{ doc.original_name || doc.file_name || 'ملف مرفق' }}</strong>
          <span class="type">{{ doc.type || 'document' }}</span>
        </div>

        <button
          type="button"
          class="download-link"
          :disabled="isDownloadingByDocumentId[doc.id] === true"
          @click="downloadDocument(doc)"
        >
          <BaseButton
            variant="outline"
            size="sm"
            :icon-left="
              isDownloadingByDocumentId[doc.id] === true ? 'progress_activity' : 'download'
            "
          >
            {{ isDownloadingByDocumentId[doc.id] === true ? 'جاري التنزيل…' : 'تنزيل' }}
          </BaseButton>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import BaseButton from '@/components/shared/BaseButton.vue';
import researchService from '@/services/research.service';
import { ref } from 'vue';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  documents: {
    type: Array,
    default: () => [],
  },
});

const toast = useToast();
const isDownloadingByDocumentId = ref({});

async function downloadDocument(doc) {
  if (isDownloadingByDocumentId.value[doc.id] === true) return;
  isDownloadingByDocumentId.value = { ...isDownloadingByDocumentId.value, [doc.id]: true };
  try {
    const researchId = doc.research_id || doc.researchId;
    if (!researchId) {
      toast.error('تعذر تحديد البحث المرتبط بهذا المستند');
      return;
    }
    const response = await researchService.getDocumentSignedUrl(researchId, doc.id);
    const url = response?.data?.data?.url;
    if (!url) {
      toast.error('تعذر إنشاء رابط تنزيل للمستند');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    toast.error('تعذر تنزيل المستند حالياً');
  } finally {
    isDownloadingByDocumentId.value = { ...isDownloadingByDocumentId.value, [doc.id]: false };
  }
}
</script>

<style scoped>
.doc-list {
  --color-teal: #1a7a6e;
  --color-gold: #c9a84c;
  --color-card: #ffffff;
  --color-surface: #f8fafc;

  background: var(--color-card);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  text-align: left;
}

.title {
  margin: 0 0 12px;
  font-size: 1.05rem;
  color: #0f1f2e;
}

.empty {
  margin: 0;
  color: #64748b;
}

.items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.item {
  background: var(--color-surface);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.meta {
  display: grid;
  gap: 3px;
}

.name {
  color: #0f1f2e;
  font-weight: 700;
}

.type {
  color: var(--color-teal);
  font-size: 0.84rem;
}

.download-link {
  text-decoration: none;
}
</style>
