<template>
  <div>
    <div id="edit_card" v-if="!streetShow">
      <van-nav-bar left-arrow title="编辑名片" fixed @click-left="gotoCardCenter" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" />
      <div class="content">
        <div class="state_box" v-if="is_allow">
          <ul class="state">
            <li class="left">名片状态</li>
            <li class="right">
              <van-radio-group v-model="form.status">
                <van-radio :name="1">开启</van-radio>
                <van-radio :name="0">关闭</van-radio>
              </van-radio-group>
            </li>
          </ul>
          <p class="tips">关闭后用户无法访问您的名片首页</p>
        </div>
        <div class="basic_info">
          <h1>基本信息</h1>
          <div class="info_box">
            <van-cell-group :border="false">
              <van-cell :border="false" center>
                <span slot="title">头像111</span>
                <div slot="default" class="header_img">
                  <van-uploader :after-read="onRead" >
                    <img v-if="!form.card_avatar" src="../../assets/images/photo-mr.jpg" />
                    <img v-if="imageUrl" :src="imageUrl" alt="头像" />
                    <img v-if="form.card_avatar" :src="form.card_avatar" alt="头像" />
                  </van-uploader>
                </div>
                <template #right-icon>
                  <van-icon name="arrow" color="color" class="search-icon" />
                </template>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">姓名<i class="iconfont icon-info-must"></i></span>
                <van-field v-model="form.card_name" placeholder="请输入姓名" maxlength="20" center clearable></van-field>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">手机号</span>
                <van-field v-model="form.card_mobile" placeholder="请输入手机号" maxlength="11" center clearable></van-field>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">微信号</span>
                <van-field v-model="form.card_wechat" placeholder="请输入微信号" maxlength="20" center clearable></van-field>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">公司名称</span>
                <van-field v-model="form.company" placeholder="请输入公司名" maxlength="20" center clearable></van-field>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">角色选择：</span>
                <van-field @click.stop="showRole = true" v-model="form.role_name" placeholder="角色选择" maxlength="20" center readonly></van-field>
                <template #right-icon>
                  <van-icon name="arrow" color="color" class="search-icon" />
                </template>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">所在城市</span>
                <van-field @click.stop="addressShow = true" v-model="form.addressName" placeholder="请选择收货地址" center readonly></van-field>
                <template #right-icon>
                  <van-icon name="arrow" color="color" class="search-icon" />
                </template>
              </van-cell>

              <van-cell :border="false" center v-if="strShow">
                <span slot="title">街道：</span>
                <van-field @click.stop="streetChoose" v-model="form.streetName" placeholder="请选择街道" center readonly></van-field>
                <template #right-icon>
                  <van-icon name="arrow" color="color" class="search-icon" />
                </template>
              </van-cell>

              <van-cell :border="false" center>
                <span slot="title">详细地址</span>
                <van-field v-model="form.address" placeholder="请输入详细地址" center clearable></van-field>
              </van-cell>
            </van-cell-group>
          </div>
        </div>

        <div class="card_info">
          <h1>名片设置</h1>
          <div class="my_synopsis">
            <h2>我的简介</h2>
            <textarea v-model="form.introduction" placeholder="请输入简介"></textarea>
          </div>
          <!--v-if="fun.isWeiXin()"-->
          <!--<div class="my_voice"-->
          <!--v-if="fun.isWeiXin()">-->
          <!--<h2>我的声音</h2>-->
          <!--<div class="voice_box"-->
          <!--v-show="isOldVoice">-->
          <!--<button type="button"-->
          <!--@click="playAmr">-->
          <!--<i class="iconfont icon-card_voice"></i>{{playAudio?'暂停':'点击播放已有录音'}}-->
          <!--</button>-->
          <!--<button class="btn_a"-->
          <!--style="background: #fff;color: #3b4043"-->
          <!--@click="reloadVoice">重新录音</button>-->
          <!--<p v-show="false">-->
          <!--<audio ref="audios"-->
          <!--controls-->
          <!--:onended="isend"></audio>-->
          <!--</p>-->
          <!--</div>-->
          <!--<div class="voice_btn"-->
          <!--v-show="!isOldVoice">-->
          <!--<div class="btn_a"-->
          <!--@click="play">录音时间{{ time }}<span v-show="form.voice">（点击播放）</span></div>-->
          <!--<button class="btn_b"-->
          <!--type="button"-->
          <!--v-if="!showStart"-->
          <!--@click="start">-->
          <!--开始录音-->
          <!--</button>-->
          <!--<button class="btn_b"-->
          <!--type="button"-->
          <!--v-if="showStart"-->
          <!--@click="stop">-->
          <!--停止录音-->
          <!--</button>-->
          <!--</div>-->

          <!--</div>-->
          <div class="my_img">
            <h2>我的图片</h2>
            <div class="img_uploader">
              <template v-for="(val, index) in form.picture">
                <div class="photoBox" :key="index">
                  <img :src="val" style="width: 100%;" />
                  <i @click="removeImg(index)"></i>
                </div>
              </template>
              <van-uploader :after-read="multipleMethod_1" multiple>
                <van-icon name="photograph" />
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="recom_goods" v-if="form.role_id == '1' || form.role_id == '2' || form.role_id == '3' || form.role_id == '6'">
          <div class="title">
            <div class="block"></div>
            <span>推荐商品</span>
          </div>
          <div class="goods_list">
            <div class="goods_box" v-for="(item, i) in chooseItem" :key="i">
              <div class="goods_img">
                <img :src="item.thumb" />
              </div>
              <ul class="goods_text">
                <li class="name" style="-webkit-box-orient: vertical;">
                  {{ item.title | escapeTitle }}
                </li>
                <li class="sum">
                  <span>
                    <font>{{ $i18n.t("money") }}</font
                    >{{ item.price }}
                  </span>
                  <i class="iconfont icon-delete" @click="deleteGoods(item.id)"></i>
                </li>
              </ul>
            </div>
            <div class="goods_box" v-if="chooseItem.length <= 0">
              <span style="width: 100%; text-align: center;">暂无商品~</span>
            </div>
          </div>
          <div class="add_btn">
            <button type="button" @click="toChooseGood"><i class="iconfont icon-life-game-plus"></i>添加商品</button>
          </div>
        </div>
      </div>
      <div class="car_btm_btn" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '100%' }">
        <button type="button" @click="saveData">保存</button>
      </div>
    </div>

    <van-popup v-model="showRole" position="bottom">
      <van-picker show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm" />
    </van-popup>

    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="district"></yd-cityselect>

    <transition name="move">
      <div class="m-dialog1" style="background: #fff;" v-if="streetShow">
        <van-nav-bar title="选择街道" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
        <van-cell v-for="(item, i) in districtVal" :key="i" :border="false" @click.native="streetConfirm(item)" title-style="text-align:left;color:#555">
          <span slot="title">{{ item.areaname }}</span>
        </van-cell>
      </div>
    </transition>
  </div>
