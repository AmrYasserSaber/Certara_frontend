<template>
  <section class="timeline">
    <h3 class="title">دورات المراجعة</h3>
    <p v-if="!sortedRounds.length" class="empty">لا توجد دورات مراجعة.</p>
    <ol v-else class="list">
      <li v-for="round in sortedRounds" :key="round.id" class="item">
        <div class="connector" aria-hidden="true">
          <span class="dot" />
          <span class="line" />
        </div>
        <details class="card" :open="isLatestRound(round)">
          <summary class="summary">
            <div class="summaryMain">
              <strong>الجولة {{ round.round_number }}</strong>
              <span class="meta">الحالة: {{ round.status || '-' }}</span>
              <span v-if="round.decision" class="meta">القرار: {{ round.decision }}</span>
            </div>
            <span class="date">{{ formatDate(round.created_at) }}</span>
          </summary>
          <div class="content">
            <p class="reviewer">المراجع: {{ round.reviewer?.name || 'غير معروف' }}</p>
            <ul v-if="round.comments?.length" class="comments">
              <li v-for="comment in round.comments" :key="comment.id" class="comment">
                <p class="commentText">{{ comment.comment_text }}</p>
                <time class="commentDate">{{ formatDate(comment.created_at) }}</time>
              </li>
            </ul>
            <p v-else class="empty">لا توجد تعليقات في هذه الجولة.</p>
          </div>
        </details>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  reviewRounds: { type: Array, default: () => [] },
});

const sortedRounds = computed(() =>
  [...props.reviewRounds].sort((a, b) => Number(a.round_number) - Number(b.round_number)),
);

function isLatestRound(round) {
  const latestNumber = sortedRounds.value.reduce(
    (max, current) => Math.max(max, Number(current.round_number || 0)),
    0,
  );
  return Number(round.round_number || 0) === latestNumber;
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
</script>

<style scoped>
.timeline {
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
  gap: 12px;
}
.item {
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 10px;
  align-items: start;
}
.connector {
  display: grid;
  grid-template-rows: 18px 1fr;
  justify-items: center;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #c9a84c;
  margin-top: 4px;
}
.line {
  width: 2px;
  background: rgba(201, 168, 76, 0.35);
  border-radius: 999px;
}
.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  overflow: hidden;
}
.summary {
  cursor: pointer;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
}
.summaryMain {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  align-items: baseline;
}
.meta {
  color: #475569;
  font-size: 0.85rem;
}
.date {
  color: #64748b;
  font-size: 0.85rem;
  white-space: nowrap;
}
.content {
  border-top: 1px solid #e2e8f0;
  padding: 10px 12px;
  display: grid;
  gap: 10px;
}
.reviewer {
  margin: 0;
  color: #334155;
  font-weight: 700;
}
.comments {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.comment {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
}
.commentText {
  margin: 0;
  color: #0f1f2e;
  line-height: 1.8;
}
.commentDate {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.82rem;
}
</style>
