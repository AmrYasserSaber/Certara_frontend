<template>
  <div class="card-flat p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
      <BaseInput
        :model-value="modelValue.q"
        label="بحث"
        placeholder="العنوان / الرقم / اسم الطالب"
        icon-left="search"
        @update:model-value="setField('q', $event)"
      />

      <BaseSelect
        :model-value="modelValue.status"
        label="الحالة"
        :options="statusOptions"
        placeholder="كل الحالات"
        @update:model-value="setField('status', $event)"
      />

      <BaseInput
        :model-value="modelValue.department"
        label="القسم"
        placeholder="مثال: Surgery"
        @update:model-value="setField('department', $event)"
      />

      <BaseInput
        :model-value="modelValue.from"
        label="من تاريخ"
        type="date"
        @update:model-value="setField('from', $event)"
      />

      <BaseInput
        :model-value="modelValue.to"
        label="إلى تاريخ"
        type="date"
        @update:model-value="setField('to', $event)"
      />
    </div>

    <div class="mt-4 flex items-center justify-end gap-2">
      <BaseButton variant="ghost" icon-left="restart_alt" @click="$emit('reset')">
        إعادة تعيين
      </BaseButton>
      <BaseButton variant="primary" icon-left="filter_alt" @click="$emit('apply')">
        تطبيق الفلاتر
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      q: '',
      status: '',
      department: '',
      from: '',
      to: '',
    }),
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'apply', 'reset']);

function setField(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  });
}
</script>
