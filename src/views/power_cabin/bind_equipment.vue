<template>
  <div id="bind_equipment">
    <c-title :hide="false"
             text='绑定设备'></c-title>
    <div class="content">
      <div class="item">
        <span>设备编号:</span>
        <input type="text"
               v-model="equipment_no"
               placeholder="输入设备编号">
      </div>
    </div>
    <div class="bind_wrap"
         :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
      <div class="bind_btn"
           @click="bind">绑定</div>
    </div>
  </div>
</template>

<script>
import bind_equipment_controller from './bind_equipment_controller';
export default bind_equipment_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#bind_equipment {
  height: 100vh;
  background-color: #fff;

  .content {
    padding: 0.75rem;

    .item {
      border-bottom: solid 1px #f5f7fa;
      padding: 0.25rem;
      text-align: left;

      span {
        display: inline-block;
      }

      input {
        flex: 1;
        color: #999;
        padding: 1.1875rem;
        border: none;
        outline: none;
      }
    }
  }

  .bind_wrap {
    position: fixed;
    bottom: 0.25rem;
    width: 100%;

    .bind_btn {
      width: 18.75rem;
      height: 2.5rem;
      background-color: #ff2c29;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
    }
  }
}

.pc {
  position: absolute;
  width: 375px !important;
}
</style>
