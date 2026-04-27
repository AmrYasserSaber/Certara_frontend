<template>
  <AppShellLayout page-title="إدارة الشهادات المعتمدة">
    <div class="certificate-page bg-surface text-on-surface" dir="rtl" lang="ar">
      <div class="mb-8 flex items-end justify-between gap-6">
        <div>
          <SectionHeader
            eyebrow="الشهادات المصدرة"
            title="معاينة الشهادة الرسمية"
            description="إدارة الشهادات المعتمدة والتحقق من البيانات النهائية."
          />
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
                    <h3 class="font-bold text-on-surface-variant">وزارة الصحة والسكان</h3>
                    <p class="text-sm text-on-surface-variant">لجنة أخلاقيات البحوث الطبية (IRB)</p>
                  </div>


                  <div class="text-left">
                    <div class="text-xs uppercase tracking-widest text-on-surface-variant mb-1">الرقم المرجعي</div>
                    <div class="text-lg font-bold text-primary mono-nums">
                      {{ certificateNumber }}
                    </div>
                    <div class="text-sm text-on-surface-variant mono-nums mt-1">
                      {{ issueDateDisplay }}
                    </div>
                  </div>
                </div>

                
                <div class="relative z-10 flex flex-1 flex-col px-8 py-8 text-center">
                  <h4 class="mb-10 text-4xl font-black tracking-tight text-secondary font-display">
                    شهادة اعتماد بروتوكول بحثي
                  </h4>
                  <p class="mb-6 text-xl leading-relaxed text-on-surface-variant">
                    تشهد لجنة أخلاقيات البحوث الطبية بأن المشروع البحثي المقدم بعنوان:
                  </p>

                  <div
                    class="mb-8 inline-block border-r-8 border-primary bg-primary/5 px-12 py-10 shadow-sm"
                  >
                    <h5 class="text-2xl font-black leading-snug text-inverse-surface font-headline italic">
                      "{{ research.title || '—' }}"
                    </h5>
                  </div>

                  <p class="mb-10 text-lg leading-relaxed text-on-surface-variant max-w-3xl mx-auto">
                    قد تمت مراجعته واعتماده من قبل اللجنة المختصة، وذلك بعد التأكد من توافقه مع المعايير الأخلاقية والعلمية المعتمدة.
                  </p>

                  <div class="mx-auto mt-4 grid w-full max-w-3xl grid-cols-2 gap-y-6 gap-x-12 border-y border-outline-variant/10 py-10 text-right">
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">الباحث الرئيسي</span>
                      <span class="text-lg font-bold text-inverse-surface">{{
                        research.principal_investigator || '—'
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">الجهة المنفذة</span>
                      <span class="text-lg font-bold text-inverse-surface">{{
                        `${research.faculty} - ${research.department}`
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">الرقم المرجعي للمنشأة</span>
                      <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                        research.serial_number || '—'
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">رقم الشهادة</span>
                      <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                        certificateNumber
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">نوع الدراسة</span>
                      <span class="text-lg font-bold text-inverse-surface">دراسة بحثية معتمدة</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">تاريخ الموافقة</span>
                      <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                        approvalDateDisplay
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">تاريخ انتهاء الصلاحية</span>
                      <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                        expiryDateDisplay
                      }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                      <span class="text-xs font-bold text-primary uppercase">حالة الاعتماد</span>
                      <span class="text-lg font-bold text-success">سارية المفعول</span>
                    </div>
                  </div>

                  <p class="mt-10 text-lg font-medium text-on-surface-variant italic">
                    ويُسمح بتنفيذ هذا البحث وفقًا للضوابط واللوائح المنظمة للبحوث الطبية المعتمدة.
                  </p>
                </div>

                <div
                  class="relative z-10 border-t-2 border-primary/10 pt-12 flex items-center justify-between"
                >
                  <div class="w-64 text-center">
                    <div class="mb-4 flex h-20 items-center justify-center">
                      <AppIcon name="signature" size="2xl" class="text-primary/10" />
                    </div>
                    <div class="border-t border-outline-variant pt-3">
                      <div class="font-black text-on-surface text-lg">رئيس اللجنة</div>
                      <div class="text-xs text-on-surface-variant mt-1">التوقيع والختم الرسمي</div>
                    </div>
                  </div>
                  


                  <div class="w-64 text-center">
                    <div class="mb-4 flex h-20 items-center justify-center">
                      <AppIcon
                        name="verified_user"
                        size="3xl"
                        :filled="true"
                        class="text-secondary/20"
                      />
                    </div>
                    <div class="border-t border-outline-variant pt-3">
                      <div class="font-black text-on-surface text-lg">الاعتماد الرقمي</div>
                      <div class="text-xs text-on-surface-variant mt-1">نظام IRB الرقمي الموحد</div>
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
                <h3 class="text-lg font-bold text-inverse-surface font-headline">حالة الشهادة</h3>
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
                  <span>إصدار الشهادة الرسمية</span>
                </button>

                <button
                  v-else
                  class="flex w-full items-center justify-center gap-3 rounded-sm bg-surface-container-low py-4 font-bold text-on-surface-variant transition-all hover:border hover:border-outline-variant"
                  :disabled="downloading"
                  @click="generateOrPrint"
                >
                  <AppIcon name="download" />
                  <span>تنزيل الشهادة (PDF)</span>
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

    <!-- Print-only certificate -->
    <div class="print-only-certificate">
      <div
        class="certificate-print-sheet relative flex h-[297mm] w-[210mm] flex-col overflow-hidden border-[16px] border-surface-container-lowest bg-white p-10"
      >
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
        >
          <div class="absolute h-[600px] w-[600px] rounded-full border-[2px] border-primary" />
          <div class="absolute h-[400px] w-[400px] rotate-45 border-[1px] border-primary" />
          <div class="absolute h-[200px] w-[200px] bg-primary" />
        </div>


        <div class="relative z-10 mb-16 flex items-start justify-between">
          <div class="text-right">
            <div class="flex gap-1 mb-2">
              <div class="w-6 h-1.5 bg-[#FF0000]" />
              <div
                class="w-6 h-1.5 bg-white border-y border-slate-100 flex items-center justify-center"
              >
                <div class="w-1 h-1 rounded-full bg-yellow-600" />
              </div>
              <div class="w-6 h-1.5 bg-black" />
            </div>
            <h2 class="mb-1 text-2xl font-black text-primary font-headline">جمهورية مصر العربية</h2>
            <h3 class="font-bold text-on-surface-variant">وزارة الصحة والسكان</h3>
            <p class="text-sm text-on-surface-variant">لجنة أخلاقيات البحوث الطبية (IRB)</p>
          </div>
          <div
            class="w-24 h-24 bg-surface-container-high rounded-sm flex items-center justify-center border border-outline-variant/20 overflow-hidden shadow-inner"
          >
            <img
              :src="egyptUniversityLogo"
              alt="Logo"
              class="w-20 h-20 object-contain p-1"
            >
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

        <div class="relative z-10 flex flex-1 flex-col px-8 py-8 text-center">
          <h4 class="mb-10 text-4xl font-black tracking-tight text-secondary font-display">
            شهادة اعتماد بروتوكول بحثي
          </h4>
          <p class="mb-6 text-xl leading-relaxed text-on-surface-variant">
            تشهد لجنة أخلاقيات البحوث الطبية بأن المشروع البحثي المقدم بعنوان:
          </p>

          <div
            class="mb-8 inline-block border-r-8 border-primary bg-primary/5 px-12 py-10"
          >
            <h5 class="text-2xl font-black leading-snug text-inverse-surface font-headline italic">
              "{{ research?.title || '—' }}"
            </h5>
          </div>

          <p class="mb-10 text-lg leading-relaxed text-on-surface-variant max-w-3xl mx-auto">
            قد تمت مراجعته واعتماده من قبل اللجنة المختصة، وذلك بعد التأكد من توافقه مع المعايير الأخلاقية والعلمية المعتمدة.
          </p>

          <div class="mx-auto mt-4 grid w-full max-w-3xl grid-cols-2 gap-y-6 gap-x-12 border-y border-outline-variant/10 py-10 text-right">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">الباحث الرئيسي</span>
              <span class="text-lg font-bold text-inverse-surface">{{
                research?.principal_investigator || '—'
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">الجهة المنفذة</span>
              <span class="text-lg font-bold text-inverse-surface">{{
                `${research?.faculty} - ${research?.department}`
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">الرقم المرجعي للمنشأة</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                research?.serial_number || '—'
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">رقم الشهادة</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                certificateNumber
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">نوع الدراسة</span>
              <span class="text-lg font-bold text-inverse-surface">دراسة بحثية معتمدة</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">تاريخ الموافقة</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                approvalDateDisplay
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">تاريخ انتهاء الصلاحية</span>
              <span class="text-lg font-bold text-inverse-surface mono-nums">{{
                expiryDateDisplay
              }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-primary uppercase">حالة الاعتماد</span>
              <span class="text-lg font-bold text-success">سارية المفعول</span>
            </div>
          </div>

          <p class="mt-10 text-lg font-medium text-on-surface-variant italic">
            ويُسمح بتنفيذ هذا البحث وفقًا للضوابط واللوائح المنظمة للبحوث الطبية المعتمدة.
          </p>
        </div>

        <div
          class="relative z-10 border-t-2 border-primary/10 pt-12 flex items-center justify-between"
        >
          <div class="w-64 text-center">
            <div class="mb-4 flex h-20 items-center justify-center">
              <AppIcon name="signature" size="2xl" class="text-primary/10" />
            </div>
            <div class="border-t border-outline-variant pt-3">
              <div class="font-black text-on-surface text-lg">رئيس اللجنة</div>
              <div class="text-xs text-on-surface-variant mt-1">التوقيع والختم الرسمي</div>
            </div>
          </div>
          


          <div class="w-64 text-center">
            <div class="mb-4 flex h-20 items-center justify-center">
              <AppIcon name="verified_user" size="3xl" :filled="true" class="text-secondary/20" />
            </div>
            <div class="border-t border-outline-variant pt-3">
              <div class="font-black text-on-surface text-lg">الاعتماد الرقمي</div>
              <div class="text-xs text-on-surface-variant mt-1">نظام IRB الرقمي الموحد</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import adminService from '@/services/admin.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';
import { formatDate } from '@/utils/helpers';

const props = defineProps({ id: { type: [String, Number], required: true } });

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
  toast.info('سيتم فتح نافذة الطباعة. اختر "حفظ كملف PDF" لتنزيل الشهادة.');
  window.print();
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
  body, html {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    height: 297mm !important;
    width: 210mm !important;
  }

  .screen-only,
  .app-sidebar,
  .app-topbar,
  header,
  aside,
  nav {
    display: none !important;
  }

  /* Reset layout constraints from AppShellLayout */
  div.flex-1,
  main,
  .md\:mr-72,
  .min-h-screen {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    min-height: 0 !important;
    display: block !important;
    position: static !important;
  }

  .print-only-certificate {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: 297mm !important;
    overflow: hidden !important;
    page-break-after: avoid;
    page-break-before: avoid;
  }

  .certificate-print-sheet {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 10mm !important; /* Reduced padding for safety */
    border: 0 !important;
    box-shadow: none !important;
    background: white !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }
}
</style>
