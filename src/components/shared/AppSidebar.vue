<template>
  <aside
    :class="[
      'fixed top-0 right-0 h-full w-72 z-40 bg-nav-dark shadow-2xl flex-col',
      'transition-transform duration-300',
      open ? 'flex' : 'hidden md:flex',
    ]"
  >
    <!-- Brand -->
    <div class="p-6 border-b border-white/10 space-y-5">
      <router-link
        to="/"
        class="flex items-center gap-3"
      >
        <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <AppIcon
            name="biotech"
            :filled="true"
            size="lg"
            class="text-gold-accent"
          />
        </div>
        <div class="min-w-0">
          <h1 class="text-lg font-bold text-white font-headline leading-tight">
            نظام IRB الرقمي
          </h1>
          <p class="text-xs text-slate-400 font-body">
            البحث العلمي والأخلاقيات
          </p>
        </div>
      </router-link>

      <BaseButton
        v-if="primaryAction"
        variant="secondary"
        :icon-left="primaryAction.icon || 'add'"
        block
        @click="primaryAction.onClick"
      >
        {{ primaryAction.label }}
      </BaseButton>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-thin">
      <AppSidebarNavItem
        v-for="item in items"
        :key="item.to || item.label"
        :to="item.to"
        :label="item.label"
        :icon="item.icon"
        :badge="item.badge"
        :active-variant="activeVariant"
      />
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-white/10 space-y-1.5">
      <AppSidebarNavItem
        v-for="item in footerItems"
        :key="item.to || item.label"
        :to="item.to"
        :label="item.label"
        :icon="item.icon"
        :active-variant="activeVariant"
      />
    </div>
  </aside>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import AppSidebarNavItem from './AppSidebarNavItem.vue';
import BaseButton from './BaseButton.vue';

defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  footerItems: { type: Array, default: () => [] },
  primaryAction: { type: Object, default: null },
  activeVariant: {
    type: String,
    default: 'gold',
    validator: (v) => ['gold', 'teal', 'light'].includes(v),
  },
});
</script>
