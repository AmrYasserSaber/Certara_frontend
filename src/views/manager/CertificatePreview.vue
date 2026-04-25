<template>
  <div class="certificate-page min-h-screen bg-surface text-on-surface" dir="rtl" lang="ar">
    <!-- Screen layout -->
    <div class="screen-only">
      <aside
        class="fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-white/5 bg-[#0F1F2E]"
      >
        <div class="px-6 py-8">
          <div class="mb-1 text-xl font-bold text-white font-headline">نظام أخلاقيات البحث</div>
          <div class="text-xs font-medium uppercase tracking-widest text-slate-400">
            بوابة المدير الإداري
          </div>
        </div>

        <nav class="mt-4 flex-1 space-y-2 px-4">
          <router-link
            class="flex items-center gap-3 rounded-sm px-4 py-3 text-slate-400 transition-all hover:translate-x-[-4px] hover:bg-[#0D6E6E]/30 hover:text-slate-100"
            to="/manager"
          >
            <AppIcon name="dashboard" />
            <span class="text-[15px]">لوحة التحكم</span>
          </router-link>
          <router-link
            class="flex items-center gap-3 rounded-sm px-4 py-3 text-slate-400 transition-all hover:translate-x-[-4px] hover:bg-[#0D6E6E]/30 hover:text-slate-100"
            to="/manager"
          >
            <AppIcon name="fact_check" />
            <span class="text-[15px]">طلبات المراجعة</span>
          </router-link>
          <router-link
            class="flex items-center gap-3 rounded-sm px-4 py-3 text-slate-400 transition-all hover:translate-x-[-4px] hover:bg-[#0D6E6E]/30 hover:text-slate-100"
            to="/manager"
          >
            <AppIcon name="gavel" />
            <span class="text-[15px]">القرارات النهائية</span>
          </router-link>
          <router-link
            class="flex items-center gap-3 rounded-sm bg-[#0D6E6E] px-4 py-3 font-bold text-white shadow-inner"
            to="/manager/research/preview"
          >
            <AppIcon name="verified" :filled="true" />
            <span class="text-[15px]">الشهادات المصدرة</span>
          </router-link>
          <router-link
            class="flex items-center gap-3 rounded-sm px-4 py-3 text-slate-400 transition-all hover:translate-x-[-4px] hover:bg-[#0D6E6E]/30 hover:text-slate-100"
            to="/manager"
          >
            <AppIcon name="analytics" />
            <span class="text-[15px]">الإحصائيات المتقدمة</span>
          </router-link>
        </nav>

        <div class="mt-auto space-y-2 px-4 py-6">
          <button
            class="flex w-full items-center justify-center gap-2 rounded-sm bg-secondary-container px-4 py-3 font-bold text-on-secondary-fixed transition-opacity hover:opacity-90"
            :disabled="!certificate"
            @click="generateOrPrint"
          >
            <AppIcon :name="certificate ? 'download' : 'add_circle'" />
            <span>{{ certificate ? 'Download PDF' : 'إصدار شهادة فورية' }}</span>
          </button>
          <div class="border-t border-white/10 pt-4">
            <button
              class="flex w-full items-center gap-3 rounded-sm px-4 py-2 text-slate-400 transition-colors hover:text-white"
              @click="logout"
            >
              <AppIcon name="logout" />
              <span class="text-[15px]">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      <header
        class="fixed right-72 left-0 top-0 z-40 flex h-20 flex-row-reverse items-center justify-between bg-[#0F1F2E]/95 px-8 backdrop-blur-md"
      >
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-sm font-bold text-white">{{ auth.user?.name || 'أحمد الشمري' }}</div>
              <div class="text-xs text-slate-400">
                {{ auth.role || 'مدير لجنة أخلاقيات البحث' }}
              </div>
            </div>
            <UserAvatar
              :name="auth.user?.name || 'أحمد الشمري'"
              :src="auth.user?.avatar_url"
              :subtitle="auth.user?.email || ''"
              size="md"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            class="rounded-sm p-2 text-slate-300 transition-all hover:bg-[#0D6E6E] hover:text-white"
          >
            <AppIcon name="notifications" />
          </button>
          <button
            class="rounded-sm p-2 text-slate-300 transition-all hover:bg-[#0D6E6E] hover:text-white"
          >
            <AppIcon name="help" />
          </button>
          <button
            class="rounded-sm p-2 text-slate-300 transition-all hover:bg-[#0D6E6E] hover:text-white"
          >
            <AppIcon name="language" />
          </button>
        </div>

        <div class="mx-8 flex-1 max-w-md">
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute right-3 text-slate-400">search</span>
            <input
              class="w-full rounded-sm border-none bg-white/5 py-2 pr-10 pl-4 text-sm text-white focus:ring-1 focus:ring-primary"
              placeholder="البحث عن بروتوكول أو شهادة..."
              type="text"
            />
          </div>
        </div>
      </header>

      <main class="mr-72 min-h-screen bg-surface-container-low pt-20">
        <div class="p-8">
          <div class="mb-8 flex items-end justify-between gap-6">
            <div>
              <div class="mb-2 flex items-center gap-2 text-sm text-on-surface-variant">
                <span>الرئيسية</span>
                <AppIcon name="chevron_left" size="xs" />
                <span>الشهادات المصدرة</span>
                <AppIcon name="chevron_left" size="xs" />
                <span class="font-bold text-primary">معاينة الشهادة الرسمية</span>
              </div>
              <h1 class="text-3xl font-black tracking-tight text-inverse-surface font-headline">
                إدارة الشهادات المعتمدة
              </h1>
            </div>

            <div class="flex gap-3">
              <BaseButton variant="ghost" icon-left="arrow_back" :to="`/manager/research/${id}`"
                >رجوع للبحث</BaseButton
              >
            </div>
          </div>

          <div v-if="loading" class="card-flat flex justify-center p-12">
            <LoadingSpinner />
          </div>

          <template v-else-if="research">
            <div class="grid grid-cols-12 gap-8">
              <!-- Certificate card -->
              <div class="col-span-12 lg:col-span-8">
                <div
                  class="shadow-[0_32px_64px_-12px_rgba(23,28,31,0.08)] bg-gradient-to-br from-white to-surface-container-high p-1"
                >
                  <div
                    ref="printArea"
                    class="certificate-sheet relative flex min-h-[842px] flex-col overflow-hidden border-[16px] border-surface-container-lowest bg-white p-12"
                  >
                    <div
                      class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
                    >
                      <div
                        class="absolute h-[600px] w-[600px] rounded-full border-[2px] border-primary"
                      ></div>
                      <div
                        class="absolute h-[400px] w-[400px] rotate-45 border-[1px] border-primary"
                      ></div>
                      <div class="absolute h-[200px] w-[200px] bg-primary"></div>
                    </div>

                    <div class="relative z-10 mb-16 flex items-start justify-between">
                      <div class="text-right">
                        <h2 class="mb-1 text-2xl font-black text-primary font-headline">
                          جمهورية مصر العربية
                        </h2>
                        <h3 class="font-bold text-on-surface-variant">وزارة الصحة</h3>
                        <p class="text-sm text-on-surface-variant">
                          لجنة أخلاقيات البحوث الطبية (IRB)
                        </p>
                      </div>

                      <div
                        class="w-24 h-24 bg-surface-container-high rounded-sm flex items-center justify-center border border-outline-variant/20 overflow-hidden"
                      >
                        <img
                          :src="egyptUniversityLogo"
                          alt="Cairo University Logo"
                          class="w-20 h-20 object-contain p-1"
                        />
                      </div>

                      <div class="text-left">
                        <div class="text-lg font-bold text-primary mono-nums">
                          {{ certificateNumber }}
                        </div>
                        <div class="text-sm text-on-surface-variant mono-nums">
                          {{ issueDateDisplay }}
                        </div>
                      </div>
                    </div>

                    <div
                      class="relative z-10 mb-8 flex justify-center border-b-2 border-primary/20 pb-4"
                    >
                      <div class="text-center">
                        <div
                          class="mx-auto mb-2 h-20 w-16 overflow-hidden rounded-sm border border-slate-200 bg-slate-100 p-0.5 shadow-sm"
                        >
                          <img
                            :src="presidentPortrait"
                            alt="President Abdel Fattah El-Sisi"
                            class="h-full w-full object-cover"
                          />
                        </div>
                        <p class="text-[10px] font-bold text-on-surface-variant">
                          تحت رعاية السيد الرئيس عبد الفتاح السيسي
                        </p>
                        <p class="text-[8px] text-on-surface-variant/70">
                          رئيس جمهورية مصر العربية
                        </p>
                      </div>
                    </div>

                    <div class="relative z-10 flex flex-1 flex-col px-8 py-12 text-center">
                      <h4 class="mb-12 text-4xl tracking-widest text-secondary font-display">
                        شهادة اعتماد بروتوكول بحثي
                      </h4>
                      <p class="mb-8 text-lg leading-relaxed text-on-surface-variant">
                        تشهد لجنة أخلاقيات البحوث الطبية بأن المشروع البحثي المقدم بعنوان:
                      </p>

                      <div
                        class="mb-12 inline-block border-r-4 border-primary bg-surface-container-low/30 px-12 py-8"
                      >
                        <h5
                          class="text-2xl font-bold leading-snug text-inverse-surface font-headline"
                        >
                          "{{ research.title || '—' }}"
                        </h5>
                      </div>

                      <div class="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-12 text-right">
                        <div>
                          <span class="mb-1 block text-sm text-on-surface-variant"
                            >الباحث الرئيسي</span
                          >
                          <span class="text-lg font-bold text-inverse-surface">{{
                            research.principal_investigator || '—'
                          }}</span>
                        </div>
                        <div>
                          <span class="mb-1 block text-sm text-on-surface-variant"
                            >الرقم المرجعي للمنشأة</span
                          >
                          <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                            research.serial_number || '—'
                          }}</span>
                        </div>
                        <div>
                          <span class="mb-1 block text-sm text-on-surface-variant"
                            >تاريخ الموافقة</span
                          >
                          <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                            approvalDateDisplay
                          }}</span>
                        </div>
                        <div>
                          <span class="mb-1 block text-sm text-on-surface-variant"
                            >تاريخ انتهاء الصلاحية</span
                          >
                          <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                            expiryDateDisplay
                          }}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      class="relative z-10 border-t border-outline-variant/10 pt-16 flex items-end justify-between"
                    >
                      <div class="w-48 text-center">
                        <div class="mb-2 flex h-16 items-center justify-center">
                          <AppIcon name="signature" size="xl" class="text-primary/20" />
                        </div>
                        <div class="border-t border-outline-variant pt-2 font-bold text-on-surface">
                          رئيس اللجنة
                        </div>
                      </div>
                      <div
                        class="flex h-32 w-32 items-center justify-center rounded-sm border-4 border-primary/10 bg-surface-container-low p-2"
                      >
                        <AppIcon name="qr_code_2" size="2xl" class="text-primary" />
                      </div>
                      <div class="w-48 text-center">
                        <div class="mb-2 flex h-16 items-center justify-center">
                          <AppIcon
                            name="verified_user"
                            size="2xl"
                            :filled="true"
                            class="text-secondary/30"
                          />
                        </div>
                        <div class="border-t border-outline-variant pt-2 font-bold text-on-surface">
                          ختم الأمان الرقمي
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Side panel -->
              <div class="col-span-12 space-y-8 lg:col-span-4">
                <div class="bg-surface-container-lowest p-8 shadow-sm">
                  <div class="mb-6 flex items-center justify-between">
                    <h3 class="text-lg font-bold text-inverse-surface font-headline">
                      حالة الشهادة
                    </h3>
                    <span
                      class="rounded-sm bg-secondary-fixed px-3 py-1 text-xs font-bold uppercase text-on-secondary-fixed"
                    >
                      {{ certificate ? 'جاهز للتنزيل' : 'جاهز للتوليد' }}
                    </span>
                  </div>

                  <div class="mb-8 space-y-4">
                    <div
                      class="flex items-center justify-between border-b border-surface-container-low py-3"
                    >
                      <span class="text-sm text-on-surface-variant">رقم الشهادة المتوقع</span>
                      <span class="font-bold text-inverse-surface mono-nums">{{
                        certificateNumber
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between border-b border-surface-container-low py-3"
                    >
                      <span class="text-sm text-on-surface-variant">تاريخ الإصدار</span>
                      <span class="font-bold text-inverse-surface mono-nums">{{
                        approvalDateDisplay
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between border-b border-surface-container-low py-3"
                    >
                      <span class="text-sm text-on-surface-variant">مدة الصلاحية</span>
                      <span class="font-bold text-inverse-surface">12 شهر</span>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <button
                      v-if="!certificate"
                      class="flex w-full items-center justify-center gap-3 rounded-sm bg-gradient-to-b from-primary to-primary-container py-4 font-bold text-white shadow-md transition-all hover:translate-y-[-2px]"
                      :disabled="generating"
                      @click="generateCertificate"
                    >
                      <AppIcon name="verified" :filled="true" />
                      <span>Generate Official Certificate</span>
                    </button>

                    <button
                      v-else
                      class="flex w-full items-center justify-center gap-3 rounded-sm bg-surface-container-low py-4 font-bold text-on-surface-variant transition-all hover:border hover:border-outline-variant"
                      :disabled="downloading"
                      @click="generateOrPrint"
                    >
                      <AppIcon name="download" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <p class="mt-4 text-center text-xs text-on-surface-variant">
                    بمجرد توليد الشهادة، لن تتمكن من تعديل تفاصيل البروتوكول البحثي المرتبطة بها.
                  </p>
                </div>

                <div class="border-r-4 border-primary bg-primary/5 p-8">
                  <h4 class="mb-4 flex items-center gap-2 font-bold text-primary">
                    <AppIcon name="info" />
                    مراجعة البيانات النهائية
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <AppIcon name="check_circle" :filled="true" class="mt-0.5 text-primary" />
                      تأكد من مطابقة عنوان البحث للبروتوكول الأصلي.
                    </li>
                    <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <AppIcon name="check_circle" :filled="true" class="mt-0.5 text-primary" />
                      التحقق من صحة أسماء الباحثين المشاركين.
                    </li>
                    <li class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <AppIcon name="check_circle" :filled="true" class="mt-0.5 text-primary" />
                      التأكد من تاريخ انتهاء الموافقة السنوية.
                    </li>
                  </ul>
                </div>

                <div class="relative h-48 overflow-hidden rounded-sm bg-inverse-surface p-8">
                  <div class="relative z-10 flex h-full flex-col justify-end">
                    <h4 class="mb-1 text-lg font-bold text-white">دليل الأمان الرقمي</h4>
                    <p class="text-sm text-slate-400">
                      يتم تأمين كل شهادة برمز تشفير فريد (Hash) لضمان عدم التلاعب.
                    </p>
                  </div>
                  <div class="absolute -top-12 -left-12 opacity-20">
                    <div class="h-48 w-48 animate-pulse rounded-full border border-secondary"></div>
                    <div class="absolute inset-0 m-8 rounded-full border border-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="card-flat p-12 text-center text-on-surface-variant">
            تعذر تحميل بيانات الشهادة لهذا البحث.
          </div>
        </div>
      </main>
    </div>

    <!-- Print-only certificate -->
    <div class="print-only-certificate">
      <div
        class="certificate-print-sheet relative flex min-h-[842px] flex-col overflow-hidden border-[16px] border-surface-container-lowest bg-white p-12"
      >
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
        >
          <div class="absolute h-[600px] w-[600px] rounded-full border-[2px] border-primary"></div>
          <div class="absolute h-[400px] w-[400px] rotate-45 border-[1px] border-primary"></div>
          <div class="absolute h-[200px] w-[200px] bg-primary"></div>
        </div>

        <div class="relative z-10 mb-8 flex justify-center border-b-2 border-primary/20 pb-4">
          <div class="text-center">
            <div
              class="mx-auto mb-2 h-20 w-16 overflow-hidden rounded-sm border border-slate-200 bg-slate-100 p-0.5 shadow-sm"
            >
              <img
                :src="presidentPortrait"
                alt="President Abdel Fattah El-Sisi"
                class="h-full w-full object-cover"
              />
            </div>
            <p class="text-[10px] font-bold text-on-surface-variant">
              تحت رعاية السيد الرئيس عبد الفتاح السيسي
            </p>
            <p class="text-[8px] text-on-surface-variant/70">رئيس جمهورية مصر العربية</p>
          </div>
        </div>

        <div class="relative z-10 mb-16 flex items-start justify-between">
          <div class="text-right">
            <div class="flex gap-1 mb-2">
              <div class="w-6 h-1.5 bg-[#FF0000]"></div>
              <div
                class="w-6 h-1.5 bg-white border-y border-slate-100 flex items-center justify-center"
              >
                <div class="w-1 h-1 rounded-full bg-yellow-600"></div>
              </div>
              <div class="w-6 h-1.5 bg-black"></div>
            </div>
            <h2 class="mb-1 text-2xl font-black text-primary font-headline">جمهورية مصر العربية</h2>
            <h3 class="font-bold text-on-surface-variant">جامعة القاهرة</h3>
            <p class="text-sm text-on-surface-variant">لجنة الدراسات العليا والبحوث</p>
          </div>
          <div
            class="w-24 h-24 bg-surface-container-high rounded-sm flex items-center justify-center border border-outline-variant/20 overflow-hidden"
          >
            <img
              :src="egyptUniversityLogo"
              alt="Cairo University Logo"
              class="w-20 h-20 object-contain p-1"
            />
          </div>
          <div class="text-left">
            <div class="text-lg font-bold text-primary mono-nums">{{ certificateNumber }}</div>
            <div class="text-sm text-on-surface-variant mono-nums">{{ issueDateDisplay }}</div>
          </div>
        </div>

        <div class="relative z-10 flex flex-1 flex-col px-8 py-12 text-center">
          <h4 class="mb-12 text-4xl tracking-widest text-secondary font-display">
            شهادة اعتماد بروتوكول بحثي
          </h4>
          <p class="mb-8 text-lg leading-relaxed text-on-surface-variant">
            تشهد لجنة أخلاقيات البحوث الطبية بأن المشروع البحثي المقدم بعنوان:
          </p>

          <div
            class="mb-12 inline-block border-r-4 border-primary bg-surface-container-low/30 px-12 py-8"
          >
            <h5 class="text-2xl font-bold leading-snug text-inverse-surface font-headline">
              "{{ research?.title || '—' }}"
            </h5>
          </div>

          <div class="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-12 text-right">
            <div>
              <span class="mb-1 block text-sm text-on-surface-variant">الباحث الرئيسي</span>
              <span class="text-lg font-bold text-inverse-surface">{{
                research?.principal_investigator || '—'
              }}</span>
            </div>
            <div>
              <span class="mb-1 block text-sm text-on-surface-variant">الرقم المرجعي للمنشأة</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                research?.serial_number || '—'
              }}</span>
            </div>
            <div>
              <span class="mb-1 block text-sm text-on-surface-variant">تاريخ الموافقة</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                approvalDateDisplay
              }}</span>
            </div>
            <div>
              <span class="mb-1 block text-sm text-on-surface-variant">تاريخ انتهاء الصلاحية</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                expiryDateDisplay
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="relative z-10 border-t border-outline-variant/10 pt-16 flex items-end justify-between"
        >
          <div class="w-48 text-center">
            <div class="mb-2 flex h-16 items-center justify-center">
              <AppIcon name="signature" size="xl" class="text-primary/20" />
            </div>
            <div class="border-t border-outline-variant pt-2 font-bold text-on-surface">
              رئيس اللجنة
            </div>
          </div>
          <div
            class="flex h-32 w-32 items-center justify-center rounded-sm border-4 border-primary/10 bg-surface-container-low p-2"
          >
            <AppIcon name="qr_code_2" size="2xl" class="text-primary" />
          </div>
          <div class="w-48 text-center">
            <div class="mb-2 flex h-16 items-center justify-center">
              <AppIcon name="verified_user" size="2xl" :filled="true" class="text-secondary/30" />
            </div>
            <div class="border-t border-outline-variant pt-2 font-bold text-on-surface">
              ختم الأمان الرقمي
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import UserAvatar from '@/components/shared/UserAvatar.vue';
import adminService from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';
import { formatDate } from '@/utils/helpers';

