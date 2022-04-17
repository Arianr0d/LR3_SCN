<template>
   <div class="form">
      <div class="form__group">
         <div class="group">
            <label class="label__text">Пользователь A:</label>
         </div>
         <div class="group">
            <div class="group__row">
               <input v-model="valP" id="P" type="text" class="form-control" placeholder="Введите простое число P" style="margin-right:15px;" @input="funcCheckErrorP_Q($event)"/>
               <input v-model="valQ" id="Q" type="text" class="form-control" placeholder="Введите простое число Q" @input="funcCheckErrorP_Q($event)"/>
            </div>
            <textarea v-model="messageInc" class="form-control" placeholder="Введите сообщение"
            @input="funcCheckErrorMessage($event)"/>
            <!--<div class="form-check">
               <input class="form-check-input" type="radio" name="flexRadioDefault" value="ru" id="flexRadioDefault1" v-model="typeLang">
               <label class="form-check-label" for="flexRadioDefault1">Русский</label>
               <input class="form-check-input" type="radio" name="flexRadioDefault" value="en" id="flexRadioDefault2" v-model="typeLang" checked>
               <label class="form-check-label" for="flexRadioDefault2">Англиский</label>
            </div> -->
         </div> 
      </div>
      <div class="group" style="margin-left:300px;">
         <b-button type="button" class="btn btn-warning" v-on:click="CalcAlgorithm">Рассчитать</b-button>
      </div>       
      
      <div v-if="onClick" class="form__group__right" style="margin-right:-25px">
         <div class="group__right">
            <textarea v-model="messageDec" class="form-control" readonly/>
         </div>
         <div class="group__right">
            <label class="label__text" style="margin-left: 15px;">: Пользователь B</label>
         </div>
      </div>
   </div>
</template>

<script>
import RSA from '../function/methodRSA.js';
import GOSTEasySwap from '../function/methodGOSTEasySwap.js';

export default {
   name: 'methodRSA',
   data() {
      return {
         onClick: false,
         valP: 3,
         valQ: 11,
         messageInc: "Hello",
         messageDec: "",
         typeLang: 'en',

         validInteger: /^([1-9][0-9]*)$/,
         validRuLang: /^[a-яА-Я]*$/,
         validEngLang: /^[a-zA-Z]*$/
      }
   },
   methods: {
      CalcAlgorithm() {
         this.onClick = true;

         /*let params = {
            valueP: Number(this.valP),
            valueQ: Number(this.valQ),
            messageM: this.messageInc,
            mesLanguage: this.typeLang
         }
         this.messageDec = RSA(params);*/

         let param = {
            messageM: this.messageInc,
            mesLanguage: this.typeLang
         }
         let res = GOSTEasySwap(param);
         this.messageDec = res;

      },
      funcCheckErrorP_Q(event) {
         if(this.validInteger.test(event.target.value) && this.funcOnSample(event.target.value)) {
            this.funcDeleteError(event);
         } else {
            this.funcAddError(event);
         }
      },
      funcCheckErrorMessage(event) {
         if(this.typeLang == 'en' && this.validEngLang.test(event.target.value)) {
            this.funcDeleteError(event);
         } else if (this.typeLang == 'ru' && this.validRuLang.test(event.target.value)) {
            this.funcDeleteError(event);
         } else {
            this.funcAddError(event);
         }
      },
      funcOnSample(num) {
         for(var i = 2; i < num; i++)
            if(num % i === 0) return false;
         return true;
      },
      funcAddError(event) {
         event.target.className += " error";
      },
      funcDeleteError(event) {
         event.target.className = "form-control";
      }
   }
}
</script>

<style scoped>

.form {
   display: flex;
   flex-direction: column;
   flex-wrap: wrap;
   border-radius: 5px;
   box-shadow: 0 0 5px rgba(0,0,0,0.5);
   width: 800px;
   padding: 80px 30px;
}

.form__group {
   display: flex;
   justify-content: flex-start;
}

.form__group__right {
   display: flex;
   flex-direction: row;
   justify-content: flex-end;
   margin-top: 35px;
}

.group__right {
   display: flex;
   justify-content: flex-end;
}

.label__text {
   margin-top: 50px;
   margin-right: 30px;
}

.group__row {
   display: flex;
   justify-content: space-between;
   margin-bottom: 15px;
}

textarea {
   min-width: 450px;
   max-width: 450px;
   min-height: 100px;
}

.btn {
   width: 150px;
   font-size: 16px;
   margin: 15px 0px;
}

.group__right {
   display: flex;
   justify-content: flex-end;
}

.form-check {
   display: flex;
   flex-direction: row;
   margin: 15px 0px;
}

.form-check-input {
   margin-right: 10px;
}

.form-check-label {
   margin-right: 20px;
}

.error {
   box-shadow: 0 0 5px red;
}

</style>