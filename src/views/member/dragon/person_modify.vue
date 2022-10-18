<template>
  <div id="person_modfiy"
       ref="person_modfiy">
    <c-title :hide="false"
             text="个人注册信息变更"></c-title>
    <div class="content">
      <div class="first">
        <div class="head">
          <div class="line"></div>
          <span>个人注册信息变更</span>
        </div>
        <div class="form_first">
          <div class="list">
            <div class="title">
              <label>操作类型</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled='true'
                   style="font-size: 12px; text-align: right; padding-right: 1rem;"
                   placeholder="请选择类型">
          </div>
          <div class="absolute"
               style="border-bottom: solid 1px #ccc; font-size: 12px; padding-left: 1rem; padding-bottom: 0.5rem;">
            <van-radio-group v-model="formData.operType">
              <van-radio :name="item.id"
                         style="margin-top: 0.5rem; display: flex; justify-content: space-between; padding-right: 1rem;"
                         @click="chooseEnp()"
                         v-for="(item,index) in empower"
                         :key="index"
                         checked-color="#f87070">{{item.name}}</van-radio>

            </van-radio-group>
          </div>
          <div class="list">
            <div class="title">
              <label>持卡人姓名/账户户名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.accountNm"
                   placeholder="请填写持卡人姓名/账户户名">
          </div>
          <div class="list">
            <div class="title">
              <label>证件号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.idNo"
                   placeholder="请填写身份证号码">
          </div>
          <div class="list">
            <div class="title">
              <label>卡号/账号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.account"
                   placeholder="请填写卡号/账号">
          </div>
          <div class="list">
            <div class="title">
              <label>银行预留手机号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.bankMbl"
                   placeholder="请填写银行预留手机号">
          </div>
        </div>
      </div>
      <div class="btn"
           @click="edit()">
        保存修改
      </div>
    </div>
  </div>
</template>
  
<script>
import person_modify_controller from "./person_modify_controller";
export default person_modify_controller;
</script>
  
  <style lang="scss" rel="stylesheet/scss" scoped>
#person_modfiy {
  .content {
    .first {
      background-color: #fff;
      margin-bottom: 0.3rem;

      .head {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-left: 1rem;

        .line {
          width: 0.1875rem;
          height: 0.875rem;
          background-color: #f87070;
          margin-right: 1rem;
        }

        span {
          font-size: 14px;
          color: #f86e6e;
        }
      }

      .form_first {
        .list {
          padding-left: 1rem;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #ccc;

          .act {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .act-people {
              padding: 0.125rem;
              border-radius: 1rem;
              border: solid 1px #f87070;
              margin-right: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                padding: 0.25rem 0.5rem;
                border-radius: 1rem;
                line-height: 1rem;
                font-size: 12px;
                color: #b1b1b1;
              }
            }
          }

          .title {
            margin: 1rem 0;

            label {
              font-size: 12px;
            }

            span {
              color: #f87070;
              display: inline-block;
              vertical-align: top;
            }
          }

          input {
            flex: 1;
            border: none;
            outline: none;
            text-indent: 0.5rem;
          }

          input::-webkit-input-placeholder {
            /* WebKit browsers */

            font-size: 12px;
          }

          input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */

            font-size: 12px;
          }

          input::-moz-placeholder {
            /* Mozilla Firefox 19+ */

            font-size: 12px;
          }

          input:-ms-input-placeholder {
            /* Internet Explorer 10+ */

            font-size: 12px;
          }

          .enp {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .enp-choose {
              padding: 0.125rem;
              border-radius: 1rem;
              border: solid 1px #f87070;
              margin-right: 0.2rem;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                padding: 0.25rem 0.5rem;
                border-radius: 1rem;
                line-height: 1rem;
                font-size: 12px;
                color: #b1b1b1;
              }
            }
          }
        }

        .list:last-child {
          border-bottom: none;
        }
      }
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      width: 80%;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      background-color: #fd5b5b;
      height: 3rem;
    }
  }

  .bg {
    background-color: #f87070;
    color: #fff !important;
  }
}
</style>
  