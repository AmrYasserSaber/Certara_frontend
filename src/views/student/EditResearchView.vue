<template>
  <AppShellLayout page-title="تعديل البحث">
    <div v-if="store.loading" class="flex justify-center p-12"><LoadingSpinner /></div>
    <div v-else-if="store.error" class="p-4 bg-error-container text-on-error-container rounded-lg">
      {{ store.error }}
    </div>

    <div v-else-if="current" class="max-w-4xl mx-auto space-y-8 mb-10">
      <!-- Reviewer Comments if REVISION_REQUESTED -->
      <div v-if="current.status === 'REVISION_REQUESTED' && comments.length" class="mb-6">
        <ReviewerComments :comments="comments" />
      </div>

      <SectionHeader
        title="تعديل البحث"
        description="يرجى تعديل البيانات الأساسية وإعادة رفع المستندات المحدثة إذا لزم الأمر."
        icon="edit_note"
      />

      <div class="max-w-3xl mx-auto space-y-8">
        <BaseCard title="البيانات الأساسية">
          <ResearchForm
            :initial-data="current"
            @submit="saveDraft"
            @cancel="$router.push('/student')"
          />
        </BaseCard>

        <BaseCard title="إعادة رفع المستندات المطلوبة">
          <div
            class="mb-4 p-4 rounded-lg bg-info-container text-on-info-container border border-info/20 text-sm flex gap-3 items-start"
          >
            <AppIcon name="info" class="mt-0.5 text-info" />
            <p>
              عند رفع أي مستند هنا، سيتم استبدال المستند القديم. اترك الحقل فارغاً إذا لم تكن تريد
              تغيير المستند الحالي.
            </p>
          </div>
          <DocumentUploadPanel
            mode="edit"
            :initial-files="{}"
            :existing-file-names="existingFileNames"
            @submit="uploadRevisedDocuments"
            @back="$router.push('/student')"
          />
        </BaseCard>
      </div>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useResearchStore } from '@/stores/research.store';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import ReviewerComments from '@/components/student/ReviewerComments.vue';
import ResearchForm from '@/components/student/ResearchForm.vue';
import DocumentUploadPanel from '@/components/student/DocumentUploadPanel.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const store = useResearchStore();
const router = useRouter();

const comments = ref([]);

onMounted(async () => {
  try {
    const data = await store.fetchOne(props.id);
    if (data) {
      comments.value = data.reviewer_comments || [];
    }
  } catch (e) {}
});

const current = computed(() => store.current);
const existingFileNames = computed(() => buildExistingFileNames(current.value?.documents));

function buildExistingFileNames(documents) {
  if (!Array.isArray(documents)) {
    return {};
  }
  return documents.reduce((acc, doc) => {
    const type = doc?.type;
    const name = doc?.original_name || doc?.originalName || doc?.file_name || '';
    if (typeof type !== 'string' || type.trim() === '') {
      return acc;
    }
    acc[type] = typeof name === 'string' ? name : '';
    return acc;
  }, {});
}

async function saveDraft(data) {
  try {
    await store.update(props.id, data);
    alert('تم حفظ التعديلات بنجاح. لا تنس رفع المستندات المعدلة إن وجدت.');
  } catch (e) {
    alert('حدث خطأ أثناء حفظ التعديلات');
  }
}

async function uploadRevisedDocuments(files) {
  try {
    const formData = new FormData();
    let hasFiles = false;
    Object.keys(files).forEach((docType) => {
      // Re-uploading only provided modified files
      if (files[docType] instanceof File) {
        formData.append(`documents[${docType}]`, files[docType]);
        hasFiles = true;
      }
    });

    if (hasFiles) {
      await store.uploadDocuments(props.id, formData);
      alert('تم رفع المستندات وتحديث البحث بنجاح.');
    } else {
      alert('لم يتم تحديد أي ملفات جديدة للرفع.');
    }

    // Optionally trigger a status update API to notify it's fixed
    // Then navigate back.
    router.push({ name: 'student.research.detail', params: { id: props.id } });
  } catch (e) {
    alert('تعذر رفع المستندات');
  }
}
</script>
