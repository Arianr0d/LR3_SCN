<template>
   <div>
      <button v-on:click="CalcAlgorithm">Рассчитать</button>
   </div>
</template>

<script>
import RSA from '../function/methodSCN.js'

export default {
   name: 'methodRSA',
   methods: {
      CalcAlgorithm() {
         let params = {
            valueP: 3,
            valueQ: 11,
            messageM: "Hello",
            mesLanguage: "en"
         }
         let res = RSA(params)
         console.log(res)
      }
   }
}
</script>

<style scoped>

</style>