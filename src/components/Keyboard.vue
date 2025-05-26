<template>
  <div class="flex flex-col gap-2 select-none">
    <div v-for="(row, index) in rows" :key="index" class="flex justify-center gap-1">
      <button
        v-for="key in row"
        :key="key"
        :class="[
          'w-10 h-10 flex items-center justify-center rounded-md font-bold uppercase text-lg shadow transition-all',
          keyColor(key),
          isKeyDisabled(key) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black hover:text-white',
        ]"
        :disabled="props.disabled || isKeyDisabled(key)"
        @click="() => { if (!isKeyDisabled(key) && !props.disabled) $emit('key', key) }"
      >
        {{ key }}
      </button>
    </div>
    <div class="flex justify-center gap-1">
      <button
        class="w-[75px] h-10 rounded-md font-bold text-lg bg-gray-300 text-gray-800 hover:bg-black hover:text-white cursor-pointer"
        :disabled="props.disabled"
        @click="$emit('key', 'Enter')"
      >Enter</button>
      <button
        class="w-[75px] h-10 rounded-md font-bold text-lg bg-gray-300 text-gray-800 hover:bg-black hover:text-white cursor-pointer"
        :disabled="props.disabled"
        @click="$emit('key', 'Backspace')"
      >Back</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  keyStatus: Record<string, 'correct' | 'present' | 'absent' | undefined>,
  disabled?: boolean
}>()

const rows = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
]

function isKeyDisabled(key: string): boolean {
  return props.keyStatus[key] === 'absent'
}

function keyColor(key: string): string {
  const status = props.keyStatus[key]
  if (status === 'correct') return 'bg-green-500 text-white'
  if (status === 'present') return 'bg-yellow-400 text-white'
  if (status === 'absent') return 'bg-gray-400 text-white'
  return 'bg-gray-200 text-gray-900'
}
</script>