const props = defineProps({ id: { type: [String, Number], required: true } });

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const loading = ref(false);
const generating = ref(false);
const downloading = ref(false);
const research = ref(null);

const certificate = computed(() => research.value?.certificate || null);
const egyptUniversityLogo =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC-MqTtLyYcweExCbxbCpJ1gHFBsec1PxlIqOTb8TSY0OrAZQvJzGk16iTYbDORE8dMy3CF0-Dyo7BmPpS9UeofpGA2rA4GdDcCEisri7X4lccDb8lEaTqYxzBtzUcJS89JAer_K5TkujL3rYQtnQEaPOBAF67UEnbxCjcQ585_-oEGyumh1SWatofQAcQmyxDbBPqEN1kzoKz4tyYiOo1eWKlveAgNRNwQZNIFw0LqTsB0QL9Udv7GumATnjW5LaBUeIm4fgPP8uLy';
const presidentPortrait =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5L2rsHAejTT-Q4MJ7AOyx2RptXSb7ke4lM4_iVEAfpk5L5TkXnpHYxZY4zXk4mrIX5fXdpKW_-NqvDsq8laQeHY0oHExDprkZuVTbKM7paqjmqmcOx2YuY-a4GTD1VDSDA_9zcviO67Zy28UV1Ig0ohJTwD18NmspCDHHh0UxQbY5iaEkQX5AWJx0l00M-sfmsmpFDU6K6bP47pVH_s12MBDazb79rdrEXMw5DRPsHX45tfY5-9KCx8P7c1j7l5hgx3Dx4zBT6dVC';
const certificateNumber = computed(
  () => certificate.value?.certificate_number || 'IRB-2024-9982-X',
);
const issueDateDisplay = computed(
  () => formatDate(certificate.value?.issued_at, 'DD / MM / YYYY') || '24 / 05 / 2024',
);
const approvalDateDisplay = computed(
  () => formatDate(certificate.value?.issued_at, 'YYYY-MM-DD') || '2024-05-24',
);
const expiryDateDisplay = computed(() => {
  const issued = certificate.value?.issued_at ? new Date(certificate.value.issued_at) : null;
  if (!issued || Number.isNaN(issued.getTime())) return '2025-05-24';
  issued.setFullYear(issued.getFullYear() + 1);
  return issued.toISOString().slice(0, 10);
});

