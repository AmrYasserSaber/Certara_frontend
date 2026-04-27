<template>
  <AppShellLayout page-title="تفاصيل البحث">
    <SectionHeader
      eyebrow="الإدارة"
      :title="research?.title || `تفاصيل البحث #${id}`"
      description="عرض كامل للبحث، بيانات الطالب، المستندات، السداد، وخط زمني للحالة."
    >
      <template #actions>
        <BaseButton variant="ghost" icon-left="arrow_back" to="/admin/research"> رجوع </BaseButton>
        <BaseButton variant="secondary" icon-left="person_add" @click="assignModalOpen = true">
          Assign Reviewer
        </BaseButton>
        <BaseButton
          v-if="research?.status === 'pending_activation'"
          variant="primary"
          icon-left="tag"
          @click="openSerialModal"
        >
          Generate Serial
        </BaseButton>
        <BaseButton
          v-if="research?.status === 'awaiting_payment_2'"
          variant="primary"
          icon-left="payments"
          @click="openSecondPaymentModal"
        >
          Set Second Payment
        </BaseButton>
      </template>
    </SectionHeader>

    <div v-if="loading" class="card-flat p-12 flex justify-center">
      <LoadingSpinner />
    </div>

    <template v-else-if="research">
      <BaseCard title="الحالة الحالية" icon="hub">
        <div class="mb-4 flex items-center gap-3">
          <StatusBadge :status="research.status" />
          <span class="text-sm text-on-surface-variant"
            >الرقم التسلسلي:
            <span class="font-mono">{{ research.serial_number || '—' }}</span></span
          >
        </div>
        <ResearchTimeline :status="research.status" />
      </BaseCard>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <BaseCard title="بيانات البحث" icon="description">
          <div class="space-y-3 text-sm">
            <p><span class="font-bold">العنوان:</span> {{ research.title || '—' }}</p>
            <p>
              <span class="font-bold">الباحث الرئيسي:</span>
              {{ research.principal_investigator || '—' }}
            </p>
            <p><span class="font-bold">المشاركون:</span> {{ research.co_investigators || '—' }}</p>
            <p><span class="font-bold">القسم:</span> {{ research.department || '—' }}</p>
            <p><span class="font-bold">الكلية:</span> {{ research.faculty || '—' }}</p>
            <p>
              <span class="font-bold">تاريخ التقديم:</span>
              {{ formatDate(research.created_at) || '—' }}
            </p>
          </div>
        </BaseCard>

        <BaseCard title="بيانات الطالب" icon="person">
          <div class="space-y-3 text-sm">
            <p><span class="font-bold">الاسم:</span> {{ research.student?.name || '—' }}</p>
            <p><span class="font-bold">البريد:</span> {{ research.student?.email || '—' }}</p>
            <p><span class="font-bold">الهاتف:</span> {{ research.student?.phone || '—' }}</p>
            <p><span class="font-bold">القسم:</span> {{ research.student?.department || '—' }}</p>
            <p><span class="font-bold">الكلية:</span> {{ research.student?.faculty || '—' }}</p>
            <p>
              <span class="font-bold">التخصص:</span> {{ research.student?.specialization || '—' }}
            </p>
          </div>
        </BaseCard>
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <BaseCard title="المستندات" icon="attach_file">
          <div v-if="documents.length" class="space-y-2">
            <a
              v-for="doc in documents"
              :key="doc.id || doc.file_path"
              :href="doc.file_url || doc.file_path"
              target="_blank"
              rel="noopener"
              class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <div>
                <p class="font-bold text-sm">{{ doc.type || 'document' }}</p>
                <p class="text-xs text-on-surface-variant font-mono">
                  {{ doc.original_name || doc.file_path }}
                </p>
              </div>
              <span class="material-symbols-outlined">download</span>
            </a>
          </div>
          <p v-else class="text-sm text-on-surface-variant">
            لا توجد قائمة مستندات مفصلة من هذا endpoint حاليًا.
          </p>
        </BaseCard>

        <BaseCard title="سجل المدفوعات" icon="payments">
          <div v-if="research?.payments?.length" class="space-y-3">
            <div v-for="payment in research.payments" :key="payment.id" class="p-3 border border-outline-variant/30 rounded-lg flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold">{{ payment.type === 'first' ? 'رسوم مبدئية' : 'رسوم المراجعة' }}</span>
                <StatusBadge :status="mapPaymentStatus(payment.status)" />
              </div>
              <div class="flex justify-between items-end">
                <span class="font-mono font-bold text-lg">{{ payment.amount }} EGP</span>
                <div class="flex gap-2">
                  <a v-if="payment.status === 'pending' && payment.checkout_url" :href="payment.checkout_url" target="_blank">
                    <BaseButton variant="ghost" size="sm" icon="payments">رابط الدفع</BaseButton>
                  </a>
                  <router-link v-if="payment.status === 'paid'" :to="`/admin/research/${research.id}/receipt?paymentId=${payment.id}`" class="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                    الإيصال
                  </router-link>
                </div>
              </div>
              <div v-if="payment.gateway_ref" class="text-[10px] text-on-surface-variant font-mono">
                Ref: {{ payment.gateway_ref }}
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-on-surface-variant text-sm">
            لا يوجد سجل دفع حتى الآن.
          </div>
        </BaseCard>
      </section>
    </template>

    <BaseCard v-else title="غير متوفر" icon="info" class="mt-6">
      <p class="text-sm text-on-surface-variant">لم يتم العثور على البحث المطلوب.</p>
    </BaseCard>

    <BaseModal v-model="assignModalOpen" title="تعيين مراجع" size="md">
      <div class="space-y-4">
        <BaseSelect
          v-model="selectedReviewerId"
          label="المراجع"
          :options="reviewerOptions"
          placeholder="اختر مراجعًا"
        />
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="assignModalOpen = false">إلغاء</BaseButton>
        <BaseButton variant="primary" :loading="assigning" @click="submitAssignReviewer">
          حفظ التعيين
        </BaseButton>
      </template>
    </BaseModal>

    <!-- Serial Generation Modal -->
    <BaseModal v-model="serialModalOpen" title="توليد الرقم التسلسلي" size="md">
      <div v-if="!serialResult" class="space-y-4">
        <p class="text-sm text-on-surface-variant">يرجى تحديد رسوم المراجعة المبدئية للبحث.</p>
        <BaseInput
          v-model="paymentAmount"
          label="مبلغ الرسوم (EGP)"
          type="number"
          placeholder="مثال: 500"
        />
      </div>
      <div v-else class="space-y-4">
        <div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
          <AppIcon name="check_circle" />
          <span class="font-bold">تم توليد الرقم التسلسلي بنجاح</span>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="font-bold">الرقم التسلسلي:</span> <span class="font-mono">{{ serialResult.serial_number }}</span></p>
          <p><span class="font-bold">المبلغ:</span> {{ serialResult.amount }} EGP</p>
          <div class="mt-4 p-3 bg-surface-container-low rounded border border-outline-variant italic break-all text-xs font-mono">
            {{ serialResult.checkout_url }}
          </div>
          <BaseButton variant="ghost" size="sm" icon="content_copy" @click="copyToClipboard(serialResult.checkout_url)">
            نسخ رابط الدفع
          </BaseButton>
        </div>
      </div>
      <template #footer>
        <template v-if="!serialResult">
          <BaseButton variant="ghost" @click="serialModalOpen = false">إلغاء</BaseButton>
          <BaseButton variant="primary" :loading="serialLoading" @click="submitGenerateSerial">
            توليد وسداد
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="primary" @click="serialModalOpen = false">إغلاق</BaseButton>
        </template>
      </template>
    </BaseModal>

    <!-- Second Payment Modal -->
    <BaseModal v-model="secondPaymentModalOpen" title="تحديد الدفعة الثانية" size="md">
      <div v-if="!secondPaymentResult" class="space-y-4">
        <p class="text-sm text-on-surface-variant">يرجى تحديد مبلغ الدفعة الثانية للبحث.</p>
        <BaseInput
          v-model="paymentAmount"
          label="مبلغ الرسوم (EGP)"
          type="number"
          placeholder="مثال: 1000"
        />
      </div>
      <div v-else class="space-y-4">
        <div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
          <AppIcon name="check_circle" />
          <span class="font-bold">تم تحديد الدفعة الثانية بنجاح</span>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="font-bold">المبلغ:</span> {{ secondPaymentResult.amount }} EGP</p>
          <div class="mt-4 p-3 bg-surface-container-low rounded border border-outline-variant italic break-all text-xs font-mono">
            {{ secondPaymentResult.checkout_url }}
          </div>
          <BaseButton variant="ghost" size="sm" icon="content_copy" @click="copyToClipboard(secondPaymentResult.checkout_url)">
            نسخ رابط الدفع
          </BaseButton>
        </div>
      </div>
      <template #footer>
        <template v-if="!secondPaymentResult">
          <BaseButton variant="ghost" @click="secondPaymentModalOpen = false">إلغاء</BaseButton>
          <BaseButton variant="primary" :loading="secondPaymentLoading" @click="submitSecondPayment">
            إرسال طلب السداد
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="primary" @click="secondPaymentModalOpen = false">إغلاق</BaseButton>
        </template>
      </template>
    </BaseModal>
  </AppShellLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseCard from '@/components/shared/BaseCard.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import ResearchTimeline from '@/components/shared/ResearchTimeline.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/composables/useToast';

