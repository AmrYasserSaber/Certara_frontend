<template>
  <div class="min-h-screen bg-surface-container-low flex flex-col">
    <!-- Slim header -->
    <header
      class="flex items-center justify-between px-6 md:px-10 py-4 bg-surface-container-lowest border-b border-outline-variant/15"
    >
      <router-link
        to="/login"
        class="flex items-center gap-2 text-on-surface"
      >
        <AppIcon
          name="biotech"
          :filled="true"
          size="lg"
          class="text-primary"
        />
        <span class="font-headline font-bold text-lg">نظام IRB الرقمي</span>
      </router-link>
      <router-link
        to="/login"
        class="text-sm text-on-surface-variant hover:text-on-surface font-medium"
      >
        إلغاء
      </router-link>
    </header>

    <main class="flex-1 py-8 md:py-12 px-4 md:px-10">
      <div class="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="تسجيل جديد"
          title="إنشاء حساب طالب"
          description="أكمل البيانات التالية لإرسال طلب تفعيل الحساب إلى إدارة اللجنة."
        />

        <div class="card p-6 md:p-8">
          <div class="mb-10 pt-4 pb-2">
            <FormStepper
              v-model="currentStep"
              :steps="steps"
            />
          </div>

          <form
            novalidate
            @submit.prevent="nextOrSubmit"
          >
            <!-- Step 1: Basic info -->
            <section
              v-if="currentStep === 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <BaseInput
                v-model="form.name"
                label="الاسم الكامل"
                icon-left="person"
                placeholder="الاسم الرباعي"
                required
                :error="errors.name"
              />
              <BaseInput
                v-model="form.email"
                label="البريد الإلكتروني"
                type="email"
                icon-left="mail"
                placeholder="example@mail.com"
                required
                dir="ltr"
                :error="errors.email"
              />
              <BaseInput
                v-model="form.password"
                label="كلمة المرور"
                type="password"
                icon-left="lock"
                placeholder="••••••••"
                required
                dir="ltr"
                :error="errors.password"
                hint="على الأقل 8 أحرف تشمل أرقامًا وحروفًا"
              />
              <BaseInput
                v-model="form.password_confirmation"
                label="تأكيد كلمة المرور"
                type="password"
                icon-left="lock"
                placeholder="••••••••"
                required
                dir="ltr"
                :error="errors.password_confirmation"
              />
              <BaseInput
                v-model="form.national_id"
                label="رقم البطاقة"
                icon-left="badge"
                placeholder="14 رقمًا"
                required
                dir="ltr"
                :error="errors.national_id"
              />
              <BaseInput
                v-model="form.phone"
                label="رقم الهاتف"
                icon-left="call"
                placeholder="+20..."
                required
                dir="ltr"
                :error="errors.phone"
              />
            </section>

            <!-- Step 2: Faculty & ID photos -->
            <section
              v-if="currentStep === 1"
              class="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <BaseSelect
                v-model="form.faculty"
                label="الكلية"
                :options="FACULTIES"
                placeholder="اختر الكلية"
                required
                :error="errors.faculty"
              />
              <BaseInput
                v-model="form.department"
                label="القسم"
                icon-left="school"
                placeholder="القسم العلمي"
                required
                :error="errors.department"
              />
              <BaseInput
                v-model="form.specialty"
                label="التخصص"
                icon-left="workspace_premium"
                required
                :error="errors.specialty"
                class="md:col-span-2"
              />
              <FileUploader
                v-model="form.id_photo_front"
                label="صورة البطاقة (الوجه)"
                icon="badge"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                :max-size-mb="5"
                required
              />
              <FileUploader
                v-model="form.id_photo_back"
                label="صورة البطاقة (الظهر)"
                icon="badge"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                :max-size-mb="5"
                required
              />
            </section>

            <!-- Step 3: Research -->
            <section
              v-if="currentStep === 2"
              class="space-y-5"
            >
              <BaseInput
                v-model="form.research_title"
                label="عنوان البحث"
                icon-left="description"
                required
                :error="errors.research_title"
              />
              <BaseInput
                v-model="form.principal_investigator"
                label="اسم الباحث الرئيسي"
                icon-left="person"
                required
                :error="errors.principal_investigator"
              />
              <BaseTextarea
                v-model="form.co_investigators"
                label="المشاركون في البحث"
                placeholder="أدخل أسماء المشاركين، اسم لكل سطر"
                rows="4"
                :error="errors.co_investigators"
                hint="سيتم حفظ القيم مفصولة بفواصل"
              />
              <BaseCheckbox
                v-model="form.agree"
                :error="errors.agree"
              >
                <span>
                  أقر بأن البيانات المقدمة صحيحة وأوافق على
                  <a
                    href="#"
                    class="text-primary font-bold hover:underline"
                  >الشروط والأحكام</a>
                </span>
              </BaseCheckbox>
              <p
                v-if="errors.agree"
                class="form-error"
              >
                <AppIcon
                  name="error"
                  size="xs"
                />
                <span>{{ errors.agree }}</span>
              </p>
            </section>

            <!-- Footer actions -->
            <div
              class="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-outline-variant/20"
            >
              <BaseButton
                v-if="currentStep > 0"
                type="button"
                variant="ghost"
                icon-right="arrow_forward"
                @click="currentStep--"
              >
                السابق
              </BaseButton>
              <span v-else />

              <BaseButton
                type="submit"
                variant="primary"
                :icon-left="currentStep === steps.length - 1 ? 'how_to_reg' : ''"
                :icon-right="currentStep === steps.length - 1 ? '' : 'arrow_back'"
                :loading="auth.loading"
              >
                {{ currentStep === steps.length - 1 ? 'إنشاء الحساب' : 'التالي' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppIcon from '@/components/shared/AppIcon.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import BaseTextarea from '@/components/shared/BaseTextarea.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';
import FormStepper from '@/components/shared/FormStepper.vue';
import FileUploader from '@/components/shared/FileUploader.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';
import { ROLE_HOME_ROUTE } from '@/utils/constants';

const steps = [
  { key: 'basic', label: 'البيانات الأساسية' },
  { key: 'docs', label: 'بيانات الكلية' },
  { key: 'research', label: 'معلومات البحث' },
];

const FACULTIES = [
  { value: 'medicine', label: 'كلية الطب' },
  { value: 'dentistry', label: 'كلية طب الأسنان' },
  { value: 'pharmacy', label: 'كلية الصيدلة' },
  { value: 'nursing', label: 'كلية التمريض' },
  { value: 'veterinary', label: 'كلية الطب البيطري' },
];

const currentStep = ref(0);
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  national_id: '',
  phone: '',
  faculty: '',
  department: '',
  specialty: '',
  id_photo_front: null,
  id_photo_back: null,
  research_title: '',
  principal_investigator: '',
  co_investigators: '',
  agree: false,
});

