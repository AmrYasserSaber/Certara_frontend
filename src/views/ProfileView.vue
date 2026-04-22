<template>
  <AppShellLayout page-title="الملف الشخصي">
    <SectionHeader
      eyebrow="حسابك"
      title="الملف الشخصي"
      description="معلوماتك الأساسية المسجلة في النظام."
    />

    <BaseCard padding="lg">
      <div class="flex items-center gap-6 mb-8">
        <UserAvatar
          :name="auth.user?.name"
          :src="auth.user?.avatar_url"
          size="xl"
          :show-name="false"
        />
        <div>
          <h3 class="font-headline text-2xl font-bold text-on-background">
            {{ auth.user?.name || '—' }}
          </h3>
          <p class="text-on-surface-variant mt-1">
            {{ roleLabelAr(auth.user?.role) }}
          </p>
        </div>
      </div>

      <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div>
          <dt class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
            البريد الإلكتروني
          </dt>
          <dd class="font-mono text-on-background">
            {{ auth.user?.email || '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
            الهاتف
          </dt>
          <dd class="font-mono text-on-background">
            {{ auth.user?.phone || '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
            الكلية
          </dt>
          <dd class="text-on-background">
            {{ auth.user?.faculty || '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-wider text-on-surface-variant font-bold mb-1">
            القسم
          </dt>
          <dd class="text-on-background">
            {{ auth.user?.department || '—' }}
          </dd>
        </div>
      </dl>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import UserAvatar from '@/components/shared/UserAvatar.vue';
import { useAuthStore } from '@/stores/auth.store';
import { roleLabelAr } from '@/utils/helpers';

const auth = useAuthStore();
</script>
