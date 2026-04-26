<template>
  <AppShellLayout page-title="الملف الشخصي">
    <SectionHeader
      eyebrow="حسابك"
      title="الملف الشخصي"
      description="معلوماتك الأساسية المسجلة في النظام."
    />

    <BaseCard
      padding="lg"
      accent-rail
    >
      <div
        v-if="loading || avatarLoading"
        class="flex items-center justify-center py-16"
      >
        <LoadingSpinner />
      </div>
      <div
        v-else-if="!auth.user"
        class="py-10"
      >
        <EmptyState
          title="تعذر تحميل بيانات الملف الشخصي"
          description="يرجى تسجيل الدخول مرة أخرى."
          icon="person_off"
        >
          <RouterLink
            to="/login"
            class="btn btn-primary"
          >
            تسجيل الدخول
          </RouterLink>
        </EmptyState>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Right: avatar + name (as in screenshot) -->
          <div class="lg:col-span-4 lg:border-l lg:border-outline-variant/25 lg:pl-8">
            <div class="text-right">
              <p class="font-headline font-extrabold text-on-background text-lg mb-4">
                المعلومات الشخصية
              </p>

              <div class="flex items-center gap-5">
                <div class="shrink-0">
                  <UserAvatar
                    :name="auth.user?.name"
                    :src="avatarUrl"
                    size="xl"
                    :show-name="false"
                  />
                </div>
                <div class="min-w-0">
                  <p class="font-headline font-extrabold text-on-background truncate">
                    {{ auth.user?.name || '—' }}
                  </p>
                  <p class="text-sm text-on-surface-variant mt-0.5">
                    {{ roleLabelAr(auth.user?.role) }}
                  </p>

                  <div class="mt-3">
                    <input
                      ref="avatarInputRef"
                      type="file"
                      accept="image/png,image/jpeg"
                      class="hidden"
                      @change="onPickAvatar"
                    >
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      :loading="avatarUploading"
                      icon-left="photo_camera"
                      @click="avatarInputRef?.click()"
                    >
                      تغيير الصورة
                    </BaseButton>
                  </div>
                </div>
              </div>

              <p
                v-if="avatarError"
                class="form-error mt-3"
              >
                {{ avatarError }}
              </p>
            </div>
          </div>

          <!-- Left: fields -->
          <section class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BaseInput
                :model-value="auth.user?.email || ''"
                label="البريد الإلكتروني"
                dir="ltr"
                readonly
                disabled
                title="لا يمكن تعديل البريد الإلكتروني, يرجى الاتصال بالدعم الفني"
              />
              <BaseInput
                :model-value="auth.user?.phone || ''"
                label="رقم الهاتف"
                dir="ltr"
                readonly
                disabled
                title="لا يمكن تعديل رقم الهاتف, يرجى الاتصال بالدعم الفني"
              />
              <BaseInput
                :model-value="auth.user?.faculty || ''"
                label="الكلية"
                readonly
                disabled
                title="لا يمكن تعديل الكلية, يرجى الاتصال بالدعم الفني"
              />
              <BaseInput
                :model-value="auth.user?.department || ''"
                label="القسم"
                readonly
                disabled
                title="لا يمكن تعديل القسم, يرجى الاتصال بالدعم الفني"
              />
              <BaseInput
                :model-value="auth.user?.specialization || ''"
                label="التخصص"
                readonly
                disabled
                title="لا يمكن تعديل التخصص, يرجى الاتصال بالدعم الفني"
              />
            </div>
          </section>
        </div>
      </div>
    </BaseCard>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import UserAvatar from '@/components/shared/UserAvatar.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import EmptyState from '@/components/shared/EmptyState.vue';
import { useAuthStore } from '@/stores/auth.store';
import { roleLabelAr } from '@/utils/helpers';
import userFilesService from '@/services/user-files.service';

const auth = useAuthStore();
const loading = ref(false);
const avatarUrl = ref('');
const avatarLoading = ref(false);
const avatarUploading = ref(false);
const avatarError = ref('');
const avatarInputRef = ref(null);

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png'];

function addCacheBuster(url) {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

onMounted(async () => {
  if (auth.user) {
    avatarUrl.value = addCacheBuster(auth.user.avatar_url || '');
    return;
  }
  loading.value = true;
  try {
    await auth.fetchMe();
  } finally {
    loading.value = false;
  }
});

watch(
  () => auth.user,
  async (user) => {
    if (!user) return;
    avatarUrl.value = addCacheBuster(user.avatar_url || '');
    if (user.avatar_url) return;
    await loadAvatar();
  },
  { immediate: true },
);

async function loadAvatar() {
  avatarLoading.value = true;
  avatarError.value = '';
  try {
    const { data } = await userFilesService.getMyAvatar();
    if (data?.avatar?.url) {
      avatarUrl.value = addCacheBuster(data.avatar.url);
    }
  } catch {
    // Keep the existing avatarUrl (auth.user.avatar_url) if present.
  } finally {
    avatarLoading.value = false;
  }
}

function onPickAvatar(event) {
  const file = event.target.files?.[0] || null;
  event.target.value = '';
  if (!file) return;
  void uploadAvatar(file);
}

async function uploadAvatar(file) {
  avatarError.value = '';
  if (file.size > MAX_AVATAR_BYTES) {
    avatarError.value = 'الحد الأقصى لصورة الملف الشخصي هو 5 ميجابايت';
    return;
  }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    avatarError.value = 'يرجى اختيار صورة بصيغة PNG أو JPG';
    return;
  }
  avatarUploading.value = true;
  try {
    const { data } = await userFilesService.uploadMyAvatar(file);
    const newUrl = addCacheBuster(data?.avatar?.url || '');
    avatarUrl.value = newUrl;
    if (auth.user) {
      auth.user = { ...auth.user, avatar_url: newUrl };
      localStorage.setItem('irb.auth.user', JSON.stringify(auth.user));
    }
  } catch (err) {
    avatarError.value = err.response?.data?.error?.message || 'تعذر رفع الصورة';
  } finally {
    avatarUploading.value = false;
  }
}
</script>
