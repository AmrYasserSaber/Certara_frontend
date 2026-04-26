<template>
  <div class="flex w-full h-screen">
    <!-- Branding panel (right in RTL) -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-nav-dark flex-col justify-center items-center relative overflow-hidden p-12 text-center"
    >
      <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div
          class="absolute top-1/4 -right-20 w-96 h-96 rounded-full border border-primary-container"
        />
        <div
          class="absolute bottom-1/4 -left-20 w-64 h-64 rounded-full border border-secondary-container"
        />
        <div class="absolute inset-0 bg-dot-grid opacity-40" />
      </div>

      <div class="relative z-10 flex flex-col items-center max-w-md">
        <div
          class="w-24 h-24 mb-8 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center"
        >
          <AppIcon name="biotech" :filled="true" size="2xl" class="text-gold-accent" />
        </div>
        <h1 class="font-headline text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wide">
          نظام IRB الرقمي
        </h1>
        <p class="font-headline text-lg text-on-primary-container font-medium mb-12 opacity-90">
          نحو بحث علمي رصين وميسر
        </p>
        <div
          class="w-full rounded-xl bg-inverse-surface/40 border border-white/10 backdrop-blur-md p-8 space-y-4 text-right"
        >
          <h3 class="font-headline text-white font-bold flex items-center gap-2">
            <AppIcon name="shield_person" size="md" class="text-gold-accent" />
            مراجعة أخلاقية آمنة
          </h3>
          <p class="text-sm text-slate-300 leading-relaxed">
            منصة متكاملة لإدارة دورة حياة الموافقات البحثية — من التقديم حتى إصدار شهادة الموافقة
            النهائية.
          </p>
        </div>
      </div>
    </div>

    <!-- Form panel (left in RTL) -->
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 bg-surface-container-low relative"
    >
      <div class="max-w-md w-full mx-auto space-y-8">
        <div class="lg:hidden flex flex-col items-center mb-6 text-center">
          <AppIcon name="biotech" :filled="true" size="xl" class="text-primary-container mb-2" />
          <h1 class="font-headline text-2xl font-bold text-on-surface">نظام IRB الرقمي</h1>
        </div>

        <div>
          <h2 class="font-headline text-3xl font-bold text-on-background mb-2">مرحباً بك مجدداً</h2>
          <p class="text-on-surface-variant text-[15px]">
            الرجاء إدخال بيانات الاعتماد للوصول إلى لوحة التحكم.
          </p>
        </div>

        <div
          v-if="auth.error"
          class="flex items-start gap-3 p-4 rounded-lg bg-error-container text-on-error-container animate-fade-in"
        >
          <AppIcon name="error" size="md" />
          <p class="text-sm font-medium">
            {{ auth.error }}
          </p>
        </div>

        <form class="space-y-5" novalidate @submit.prevent="onSubmit">
          <BaseInput
            v-model="form.email"
            label="البريد الإلكتروني"
            type="email"
            icon-left="mail"
            placeholder="example@mail.com"
            :error="errors.email"
            required
            autocomplete="email"
            dir="ltr"
          />

          <BaseInput
            v-model="form.password"
            label="كلمة المرور"
            :type="showPassword ? 'text' : 'password'"
            icon-left="lock"
            :icon-right="showPassword ? 'visibility' : 'visibility_off'"
            placeholder="••••••••"
            :error="errors.password"
            required
            autocomplete="current-password"
            dir="ltr"
            @icon-right-click="showPassword = !showPassword"
          />

          <div class="flex justify-between items-center text-sm">
            <BaseCheckbox v-model="form.remember" label="تذكرني" />
            <a
              class="text-primary hover:text-primary-container font-bold transition-colors"
              href="#"
            >
              نسيت كلمة المرور؟
            </a>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            icon-right="login"
            :loading="auth.loading"
            block
          >
            تسجيل الدخول
          </BaseButton>

          <p class="text-center text-on-surface-variant text-[15px]">
            ليس لديك حساب؟
            <router-link
              to="/register"
              class="text-secondary-container hover:text-secondary font-headline font-bold mr-1 transition-colors"
            >
              التسجيل كطالب
            </router-link>
          </p>
        </form>
      </div>

      <p class="absolute bottom-6 inset-x-0 text-center text-xs text-outline font-mono">
        © 2024 نظام IRB الرقمي. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = reactive({ email: '', password: '', remember: true });
const errors = reactive({ email: '', password: '' });
const showPassword = ref(false);

function validate() {
  errors.email = '';
  errors.password = '';
  let ok = true;
  if (!form.email) {
    errors.email = 'البريد الإلكتروني مطلوب';
    ok = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    ok = false;
  }
  if (!form.password) {
    errors.password = 'كلمة المرور مطلوبة';
    ok = false;
  } else if (form.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن لا تقل عن 8 أحرف';
    ok = false;
  }
  return ok;
}

async function onSubmit() {
  if (!validate()) return;
  try {
    await auth.login({ email: form.email, password: form.password });
    toast.success('تم تسجيل الدخول بنجاح');
    const redirect = route.query.redirect;
    const target = typeof redirect === 'string' && redirect ? redirect : '/profile';
    router.replace(target);
  } catch {
    // error is surfaced via auth.error banner
  }
}
</script>
