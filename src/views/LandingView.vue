<template>
  <div class="min-h-screen bg-surface text-on-surface overflow-hidden">
    <header class="relative">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-dot-grid opacity-40" />
        <div
          class="decorative-blob -top-24 -right-24 w-[28rem] h-[28rem] bg-primary/20 animate-float-slow"
        />
        <div
          class="decorative-blob top-40 -left-28 w-[22rem] h-[22rem] bg-secondary-container/25 animate-float"
        />
        <div
          class="decorative-blob bottom-10 right-20 w-[18rem] h-[18rem] bg-tertiary-fixed/40 animate-float-fast"
        />
      </div>

      <nav
        class="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pt-10 flex items-center justify-between gap-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-2xl bg-primary-gradient shadow-primary-cta flex items-center justify-center"
          >
            <AppIcon
              name="biotech"
              :filled="true"
              size="lg"
              class="text-on-primary"
            />
          </div>
          <div class="leading-tight">
            <p class="font-headline font-extrabold tex t-on-background text-lg">
              نظام IRB الرقمي
            </p>
            <p class="text-xs text-on-surface-variant">
              إدارة متكاملة لدورة حياة البروتوكولات البحثية
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink
            to="/login"
            class="btn btn-ghost btn-sm"
          >
            <AppIcon
              name="login"
              size="sm"
              class="text-on-surface-variant"
            />
            تسجيل الدخول
          </RouterLink>
          <RouterLink
            to="/register"
            class="btn btn-secondary btn-sm"
          >
            <AppIcon
              name="person_add"
              size="sm"
              class="text-on-secondary-container"
            />
            إنشاء حساب طالب
          </RouterLink>
        </div>
      </nav>

      <section class="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pt-12 pb-14">
        <div class="grid lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div
              class="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/70 border border-outline-variant/20 px-4 py-2 glass-light"
            >
              <span class="badge badge-info">
                <AppIcon
                  name="verified_user"
                  size="sm"
                />
                منصة مؤسسية
              </span>
              <span class="text-xs text-on-surface-variant font-headline">
                مصممة خصيصاً للجامعات واللجان الأخلاقية
              </span>
            </div>

            <h1
              class="font-headline font-extrabold text-4xl sm:text-5xl leading-[1.15] text-on-background text-balance animate-rise-in"
            >
              حوّل مراجعات الأخلاقيات إلى تجربة
              <span class="text-primary">سلسة</span>
              و
              <span class="text-secondary">شفافة</span>
            </h1>

            <p
              class="text-[15px] sm:text-base text-on-surface-variant leading-relaxed max-w-2xl animate-rise-in-delay"
            >
              من تسجيل الطالب ورفع المستندات، إلى الدفع، حساب حجم العينة، المراجعة العمياء، وقرار
              المدير — كل خطوة لها حالة واضحة وتنبيهات فورية ومسار عمل منظم.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:items-center pt-2">
              <RouterLink
                to="/register"
                class="btn btn-primary btn-lg"
              >
                ابدأ الآن
                <AppIcon
                  name="arrow_back"
                  size="sm"
                  class="text-on-primary"
                />
              </RouterLink>
              <RouterLink
                to="/login"
                class="btn btn-outline btn-lg"
              >
                لدي حساب بالفعل
                <AppIcon
                  name="login"
                  size="sm"
                  class="text-on-surface"
                />
              </RouterLink>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div class="card-flat px-4 py-3 animate-pop-in">
                <p class="text-xs text-on-surface-variant font-headline">
                  مراحل واضحة
                </p>
                <p class="font-headline font-extrabold text-on-background text-lg tabular-nums">
                  11
                </p>
              </div>
              <div class="card-flat px-4 py-3 animate-pop-in delay-75">
                <p class="text-xs text-on-surface-variant font-headline">
                  أدوار متعددة
                </p>
                <p class="font-headline font-extrabold text-on-background text-lg tabular-nums">
                  5
                </p>
              </div>
              <div class="card-flat px-4 py-3 animate-pop-in delay-150">
                <p class="text-xs text-on-surface-variant font-headline">
                  مراجعة عمياء
                </p>
                <p class="font-headline font-extrabold text-on-background text-lg">
                  نعم
                </p>
              </div>
              <div class="card-flat px-4 py-3 animate-pop-in delay-200">
                <p class="text-xs text-on-surface-variant font-headline">
                  تنبيهات فورية
                </p>
                <p class="font-headline font-extrabold text-on-background text-lg">
                  ✔
                </p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="relative card-elevated p-6 sm:p-8 overflow-hidden ambient-shadow">
              <div
                class="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-primary/15 blur-2xl"
              />
              <div
                class="absolute -bottom-12 -right-10 w-52 h-52 rounded-full bg-secondary-container/20 blur-2xl"
              />

              <div class="relative space-y-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center shadow-primary-cta"
                    >
                      <AppIcon
                        name="timeline"
                        :filled="true"
                        size="md"
                        class="text-on-primary"
                      />
                    </div>
                    <div>
                      <p class="font-headline font-extrabold text-on-background">
                        مسار البروتوكول
                      </p>
                      <p class="text-xs text-on-surface-variant">
                        حالة واحدة في كل لحظة
                      </p>
                    </div>
                  </div>
                  <span class="badge badge-success">
                    <AppIcon
                      name="auto_awesome"
                      size="sm"
                    />
                    منظم
                  </span>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse-soft"
                      />
                      <span class="text-sm font-headline font-bold">بانتظار الدفع الأول</span>
                    </div>
                    <span class="badge badge-warning">awaiting_payment_1</span>
                  </div>

                  <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div class="h-full w-[55%] bg-gold-gradient animate-progress" />
                  </div>

                  <div class="grid grid-cols-2 gap-3 pt-2">
                    <div class="card-flat p-4">
                      <p class="text-xs text-on-surface-variant font-headline mb-1">
                        رفع المستندات
                      </p>
                      <div class="flex items-center gap-2">
                        <AppIcon
                          name="upload_file"
                          size="sm"
                          class="text-primary"
                        />
                        <p class="text-sm font-headline font-bold text-on-background">
                          سهل وسريع
                        </p>
                      </div>
                    </div>
                    <div class="card-flat p-4">
                      <p class="text-xs text-on-surface-variant font-headline mb-1">
                        تنبيهات
                      </p>
                      <div class="flex items-center gap-2">
                        <AppIcon
                          name="notifications_active"
                          size="sm"
                          class="text-tertiary"
                        />
                        <p class="text-sm font-headline font-bold text-on-background">
                          لحظياً
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4"
                  >
                    <div class="flex items-start gap-3">
                      <div
                        class="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center"
                      >
                        <AppIcon
                          name="policy"
                          :filled="true"
                          size="md"
                          class="text-on-tertiary-fixed"
                        />
                      </div>
                      <div class="space-y-1">
                        <p class="font-headline font-extrabold text-on-background">
                          خصوصية المراجعة
                        </p>
                        <p class="text-sm text-on-surface-variant leading-relaxed">
                          صفحات المراجع تُخفي بيانات الطالب بالكامل لضمان مراجعة عمياء.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </header>

    <section class="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pb-16">
      <div class="grid md:grid-cols-3 gap-4">
        <div class="card p-6 hover:shadow-ambient transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <AppIcon
                name="manage_accounts"
                :filled="true"
                size="md"
                class="text-primary"
              />
            </div>
            <p class="font-headline font-extrabold text-on-background">
              إدارة المستخدمين
            </p>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            تفعيل الحسابات، توزيع المراجعين، وتتبع سجل النشاط — كل ذلك داخل لوحة واحدة.
          </p>
        </div>

        <div class="card p-6 hover:shadow-ambient transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-11 h-11 rounded-2xl bg-secondary-container/25 flex items-center justify-center"
            >
              <AppIcon
                name="payments"
                :filled="true"
                size="md"
                class="text-secondary"
              />
            </div>
            <p class="font-headline font-extrabold text-on-background">
              مدفوعات ورسوم
            </p>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            مرحلتان للدفع مرتبطة بالحالات. إيصالات قابلة للتحميل وبيانات واضحة للمستخدم.
          </p>
        </div>

        <div class="card p-6 hover:shadow-ambient transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-11 h-11 rounded-2xl bg-tertiary-fixed/60 flex items-center justify-center"
            >
              <AppIcon
                name="workspace_premium"
                :filled="true"
                size="md"
                class="text-tertiary"
              />
            </div>
            <p class="font-headline font-extrabold text-on-background">
              شهادات الاعتماد
            </p>
          </div>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            عند الموافقة النهائية، يمكن إصدار شهادة PDF وربطها بالبحث للوصول السريع.
          </p>
        </div>
      </div>
    </section>

    <footer class="relative z-10 border-t border-outline-variant/20">
      <div
        class="mx-auto max-w-6xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-xs text-on-surface-variant font-mono">
          © 2026 نظام IRB الرقمي. جميع الحقوق محفوظة.
        </p>
        <div class="flex items-center gap-3 text-xs text-on-surface-variant">
          <span class="inline-flex items-center gap-1">
            <AppIcon
              name="lock"
              size="sm"
            />
            أمان
          </span>
          <span class="inline-flex items-center gap-1">
            <AppIcon
              name="bolt"
              size="sm"
            />
            سرعة
          </span>
          <span class="inline-flex items-center gap-1">
            <AppIcon
              name="language"
              size="sm"
            />
            RTL
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
</script>

