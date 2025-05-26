<template>
  <div class="flex flex-col items-center select-none">
    <div v-for="(row, rIdx) in board" :key="rIdx" class="flex gap-2 mb-1">
      <div
        v-for="(cell, cIdx) in row"
        :key="cIdx"
        :class="[
          'w-14 h-14 flex items-center justify-center rounded font-bold text-2xl border-2 transition-all duration-200',
          showStatus[rIdx] && showStatus[rIdx][cIdx]
            ? getCellColor(rIdx, cIdx)
            : 'bg-neutral-900 text-white border-neutral-700', // before reveal
          rIdx === activeRow && !gameOver ? 'border-blue-400' : '',
          flipping[rIdx] && flipping[rIdx][cIdx] ? 'flip' : '',
        ]"
        :style="{
          fontFamily: `'Clear Sans', Arial, sans-serif`,
          animationDelay: flipping[rIdx] && flipping[rIdx][cIdx]
            ? (cIdx * 350) + 'ms'
            : undefined
        }"
      >
        <span>{{ cell.letter }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

interface BoardCell {
  letter: string
  status: 'correct' | 'present' | 'absent' | ''
}

const props = defineProps<{
  board: BoardCell[][],
  activeRow: number,
  currentGuess: string,
  getCellColor: (row: number, col: number) => string,
  gameOver: boolean
}>()

// 2D arrays to track flip and color-reveal for each tile
const flipping = ref<boolean[][]>([])
const showStatus = ref<boolean[][]>([])

// Always initialize arrays to right shape when board changes
watch(() => props.board, (board) => {
  flipping.value = Array.from({ length: board.length }, () => Array(board[0]?.length || 5).fill(false))
  showStatus.value = Array.from({ length: board.length }, () => Array(board[0]?.length || 5).fill(false))
}, { immediate: true })

watch(
  () => props.board.map(r => r.map(c => c.status)),
  (statuses, prevStatuses) => {
    for (let row = 0; row < statuses.length; row++) {
      // If all cells in row just revealed
      if (
        statuses[row].every(s => s !== '') &&
        (!prevStatuses || prevStatuses[row]?.some((s, i) => s !== statuses[row][i]))
      ) {
        // For each cell in the row, flip sequentially
        for (let col = 0; col < statuses[row].length; col++) {
          // Defensive: always initialize row arrays
          if (!flipping.value[row]) flipping.value[row] = []
          if (!showStatus.value[row]) showStatus.value[row] = []
          // Start flip
          flipping.value[row][col] = true
          // Reveal status (color) at halfway point of flip
          setTimeout(() => {
            showStatus.value[row][col] = true
          }, col * 350 + 250)
          // Remove flip animation class at end
          setTimeout(() => {
            flipping.value[row][col] = false
          }, col * 350 + 500)
        }
      }
    }
  },
  { deep: true }
)
</script>

<style scoped>
.flip {
  animation: flip 500ms ease forwards;
}
@keyframes flip {
  0% {
    transform: scaleY(1);
  }
  50% {
    color: transparent;
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
