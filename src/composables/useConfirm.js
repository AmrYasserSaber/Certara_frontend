import { reactive } from 'vue';

/**
 * Promise-based confirm dialog.
 *   const ok = await useConfirm().ask({ title, message, confirmText, variant });
 *   if (ok) ...
 *
 * Consumed by <ConfirmDialog /> which is mounted once from App.vue.
 */

const state = reactive({
  open: false,
  title: '',
  message: '',
  confirmText: 'تأكيد',
  cancelText: 'إلغاء',
  variant: 'primary', // primary | danger
  _resolve: null,
});

function ask(options = {}) {
  state.title = options.title || 'تأكيد الإجراء';
  state.message = options.message || '';
  state.confirmText = options.confirmText || 'تأكيد';
  state.cancelText = options.cancelText || 'إلغاء';
  state.variant = options.variant || 'primary';
  state.open = true;
  return new Promise((resolve) => {
    state._resolve = resolve;
  });
}

function confirm() {
  state.open = false;
  state._resolve?.(true);
  state._resolve = null;
}

function cancel() {
  state.open = false;
  state._resolve?.(false);
  state._resolve = null;
}

export function useConfirm() {
  return { state, ask, confirm, cancel };
}
