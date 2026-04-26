<template>
  <header
    :class="[
      'sticky top-0 z-30 flex justify-between items-center px-6 md:px-8 py-3 h-16 md:h-20 shadow-sm backdrop-blur-md',
      dark
        ? 'bg-nav-dark text-white'
        : 'bg-surface-container-low text-on-surface border-b border-outline-variant/15',
    ]"
  >
    <div class="flex items-center gap-3">
      <button
        v-if="showMenu"
        type="button"
        class="md:hidden"
        :class="dark ? 'btn-icon-dark' : 'btn-icon'"
        aria-label="menu"
        @click="$emit('toggle-sidebar')"
      >
        <AppIcon name="menu" />
      </button>
      <h2
        v-if="title"
        :class="['font-headline font-bold', dark ? 'text-white' : 'text-on-background', titleSize]"
      >
        {{ title }}
      </h2>
      <slot name="left" />
    </div>

    <div class="flex items-center gap-2 md:gap-3">
      <slot name="center" />
      <NotificationBell :dark="dark" />
      <button
        v-if="showLanguage"
        type="button"
        :class="dark ? 'btn-icon-dark' : 'btn-icon'"
        aria-label="language"
        @click="$emit('toggle-language')"
      >
        <AppIcon name="translate" />
      </button>
      <div
        v-if="user"
        :class="[
          'flex items-center gap-2 pr-3 border-r',
          dark ? 'border-white/10' : 'border-outline-variant/30',
        ]"
      >
        <UserAvatar
          :name="user.name"
          :src="user.avatar"
          :subtitle="user.subtitle"
          size="sm"
          :show-name="!compact"
        />
        <button
          v-if="!compact"
          type="button"
          :class="dark ? 'btn-icon-dark' : 'btn-icon'"
          aria-label="logout"
          @click="$emit('logout')"
        >
          <AppIcon name="logout" />
        </button>
      </div>
      <slot name="right" />
    </div>
  </header>
</template>

<script setup>
import AppIcon from './AppIcon.vue';
import UserAvatar from './UserAvatar.vue';
import NotificationBell from './NotificationBell.vue';

defineProps({
  title: { type: String, default: '' },
  user: { type: Object, default: null },
  dark: { type: Boolean, default: true },
  compact: { type: Boolean, default: false },
  showMenu: { type: Boolean, default: true },
  titleSize: {
    type: String,
    default: 'text-lg md:text-xl',
  },
  showLanguage: { type: Boolean, default: true },
});

defineEmits(['toggle-sidebar', 'toggle-language', 'logout']);
</script>
