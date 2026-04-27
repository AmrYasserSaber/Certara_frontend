<template>
  <div v-if="orderedRounds.length > 0" class="space-y-4">
    <SectionHeader
      title="تعليقات المراجعين"
      description="التعديلات والملاحظات المطلوبة على البحث"
      icon="rate_review"
    />

    <ol class="space-y-3">
      <div
        v-for="(round, index) in orderedRounds"
        :key="round.id"
        class="grid grid-cols-[24px_1fr] gap-3"
      >
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-warning border border-warning/40 mt-2"></div>
          <div
            v-if="index < orderedRounds.length - 1"
            class="w-0.5 flex-1 bg-warning/30 rounded-full mt-1"
          ></div>
        </div>
        <details
          class="bg-surface-container text-on-surface p-4 rounded-lg border border-outline-variant/30"
          :open="index === orderedRounds.length - 1"
        >
          <summary class="flex items-start justify-between gap-3 cursor-pointer select-none">
            <div class="flex items-center gap-2">
              <div
                class="bg-warning-container text-on-warning-container p-2 rounded-lg border border-warning/30"
              >
                <AppIcon name="rate_review" class="text-warning" />
              </div>
              <div>
                <p class="font-bold font-headline">الجولة رقم {{ round.round_number }}</p>
                <p class="text-xs text-on-surface-variant">
                  المراجع: {{ round.reviewer?.name || 'غير معروف' }}
                </p>
              </div>
            </div>
            <div
              v-if="round.created_at"
              class="text-xs text-on-surface-variant whitespace-nowrap flex items-center gap-1"
            >
              <AppIcon name="schedule" size="xs" />
              {{ formatDate(round.created_at) }}
            </div>
          </summary>
          <div class="mt-3">
            <div v-if="round.comments && round.comments.length > 0" class="space-y-2">
              <div
                v-for="(comment, commentIndex) in round.comments"
                :key="comment.id || commentIndex"
                class="bg-warning-container text-on-warning-container p-4 rounded-lg border border-warning/30"
              >
                <div class="flex items-start gap-3">
                  <AppIcon name="warning" class="text-warning mt-0.5" />
                  <div class="flex-1">
                    <p class="font-bold mb-1 font-headline">ملاحظة {{ commentIndex + 1 }}</p>
                    <p class="text-sm whitespace-pre-wrap">{{ comment.comment_text }}</p>
                    <p v-if="comment.created_at" class="text-xs mt-2 opacity-70">
                      <AppIcon name="schedule" size="xs" />
                      {{ formatDate(comment.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-on-surface-variant">لا توجد تعليقات في هذه الجولة.</div>
          </div>
        </details>
      </div>
    </ol>
  </div>
  <div v-else class="text-sm text-on-surface-variant">لا توجد تعليقات متاحة حالياً.</div>
</template>

<script setup>
import { computed } from 'vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { formatDate } from '@/utils/helpers';

const props = defineProps({
  reviewRounds: {
    type: Array,
    default: () => [],
  },
});

const orderedRounds = computed(() =>
  [...props.reviewRounds].sort((a, b) => Number(a.round_number) - Number(b.round_number)),
);
</script>
