import { reactive } from 'vue';

/**
 * Tiny singleton toast store consumed by <ToastContainer /> in App.vue.
 * Usage:
 *   const toast = useToast();
 *   toast.success('تم الحفظ بنجاح');
 *   toast.error('حدث خطأ');
 */

const state = reactive({
  items:
    /** @type {Array<{id:number,type:string,title?:string,message:string,timeout:number}>} */ ([]),
});

let seed = 1;

function push(type, message, { title, timeout = 4000 } = {}) {
  const id = seed++;
  state.items.push({ id, type, title, message, timeout });
  if (timeout > 0) {
    setTimeout(() => remove(id), timeout);
  }
  return id;
}

function remove(id) {
  const idx = state.items.findIndex((t) => t.id === id);
  if (idx !== -1) state.items.splice(idx, 1);
}

export function useToast() {
  return {
    state,
    success: (msg, opts) => push('success', msg, opts),
    error: (msg, opts) => push('error', msg, opts),
    info: (msg, opts) => push('info', msg, opts),
    warning: (msg, opts) => push('warning', msg, opts),
    remove,
  };
}