const props = defineProps({ id: { type: [String, Number], required: true } });

const toast = useToast();

const loading = ref(false);
const serialLoading = ref(false);
const assigning = ref(false);

const research = ref(null);
const reviewers = ref([]);
const assignModalOpen = ref(false);
const selectedReviewerId = ref('');

const reviewerOptions = computed(() =>
  reviewers.value.map((r) => ({
    value: String(r.id),
    label: `${r.name} (${r.email})`,
  })),
);

const documents = computed(() => {
  if (Array.isArray(research.value?.documents)) return research.value.documents;
  if (research.value?.document) return [research.value.document];
  return [];
});

function mapPaymentStatus(value) {
  if (!value) return 'draft';
  if (value === 'paid') return 'approved';
  if (value === 'failed') return 'rejected';
  return 'awaiting_payment_1';
}

async function loadResearchDetail() {
  loading.value = true;
  try {
    const res = await adminService.researchDetail(Number(props.id));
    const payload = res?.data?.data || {};
    research.value = payload.research || payload || null;
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل تفاصيل البحث');
    research.value = null;
  } finally {
    loading.value = false;
  }
}

async function loadReviewers() {
  try {
    const res = await adminService.reviewers();
    reviewers.value = res?.data?.data?.items || [];
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل المراجعين');
  }
}

