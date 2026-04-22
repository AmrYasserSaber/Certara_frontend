<template>
  <AppShellLayout :page-title="title">
    <SectionHeader
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
    />

    <BaseCard
      variant="elevated"
      padding="lg"
    >
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <AppIcon
            :name="icon"
            :filled="true"
            size="2xl"
            class="text-primary"
          />
        </div>
        <div class="flex-1 text-center md:text-right">
          <h3 class="font-headline text-xl font-bold text-on-background mb-1">
            قيد الإنشاء
          </h3>
          <p class="text-on-surface-variant leading-relaxed">
            هذه الشاشة محجوزة ضمن السكافولد. ستُبنى بواسطة
            <span class="font-bold text-primary">{{ owner }}</span>
            وفقاً للمواصفات في
            <code class="font-mono text-xs bg-surface-container-high px-2 py-0.5 rounded">DEV_CHECKLISTS.md</code>.
          </p>
          <div
            v-if="endpoints?.length"
            class="mt-5"
          >
            <p class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-2">
              نقاط API المتوقعة:
            </p>
            <ul class="space-y-1.5">
              <li
                v-for="ep in endpoints"
                :key="ep"
                class="font-mono text-xs bg-surface-container-low rounded px-3 py-1.5 inline-block mr-1.5 mb-1.5"
              >
                {{ ep }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </BaseCard>

    <slot />
  </AppShellLayout>
</template>

<script setup>
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  description: { type: String, default: '' },
  owner: { type: String, default: 'DEV' },
  icon: { type: String, default: 'construction' },
  endpoints: { type: Array, default: () => [] },
});
</script>