async function loadResearch() {
  loading.value = true;
  try {
    const res = await adminService.managerResearch(Number(props.id));
    const payload = res?.data?.data || {};
    research.value = payload.research || payload || null;
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل بيانات الشهادة');
    research.value = null;
  } finally {
    loading.value = false;
  }
}

async function generateCertificate() {
  generating.value = true;
  try {
    await adminService.issueCertificate(Number(props.id));
    toast.success('تم توليد الشهادة بنجاح');
    await loadResearch();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر توليد الشهادة');
  } finally {
    generating.value = false;
  }
}

function generateOrPrint() {
  if (!certificate.value) {
    generateCertificate();
    return;
  }

  // The print view is the downloadable certificate.
  window.print();
}

async function logout() {
  await auth.logout();
  router.replace('/login');
}

onMounted(loadResearch);
</script>

<style scoped>
.certificate-page {
  font-family: 'IBM Plex Arabic', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.mono-nums {
  font-family: 'JetBrains Mono', monospace;
}

.print-only-certificate {
  display: none;
}

@media print {
  .screen-only {
    display: none !important;
  }

  .print-only-certificate {
    display: block !important;
  }

  .certificate-page {
    background: white !important;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  .certificate-print-sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 0;
    border: 0 !important;
    box-shadow: none !important;
    page-break-after: avoid;
    page-break-inside: avoid;
  }
}
</style>
