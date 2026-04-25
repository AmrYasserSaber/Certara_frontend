<template>
  <form @submit.prevent="submitForm" class="space-y-6">
     <BaseInput
       v-model="formData.title"
       label="عنوان البحث"
       placeholder="أدخل عنوان البحث كاملاً"
       :error="errors.title"
       :required="!allowPartial"
     />
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        v-model="formData.principal_investigator"
        label="الباحث الرئيسي"
        placeholder="الاسم الكامل للباحث الرئيسي"
        :error="errors.principal_investigator"
        :required="!allowPartial"
      />
      <BaseInput
        v-model="formData.department"
        label="القسم"
        placeholder="القسم التابع له الباحث"
        :error="errors.department"
        :required="!allowPartial"
      />
    </div>

    <BaseInput
      v-model="formData.faculty"
      label="الكلية / الجهة"
      placeholder="الكلية أو الجهة التابع لها الباحث"
      :error="errors.faculty"
      :required="!allowPartial"
    />
    
    <BaseTextarea
      v-model="formData.co_investigators"
      label="الباحثون المشاركون (اختياري)"
      placeholder="اكتب أسماء الباحثين المشاركين مفصولين بفواصل"
      :error="errors.co_investigators"
    />

    <div class="flex justify-end gap-3 mt-8">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')">
        إلغاء
      </BaseButton>
      <BaseButton type="submit" variant="primary">
        حفظ وانتقال للمستندات
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseTextarea from '@/components/shared/BaseTextarea.vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
  allowPartial: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  title: props.initialData.title || '',
  principal_investigator: props.initialData.principal_investigator || '',
  department: props.initialData.department || '',
  faculty: props.initialData.faculty || '',
  co_investigators: props.initialData.co_investigators || '',
});

const errors = ref({});

watch(() => props.initialData, (newVal) => {
  if(newVal && Object.keys(newVal).length > 0) {
    Object.assign(formData.value, newVal);
  }
}, { deep: true });

function validate() {
  if (props.allowPartial) return true;
  
  errors.value = {};
  if (!formData.value.title) errors.value.title = 'حقل مطلوب';
  if (!formData.value.principal_investigator) errors.value.principal_investigator = 'حقل مطلوب';
  if (!formData.value.department) errors.value.department = 'حقل مطلوب';
  if (!formData.value.faculty) errors.value.faculty = 'حقل مطلوب';
  
  return Object.keys(errors.value).length === 0;
}

function submitForm() {
  if (validate()) {
    emit('submit', { ...formData.value });
  }
}
</script>
