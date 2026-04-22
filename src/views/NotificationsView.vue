<template>
  <AppShellLayout page-title="التنبيهات">
    <SectionHeader
      eyebrow="التنبيهات"
      title="صندوق التنبيهات"
      description="تابع جميع التحديثات المتعلقة بأبحاثك، طلباتك، والمراجعات."
    >
      <template #actions>
        <BaseButton
          v-if="store.unreadCount"
          variant="ghost"
          icon-left="done_all"
          @click="store.markAllRead()"
        >
          تحديد الكل كمقروء
        </BaseButton>
        <BaseButton
          variant="outline"
          icon-left="refresh"
          :loading="store.loading"
          @click="store.fetchAll()"
        >
          تحديث
        </BaseButton>
      </template>
    </SectionHeader>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- List -->
      <div class="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin pl-1">
        <LoadingSpinner
          v-if="store.loading && !store.notifications.length"
          class="justify-center py-10 w-full"
        />
        <EmptyState
          v-else-if="!store.notifications.length"
          icon="notifications_off"
          title="لا توجد تنبيهات بعد"
          description="ستظهر هنا أي تحديثات تخص طلباتك."
        />
        <NotificationItem
          v-for="n in store.notifications"
          :key="n.id"
          :notification="n"
          :class="{ 'ring-2 ring-primary/30': selected?.id === n.id }"
          @click="select(n)"
        />
      </div>

      <!-- Detail -->
      <div class="lg:col-span-3">
        <div
          v-if="!selected"
          class="card p-10 h-full flex items-center justify-center"
        >
          <EmptyState
            icon="inbox"
            title="اختر تنبيهًا لعرض التفاصيل"
            description="اضغط على أي تنبيه في القائمة لرؤية النص الكامل والإجراءات المتاحة."
          />
        </div>
        <article
          v-else
          class="card p-6 md:p-8 space-y-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="badge-pending mb-2">{{ typeLabel(selected.type) }}</span>
              <h3 class="font-headline text-xl font-bold text-on-background mt-1">
                {{ selected.title }}
              </h3>
              <p class="text-xs text-on-surface-variant mt-1 font-mono">
                {{ formatDate(selected.created_at, 'D MMMM YYYY · HH:mm') }}
              </p>
            </div>
            <BaseButton
              v-if="!selected.is_read"
              variant="ghost"
              size="sm"
              icon-left="mark_email_read"
              @click="store.markRead(selected.id)"
            >
              تحديد كمقروء
            </BaseButton>
          </div>

          <p class="text-on-surface leading-relaxed whitespace-pre-wrap">
            {{ selected.message }}
          </p>

          <div
            v-if="selected.research_id"
            class="pt-4 border-t border-outline-variant/20"
          >
            <BaseButton
              variant="primary"
              icon-left="open_in_new"
              :to="researchRoute(selected.research_id)"
            >
              عرض البحث المرتبط
            </BaseButton>
          </div>
        </article>
      </div>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import NotificationItem from '@/components/shared/NotificationItem.vue';
import EmptyState from '@/components/shared/EmptyState.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { useNotificationStore } from '@/stores/notification.store';
import { useAuthStore } from '@/stores/auth.store';
import { NOTIFICATION_TYPES, ROLES } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';

const store = useNotificationStore();
const auth = useAuthStore();
const selected = ref(null);

const TYPE_LABELS = {
  [NOTIFICATION_TYPES.ACCOUNT_ACTIVATED]: 'تفعيل الحساب',
  [NOTIFICATION_TYPES.PAYMENT_CONFIRMED]: 'تأكيد الدفع',
  [NOTIFICATION_TYPES.REVIEW_REQUESTED]: 'طلب مراجعة',
  [NOTIFICATION_TYPES.REVISION_REQUESTED]: 'طلب تعديل',
  [NOTIFICATION_TYPES.RESEARCH_APPROVED]: 'موافقة على البحث',
  [NOTIFICATION_TYPES.RESEARCH_REJECTED]: 'رفض البحث',
  [NOTIFICATION_TYPES.CERTIFICATE_READY]: 'الشهادة جاهزة',
};

function typeLabel(t) {
  return TYPE_LABELS[t] || t;
}

function select(n) {
  selected.value = n;
  if (!n.is_read) store.markRead(n.id);
}

function researchRoute(id) {
  const role = auth.user?.role;
  if (role === ROLES.STUDENT) return `/student/research/${id}`;
  if (role === ROLES.ADMIN) return `/admin/research/${id}`;
  if (role === ROLES.REVIEWER) return `/reviewer/research/${id}`;
  if (role === ROLES.MANAGER) return `/manager/research/${id}`;
  if (role === ROLES.SAMPLE_SIZE_OFFICER) return `/sample-size/research/${id}`;
  return '/';
}

onMounted(() => {
  store.fetchAll();
  store.startPolling();
});
</script>
