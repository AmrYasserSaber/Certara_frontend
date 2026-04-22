<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @keydown.esc="onBackdrop"
      >
        <div
          class="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm"
          aria-hidden="true"
          @click="onBackdrop"
        />
        <section
          role="dialog"
          aria-modal="true"
          :class="[
            'relative w-full bg-surface-container-lowest rounded-xl shadow-ambient-lg ghost-border overflow-hidden flex flex-col max-h-[90vh]',
            sizeClass,
          ]"
          @click.stop
        >
          <header
            v-if="$slots.header || title"
            class="flex items-center justify-between gap-4 px-6 py-4 border-b border-surface-variant"
          >
            <div class="min-w-0">
              <h3 class="font-headline text-lg font-bold text-on-background truncate">
                <slot name="header">
                  {{ title }}
                </slot>
              </h3>
              <p
                v-if="subtitle"
                class="text-xs text-on-surface-variant mt-0.5"
              >
                {{ subtitle }}
              </p>
            </div>
            <button
              v-if="closable"
              type="button"
              class="btn-icon"
              aria-label="close"
              @click="close"
            >
              <AppIcon name="close" />
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="px-6 py-4 bg-surface border-t border-surface-variant flex justify-end gap-3"
          >
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(v),
  },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'close']);

const sizeClass = computed(
  () =>
    ({
      sm: 'max-w-md',
      md: 'max-w-xl',
      lg: 'max-w-3xl',
      xl: 'max-w-5xl',
      '2xl': 'max-w-6xl',
    })[props.size],
);

function close() {
  emit('update:modelValue', false);
  emit('close');
}

function onBackdrop() {
  if (props.closeOnBackdrop) close();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}
.modal-enter-active section,
.modal-leave-active section {
  transition: transform 200ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from section,
.modal-leave-to section {
  transform: translateY(8px) scale(0.98);
}
</style>