const errors = reactive({});
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

function clearErrors() {
  Object.keys(errors).forEach((k) => (errors[k] = ''));
}

function validateStep() {
  clearErrors();
  let ok = true;
  const req = (key, msg) => {
    if (!form[key]) {
      errors[key] = msg;
      ok = false;
    }
  };
  if (currentStep.value === 0) {
    req('name', 'الاسم مطلوب');
    req('email', 'البريد الإلكتروني مطلوب');
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      errors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    req('password', 'كلمة المرور مطلوبة');
    if (form.password && form.password.length < 8)
      errors.password = 'كلمة المرور يجب أن لا تقل عن 8 أحرف';
    if (form.password !== form.password_confirmation)
      errors.password_confirmation = 'كلمتا المرور غير متطابقتين';
    req('national_id', 'رقم البطاقة مطلوب');
    if (form.national_id && !/^\d{14}$/.test(form.national_id))
      errors.national_id = 'رقم البطاقة يجب أن يكون 14 رقمًا';
    req('phone', 'رقم الهاتف مطلوب');
    ok =
      ok &&
      !errors.email &&
      !errors.password &&
      !errors.password_confirmation &&
      !errors.national_id;
  } else if (currentStep.value === 1) {
    req('faculty', 'الكلية مطلوبة');
    req('department', 'القسم مطلوب');
    req('specialty', 'التخصص مطلوب');
    if (!form.id_photo_front) {
      errors.id_photo_front = 'صورة البطاقة (الوجه) مطلوبة';
      ok = false;
    }
    if (!form.id_photo_back) {
      errors.id_photo_back = 'صورة البطاقة (الظهر) مطلوبة';
      ok = false;
    }
  } else if (currentStep.value === 2) {
    req('research_title', 'عنوان البحث مطلوب');
    req('principal_investigator', 'اسم الباحث الرئيسي مطلوب');
    if (!form.agree) {
      errors.agree = 'يجب الموافقة على الشروط قبل المتابعة';
      ok = false;
    }
  }
  return ok;
}

async function nextOrSubmit() {
  if (!validateStep()) return;
  if (currentStep.value < steps.length - 1) {
    currentStep.value += 1;
    return;
  }
  try {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') return;
      if (typeof v === 'boolean') return fd.append(k, v ? '1' : '0');
      fd.append(k, v);
    });
    await auth.register(fd);
    toast.success('تم إنشاء الحساب بنجاح. بانتظار تفعيل الإدارة.');
    if (auth.isAuthenticated) {
      router.replace(ROLE_HOME_ROUTE[auth.user?.role] || '/');
    } else {
      router.replace('/login');
    }
  } catch {
    toast.error(auth.error || 'حدث خطأ أثناء إنشاء الحساب');
  }
}
</script>
