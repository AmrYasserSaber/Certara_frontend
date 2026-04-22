<template>
  <div class="relative pt-6 pb-10 overflow-x-auto hide-scrollbar scrollbar-thin">
    <div class="min-w-[800px] px-4 relative">
      <div class="absolute top-[2rem] left-8 right-8 h-1 bg-surface-container-high rounded-full" />
      <div
        class="absolute top-[2rem] right-8 h-1 bg-primary-container rounded-full transition-all duration-500"
        :style="{ width: progressWidth }"
      />

      <ol class="flex justify-between relative z-10">
        <li
          v-for="(item, idx) in stages"
          :key="item.key"
          class="flex flex-col items-center w-24"
        >
          <div class="relative">
            <div
              v-if="idx === currentStage && !isRejected"
              class="absolute inset-0 rounded-full bg-secondary-container opacity-50 animate-ping"
            />
            <div
              :class="[
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest shadow-md',
                stageStyle(idx),
              ]"
            >
              <AppIcon
                :name="idx < currentStage ? 'check' : item.icon"
                :filled="idx <= currentStage"
                size="sm"
              />
            </div>
          </div>
          <p
            class="text-xs font-bold font-headline text-center mt-2"
            :class="
              idx === currentStage
                ? isRejected
                  ? 'text-error'
                  : 'text-secondary'
                : idx < currentStage
                  ? 'text-on-background'
                  : 'text-outline'
            "
          >
            {{ item.label }}
          </p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';
import {
  RESEARCH_TIMELINE_STAGES,
  STATUS_TO_TIMELINE_STAGE,
  RESEARCH_STATUS,
} from '@/utils/constants';

const props = defineProps({
  /** Preferred: provide a status and we compute the stage. */
  status: { type: String, default: '' },
  /** Override: explicit stage index (0..7). */
  stage: { type: Number, default: null },
  stages: { type: Array, default: () => RESEARCH_TIMELINE_STAGES },
});

const currentStage = computed(() => {
  if (props.stage !== null) return props.stage;
  return STATUS_TO_TIMELINE_STAGE[props.status] ?? 0;
});

const isRejected = computed(() => props.status === RESEARCH_STATUS.REJECTED);

const progressWidth = computed(() => {
  const pct = Math.max(0, Math.min(1, currentStage.value / Math.max(1, props.stages.length - 1)));
  return `${pct * 100}%`;
});

function stageStyle(idx) {
  if (idx < currentStage.value) return 'bg-primary-container text-white';
  if (idx === currentStage.value) {
    if (isRejected.value) return 'bg-error text-on-error';
    return 'bg-secondary-container text-on-secondary-container';
  }
  return 'bg-surface-container-high border-2 border-outline-variant text-outline';
}
</script>
