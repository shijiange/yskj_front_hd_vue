<template>
    <div id="enterShop">
        <c-title :hide="false" :text='title'></c-title>
        <!-- <div class="title">{{title}}</div> -->
        <div id="content" v-html='content'>
            <p>{{content}}</p>
        </div>

    <div style="height: 40px;">

    </div>
        
    </div>
</template>

<script>
import enter_protocol_controller from './enter_protocol_controller';
export default enter_protocol_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enterShop {
  background: #fff;
  min-height: 38.75rem;

  p {
    padding: 0.875rem;
    font-size: 16px;
    line-height: 1.625rem;
    text-align: left;
  }
}
</style>