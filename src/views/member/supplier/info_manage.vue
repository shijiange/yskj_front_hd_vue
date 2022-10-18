<template>
  <div id="supplier-center">
    <c-title :hide="false" text="信息管理"></c-title>
    <div class="info-box">
      <h1>基本信息</h1>
      <section>
        <van-field label="真实姓名:" placeholder="请输入真实姓名" v-model="information.my_name" center clearable />
        <van-field label="手机号码:" placeholder="请输入手机号码" v-model="information.phone_number" center clearable />
      </section>
      <h1>店铺信息</h1>
      <section>
        <van-field label="店铺名称:" placeholder="请输入店铺姓名" v-model="information.store_name" center clearable />
      </section>
      <section>
        <div style="height: 50px; text-align: left; line-height: 50px; background: white;">
          <span style="font-size: 16px; margin-left: 10px;">店铺LOGO：</span>
        </div>
        <div
          style="
            background: white;
            padding-bottom: 10px;
            box-sizing: border-box;
            border-bottom: solid 0.0625rem #ebebeb;
"
        >
          <div style="text-align: center;">
            <van-uploader :after-read="onRead">
              <!--<el-upload :action="uploadUrl" :on-preview="handlePreview" :limit="1" list-type="picture-card" :show-file-list="false" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleStoreSuccess">-->
              <div style="padding: 1rem; width: 10rem; height: 10rem; border: 1px dashed #333; margin: 0 auto;">
                <img :src="imageUrl ? imageUrl : require('../../../assets/images/up_icon.png')" style="width: 100%;" class="avatar" />
              </div>
              <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
              <!--<i v-else class="el-icon-plus"></i>-->
            </van-uploader>
            <!--</el-upload>-->
          </div>
          <span class="group">供应商分组：{{information.group}}</span>
          <div>
            <span class="licence" v-if="information.imageList && information.imageList.length > 0">营业执照</span>
            <div class="license_img">
              <template v-for="(item, index) in information.imageList">
                <img :src="item" alt="" class="img_box" :key="index" />
              </template>
            </div>
          </div>
          <span class="industry">行业：{{information.category}}</span>
        </div>
      </section>
      <h1 v-if="fill_set">收款信息</h1>
      <section>
        <van-field v-if="fill_set.company_bank == 1" type="number" label="银行卡账号:" placeholder="请输入银行账号" v-model.trim="information.bank_account" center clearable />
        <van-field v-if="fill_set.bank_username == 1" label="开户人姓名:" placeholder="请输入开户人姓名" v-model.trim="information.owner_name" center clearable />
        <van-field v-if="fill_set.bank_of_accounts == 1" label="开户银行:" placeholder="请输入开户银行" v-model.trim="information.opening_bank" center clearable />
        <van-field v-if="fill_set.opening_branch == 1" label="开户支行:" placeholder="请输入开户支行" v-model.trim="information.opening_branch" center clearable />

        <van-field v-if="fill_set.company_ali == 1" label="企业支付宝账号:" placeholder="请输入企业支付宝账号" v-model.trim="information.enterprise_alipay" center clearable />
        <van-field v-if="fill_set.company_ali_username == 1" label="企业支付宝用户名:" placeholder="请输入企业支付宝用户名" v-model.trim="information.enterprise_alipay_user" center clearable />
        <van-field v-if="fill_set.ali == 1" label="支付宝账号:" placeholder="请输入支付宝账号" v-model.trim="information.alipay" center clearable />

        <van-field v-if="fill_set.ali_username == 1" label="支付宝用户名:" placeholder="请输入支付宝用户名" v-model.trim="information.alipay_username" center clearable />

        <van-field v-if="fill_set.wechat == 1" label="微信账号:" placeholder="请输入微信账号" v-model.trim="information.weChat_account" center clearable />
      </section>

      <div class="btn">
        <button type="buttom" @click="modifyInformation">确认修改</button>
      </div>
    </div>
  </div>
</template>
<script>
import info_manage_controller from "./info_manage_controller";
export default info_manage_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// setting sun
.avatar {
  width: 100%;
  height: 100%;
}

#supplier-center {
  text-align: left;

  .info-box {
    h1 {
      line-height: 2.25rem;
      color: #888;
      padding: 0 0.875rem;
      font-size: 16px;
      text-align: left;
    }

    ul {
      h1 {
        line-height: 2.25rem;
        color: #888;
        padding: 0 0.875rem;
        font-size: 16px;
        text-align: left;
      }

      li {
        background-color: #fff;
        line-height: 2.75rem;
        font-size: 14px;
        text-align: left;
        padding: 0 1.25rem;
        border-bottom: solid 0.0625rem #ebebeb;
        display: flex;

        input {
          border: none;
          flex: 1;
        }

        i {
          font-size: 1.5rem;
          color: #c9c9c9;
          line-height: 3.75rem;
        }
      }

      #logo {
        line-height: 3.75rem;
        height: 3.75rem;
        position: relative;
        justify-content: space-between;

        span {
          line-height: 2.75rem;
        }

        .spare {
          position: absolute;
          right: 2.75rem;
          top: 0.375rem;
          width: 3rem;
          height: 3rem;
          border: 0.0625rem dashed #ccc;
          background-color: #fafafa;
          border-radius: 0.1875rem;
          margin: 0 auto;
          display: flex;

          i {
            font-size: 1.5rem;
            margin: 0 auto;
            line-height: 3rem;
            color: #ccc;
          }
        }
      }
    }

    .btn {
      margin: 1.25rem 0;
      padding: 0 0.875rem;
      font-size: 16px;

      button {
        color: #fff;
        background-color: #f15353;
        height: 2.875rem;
        border-radius: 0.25rem;
        border: none;
        width: 100%;
      }
    }
  }

  .van-cell {
    padding: 10px;
    font-size: 16px;

    /deep/input::placeholder {
      color: #555;
    }

    /deep/.van-field__label {
      white-space: nowrap;
      color: #333;
      width: 8.1em;
    }
  }

  .license_img {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .industry {
    font-size: 16px;
    margin: 20px 0 20px 10px;
    display: block;
  }

  .licence {
    font-size: 16px;
    margin: 20px 0 20px 10px;
    display: block;
  }

  .group {
    font-size: 16px;
    margin: 10px 0 0 10px;
    display: block;
  }

  .img_box {
    width: 45%;
    margin-bottom: 10px;
  }
}
</style>
