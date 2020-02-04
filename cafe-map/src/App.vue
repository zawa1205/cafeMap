<template>
  <div class="app">
    <Header/>
    <router-view/>
  </div>


</template>

<script>
import Header from './Header.vue'

export default {
  components: {
    Header,
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  background-color: rgb(246, 246, 246);

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
  }

}
</style>
