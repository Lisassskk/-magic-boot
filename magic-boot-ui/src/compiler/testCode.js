export const testCode = `
  <template>
    <div class="aaa">
      {{ msg }}
      <a-button type="primary" @click="$emit('xxClick')">阿斯顿发</a-button>
      {{ props.aaaaaa }}
    </div>
  </template>

  <script setup>
    const msg = '11111'
    const props = defineProps({
      aaaaaa: String
    })
  </script>

  <style scoped>
    .aaa{
      font-size: 30px;
      color: red;
    }
  </style>
`