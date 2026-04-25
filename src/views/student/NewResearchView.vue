<template>
  <AppShellLayout page-title="بحث جديد">
    <div class="max-w-4xl mx-auto mb-10">
      <FormStepper
        v-model="currentStep"
        :steps="steps"
      />
    </div>

    <BaseCard class="max-w-4xl mx-auto">
      <div v-if="currentStep === 0">
        <ResearchForm
          :initial-data="researchData"
          @submit="onResearchFormSubmit"
          @cancel="onCancel"
        />
      </div>

      <div v-else-if="currentStep === 1">
        <DocumentUploadPanel
          :initial-files="documents"
          @submit="onDocumentsSubmit"
          @back="currentStep--"
        />
      </div>

      <div v-else-if="currentStep === 2" class="space-y-6">
        <SectionHeader
          title="مراجعة التقديم"
          description="يرجى مراجعة تفاصيل البحث الخاصة بك قبل التقديم النهائي."
          icon="rate_review"
        />
        
        <div class="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 space-y-2">
          <p class="font-bold flex items-center gap-2">
            <AppIcon name="title" size="sm" class="text-primary"/> 
            العنوان: <span class="font-normal">{{ researchData.title }}</span>
          </p>
          <p class="font-bold flex items-center gap-2">
            <AppIcon name="person" size="sm" class="text-primary"/> 
            الباحث الرئيسي: <span class="font-normal">{{ researchData.principal_investigator }}</span>
          </p>
          <p class="font-bold flex items-center gap-2">
            <AppIcon name="account_balance" size="sm" class="text-primary"/> 
            الجهة: <span class="font-normal">{{ researchData.faculty }} - {{ researchData.department }}</span>
          </p>
        </div>

        <div v-if="error" class="p-4 rounded-lg bg-error-container text-on-error-container text-sm font-medium">
          {{ error }}
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <BaseButton type="button" variant="outline" @click="currentStep--" :disabled="saving">
            عودة
          </BaseButton>
          <BaseButton
            type="button"
            variant="primary"
            :loading="saving"
            @click="submitAll"
          >
            إرسال البحث للإدارة
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useResearchStore } from '@/stores/research.store';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import FormStepper from '@/components/shared/FormStepper.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import ResearchForm from '@/components/student/ResearchForm.vue';
import DocumentUploadPanel from '@/components/student/DocumentUploadPanel.vue';

const router = useRouter();
const store = useResearchStore();

const steps = [
  { label: 'البيانات الأساسية' },
  { label: 'المرفقات' },
  { label: 'استعراض وتقديم' },
];

const currentStep = ref(0);
const saving = ref(false);
const error = ref('');

const researchData = ref({
  title: '',
  principal_investigator: '',
  co_investigators: '',
  department: '',
  faculty: ''
});

const documents = ref({});

const createdId = ref(null);

async function onResearchFormSubmit(data) {
  saving.value = true;
  error.value = '';
  try {
    if (createdId.value) {
      // Update existing if already created but they went back to step 1
      await store.update(createdId.value, data);
      researchData.value = data;
    } else {
      const newResearch = await store.create(data);
      createdId.value = newResearch.id;
      researchData.value = newResearch;
    }
    currentStep.value = 1;
  } catch (err) {
    error.value = err.response?.data?.message || 'تعذر حفظ البيانات الأولية للبحث كمسودة.';
  } finally {
    saving.value = false;
  }
}

function onDocumentsSubmit(files) {
  documents.value = files;
  currentStep.value = 2;
}

function onCancel() {
  router.push('/student');
}

async function submitAll() {
  saving.value = true;
  error.value = '';
  
  try {
    if (!createdId.value) {
       throw new Error('رقم البحث غير متوفر. يرجى البدء من الخطوة الأولى.');
    }
    
    // Upload Documents using FormData
    const formData = new FormData();
    Object.keys(documents.value).forEach(docType => {
      if (documents.value[docType]) {
        formData.append(`files[${docType}]`, documents.value[docType]);
      }
    });
    
    await store.uploadDocuments(createdId.value, formData);
    
    // Redirect to Dashboard or details
    router.push('/student');
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'حدث خطأ غير متوقع أثناء إرفاق المستندات.';
  } finally {
    saving.value = false;
  }
}
</script>
