import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
  RESEARCH_STATUS_BADGE_VARIANT,
  RESEARCH_STATUS_LABELS_AR,
  ROLE_LABELS_AR,
  USER_STATUS_LABELS_AR,
} from '@/utils/constants';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('ar');

/** Format a date with the default "12 أكتوبر 2024" style. */
export function formatDate(input, template = 'D MMMM YYYY') {
  if (!input) return '';
  const d = dayjs(input);
  return d.isValid() ? d.format(template) : '';
}

/** Short ISO-ish date for mono fields. */
export function formatDateShort(input) {
  if (!input) return '';
  const d = dayjs(input);
  return d.isValid() ? d.format('DD MMM YY') : '';
}

/** "Just now", "منذ يومين", etc. */
export function formatRelative(input) {
  if (!input) return '';
  const d = dayjs(input);
  return d.isValid() ? d.fromNow() : '';
}

/** 1234 -> "1,234" in Latin digits (mono fields). */
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '';
  return Number(n).toLocaleString('en-US');
}

/** 1234.5 -> "1,234.50 ج.م" */
export function formatCurrency(n, currency = 'EGP') {
  if (n === null || n === undefined) return '';
  try {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(n));
  } catch {
    return `${formatNumber(n)} ${currency}`;
  }
}

/** 1536 -> "1.5 KB" */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = Number(bytes);
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function statusBadgeVariant(status) {
  return RESEARCH_STATUS_BADGE_VARIANT[status] || 'neutral';
}

export function statusLabelAr(status) {
  return RESEARCH_STATUS_LABELS_AR[status] || status || '';
}

export function roleLabelAr(role) {
  return ROLE_LABELS_AR[role] || role || '';
}

export function userStatusLabelAr(status) {
  return USER_STATUS_LABELS_AR[status] || status || '';
}

/** Ensure the browser downloads a blob with the given filename. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Debounce helper — returns a function that delays invoking `fn` until
 * `wait` ms have passed since the last call.
 */
export function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function truncate(str, max = 80) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

/** Stub used by reviewer views to strip student PII defensively. */
export function sanitizeResearchForReviewer(research) {
  if (!research) return research;
  const clone = { ...research };
  delete clone.student_id;
  delete clone.student_name;
  delete clone.student_email;
  delete clone.student_phone;
  delete clone.id_photo_path;
  if (clone.student) delete clone.student;
  return clone;
}
