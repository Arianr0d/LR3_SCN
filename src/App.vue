<template>
   <router-link to="/"/>
   <router-view/>
</template>

<script>
export default {
  name: 'App',
  created(){
    console.log(5^2)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px 0px 0px 0px;
  display: flex;
  justify-content: center;
}
</style>
