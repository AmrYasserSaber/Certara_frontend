# Shared Component Library

All live under `src/components/shared/`. DEV 1 owns this folder; other devs
request additions via PR.

Every component is a `<script setup>` SFC. All props support RTL and Arabic
labels out of the box. Icons come from Material Symbols and pass through
`AppIcon`.

---

## Layout

### `AppShellLayout`
Dark-nav app shell with sidebar + topbar + `<main>` slot.

```vue
<AppShellLayout page-title="لوحة الطالب" active-variant="gold">
  <!-- page content -->
</AppShellLayout>
```

Props:

- `pageTitle: String` – shown in the topbar.
- `navItems: Array` – `{ to, label, icon, badge? }`. If omitted, a default list
  is generated from the user's role.
- `footerItems: Array` – same shape; defaults include profile + notifications.
- `primaryAction: Object` – `{ label, icon, onClick }` to render a gold CTA
  button inside the sidebar brand block.
- `activeVariant: 'gold' | 'teal' | 'light'` – sidebar active-item style.
- `darkTopbar: Boolean` – default `true`.

### `AppSidebar` / `AppSidebarNavItem` / `AppTopBar`
Lower-level pieces used by `AppShellLayout`. Use directly only if you need a
custom shell.

### `BlankLayout`
Minimal layout used for login/register/404 pages.

---

## Primitives

### `BaseButton`
```vue
<BaseButton variant="primary" icon-left="save" :loading="saving" @click="save">
  حفظ
</BaseButton>
```
Props: `variant`, `size`, `iconLeft`, `iconRight`, `loading`, `disabled`,
`block`, `to`, `href`, `type`.

Variants: `primary | secondary | ghost | outline | danger | icon | icon-dark`.

### `BaseInput` / `BaseSelect` / `BaseTextarea`
Standard field primitives with label, hint, error slot, leading/trailing icons.
All use `v-model`.

### `BaseCheckbox` / `BaseRadio`
Inline single-line choice fields.

### `AppIcon`
Wraps Material Symbols.

```vue

<AppIcon name="check_circle" :filled="true" size="lg" weight="500"></AppIcon>
```

---

## Surfaces

### `BaseCard`
Generic card with header / body / footer slots, title + icon props, optional
`accent-rail`.

### `StatCard`
KPI tile with decorative blob + icon + optional trend.

### `SectionHeader`
Page-level eyebrow + title + description, plus `actions` slot.

### `EmptyState` / `LoadingSpinner`
Used by `BaseTable` internally; reusable on any page.

---

## Data

### `BaseTable`
RTL-aware table shell.

```vue

<BaseTable :columns="columns" :rows="rows" :loading="loading">
  <template #row="{ row }">
    <td>{{ row.title }}</td>
    <td>
      <StatusBadge :status="row.status"></StatusBadge>
    </td>
  </template>
</BaseTable>
```

### `BasePagination`
`v-model` bound page number, accepts `totalItems` + `perPage`.

---

## Feedback

### `StatusBadge`
Accepts either a `status` (one of the 11 `RESEARCH_STATUS` enum values and maps
it to label + variant) or an explicit `variant`.

### `BaseModal`
Teleported modal with backdrop blur. Props: `modelValue`, `title`, `size`,
`closable`, `closeOnBackdrop`.

### `ConfirmDialog`
Mounted once globally from `App.vue`. Usage:

```js
const ok = await useConfirm().ask({
  title: 'حذف البحث',
  message: 'هل أنت متأكد؟',
  variant: 'danger',
});
```

### `ToastNotification` / `ToastContainer`
Mounted once globally from `App.vue`. Trigger via:

```js
useToast().success('تم الحفظ');
useToast().error('فشل الطلب');
```

---

## Forms

### `FileUploader`
Drag-and-drop dropzone with per-file status badge.

```vue

<FileUploader
  v-model="file"
  label="البروتوكول البحثي"
  accept="application/pdf"
  :max-size-mb="10"
  required
></FileUploader>
```

### `FormStepper`
Horizontal stepper for multi-step forms (used by the register flow).

---

## Domain-shared

### `NotificationBell`
Header dropdown; auto-hydrates from the notification store + 30-second polling.

### `NotificationItem`
Styled notification card. Maps each `NOTIFICATION_TYPES.*` to its icon + color.

### `UserAvatar`
Initials-based avatar with optional photo + subtitle.

### `ResearchTimeline`
8-step horizontal progress timeline. Either pass `status` and it will compute
the current stage, or pass an explicit `stage` index.

### `StubView`
Used by every placeholder view. Renders "قيد الإنشاء" with owner + expected
endpoints so other devs know exactly what to implement.
