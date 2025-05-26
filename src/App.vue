<template>
  <div class="w-screen min-h-screen flex flex-col m-0 p-0 items-center justify-center bg-neutral-900">
    <div class="w-full flex flex-col items-center justify-center">
      <h1 class="text-3xl font-bold mb-6 text-center text-white tracking-wide drop-shadow">Infinite Wordle</h1>
      <WordleBoard
        :board="board"
        :activeRow="attempts"
        :currentGuess="currentGuess"
        :getCellColor="getCellColor"
        :gameOver="gameOver"
      />
      <div class="flex flex-row">
        <div v-if="message" class="mt-4 text-lg text-center text-white font-medium">{{ message }}</div>
        <div v-if="loading" class="mt-4 ml-2 text-sm text-blue-200 italic animate-pulse">Checking word...</div>
        <button
          v-if="gameOver"
          @click="nextGame"
          class="mt-4 ml-4 p-0 mx-auto underline leading-4 text-white rounded font-regular transition-all cursor-pointer"
        >
          Next Word
        </button>
      </div>
      <Keyboard
        class="mt-6"
        :keyStatus="keyStatus"
        :disabled="gameOver || loading"
        @key="handleVirtualKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRandomWord } from './utils/wordApi'
import WordleBoard from './components/WordleBoard.vue'
import Keyboard from './components/Keyboard.vue'

interface BoardCell {
  letter: string
  status: 'correct' | 'present' | 'absent' | ''
}

const maxAttempts = 6
const board = ref<BoardCell[][]>([])
const answer = ref('')
const currentGuess = ref('')
const attempts = ref(0)
const gameOver = ref(false)
const message = ref('')
const keyStatus = ref<Record<string, 'correct' | 'present' | 'absent' | undefined>>({})
const loading = ref(false)

function emptyRow(): BoardCell[] {
  return Array(5).fill(null).map(() => ({ letter: '', status: '' }))
}

async function initGame() {
  answer.value = await getRandomWord()
  board.value = Array(maxAttempts).fill(null).map(() => emptyRow())
  currentGuess.value = ''
  attempts.value = 0
  gameOver.value = false
  message.value = ''
  keyStatus.value = {}
  loading.value = false
}
onMounted(initGame)

function getCellColor(row: number, col: number): string {
  const cell = board.value[row][col]
  if (cell.status === 'correct') return 'bg-green-600 text-white border-green-700'
  if (cell.status === 'present') return 'bg-yellow-400 text-black border-yellow-500'
  if (cell.status === 'absent') return 'bg-neutral-700 text-white border-neutral-800'
  return 'bg-neutral-900 text-white border-neutral-700'
}

// Check word via dictionaryapi.dev
async function isValidWord(word: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    return res.ok
  } catch {
    return false
  }
}

async function submitGuess() {
  if (gameOver.value || loading.value) return
  if (currentGuess.value.length !== 5) {
    message.value = 'Guess must be 5 letters'
    return
  }
  loading.value = true
  message.value = ''
  const guessLower = currentGuess.value.toLowerCase()
  const valid = await isValidWord(guessLower)
  loading.value = false
  if (!valid) {
    message.value = 'Not a valid word!'
    return
  }

  const row: BoardCell[] = []
  const answerArr = answer.value.split('')
  const guessArr = guessLower.split('')

  // Count for yellow logic
  let answerCharCounts = answerArr.reduce((acc, c) => {
    acc[c] = (acc[c] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      row.push({ letter: guessArr[i].toUpperCase(), status: 'correct' })
      answerCharCounts[guessArr[i]]--
    } else {
      row.push({ letter: guessArr[i].toUpperCase(), status: '' })
    }
  }
  // Second pass: present/absent
  for (let i = 0; i < 5; i++) {
    if (row[i].status === '') {
      if (answerCharCounts[guessArr[i]] > 0) {
        row[i].status = 'present'
        answerCharCounts[guessArr[i]]--
      } else {
        row[i].status = 'absent'
      }
    }
  }

  board.value[attempts.value] = row
  updateKeyStatus(row)
  attempts.value++
  if (guessLower === answer.value) {
    message.value = '🎉 Correct! Next word?'
    gameOver.value = true
  } else if (attempts.value >= maxAttempts) {
    message.value = `Game Over! The word was "${answer.value.toUpperCase()}".`
    gameOver.value = true
  } else {
    message.value = ''
    currentGuess.value = ''
  }
}

function updateActiveRow() {
  for (let i = 0; i < 5; i++) {
    board.value[attempts.value][i].letter = currentGuess.value[i]?.toUpperCase() || ''
    board.value[attempts.value][i].status = ''
  }
}

function updateKeyStatus(guessRow: BoardCell[]) {
  for (const cell of guessRow) {
    const k = cell.letter.toLowerCase()
    if (cell.status === 'correct') {
      keyStatus.value[k] = 'correct'
    } else if (cell.status === 'present') {
      if (keyStatus.value[k] !== 'correct') keyStatus.value[k] = 'present'
    } else if (cell.status === 'absent') {
      if (!keyStatus.value[k]) keyStatus.value[k] = 'absent'
    }
  }
}

function handleVirtualKey(key: string) {
  if (gameOver.value || loading.value) return
  if (key === 'Enter') {
    submitGuess()
  } else if (key === 'Backspace') {
    if (currentGuess.value.length > 0) {
      currentGuess.value = currentGuess.value.slice(0, -1)
      updateActiveRow()
    }
  } else if (/^[a-zA-Z]$/.test(key) && currentGuess.value.length < 5) {
    currentGuess.value += key.toLowerCase()
    updateActiveRow()
  }
}

function nextGame() {
  initGame()
}

// Keyboard
window.addEventListener('keydown', async (e) => {
  if (gameOver.value || loading.value) return
  if (e.ctrlKey || e.altKey || e.metaKey) return
  if (e.key === 'Enter' || e.key === 'Backspace' || /^[a-zA-Z]$/.test(e.key)) {
    e.preventDefault()
    if (e.key === 'Enter') {
      await submitGuess()
    } else {
      handleVirtualKey(e.key)
    }
  }
})
</script>
