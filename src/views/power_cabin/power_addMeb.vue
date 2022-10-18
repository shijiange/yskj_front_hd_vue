<template>
  <div id="power_addMeb">
    <c-title :hide="false"
             text='会员资料填写'></c-title>
    <div class="content">
      <div class="name">
        <span>姓名</span>
        <input type="text"
               v-model="form.user_name"
               placeholder="请输入您的姓名">
      </div>
      <div class="bind-phone">
        <span>手机号</span>
        <div class="input">
          <input type="text"
                 v-model="form.phone"
                 placeholder="请输入您的手机号">
          <div class="tobind"
               v-if="!form.phone"
               @click="tobind">
            绑定手机
          </div>
        </div>
      </div>
      <div class="sex">
        <span>性别</span>
        <div class="select-sex">
          <span>{{form.sex=='1'?'男':'女'}}</span>
          <i class="iconfont icon-advertise-next"
             @click="show=true"></i>
        </div>
      </div>
      <div class="district">
        <span class="slot-left">地区</span>
        <div class="select-district">
          <span>{{form.address}}</span>
          <i class="iconfont icon-advertise-next"
             @click="show2=true"></i>
        </div>
      </div>
        <div class="name">
        <span>经销商</span>
        <input type="text"
               v-model="name"
               disabled>
      </div>
      <div class="btn" @click="confirm() ">
        确认提交
      </div>
    </div>
    <yd-cityselect v-model="show2"
                   ref="cityselectDemo"
                   :callback="result2"
                   :items="district"></yd-cityselect>
    <van-popup v-model="show"
               position="bottom"
               class="pop">
      <div class="title">
        <span class="cancel"
              @click="show=false">取消</span>
        <span>选择性别</span>
        <span class="confirm"
              @click="show=false">确认</span>
      </div>
      <div class="pop-content">
        <van-radio-group v-model="form.sex"
                         checked-color="#ee2a2b">
          <div class="item"
               v-for="(obj,index) in upgrade_level"
               :key="index">
            <span>{{obj.text}}</span>
            <van-radio :name="obj.id"></van-radio>
          </div>
        </van-radio-group>
      </div>
    </van-popup>

  </div>
</template>

<script>
import power_addMeb_controller from './power_addMeb_controller';
export default power_addMeb_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_addMeb {
  height: 100vh;
  background-color: #fff;

  .content {
    padding-left: 0.75rem;
    padding-right: 0.75rem;

    .name {
      padding: 1rem 0;
      border-bottom: solid 1px #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        width: 4.375rem;
        display: inline-block;
        margin-left: 0.25rem;
        text-align: left;
      }

      input {
        outline: none;
        border: none;
        flex: 1;
      }
    }

    .bind-phone {
      padding: 1rem 0;
      border-bottom: solid 1px #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        width: 4.375rem;
        display: inline-block;
        margin-left: 0.25rem;
        text-align: left;
      }

      .input {
        flex: 1;
        text-align: left;
        position: relative;

        input {
          outline: none;
          border: none;
        }

        .tobind {
          width: 4.6875rem;
          height: 1.75rem;
          background-color: rgba(255, 77, 72, 0.27);
          border-radius: 0.875rem;
          color: #ff4d48;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 0;
          top: 0;
          margin-top: -0.2rem;
        }
      }
    }

    .sex {
      padding: 1rem 0;
      border-bottom: solid 1px #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        width: 4.375rem;
        display: inline-block;
        margin-left: 0.25rem;
        text-align: left;
      }

      .select-sex {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }
    }

    .district {
      padding: 1rem 0;
      border-bottom: solid 1px #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .slot-left {
        width: 4.375rem;
        display: inline-block;
        margin-left: 0.25rem;
        text-align: left;
      }

      .select-district {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }
    }

    .btn {
      width: 18.75rem;
      height: 2.5rem;
      background-image:
        linear-gradient(
          0deg,
          #ff8a66 0%,
          #ff4946 84%
        ),
        linear-gradient(
          #03ddc8,
          #03ddc8
        );
      background-blend-mode:
        normal,
        normal;
      box-shadow:
        0 0.125rem 0.25rem 0
        rgba(255, 79, 73, 0.13);
      border-radius: 1.25rem;
      margin: 0 auto;
      color: #fff;
      margin-top: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }

  .pop {
    border-radius: 1.3125rem 1.3125rem 0 0;
    padding-top: 0.75rem;
    padding-bottom: 2.875rem;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 1.75rem;

      .cancel {
        color: #666;
      }

      .confirm {
        color: #ee2e2b;
      }
    }

    .pop-content {
      .item {
        display: flex;
        justify-content: space-between;
        padding: 0 1.75rem;
        margin-top: 2.25rem;
      }
    }
  }
}
</style>
