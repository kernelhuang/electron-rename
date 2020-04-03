<template>
    <div class="progressContainer" v-show="show">
        <div class="progress" :style="{width:progress+'%'}">
            <b v-model="progress">{{progress}}%</b>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'MyProgress',
    data () {
      return {
        show: false,
        progress: 0
      }
    },
    mounted () {
      this.show = true
    }
  }
</script>

<style scoped>
    div.progressContainer{
        height: 20px;
        width: 96%;
        border-radius: 10px;
        background-color: #ddd;
        margin-left: 2%;
    }
    div.progress{
        background-color: #1C8DE0;
        border-radius: 10px;
        height:20px;
        line-height: 20px;
    }
    b{
        color:#fff;
        font-weight: 100;
        font-size: 12px;
        position:absolute;
        left:40%;
    }
</style>
