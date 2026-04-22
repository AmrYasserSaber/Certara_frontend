<template>
  <div class="table-shell">
    <div
      v-if="$slots.toolbar"
      class="flex items-center justify-between gap-3 p-4 border-b border-outline-variant/20"
    >
      <slot name="toolbar" />
    </div>
    <div class="overflow-x-auto scrollbar-thin">
      <table class="table-base">
        <thead class="table-head">
          <tr>
            <slot name="head">
              <th
                v-for="col in columns"
                :key="col.key"
                :class="col.align ? `text-${col.align}` : ''"
              >
                {{ col.label }}
              </th>
            </slot>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td
              :colspan="columns.length || 1"
              class="py-16 text-center"
            >
              <LoadingSpinner />
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!rows || rows.length === 0">
          <tr>
            <td
              :colspan="columns.length || 1"
              class="py-16"
            >
              <slot name="empty">
                <EmptyState
                  :title="emptyTitle"
                  :description="emptyDescription"
                />
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            v-for="(row, idx) in rows"
            :key="rowKey ? row[rowKey] : idx"
            class="table-row"
          >
            <slot
              name="row"
              :row="row"
              :index="idx"
            >
              <td
                v-for="col in columns"
                :key="col.key"
              >
                {{ row[col.key] }}
              </td>
            </slot>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="$slots.footer"
      class="p-4 border-t border-outline-variant/20"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue';
import EmptyState from './EmptyState.vue';

defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  loading: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'لا توجد بيانات' },
  emptyDescription: { type: String, default: 'لم يتم العثور على سجلات لعرضها.' },
});
</script>
