/**
 * Shared enum-like constants used across the whole frontend.
 * Stay in sync with `database/schema.sql` and the API contract.
 * DEV 1 owns this file — other devs request additions via PR.
 */

export const ROLES = Object.freeze({
  STUDENT: 'student',
  ADMIN: 'admin',
  SAMPLE_SIZE_OFFICER: 'sample_size_officer',
  REVIEWER: 'reviewer',
  MANAGER: 'manager',
});

export const ROLE_LABELS_AR = Object.freeze({
  [ROLES.STUDENT]: 'طالب',
  [ROLES.ADMIN]: 'موظف الإدارة',
  [ROLES.SAMPLE_SIZE_OFFICER]: 'موظف حساب حجم العينة',
  [ROLES.REVIEWER]: 'مراجع',
  [ROLES.MANAGER]: 'مدير اللجنة',
});

export const USER_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
});

export const USER_STATUS_LABELS_AR = Object.freeze({
  [USER_STATUS.PENDING]: 'قيد التفعيل',
  [USER_STATUS.ACTIVE]: 'مفعل',
  [USER_STATUS.REJECTED]: 'مرفوض',
});

/** All 11 research statuses (matches the ENUM in schema.sql). */
export const RESEARCH_STATUS = Object.freeze({
  DRAFT: 'draft',
  PENDING_ACTIVATION: 'pending_activation',
  AWAITING_PAYMENT_1: 'awaiting_payment_1',
  AWAITING_SAMPLE_SIZE: 'awaiting_sample_size',
  AWAITING_PAYMENT_2: 'awaiting_payment_2',
  IN_REVIEW: 'in_review',
  REVISION_REQUESTED: 'revision_requested',
  REVIEWER_APPROVED: 'reviewer_approved',
  MANAGER_REVIEWING: 'manager_reviewing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const RESEARCH_STATUS_LABELS_AR = Object.freeze({
  [RESEARCH_STATUS.DRAFT]: 'مسودة',
  [RESEARCH_STATUS.PENDING_ACTIVATION]: 'قيد التفعيل',
  [RESEARCH_STATUS.AWAITING_PAYMENT_1]: 'بانتظار الدفع الأول',
  [RESEARCH_STATUS.AWAITING_SAMPLE_SIZE]: 'بانتظار حجم العينة',
  [RESEARCH_STATUS.AWAITING_PAYMENT_2]: 'بانتظار الدفع الثاني',
  [RESEARCH_STATUS.IN_REVIEW]: 'قيد المراجعة',
  [RESEARCH_STATUS.REVISION_REQUESTED]: 'مطلوب تعديلات',
  [RESEARCH_STATUS.REVIEWER_APPROVED]: 'تمت موافقة المراجع',
  [RESEARCH_STATUS.MANAGER_REVIEWING]: 'بانتظار قرار المدير',
  [RESEARCH_STATUS.APPROVED]: 'معتمد',
  [RESEARCH_STATUS.REJECTED]: 'مرفوض',
});

/**
 * Maps each research status to a badge variant name understood by StatusBadge.vue.
 * Variants: neutral | info | success | warning | error | pending
 */
export const RESEARCH_STATUS_BADGE_VARIANT = Object.freeze({
  [RESEARCH_STATUS.DRAFT]: 'neutral',
  [RESEARCH_STATUS.PENDING_ACTIVATION]: 'pending',
  [RESEARCH_STATUS.AWAITING_PAYMENT_1]: 'warning',
  [RESEARCH_STATUS.AWAITING_SAMPLE_SIZE]: 'info',
  [RESEARCH_STATUS.AWAITING_PAYMENT_2]: 'warning',
  [RESEARCH_STATUS.IN_REVIEW]: 'info',
  [RESEARCH_STATUS.REVISION_REQUESTED]: 'warning',
  [RESEARCH_STATUS.REVIEWER_APPROVED]: 'success',
  [RESEARCH_STATUS.MANAGER_REVIEWING]: 'info',
  [RESEARCH_STATUS.APPROVED]: 'success',
  [RESEARCH_STATUS.REJECTED]: 'error',
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
});

export const PAYMENT_TYPE = Object.freeze({
  FIRST: 'first',
  SECOND: 'second',
});

export const PAYMENT_STATUS_LABELS_AR = Object.freeze({
  [PAYMENT_STATUS.PENDING]: 'قيد الانتظار',
  [PAYMENT_STATUS.PAID]: 'مدفوع',
  [PAYMENT_STATUS.FAILED]: 'فشل',
});

