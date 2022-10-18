<template>
  <div id="add_family">
    <c-title :hide="false"
             text='家庭成员'></c-title>
    <div class="without"
         v-if="member_data.length<=0">
      <div class="img">
        <img src="../../assets/images/energytank_blank@2x.png">
      </div>
      <p class="no-message">暂无家庭成员</p>
      <div class="without-btn"
           @click="addMember">添加家庭成员</div>
    </div>
    <div class="content"
         v-if="member_data.length>0">
      <div class="member-list">
        <div class="list"
             v-for="(item,index) in member_data"
             :key="index">
          <div class="avator">
            <img :src="item.avatar_image">
            <div class="delete-btn"
                 @click="delMember(item.uid)"><i class="iconfont icon-guanbi"></i></div>
          </div>
          <span style="margin-top: 1rem;">{{item.nickname}}</span>
        </div>
        <div class="add-member">
          <div class="icon"
               @click="addMember"><img src="../../assets/images/up_icon.png"></div>
          <span style="margin-top: 1rem;">添加</span>
        </div>
      </div>
    </div>
    <van-popup v-model="show"
               position="bottom"
               :style="{ height: '100%' }"
               class="pop">
      <div class="pop-content">
        <div class="title">
          <i class="iconfont icon-back"
             @click="closePop"></i>
          <span class="cancel">添加家庭成员</span>
        </div>
        <div class="search-wrap">
          <div class="search">
            <i class="iconfont icon-sousuo1"
               @click="Search"></i>
            <input type="text"
                   @keypress="enterSearch"
                   v-model="member"
                   placeholder="搜索会员昵称/姓名/手机号">
          </div>
        </div>
        <div id="listWrap">
          <div class="list"
               v-for="(item,index) in datas"
               :key="index">
            <van-radio-group v-model="family_user_id"
                             checked-color="#ee2a2b">
              <van-radio :name="item.uid"
                         style=" margin-right: 1.1875rem; margin-left: 0.5rem;"></van-radio>

            </van-radio-group>
            <span class="id">ID:{{item.uid}}</span>
            <span style="font-size: 16px;">{{item.nickname}}</span>
          </div>

        </div>
      </div>
      <div class="confirm"
           :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="confirm-btn"
             @click="confirm">
          确定
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import add_family_controller from './add_family_controller';
export default add_family_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#add_family {
  height: 100vh;
  background-color: #fff;

  .without {
    padding-top: 2.5rem;
    text-align: center;

    .img {
      width: 19.1875rem;
      height: 12.75rem;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .no-message {
      margin-top: 2.125rem;
      color: #999;
    }

    .without-btn {
      width: 18.75rem;
      height: 2.5rem;
      background-image: linear-gradient(0deg, #ff8a66 0%, #ff4946 84%), linear-gradient(#03ddc8, #03ddc8);
      background-blend-mode: normal, normal;
      box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
      border-radius: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
      margin-top: 2.5rem;
    }
  }

  .content {
    padding-top: 1rem;

    .member-list {
      display: flex;
      flex-wrap: wrap;

      .list {
        width: 25%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .avator {
          width: 4.3125rem;
          height: 4.3125rem;
          border-radius: 50%;
          position: relative;

          .delete-btn {
            width: 1.1875rem;
            height: 1.1875rem;
            background-color: #ff2c29;
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            border-radius: 50%;
            font-size: 18px;
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }

      .add-member {
        width: 25%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .icon {
          width: 4.3125rem;
          height: 4.3125rem;
          border-radius: 50%;
          position: relative;
          border: dashed 1px #999;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;

          img {
            width: 2.0625rem;
            height: 2.0625rem;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .pop {
    .pop-content {
      .title {
        margin-top: 0.75rem;
        margin-left: 0.75rem;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 18px;
        justify-content: center;

        i {
          position: absolute;
          left: 0;
        }
      }

      .search-wrap {
        width: 100%;
        text-align: left;
        position: fixed;
        top: 3rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        display: flex;
        align-items: center;
        height: 3rem;
        border-bottom: solid 1px #f5f7fa;

        .search {
          width: 100%;

          i {
            margin-left: 0.5rem;
            margin-right: 1.1875rem;
          }

          input {
            outline: none;
            border: none;
          }
        }
      }

      #listWrap {
        position: fixed;
        padding: 0 0.75rem;
        top: 6rem;
        overflow-y: scroll;
        width: 100%;
        bottom: 3.5rem;

        .list {
          padding: 1.25rem 0;
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #f5f7fa;

          .id {
            margin-right: 0.75rem;
            width: 4.8125rem;
            height: 1rem;
            background-color: #ffe3e3;
            border-radius: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ff9493;
            font-size: 12px;
          }
        }
      }
    }

    .confirm {
      position: fixed;
      bottom: 0.25rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 0;
      height: 3.0625rem;

      .confirm-btn {
        width: 18.75rem;
        height: 2.5rem;
        background-image: linear-gradient(0deg, #ff8a66 0%, #ff4946 84%), linear-gradient(#03ddc8, #03ddc8);
        background-blend-mode: normal, normal;
        box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
        border-radius: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        color: #fff;
      }
    }
  }
}

.pcStyle {
  position: absolute !important;
}
</style>
