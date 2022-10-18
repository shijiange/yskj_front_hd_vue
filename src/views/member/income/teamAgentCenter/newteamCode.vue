
<template>
    <div id="teamCode">
        <c-title :hide="false" text='我的激活码' tolink='newcodeHistory' totext='使用记录'></c-title>
        <van-button type="default" @click="openDialog('123')">使用激活码</van-button>
        <!--<el-button type="text" @click="openDialog('123')">使用激活码</el-button>-->
        <ul class="upgradeList" v-for="(item,i) in codes" :key='i'>
            <li><span>可升至{{item.has_one_level.level_name}}</span><span>{{item.code}}</span></li>
        </ul>
        <van-popup
            v-model="showPop"
            closeable
            position="bottom"
            :style="{ height: '40%' }"
        >
        <div style="display: flex; align-items: center; justify-content: center; height: 4rem;">请输入激活码</div>
        <div style="margin-top: 1rem;">
            <input type="text" v-model="popCode" style="outline: none; border: solid 1px #ccc; height: 2rem; text-indent: 1rem;">
        </div>
        <van-button @click="activation">确定</van-button>
        </van-popup>
        <!-- <ul class='rationList' v-for="item in codes">
                <li>
                    <div class="left">
                        <span>激活码</span>
                    </div>
                    <div class="right">
                        {{item.code}}
                    </div>
                </li>
            </ul> -->
        <!-- <van-dialog v-model="show" show-cancel-button :confirm="openDialog">
            <van-field v-model="value" label="激活码" placeholder="请输入激活码" />
        </van-dialog> -->
    </div>
</template>

<script>
import newteam_code_controller from './newteam_code_controller';
export default newteam_code_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #teamCode {
    .el-button--text {
      color: #fff;
      background-color: #f15353;
      border-color: #f15353;
      width: 80%;
      height: 2.5rem;
      line-height: 2.5rem;
      margin: 1.25rem 0;
      padding: 0;
      font-size: 16px;
    }

    .van-button {
      color: #fff;
      background-color: #f15353;
      border-color: #f15353;
      width: 80%;
      height: 2.5rem;
      line-height: 2.5rem;
      margin: 1.25rem 0;
      padding: 0;
      font-size: 16px;
    }

    .m_header {
      width: 100%;
      height: 2.8125rem;
      margin-top: 2.8125rem;
      line-height: 2.8125rem;
      background: #fff;
      border-bottom: 0.0625rem solid #ccc;

      span {
        display: inline-block;
        width: 1rem;
        height: 1.5rem;
        float: left;
        font-size: 22px;
        font-weight: normal;
      }

      span.history {
        width: 20%;
        float: right;
        font-size: 12px;
        font-weight: normal;
        color: #888;
      }

      span.title {
        width: 60%;
        font-size: 15px;
        font-weight: bold;
        box-sizing: border-box;
        padding-left: 30%;
      }
    }

    .upgradeList {
      background: #fff;

      li {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        height: 2.75rem;
        line-height: 2.75rem;
        border-bottom: solid 0.0625rem #ebebeb;
        padding: 0 0.875rem;

        span:first-child {
          color: #8c8c8c;
        }
      }

      li:last-child {
        border: none;
      }
    }

    .rationList {
      li {
        background: #fff;
        padding: 10px;
        overflow: hidden;
        border-bottom: 0.0625rem solid #ebebeb;

        .left {
          float: left;
          color: #333;
          line-height: 1.75rem;

          .num {
            color: #999;
            font-size: 12px;
            margin-left: 0.3125rem;
          }
        }

        .right {
          float: right;
          line-height: 1.75rem;
        }
      }
    }
  }
</style>
