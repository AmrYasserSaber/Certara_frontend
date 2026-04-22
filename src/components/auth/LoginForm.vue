<template>
  <!--
    Slot-only wrapper kept for symmetry with DEV_CHECKLISTS.md.
    The real login form lives inline in `views/auth/LoginView.vue` because it
    is tightly coupled to the two-pane branding layout. If you later need to
    reuse the form (e.g. inside a modal), move the <form>...</form> block here.
  -->
  <slot />
</template>