<style scoped>
@keyframes floatSlow {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, 18px, 0) scale(1.02);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes float {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -14px, 0) scale(1.02);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes floatFast {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, 10px, 0) scale(1.03);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes riseIn {
  0% {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popIn {
  0% {
    opacity: 0;
    transform: translate3d(0, 10px, 0) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes progress {
  0% {
    transform: translateX(0);
    filter: brightness(1);
  }
  50% {
    transform: translateX(6px);
    filter: brightness(1.08);
  }
  100% {
    transform: translateX(0);
    filter: brightness(1);
  }
}
@keyframes pulseSoft {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.25);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}
.animate-float-slow {
  animation: floatSlow 9s ease-in-out infinite;
}
.animate-float {
  animation: float 7s ease-in-out infinite;
}
.animate-float-fast {
  animation: floatFast 5.5s ease-in-out infinite;
}
.animate-rise-in {
  animation: riseIn 700ms ease-out both;
}
.animate-rise-in-delay {
  animation: riseIn 900ms ease-out both;
  animation-delay: 120ms;
}
.animate-pop-in {
  animation: popIn 650ms ease-out both;
}
.animate-pop-in.delay-75 {
  animation-delay: 75ms;
}
.animate-pop-in.delay-150 {
  animation-delay: 150ms;
}
.animate-pop-in.delay-200 {
  animation-delay: 200ms;
}
.animate-progress {
  animation: progress 2.8s ease-in-out infinite;
  transform-origin: center;
}
.animate-pulse-soft {
  animation: pulseSoft 1.8s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-float-slow,
  .animate-float,
  .animate-float-fast,
  .animate-rise-in,
  .animate-rise-in-delay,
  .animate-pop-in,
  .animate-progress,
  .animate-pulse-soft {
    animation: none !important;
  }
}
</style>