</template>

<script>
import edit_card_controller from "./edit_card_controller";

export default edit_card_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#edit_card {
  padding-top: 40px;
  padding-bottom: 64px;

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 10px;
  }

  .m-dialog1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 120%;
    z-index: 100;
    background: #fff;
  }

  .content {
    .state_box {
      background: #fff;

      .state {
        display: flex;
        height: 2.875rem;
        line-height: 2.875rem;
        padding: 0 0.875rem;
        font-size: 15px;

        .left {
          width: 6.25rem;
          text-align: left;
        }

        .right {
          .van-radio-group {
            display: flex;
            height: 2.875rem;

            .van-radio {
              width: 6.25rem;
              text-align: left;
              display: flex;
              align-items: center;
            }
          }
        }
      }

      .tips {
        line-height: 2.25rem;
        color: #8c8c8c;
        font-size: 14px;
        text-align: left;
        border-top: solid 0.0625rem #ebebeb;
        padding-right: 0.875rem;
        margin-left: 0.875rem;
      }
    }

    .basic_info {
      h1 {
        font-size: 16px;
        line-height: 2.25rem;
        padding: 0 0.875rem;
        text-align: left;
        margin-top: 0.625rem;
        font-weight: normal;
        color: #8c8c8c;
      }

      .info_box {
        .header_img {
          float: right;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 2.25rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.625rem;

          .van-uploader {
            width: 2.25rem;
            height: 2.25rem;
          }

          img {
            float: right;
            width: 100%;
            height: 100%;
          }
        }

        .iconfont {
          font-size: 10px;
          color: #f15353;
          margin-left: 0.25rem;
        }
      }

      // 替换ydui组件新增
      .van-cell {
        padding: 0 12px 0 16px;
        height: 50px;
        color: #555;

        .van-cell__title {
          flex: none;
          width: 6.25rem;
          // height: 100%;
          text-align: left;
        }

        .van-cell__value {
          // text-align: right;
        }

        .van-field {
          padding: 0;
        }

        /deep/.van-field__control {
          color: #555;
        }

        /deep/input::placeholder {
          color: #555;
        }
      }
    }

    .card_info {
      h1 {
        font-weight: normal;
        color: #8c8c8c;
        font-size: 16px;
        line-height: 2.25rem;
        text-align: left;
        padding: 0 0.875rem;
      }

      .my_synopsis,
      .my_voice,
      .my_img {
        padding: 0 1.25rem;
        background: #fff;

        .voice_box {
          padding: 0.625rem 0;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 2rem;
            color: #fff;
          }

          button {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            width: 15rem;
            height: 2.5rem;
            color: #fff;
            background: #50a6f9;
            border-radius: 0.375rem;
            margin-left: 1.25rem;
          }

          .btn_a {
            width: 13.75rem;
            height: 2.5rem;
            line-height: 2.5rem;
            border: solid 0.0625rem #ebebeb;
            border-radius: 0.25rem;
            color: #8c8c8c;
            font-size: 15px;
          }
        }

        h2 {
          font-size: 15px;
          line-height: 1.875rem;
          padding: 0.625rem 0;
          text-align: left;
          font-weight: normal;
        }

        textarea {
          width: 100%;
          max-height: 6.25rem;
          border-radius: 0.25rem;
          border: solid 0.0625rem #ebebeb;
          padding: 0.625rem;
          line-height: 1.5rem;
          background: #fafafa;
        }

        .voice_btn {
          display: flex;
          justify-content: space-between;

          .btn_a {
            width: 13.75rem;
            height: 2.5rem;
            line-height: 2.5rem;
            border: solid 0.0625rem #ebebeb;
            border-radius: 0.25rem;
            color: #8c8c8c;
            font-size: 15px;
          }

          .btn_b {
            width: 5.625rem;
            height: 2.5rem;
            background: #50a6f9;
            border: none;
            border-radius: 0.25rem;
            color: #fff;
            font-size: 15px;
          }
        }

        .img_uploader {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;

          .photoBox {
            position: relative;
            width: 4.5rem;
            height: 4.5rem;
            border: 1px dashed #c0ccda;
            margin-right: 0.2rem;
            margin-left: 0.2rem;
            margin-bottom: 0.2rem;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              width: 1.2rem;
              height: 1.2rem;
              position: absolute;
              top: 0.1rem;
              right: 0.1rem;
              background: url("../../assets/images/close_iocn.png");
              background-size: 100%;
            }
          }

          .van-uploader {
            width: 4.5rem;
            height: 4.5rem;
            overflow: hidden;
            background: #f2f2f2;
            margin-left: 0.2rem;
            margin-right: 0.875rem;
            margin-bottom: 0.9375rem;

            .van-icon {
              font-size: 24px;
              line-height: 4.5rem;
              color: #666;
            }
          }
        }
      }
    }

    .recom_goods {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0 0.9375rem;

      .title {
        height: 2.5rem;
        line-height: 2.5rem;
        display: flex;
        align-items: center;

        .block {
          width: 0.25rem;
          height: 1rem;
          background: #50a6f9;
          border-radius: 0.0625rem;
          margin-right: 0.375rem;
        }

        span {
          font-weight: bold;
          font-size: 16px;
        }
      }

      .goods_list {
        padding-top: 0.625rem;

        .goods_box {
          background: #fafafa;
          padding: 0.625rem;
          display: flex;
          margin-bottom: 0.625rem;

          .goods_img {
            width: 5.25rem;
            height: 5.25rem;
            overflow: hidden;
            margin-right: 0.625rem;
            background: #f2f2f2;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .goods_text {
            width: 14.4375rem;
            position: relative;

            .name {
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 15px;
              text-align: left;
            }

            .sum {
              position: absolute;
              bottom: 0;
              display: flex;
              line-height: 1.5rem;
              width: 100%;
              justify-content: space-between;

              span {
                color: #f15353;
                font-size: 16px;

                font {
                  font-size: 12px;
                }
              }

              .iconfont {
                font-size: 24px;
                color: #ccc;
              }
            }
          }
        }
      }

      .add_btn {
        button {
          width: 100%;
          margin-bottom: 0.625rem;
          height: 2.5rem;
          line-height: 2.5rem;
          border: none;
          color: #50a6f9;
          font-size: 16px;

          i {
            color: #50a6f9;
            font-size: 1.125rem;
            margin-right: 0.625rem;
          }
        }
      }
    }
  }

  .car_btm_btn {
    background: #fff;
    position: fixed;
    z-index: 10;
    bottom: 0;
    padding: 0.625rem 0.9375rem;
    border-top: solid 0.0625rem #ebebeb;
    width: 100%;

    button {
      width: 100%;
      height: 2.5rem;
      background: #50a6f9;
      font-size: 16px;
      border: none;
      border-radius: 3.75rem;
      color: #fff;
    }
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
