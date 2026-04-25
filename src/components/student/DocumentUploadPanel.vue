<template>
  <div class="space-y-6">
    <SectionHeader
      title="مستندات البحث"
      description="يرجى رفع المستندات التالية بصيغة PDF فقط (الحد الأقصى لكل ملف 10 ميجابايت)."
      icon="drive_folder_upload"
      class="mb-6"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileUploader
        v-model="files.protocol"
        label="البروتوكول البحثي"
        description="البروتوكول التفصيلي للبحث المراد إجراؤه"
        icon="article"
        :required="!allowPartial"
      />

      <FileUploader
        v-model="files.application"
        label="نموذج التقديم"
        description="نموذج طلب الموافقة من لجنة الأخلاقيات (IRB)"
        icon="feed"
        :required="!allowPartial"
      />

      <FileUploader
        v-model="files.coi"
        label="إقرار تضارب المصالح"
        description="إقرار بعدم وجود تضارب مصالح (COI Form)"
        icon="gavel"
        :required="!allowPartial"
      />

      <FileUploader
        v-model="files.checklist"
        label="قائمة المراجعة"
        description="قائمة مراجعة المستندات المطلوبة (Checklist)"
        icon="fact_check"
        :required="!allowPartial"
      />

      <FileUploader
        v-model="files.consent"
        label="استمارة الموافقة المستنيرة"
        description="نموذج موافقة المريض إذا كان البحث يتطلب ذلك"
        icon="assignment_turned_in"
        :required="!allowPartial"
      />
    </div>

    <div class="flex justify-end gap-3 mt-8">
      <BaseButton type="button" variant="outline" @click="$emit('back')">
        عودة
      </BaseButton>
      <BaseButton
        type="button"
        variant="primary"
        :disabled="!isValid"
        @click="$emit('submit', files)"
      >
        مراجعة وتقديم
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import FileUploader from '@/components/shared/FileUploader.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  initialFiles: {
    type: Object,
    default: () => ({}),
  },
  allowPartial: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'back']);

const files = ref({
  protocol: props.initialFiles.protocol || null,
  application: props.initialFiles.application || null,
  coi: props.initialFiles.coi || null,
  checklist: props.initialFiles.checklist || null,
  consent: props.initialFiles.consent || null,
});

watch(() => props.initialFiles, (newVal) => {
  if(newVal && Object.keys(newVal).length > 0) {
    Object.assign(files.value, newVal);
  }
}, { deep: true });

const isValid = computed(() => {
  if (props.allowPartial) return true;
  
  return files.value.protocol &&
         files.value.application &&
         files.value.coi &&
         files.value.checklist &&
         files.value.consent;
});
</script>
