<template>
  <div
    class="bg-surface-container-lowest rounded-lg border p-4 transition-all group cursor-pointer"
    :class="[
      error ? 'border-error/60' : 'border-outline-variant/20',
      'hover:border-primary-fixed-dim',
    ]"
    @click="openPicker"
    @dragover.prevent="dragOver = true"
    @dragleave.prevent="dragOver = false"
    @drop.prevent="onDrop"
  >
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="min-w-0">
        <p class="font-headline font-bold text-on-background flex items-center gap-1.5">
          <AppIcon
            :name="icon"
            :filled="true"
            size="sm"
            class="text-primary"
          />
          {{ label }}
          <span
            v-if="required"
            class="text-error mr-0.5"
          >*</span>
        </p>
        <p
          v-if="description"
          class="text-xs text-on-surface-variant mt-1"
        >
          {{ description }}
        </p>
      </div>
      <span
        v-if="statusBadge"
        :class="['badge', statusClass]"
      >
        {{ statusBadge }}
      </span>
    </div>

    <div
      :class="[
        'border border-dashed rounded p-5 bg-surface/50 group-hover:bg-primary-fixed/5 transition-colors text-center',
        dragOver ? 'border-primary bg-primary-fixed/10' : 'border-outline-variant/50',
      ]"
    >
      <template v-if="!file">
        <AppIcon
          name="cloud_upload"
          size="xl"
          class="text-on-surface-variant mx-auto block"
        />
        <p class="text-sm text-on-surface-variant mt-2">
          اسحب الملف هنا أو <span class="text-primary font-bold">اختر من الجهاز</span>
        </p>
        <p class="text-[11px] text-on-surface-variant/70 mt-1 font-mono">
          PDF — حتى {{ maxSizeMb }} ميجابايت
        </p>
      </template>
      <template v-else>
        <div class="flex items-center justify-between gap-3 text-right">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <AppIcon
                name="picture_as_pdf"
                :filled="true"
                size="md"
              />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-on-background truncate">
                {{ file.name }}
              </p>
              <p class="text-[11px] text-on-surface-variant font-mono">
                {{ sizeLabel }}
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn-icon"
            aria-label="remove"
            @click.stop="clear"
          >
            <AppIcon
              name="close"
              size="sm"
            />
          </button>
        </div>
      </template>
    </div>

    <p
      v-if="error"
      class="form-error mt-2"
    >
      <AppIcon
        name="error"
        size="xs"
      />
      <span>{{ error }}</span>
    </p>

    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      @change="onPick"
    >
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AppIcon from './AppIcon.vue';
import { formatFileSize } from '@/utils/helpers';

const props = defineProps({
  modelValue: { type: [File, Object, null], default: null },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  accept: { type: String, default: 'application/pdf' },
  icon: { type: String, default: 'description' },
  maxSizeMb: { type: Number, default: 10 },
  required: { type: Boolean, default: false },
  statusBadge: { type: String, default: '' },
  statusVariant: {
    type: String,
    default: 'neutral',
    validator: (v) => ['neutral', 'info', 'success', 'warning', 'error', 'pending'].includes(v),
  },
});

const emit = defineEmits(['update:modelValue', 'error']);

const inputRef = ref(null);
const dragOver = ref(false);
const error = ref('');

const file = computed(() => props.modelValue);
const sizeLabel = computed(() => (file.value ? formatFileSize(file.value.size) : ''));

const statusClass = computed(
  () =>
    ({
      neutral: 'badge-neutral',
      info: 'badge-info',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      pending: 'badge-pending',
    })[props.statusVariant],
);

function openPicker() {
  inputRef.value?.click();
}

function onPick(event) {
  const picked = event.target.files?.[0];
  handle(picked);
  event.target.value = '';
}

function onDrop(event) {
  dragOver.value = false;
  const picked = event.dataTransfer.files?.[0];
  handle(picked);
}

function handle(picked) {
  error.value = '';
  if (!picked) return;
  if (picked.size > props.maxSizeMb * 1024 * 1024) {
    error.value = `الحد الأقصى لحجم الملف هو ${props.maxSizeMb} ميجابايت`;
    emit('error', error.value);
    return;
  }
  if (props.accept && !isAcceptable(picked, props.accept)) {
    error.value = 'نوع الملف غير مسموح به';
    emit('error', error.value);
    return;
  }
  emit('update:modelValue', picked);
}

function isAcceptable(picked, accept) {
  const types = accept.split(',').map((s) => s.trim());
  return types.some((t) => {
    if (t.startsWith('.')) return picked.name.toLowerCase().endsWith(t.toLowerCase());
    if (t.endsWith('/*')) return picked.type.startsWith(t.replace('/*', '/'));
    return picked.type === t;
  });
}

function clear() {
  emit('update:modelValue', null);
  error.value = '';
}
</script>
