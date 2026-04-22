<template>
  <main class="min-h-screen flex items-center justify-center px-6 bg-surface-container-low">
    <div class="max-w-md text-center">
      <div
        class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary-container/30 flex items-center justify-center"
      >
        <AppIcon
          name="explore_off"
          :filled="true"
          size="2xl"
          class="text-on-secondary-container"
        />
      </div>
      <p class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-2 font-mono">
        404
      </p>
      <h1 class="font-headline text-3xl font-bold text-on-background mb-3">
        الصفحة غير موجودة
      </h1>
      <p class="text-on-surface-variant mb-8 leading-relaxed">
        لم نعثر على الصفحة المطلوبة. ربما تم نقلها أو أن الرابط غير صحيح.
      </p>
      <BaseButton
        variant="primary"
        icon-left="home"
        to="/"
      >
        العودة إلى الرئيسية
      </BaseButton>
    </div>
  </main>
</template>

<script setup>
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
</script>
