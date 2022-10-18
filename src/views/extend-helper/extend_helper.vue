<template>
  <div id="extend_helper">
    <c-title :hide="false"
             :text="plugin_name"
             tolink="extendExplain"
             :totext="'使用说明'"> </c-title>
    <div class="content">
      <div class="banner">
        <img :src="banner">
      </div>
      <div class="set-connect">
        <div class="title">
          链接设置
        </div>
        <div class="input-one">
          <div class="left">内容链接</div>
          <input type="text"
                 v-model="form.content_url"
                 placeholder="请在这里粘贴链接">
        </div>
        <div class="toLink">
          <div class="left">跳转链接</div>
          <div class="right">
            <div class="tab">
              <div v-for="(item,index) in link"
                   :key="index"
                   @click="changeId(item)"
                   :class="[id==item.id ? 'block' : '']">
                {{item.text}}
              </div>
            </div>
            <div class="add-good"
                 @click="addGood()"
                 v-if="id=='3'&&!arr.title">
              <span class="icon">+</span>
              <span>添加</span>
            </div>
            <div class="goodlist"
                 v-if="id=='3'&&arr.title">
              <div class="good">
                <img :src="arr.thumb">
                <div class="text">
                  <div class="tit">
                    {{arr.title}}
                  </div>
                  <div class="cash">
                    {{arr.price}}
                  </div>
                </div>
                <div class="delete"
                     @click="deleteGood">
                  <i class="iconfont icon-close11"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="connect-method">
        <div class="title">
          联系方式
        </div>
        <div class="input-one">
          <div class="left">姓名<span>*</span></div>
          <input type="text"
                 v-model="form.name"
                 placeholder="请输入联系人姓名">
        </div>
        <div class="input-two">
          <div class="left">手机号<span>*</span></div>
          <input type="number"
                 v-model="form.phone"
                 placeholder="请输入联系人手机号">
        </div>
      </div>
      <div class="share-set">
        <div class="title">
          分享方式
        </div>
        <div class="input-one">
          <div class="left">分享标题</div>
          <input type="text"
                 v-model="form.share_title"
                 placeholder="请输入分享标题">
        </div>
        <div class="input-two">
          <div class="left">分享图片</div>
          <van-uploader :after-read="onRead">
            <div style="  width: 4rem; height: 4rem; border: 1px solid  #c0ccda; margin: 0 auto; display: flex; border-radius: 5px; position: relative;">
              <img :src="
                          form.share_img
                            ? form.share_img
                            : require('../../assets/images/up_icon.png')
                        "
                   style="width: 80%; height: 80%;"
                   class="avatar" />
              <div class="delete"
                   @click.stop="removeImg_1"
                   v-if="form.share_img.length>0">
                <i class="iconfont icon-close11"></i>
              </div>
            </div>
          </van-uploader>
        </div>
        <div class="desc">
          <textarea placeholder="请输入分享描述"
                    v-model="form.share_desc"
                    class="textarea"></textarea>
        </div>
      </div>
      <div class="btn-group">
        <div class="btn-one"
             @click="addconnect">提交</div>
        <div class="btn-two"
             @click="toRecord">推广记录</div>
      </div>
    </div>
    <van-popup v-model="show"
               position="bottom"
               id="pop"
               :style="{ height: '100%'}">
      <div class="select">
        <i class="iconfont icon-fanhui"
           @click="show=false"></i>
        <h4 class="select-good">选择商品</h4>
      </div>
      <div style="position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; top: 0;"
           :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="sousuo">
          <i class="iconfont icon-sousuo"
             @click="Search"
             style="margin-right: 0.5rem; color: #999;"></i>
          <input type="text"
                 v-model="keyword"
                 @keypress="enterSearch"
                 placeholder="搜索商品">
        </div>
      </div>
      <div id="listWrap">
        <van-radio-group v-model="arr">
          <div class="list"
               v-for="(item,index) in datas"
               :key="index">
            <div class="image"><img :src="item.thumb"></div>
            <div class="test">
              <div class="tit">
                {{item.title}}
              </div>
              <van-radio :name="item"
                         style="position: absolute; right: 0; top: 50%;"
                         checked-color="#ff2c29"></van-radio>
              <div class="cash"><span class="first">{{$i18n.t('money')}}</span><span class="two">{{item.price}}</span></div>
            </div>

          </div>
        </van-radio-group>
      </div>
      <div class="pop-btn"
           :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <div class="btn-p"
             @click="closePop">
          确定
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import extend_helper_controller from './extend_helper_controller';