async function submitAssignReviewer() {
  if (!selectedReviewerId.value) {
    toast.warning('اختر مراجعًا');
    return;
  }

  assigning.value = true;
  try {
    await adminService.assignReviewer(Number(props.id), Number(selectedReviewerId.value));
    toast.success('تم تعيين المراجع بنجاح');
    assignModalOpen.value = false;
    await loadResearchDetail();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تعيين المراجع');
  } finally {
    assigning.value = false;
  }
}

const serialModalOpen = ref(false);
const serialResult = ref(null);
const secondPaymentModalOpen = ref(false);
const secondPaymentResult = ref(null);
const secondPaymentLoading = ref(false);
const paymentAmount = ref(500);

function openSerialModal() {
  paymentAmount.value = 500;
  serialResult.value = null;
  serialModalOpen.value = true;
}

function openSecondPaymentModal() {
  paymentAmount.value = research.value?.sample_size?.fee_amount || 0;
  secondPaymentResult.value = null;
  secondPaymentModalOpen.value = true;
}

async function submitGenerateSerial() {
  if (paymentAmount.value <= 0) {
    toast.warning('يرجى تحديد مبلغ صحيح');
    return;
  }
  serialLoading.value = true;
  try {
    const res = await adminService.generateSerial(Number(props.id), Number(paymentAmount.value));
    toast.success('تم توليد الرقم التسلسلي ورابط الدفع');
    const data = res.data?.data || {};
    serialResult.value = {
        serial_number: data.serial_number,
        amount: data.amount || paymentAmount.value,
        checkout_url: data.checkout_url
    };
    // No longer closing modal immediately
    await loadResearchDetail();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر توليد الرقم التسلسلي');
  } finally {
    serialLoading.value = false;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.success('تم نسخ الرابط');
}

async function submitSecondPayment() {
  if (paymentAmount.value <= 0) {
    toast.warning('يرجى تحديد مبلغ صحيح');
    return;
  }
  secondPaymentLoading.value = true;
  try {
    const res = await adminService.setSecondPayment(Number(props.id), Number(paymentAmount.value));
    toast.success('تم تحديد مبلغ الدفعة الثانية وإرسال رابط الدفع');
    const data = res.data?.data || {};
    secondPaymentResult.value = {
        amount: data.amount || paymentAmount.value,
        checkout_url: data.checkout_url
    };
    await loadResearchDetail();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحديد الدفعة الثانية');
  } finally {
    secondPaymentLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadResearchDetail(), loadReviewers()]);
});
</script>
