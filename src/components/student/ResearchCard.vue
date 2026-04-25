<template>
  <div class="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow gap-4 items-start md:items-center">
    <div class="flex-1 space-y-1">
      <div class="flex items-center gap-2">
        <h3 class="font-headline font-bold text-lg text-on-surface">
          {{ research.title || 'بحث بدون عنوان' }}
        </h3>
        <StatusBadge :status="research.status" />
      </div>
      <p class="text-sm text-on-surface-variant font-medium">
        الباحث الرئيسي: <span class="text-on-surface">{{ research.principal_investigator || 'غير محدد' }}</span>
      </p>
      <div class="flex items-center gap-4 text-xs text-outline mt-2">
        <span v-if="research.serial_number" class="font-mono bg-surface-container px-2 py-0.5 rounded font-bold text-primary">
          {{ research.serial_number }}
        </span>
        <span class="flex items-center gap-1">
          <AppIcon name="calendar_today" size="xs" />
          {{ formatDate(research.updated_at || research.created_at) }}
        </span>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
      <router-link :to="{ name: 'student.research.detail', params: { id: research.id } }">
        <BaseButton variant="outline" size="sm" icon="visibility">
          التفاصيل
        </BaseButton>
      </router-link>
      
      <router-link
        v-if="['DRAFT', 'REVISION_REQUESTED'].includes(research.status)"
        :to="{ name: 'student.research.edit', params: { id: research.id } }"
      >
        <BaseButton variant="primary" size="sm" icon="edit">
          تعديل
        </BaseButton>
      </router-link>

      <router-link
        v-if="research.status === 'AWAITING_PAYMENT_1' || research.status === 'AWAITING_PAYMENT_2'"
        :to="{ name: 'student.research.pay', params: { id: research.id } }"
      >
        <BaseButton variant="primary" size="sm" icon="payments">
          ادفع الآن
        </BaseButton>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '@/components/shared/StatusBadge.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

defineProps({
  research: {
    type: Object,
    required: true,
  },
});

function formatDate(dateString) {
  if (!dateString) return 'تاريخ غير متوفر';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ar-EG', options);
}
</script>
