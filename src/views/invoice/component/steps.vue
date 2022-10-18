<template>
  <div class="steps">
    <template v-for="(item,i) in list" >
      <div class="steps-item" >
        <div class="steps-item-radius" :class="active>=i?'bor153':'borCB'">
          <div :class="active>=i?'bgc153':'bgcCB'"></div>
        </div>
        <div class="steps-item-text">{{item}}</div>
      </div>
      <div class="steps-line" v-if="i<list.length-1">
        <div  :class="active>i?'bgc153':'bgcCB'"></div>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    props:["list","active"]
  }
</script>
<style scoped lang="scss">
  .bgc153{
    background-color: #f15353;
  }
  .bgcCB{
    background-color: #cbcbcb;
  }
  .bor153{
    border: #f15353 1px solid;
  }
  .borCB{
    border: #cbcbcb 1px solid;
  }

  .steps{
    display: flex;
    margin: 1.3rem 0 .8rem;
    .steps-line{
      flex: 1;
      height: 1rem;
      display: flex;
      align-items: center;
      div{
        width: 100%;
        height: 1px;
      }
    }
    .steps-item{
      width: 4rem;
      font-size: .75rem;
      text-align: center;
      .steps-item-text{
        margin-top: .4rem;
        font-size: .75rem;
        color: #333;
      }
    }
    .steps-item-radius{
      width: 1rem;
      height: 1rem;
      margin: 0 auto;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      div{
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
      }
    }
  }
</style>