export const DOCUMENT_TYPES = Object.freeze({
  PROTOCOL: 'protocol',
  APPLICATION: 'application',
  COI: 'coi',
  CHECKLIST: 'checklist',
  CONSENT: 'consent',
});

export const DOCUMENT_TYPE_LABELS_AR = Object.freeze({
  [DOCUMENT_TYPES.PROTOCOL]: 'البروتوكول البحثي',
  [DOCUMENT_TYPES.APPLICATION]: 'طلب مراجعة البروتوكول',
  [DOCUMENT_TYPES.COI]: 'إقرار تضارب المصالح',
  [DOCUMENT_TYPES.CHECKLIST]: 'قائمة مراجعة IRB',
  [DOCUMENT_TYPES.CONSENT]: 'موافقة الباحث والمريض',
});

export const REVIEW_DECISIONS = Object.freeze({
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested',
});

export const REVIEW_DECISION_LABELS_AR = Object.freeze({
  [REVIEW_DECISIONS.APPROVED]: 'موافقة',
  [REVIEW_DECISIONS.REJECTED]: 'رفض',
  [REVIEW_DECISIONS.REVISION_REQUESTED]: 'طلب تعديل',
});

export const NOTIFICATION_TYPES = Object.freeze({
  ACCOUNT_ACTIVATED: 'ACCOUNT_ACTIVATED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  REVIEW_REQUESTED: 'REVIEW_REQUESTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  RESEARCH_APPROVED: 'RESEARCH_APPROVED',
  RESEARCH_REJECTED: 'RESEARCH_REJECTED',
  CERTIFICATE_READY: 'CERTIFICATE_READY',
});

/** The 8 pipeline stages shown by ResearchTimeline.vue. */
export const RESEARCH_TIMELINE_STAGES = Object.freeze([
  { key: 'submitted', label: 'مُقدَّم', icon: 'inventory_2' },
  { key: 'admin_review', label: 'مراجعة الإدارة', icon: 'fact_check' },
  { key: 'payment_1', label: 'الدفع الأول', icon: 'payments' },
  { key: 'sample_size', label: 'حجم العينة', icon: 'group' },
  { key: 'payment_2', label: 'الدفع الثاني', icon: 'payments' },
  { key: 'in_review', label: 'قيد المراجعة', icon: 'rate_review' },
  { key: 'decision', label: 'القرار', icon: 'gavel' },
  { key: 'certificate', label: 'الشهادة', icon: 'workspace_premium' },
]);

/** Map each research status to the timeline stage index (0..7) it is currently on. */
export const STATUS_TO_TIMELINE_STAGE = Object.freeze({
  [RESEARCH_STATUS.DRAFT]: 0,
  [RESEARCH_STATUS.PENDING_ACTIVATION]: 1,
  [RESEARCH_STATUS.AWAITING_PAYMENT_1]: 2,
  [RESEARCH_STATUS.AWAITING_SAMPLE_SIZE]: 3,
  [RESEARCH_STATUS.AWAITING_PAYMENT_2]: 4,
  [RESEARCH_STATUS.IN_REVIEW]: 5,
  [RESEARCH_STATUS.REVISION_REQUESTED]: 5,
  [RESEARCH_STATUS.REVIEWER_APPROVED]: 6,
  [RESEARCH_STATUS.MANAGER_REVIEWING]: 6,
  [RESEARCH_STATUS.APPROVED]: 7,
  [RESEARCH_STATUS.REJECTED]: 6,
});

/** Redirect target per role after successful login. */
export const ROLE_HOME_ROUTE = Object.freeze({
  [ROLES.STUDENT]: '/student',
  [ROLES.ADMIN]: '/admin',
  [ROLES.SAMPLE_SIZE_OFFICER]: '/sample-size',
  [ROLES.REVIEWER]: '/reviewer',
  [ROLES.MANAGER]: '/manager',
});

/** LocalStorage keys for auth persistence. */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'irb.auth.token',
  USER: 'irb.auth.user',
  LOCALE: 'irb.locale',
});

export const MAX_UPLOAD_SIZE_MB = 10;
export const ALLOWED_DOC_MIME_TYPES = ['application/pdf'];
export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const NOTIFICATION_POLL_INTERVAL_MS = 30_000;
