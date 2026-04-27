<template>
  <AppShellLayout page-title="تفعيل المستخدمين">
    <SectionHeader
      eyebrow="الإدارة"
      title="المستخدمون بانتظار التفعيل"
      description="اعرض الهوية ثم قم بتفعيل أو رفض المستخدم مع سبب الرفض."
    />

    <BaseTable
      :columns="columns"
      :rows="users"
      :loading="loading"
      empty-title="لا يوجد مستخدمون معلقون"
      empty-description="كل الحسابات تمت معالجتها حاليًا."
    >
      <template #row="{ row }">
        <td class="font-bold text-on-background">
          {{ row.name }}
        </td>
        <td class="font-mono text-xs">
          {{ row.email }}
        </td>
        <td>{{ row.department || '—' }}</td>
        <td>{{ row.faculty || '—' }}</td>
        <td class="font-mono text-xs">
          {{ formatDate(row.created_at) }}
        </td>
        <td class="min-w-[420px]">
          <UserActivationCard
            compact
            :user="row"
            :activating="busyUserId === row.id && busyAction === 'activate'"
            :rejecting="busyUserId === row.id && busyAction === 'reject'"
            :reason="rejectReasons[row.id] || ''"
            @update:reason="setRejectReason(row.id, $event)"
            @view-id="openIdModal"
            @activate="activateUser"
            @reject="rejectUser"
          />
        </td>
      </template>

      <template #footer>
        <BasePagination
          v-model="page"
          :total-items="total"
          :per-page="limit"
          @update:model-value="loadUsers"
        />
      </template>
    </BaseTable>

    <BaseModal
      v-model="idModalOpen"
      title="صور الهوية"
      size="lg"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card-flat p-4">
          <h4 class="font-bold mb-2">
            الوجه الأمامي
          </h4>
          <img
            v-if="selectedIdentity.front"
            :src="selectedIdentity.front"
            alt="front-id"
            class="w-full h-64 object-contain rounded-lg bg-surface-container-low"
          >
          <p
            v-else
            class="text-sm text-on-surface-variant"
          >
            لا توجد صورة أمامية.
          </p>
        </div>
        <div class="card-flat p-4">
          <h4 class="font-bold mb-2">
            الوجه الخلفي
          </h4>
          <img
            v-if="selectedIdentity.back"
            :src="selectedIdentity.back"
            alt="back-id"
            class="w-full h-64 object-contain rounded-lg bg-surface-container-low"
          >
          <p
            v-else
            class="text-sm text-on-surface-variant"
          >
            لا توجد صورة خلفية.
          </p>
        </div>
      </div>
    </BaseModal>
  </AppShellLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppShellLayout from '@/components/shared/AppShellLayout.vue';
import SectionHeader from '@/components/shared/SectionHeader.vue';
import BaseTable from '@/components/shared/BaseTable.vue';
import BasePagination from '@/components/shared/BasePagination.vue';
import BaseModal from '@/components/shared/BaseModal.vue';
import UserActivationCard from '@/components/admin/UserActivationCard.vue';
import adminService from '@/services/admin.service';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const loading = ref(false);
const users = ref([]);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

const busyUserId = ref(null);
const busyAction = ref('');
const rejectReasons = ref({});

const idModalOpen = ref(false);
const selectedIdentity = ref({ front: '', back: '' });

const columns = [
  { key: 'name', label: 'الاسم' },
  { key: 'email', label: 'البريد' },
  { key: 'department', label: 'القسم' },
  { key: 'faculty', label: 'الكلية' },
  { key: 'created_at', label: 'تاريخ التسجيل' },
  { key: 'actions', label: 'الإجراءات' },
];

function setRejectReason(userId, value) {
  rejectReasons.value = {
    ...rejectReasons.value,
    [userId]: value,
  };
}

function openIdModal(user) {
  const frontPhoto = user?.identity_photos?.front;
  const backPhoto = user?.identity_photos?.back;

  selectedIdentity.value = {
    front:
      (typeof frontPhoto === 'string' ? frontPhoto : '') ||
      frontPhoto?.file_url ||
      frontPhoto?.file_path ||
      '',
    back:
      (typeof backPhoto === 'string' ? backPhoto : '') ||
      backPhoto?.file_url ||
      backPhoto?.file_path ||
      '',
  };
  idModalOpen.value = true;
}

async function loadUsers() {
  loading.value = true;
  try {
    const res = await adminService.pendingUsers({
      page: page.value,
      limit: limit.value,
      status: 'pending',
    });
    users.value = res?.data?.data?.items || [];
    total.value = Number(res?.data?.meta?.total || 0);
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تحميل المستخدمين المعلقين');
  } finally {
    loading.value = false;
  }
}

async function activateUser(user) {
  busyUserId.value = user.id;
  busyAction.value = 'activate';
  try {
    await adminService.activateUser(user.id);
    toast.success('تم تفعيل المستخدم بنجاح');
    await loadUsers();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر تفعيل المستخدم');
  } finally {
    busyUserId.value = null;
    busyAction.value = '';
  }
}

async function rejectUser({ user, reason }) {
  busyUserId.value = user.id;
  busyAction.value = 'reject';
  try {
    await adminService.rejectUser(user.id, reason || '');
    toast.success('تم رفض المستخدم');
    await loadUsers();
  } catch (err) {
    toast.error(err?.response?.data?.error?.message || 'تعذر رفض المستخدم');
  } finally {
    busyUserId.value = null;
    busyAction.value = '';
  }
}

onMounted(loadUsers);
</script>