export default extend_helper_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#extend_helper {
  .content {
    background-color: #fff;

    .banner {
      padding: 0.75rem;
      width: 100%;
      height: 10rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .my-swipe {
      padding: 1rem 0.75rem;

      a {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        border-radius: 0.625rem;
      }
    }

    .set-connect {
      .title {
        width: 100%;
        height: 2.0625rem;
        background-color: #f7f9fc;
        display: flex;
        align-items: center;
        padding-left: 1.125rem;
        color: #999;
        font-size: 16px;
      }

      .input-one {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        border-bottom: solid 1px #f0f0f0;
        display: flex;
        align-items: center;
        text-align: left;

        .left {
          width: 5.25rem;

          span {
            vertical-align: top;
            color: #ff2c29;
          }
        }

        input {
          outline: none;
          border: none;
          color: #999;
          flex: 1;
        }
      }

      .toLink {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        display: flex;
        text-align: left;

        .left {
          width: 5.25rem;
        }

        .right {
          flex: 1;

          .tab {
            display: flex;
            color: #999;
            align-items: center;

            div {
              margin-right: 1.25rem;
            }
          }

          .add-good {
            width: 2.875rem;
            height: 2.875rem;
            border-radius: 0.3125rem;
            border: solid 0.0625rem #c5c5c5;
            border: dashed 1px #c5c5c5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 1rem;

            .icon {
              color: #c5c5c5;
              font-size: 22px;
            }

            span {
              font-size: 12px;
              color: #c5c5c5;
            }
          }

          .goodlist {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .good {
              position: relative;
              margin-top: 1rem;
              width: 45%;
              padding: 0.25rem 0.125rem;
              background-color: #f8f8f8;
              border-radius: 0.3125rem;
              display: flex;

              img {
                width: 2.375rem;
                height: 2.375rem;
                border-radius: 0.125rem;
              }

              .text {
                display: flex;
                flex-direction: column;
                margin-left: 0.125rem;
                justify-content: space-between;

                .tit {
                  font-size: 12px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                }

                .cash {
                  font-size: 12px;
                  color: #ff2c29;
                }
              }

              .delete {
                width: 0.875rem;
                height: 0.875rem;
                background-color: #c5c5c5;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                right: 0;
                border-radius: 50%;
                transform: translate(50%, -50%);

                i {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }

    .connect-method {
      .title {
        width: 100%;
        height: 2.0625rem;
        background-color: #f7f9fc;
        display: flex;
        align-items: center;
        padding-left: 1.125rem;
        color: #999;
        font-size: 16px;
      }

      .input-one {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        border-bottom: solid 1px #f0f0f0;
        display: flex;
        align-items: center;
        text-align: left;

        .left {
          width: 5.25rem;

          span {
            vertical-align: top;
            color: #ff2c29;
          }
        }

        input {
          outline: none;
          border: none;
          color: #999;
          flex: 1;
        }
      }

      .input-two {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        display: flex;
        align-items: center;
        text-align: left;

        .left {
          width: 5.25rem;

          span {
            vertical-align: top;
            color: #ff2c29;
          }
        }

        input {
          outline: none;
          border: none;
          color: #999;
          flex: 1;
        }
      }
    }

    .share-set {
      .title {
        width: 100%;
        height: 2.0625rem;
        background-color: #f7f9fc;
        display: flex;
        align-items: center;
        padding-left: 1.125rem;
        color: #999;
        font-size: 16px;
      }

      .input-one {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        border-bottom: solid 1px #f0f0f0;
        display: flex;
        align-items: center;
        text-align: left;

        .left {
          width: 5.25rem;
        }

        input {
          outline: none;
          border: none;
          color: #999;
          flex: 1;
        }
      }

      .input-two {
        padding-top: 1.375rem;
        padding-bottom: 1.375rem;
        margin-left: 1.125rem;
        margin-right: 1.125rem;
        border-bottom: solid 1px #f0f0f0;
        display: flex;
        align-items: center;
        text-align: left;
        justify-content: space-between;

        .left {
          width: 5.25rem;
        }

        .delete {
          width: 0.875rem;
          height: 0.875rem;
          background-color: #c5c5c5;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          right: 0;
          border-radius: 50%;
          transform: translate(50%, -50%);
          z-index: 999;

          i {
            color: #fff;
          }
        }
      }

      .desc {
        padding-top: 0.75rem;
        padding-bottom: 12px;

        .textarea {
          width: 21.125rem;
          height: 4.875rem;
          background-color: #f7f9fc;
          border-radius: 0.3125rem;
          text-align: left;
          border: none;
          padding: 0.5rem;
        }
      }
    }

    .btn-group {
      height: 3.0625rem;
      background-color: #fff;
      width: 100%;
      justify-content: center;
      display: flex;
      align-items: center;
      box-shadow: 6px 3px 15px #ccc;

      .btn-one {
        margin-right: 2.25rem;
        width: 8.75rem;
        height: 2.5rem;
        background-color: #ff2c29;
        border-radius: 1.25rem;
        justify-content: center;
        display: flex;
        align-items: center;
        color: #fff;
      }

      .btn-two {
        width: 8.75rem;
        height: 2.5rem;
        background-color: rgba(255, 44, 41, 0.1);
        border-radius: 1.25rem;
        justify-content: center;
        display: flex;
        align-items: center;
        color: #ff2c29;
      }
    }
  }

  #pop {
    min-height: 100vh;

    .select {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0.75rem;

      .select-good {
        font-size: 18px;
      }

      i {
        position: absolute;
        left: 0.75rem;
      }
    }

    .sousuo {
      width: 19.25rem;
      height: 1.875rem;
      background-color: #f7f9fc;
      border-radius: 0.9375rem;
      margin: 0 auto;
      padding-left: 0.5rem;
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;

      input {
        outline: none;
        border: none;
        color: #999;
      }
    }

    #listWrap {
      padding: 0 0.75rem;
      overflow-y: scroll;
      position: fixed;
      top: 6rem;
      width: 100%;
      bottom: 3rem;

      .list {
        display: flex;
        margin-bottom: 1.25rem;

        .image {
          width: 6.875rem;
          height: 6.875rem;
          border-radius: 0.3125rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .test {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          margin-left: 1rem;
          flex: 1;

          .tit {
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }

          .cash {
            color: #ff2c29;
            text-align: left;

            .first {
              font-size: 12px;
            }

            .two {
              font-size: 16px;
            }
          }
        }
      }
    }

    .pop-btn {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 0;
      width: 100%;
      height: 3.0625rem;

      .btn-p {
        width: 17.5rem;
        height: 2.5rem;
        background-color: #ff2c29;
        border-radius: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
      }
    }
  }
}

.block {
  background-color: rgba(255, 44, 41, 0.1);
  border-radius: 0.8125rem;
  padding: 0.1875rem 0.5rem;
  color: #ff2c29;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcStyle {
  position: absolute !important;
}
</style>
