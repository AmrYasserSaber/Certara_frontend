<template>
  <section class="thread">
    <h3 class="title">
      سجل التعليقات
    </h3>

    <p
      v-if="!sortedComments.length"
      class="empty"
    >
      لا توجد تعليقات بعد.
    </p>

    <ul
      v-else
      class="list"
    >
      <li
        v-for="comment in sortedComments"
        :key="comment.id"
        class="comment"
      >
        <p class="text">
          {{ comment.comment_text }}
        </p>
        <time class="date">{{ formatDate(comment.created_at) }}</time>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
});

const sortedComments = computed(() =>
  [...props.comments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  ),
);

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
</script>

<style scoped>
.thread {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  text-align: right;
}

.title {
  margin: 0 0 12px;
  color: #0f1f2e;
}

.empty {
  margin: 0;
  color: #64748b;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.comment {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
}

.text {
  margin: 0;
  color: #0f1f2e;
  line-height: 1.8;
}

.date {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.82rem;
}
</style>
