<template>
  <div
    v-if="comments && comments.length > 0"
    class="space-y-4"
  >
    <SectionHeader
      title="تعليقات المراجعين"
      description="التعديلات والملاحظات المطلوبة على البحث"
      icon="rate_review"
    />
    
    <div class="space-y-3">
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="bg-warning-container text-on-warning-container p-4 rounded-lg border border-warning/30"
      >
        <div class="flex items-start gap-3">
          <AppIcon
            name="warning"
            class="text-warning mt-0.5"
          />
          <div class="flex-1">
            <p class="font-bold mb-1 font-headline">
              ملاحظة {{ index + 1 }}
            </p>
            <p class="text-sm whitespace-pre-wrap">
              {{ comment.content }}
            </p>
            <p class="text-xs mt-2 opacity-70">
              <AppIcon
                name="schedule"
                size="xs"
              /> 
              {{ formatDate(comment.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SectionHeader from '@/components/shared/SectionHeader.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { formatDate } from '@/utils/helpers';

defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
});
</script>
