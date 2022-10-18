<template>
  <div id="microRelease">
    <c-title :hide="false" text="编辑帖子"></c-title>
    <div class="content">
      <div class="uploadphotolist">
        <yz_uploader v-model="imgData" ref="uploader"></yz_uploader>
      </div>
      <div
        class="textInput
"
      >
        <div class="titleinp">
          <div class="required-field">*</div>
          <input type="text" v-model="releasetitle" placeholder="填写标题会更有赞哦~" />
        </div>
        <div class="contentinp">
          <div class="required-field">*</div>
          <textarea name="" v-model="releasecontents" placeholder="添加正文"></textarea>
        </div>
      </div>

      <div class="messageadd">
        <ul>
          <template v-if="audio_open">
            <!-- 音频上传和录音 -->
            <audioUpload v-on:uploaderAudio="updataAudio"></audioUpload>
            <!-- 上传的音频播放 -->
            <audioSlider v-for="(item, index) in audioList" :key="index" :src="item.file" :duration="item.duration">
              <!-- 组件插槽 -->
              <!-- 删除按钮 -->
              <div style="padding: 0 5px; display: flex; align-items: center;" @click.stop="delAudio(index)">
                <i class="iconfont icon-info-complete" style="color: #4fc08d; font-size: 20px; margin-right: 4px;"></i>
                <i class="iconfont icon-all_delete_1" style="color: #5f5f5f;"></i>
              </div>
            </audioSlider>
          </template>

          <li @click="getClassification">
            <div class="left">
              <div class="required-field">*</div>
              <img v-if="catidshow" src="../../assets/images/micro_communities/publish_select_class_cur@2x.png" alt="" />
              <img v-else src="../../assets/images/micro_communities/publish_select_class@2x.png" alt="" />
            </div>
            <div class="right">
              <div class="inforselection" :class="{ selecolor: catidshow }">
                <div class="inf_left">{{ catname ? catname : "选择分类" }}</div>
                <div class="inf_right">
                  <i class="fa fa-angle-right"></i>
                </div>
              </div>
            </div>
          </li>
          <li @click="getReleaseAddress">
            <div class="left">
              <img v-if="releaseaddressshow" src="../../assets/images/micro_communities/publish_add_address_cur@2x.png" alt="" />
              <img v-else src="../../assets/images/micro_communities/publish_add_address@2x.png" alt="" />
            </div>
            <div class="right">
              <div class="inforselection" :class="{ selecolor: releaseaddressshow }">
                <div class="inf_left">{{ releaseaddress ? releaseaddress : "添加地点" }}</div>
                <div class="inf_right">
                  <i class="fa fa-angle-right"></i>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <img v-if="goodsIdshow" src="../../assets/images/micro_communities/publish_add_goods_cur@2x.png" alt="" />
              <img v-else src="../../assets/images/micro_communities/publish_add_goods@2x.png" alt="" />
            </div>
            <div class="right">
              <template v-if="goodsIdshow">
                <div class="selectgoods">
                  <div class="selectgoodsleft">
                    <div class="goleft">
                      <img :src="selectgoodsData.thumb" alt="" />
                    </div>
                    <div class="gocenter">
                      <div class="goodsname">{{ selectgoodsData.title }}</div>
                      <div class="fobottom">
                        <div class="foleft">
                          <div class="pic">{{ $i18n.t("money") }}{{ selectgoodsData.price }}</div>
                          <div class="delpic">{{ $i18n.t("money") }}{{ selectgoodsData.market_price }}</div>
                        </div>
                        <div class="foright">
                          <div class="sold">已售{{ selectgoodsData.show_sales }}件</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="selectgoodsright">
                    <div class="goright" @click.stop="getGoodsMessage">
                      更换
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="inforselection" @click="getGoodsMessage">
                  <div class="inf_left">添加商品</div>
                  <div class="inf_right">
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>
              </template>
            </div>
          </li>
          <li>
            <div class="left">
              <img v-if="storeIdshow" src="../../assets/images/micro_communities/publish_add_store_cur@2x.png" alt="" />
              <img v-else src="../../assets/images/micro_communities/publish_add_store@2x.png" alt="" />
            </div>
            <div class="right">
              <template v-if="storeIdshow">
                <div class="selectshop">
                  <div class="selectgoodsleft">
                    <div class="goleft">
                      <img :src="selectstoreData.thumb" alt="" />
                    </div>
                    <div class="gocenter">
                      <div class="shopname">{{ selectstoreData.store_name }}</div>
                      <div class="start_1">
                        <img src="../../assets/images/collect.png" alt="" />
                        <img src="../../assets/images/collect.png" alt="" />
                        <img src="../../assets/images/collect.png" alt="" />
                        <img src="../../assets/images/collect.png" alt="" />
                        <img src="../../assets/images/collect.png" alt="" />
                      </div>
                      <div class="fobottom">
                        <div class="area">{{ selectstoreData.address }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="selectgoodsright">
                    <div class="goright" @click="getStoreMessage">
                      更换
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="inforselection" @click="getStoreMessage">
                  <div class="inf_left">添加门店</div>
                  <div class="inf_right">
                    <i class="fa fa-angle-right"></i>
                  </div>
                </div>
              </template>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="user_protocol">
      <van-checkbox v-model="checked" checked-color="#f15353">阅读并同意<span class="us_color" @click.stop="openProtocol">《用户协议》</span></van-checkbox>
    </div>

    <div class="authorize_confirm" v-if="is_crm">
      <van-checkbox v-model="checked_confirm"  checked-color="#f15353">1.本人确认该上传内容（视频、图片、文字）为本人委托益生康健云平台服务编辑内容，未作实质性修改。
      </van-checkbox>
    </div>
    <div class="authorize_confirm_again" v-if="is_crm">
      <van-checkbox v-model="checked_confirm_again"  checked-color="#f15353">
        2.本人确认该上传内容（视频、图片、文字）为本人真实意思表示，同意上传，且知悉社区内容发布规范。
      </van-checkbox>
    </div>


    <div class="Releasebtn set-pc-styleLeft">
      <div class="submit" @click="submitBtn">保存修改</div>
    </div>
    <van-popup :overlay="false" v-model="classificationshow" position="right" style="width: 100%; height: 100%;">
      <div class="classification">
        <van-nav-bar title="选择分类" left-text="" right-text="取消" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
        <div class="searchbox">
          <div class="left">
            <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
            <div class="textinp">
              <van-field v-model="commodityTitle" placeholder="搜索分类" :clearable="true" />
            </div>
          </div>
          <div class="right" @click="searchBtn">搜索</div>
        </div>
        <div class="classification_list">
          <ul v-for="(item, i) in catelist" :key="i">
            <li>
              <div class="one_cat">{{ item.name }}</div>
              <div class="two_cat">
                <div class="childs-name" @click="selectCateId(item.id, item.name)" :class="[catid == item.id ? 'color_text' : '']">全部</div>
                <div class="childs-name" @click="selectCateTwoId(childs.id, item.name, childs.name)" v-for="childs in item.child" :key="childs.id" :class="[catid == childs.id ? 'color_text' : '']">
                  {{ childs.name }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
    <van-popup :overlay="false" v-model="Locationshow" position="right" style="width: 100%; height: 100%;" :lazy-render="false">
      <div class="Locations">
        <van-nav-bar title="选择地点" left-text="" right-text="取消" left-arrow @click-left="onAddressLeft" @click-right="onAddressRight" />
        <div class="searchbox">
          <div class="left">
            <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
            <div class="textinp">
              <input type="text" v-model="address_detail" id="suggestId" name="address_detail" placeholder="输入您所在的地点" />
            </div>
          </div>
          <!--                    <div class="right">搜索</div>-->
        </div>
      </div>
    </van-popup>
    <van-popup :overlay="false" v-model="addgoodslistshow" position="right" style="width: 100%; height: 100%;">
      <div class="addgoodslist">
        <van-nav-bar title="添加商品" left-text="" right-text="取消" left-arrow @click-left="onAddGoodsLeft" @click-right="onAddGoodsRight" />
        <div class="searchbox">
          <div class="left">
            <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
            <div class="textinp">
              <van-field v-model="goodsdata" placeholder="搜索商品标题" :clearable="true" />
            </div>
          </div>
          <div class="right" @click="searchGoodBtn">搜索</div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="addgoodslist_list">
            <ul>
              <li v-for="(item, index) in goodslistData" @click="setGoodsId(item.id)" :key="index">
                <div class="left">
                  <img :src="item.thumb" alt="" />
                </div>
                <div class="center">
                  <div class="top">{{ item.title }}</div>
                  <div class="bottom">
                    <div class="picleft">{{ $i18n.t("money") }}{{ item.price }}</div>
                    <div class="picright">原价：{{ $i18n.t("money") }}{{ item.market_price }}</div>
                  </div>
                </div>
                <div class="right" v-if="goodsId == item.id">
                  <img src="../../assets/images/micro_communities/addGoods_gou@2x.png" />
                </div>
              </li>
            </ul>
          </div>
        </van-pull-refresh>
      </div>
    </van-popup>
    <van-popup :overlay="false" v-model="storeshow" position="right" style="width: 100%; height: 100%;">
      <div class="storelist">
        <van-nav-bar title="添加门店" left-text="" right-text="取消" left-arrow @click-left="onStoreLeft" @click-right="onStoreRight" />
        <div class="searchbox">
          <div class="left">
            <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
            <div class="textinp">
              <van-field v-model="storedata" placeholder="搜索门店" :clearable="true" />
            </div>
          </div>
          <div class="right" @click="searchStoreBtn">搜索</div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTopStore" success-text="刷新成功">
          <div class="astorelist_list">
            <ul>
              <li v-for="(item, index) in storelistData" @click="setStoreId(item.id)" :key="index">
                <div class="left">
                  <img :src="item.thumb" alt="" />
                </div>
                <div class="center">
                  <div class="top">{{ item.store_name }}</div>
                  <div class="start_1">
                    <img src="../../assets/images/collect.png" alt="" />
                    <img src="../../assets/images/collect.png" alt="" />
                    <img src="../../assets/images/collect.png" alt="" />
                    <img src="../../assets/images/collect.png" alt="" />
                    <img src="../../assets/images/collect.png" alt="" />
                  </div>
                  <div class="fobottom">
                    <div class="area">{{ item.address }}</div>
                  </div>
                </div>
                <div class="right" v-if="storeId == item.id">
                  <img src="../../assets/images/micro_communities/addGoods_gou@2x.png" />
                </div>
              </li>
            </ul>
          </div>
        </van-pull-refresh>
      </div>
    </van-popup>
    <van-popup :overlay="false" v-model="protocolshow" position="right" style="width: 100%; height: 100%;">
      <div class="protocolcontent">
        <van-nav-bar title="用户协议" left-text="" right-text="" left-arrow @click-left="protocolLeft" />
        <div class="content" v-html="agreementcontent"></div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import microEdit_controller from "./microEdit_controller";
export default microEdit_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#microRelease {
  .content {
    background: #fff;
    padding-top: 1.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-bottom: 1.5rem;
    margin-bottom: 1.03rem;

    .uploadphotolist {
      padding-bottom: 0.63rem;

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          width: 5rem;
          height: 5rem;
          margin-left: 0.38rem;
          border-radius: 0.25rem;
          position: relative;

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
      }
    }

    .required-field {
      color: #f15353;
      font-weight: 600;
      font-size: 16px;
      padding-right: 4px;
    }

    .textInput {
      .titleinp {
        display: flex;
        align-items: center;
        height: 2.5rem;
        border-bottom: 0.06rem solid #e5e5e5;
        margin-bottom: 0.78rem;

        input {
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: left;
          flex: 1;
          border: none;
          outline: none;
        }
      }

      .contentinp {
        display: flex;
        height: 6.66rem;
        border-bottom: 0.06rem solid #e5e5e5;

        textarea {
          height: 100%;
          width: 100%;
          text-align: left;
          border: none;
          outline: none;
        }
      }
    }

    .messageadd {
      ul {
        li {
          display: flex;
          min-height: 3.38rem;
          align-items: center;
          border-bottom: 0.06rem solid #e5e5e5;

          .left {
            display: flex;
            align-items: center;
            margin-right: 0.63rem;

            img {
              width: 1.2rem;
              height: 1.2rem;
            }
          }

          .right {
            flex: 1;

            .inforselection {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 100%;

              .inf_left {
                line-height: 0.91rem;
                font-size: 0.91rem;
                color: #999;
              }

              .inf_right {
                font-size: 1rem;
                height: 1rem;
                width: 0.69rem;
                color: #999;
              }
            }

            .inforselection.selecolor {
              .inf_left {
                color: #1c96fe;
              }
            }

            .selectgoods {
              display: flex;
              align-items: center;
              padding-top: 0.63rem;
              padding-bottom: 0.63rem;
              justify-content: space-between;

              .selectgoodsleft {
                display: flex;
                align-items: center;

                .goleft {
                  width: 3rem;
                  height: 3rem;
                  border-radius: 0.2rem;
                  border: 0.06rem solid #e5e5e5;
                  margin-right: 0.63rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .gocenter {
                  .goodsname {
                    font-size: 0.84rem;
                    line-height: 1rem;
                    max-width: 8rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: left;
                    margin-bottom: 0.75rem;
                    padding-top: 0.2rem;
                  }

                  .fobottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .foleft {
                      display: flex;
                      align-items: center;
                      height: 1rem;
                      line-height: 1rem;
                      margin-right: 1.69rem;

                      .pic {
                        color: #f15353;
                        font-size: 0.88rem;
                        margin-right: 0.59rem;
                      }

                      .delpic {
                        color: #999;
                        font-size: 0.75rem;
                        text-decoration: line-through;
                      }
                    }

                    .foright {
                      display: flex;
                      align-items: center;
                      height: 1rem;
                      line-height: 1rem;

                      .sold {
                        color: #999;
                        font-size: 0.75rem;
                      }
                    }
                  }
                }
              }

              .selectgoodsright {
                display: flex;
                align-items: center;

                .goright {
                  width: 3.75rem;
                  height: 1.63rem;
                  background-color: #fff;
                  border-radius: 0.25rem;
                  border: solid 0.06rem #e5e5e5;
                  line-height: 1.63rem;
                  color: #333;
                  font-size: 0.75rem;
                }
              }
            }

            .selectshop {
              display: flex;
              align-items: center;
              padding-top: 0.63rem;
              padding-bottom: 0.63rem;
              justify-content: space-between;

              .selectgoodsleft {
                display: flex;
                align-items: center;

                .goleft {
                  width: 3rem;
                  height: 3rem;
                  border-radius: 0.2rem;
                  border: 0.06rem solid #e5e5e5;
                  margin-right: 0.63rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .gocenter {
                  .shopname {
                    font-size: 0.84rem;
                    line-height: 1rem;
                    max-width: 8rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: left;
                    padding-top: 0.2rem;
                  }

                  .start_1 {
                    text-align: left;

                    img {
                      width: 0.38rem;
                      height: 0.38rem;
                    }
                  }

                  .fobottom {
                    color: #999;
                    font-size: 0.75rem;
                  }
                }
              }

              .selectgoodsright {
                display: flex;
                align-items: center;

                .goright {
                  width: 3.75rem;
                  height: 1.63rem;
                  background-color: #fff;
                  border-radius: 0.25rem;
                  border: solid 0.06rem #e5e5e5;
                  line-height: 1.63rem;
                  color: #333;
                  font-size: 0.75rem;
                }
              }
            }
          }
        }
      }
    }
  }

  .user_protocol {
    font-size: 0.88rem;
    color: #999;
    padding: 0 0.875rem 1rem;

    .us_color {
      color: #1c96fe;
    }
  }
  .authorize_confirm,.authorize_confirm_again{
    font-size: 0.88rem;
    color: #999;
    padding: 0 0.875rem 1rem;
    text-align:left;
  }
  .authorize_confirm_again{
    padding-bottom:4rem;
  }
  .van-checkbox{
    -webkit-box-align: start;
    -webkit-align-items: start;
    -ms-flex-align: start;
    align-items: start;
  }
  .Releasebtn {
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.41rem 0.94rem;
    height: 3.31rem;
    background: #fff;

    .submit {
      line-height: 2.5rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 0.25rem;
      color: #fff;
    }
  }

  .classification {
    width: 100%;
    height: 100%;

    .searchbox {
      display: flex;
      padding-top: 0.47rem;
      padding-bottom: 0.47rem;
      border-bottom: 0.06rem solid #ebedf0;

      .left {
        display: flex;
        align-items: center;
        margin-left: 0.94rem;
        width: 18.13rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;

        .searchion {
          font-size: 0.81rem;
          color: #999;
          margin-left: 0.5rem;
          margin-right: 0.41rem;
        }

        .van-cell {
          background-color: transparent;
          padding: 0;
        }
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.94rem;
        color: #333;
      }
    }

    .classification_list {
      padding-left: 0.72rem;

      ul {
        li {
          font-size: 12px;
          text-align: left;
          color: #333;
          margin-top: 1rem;

          .one_cat {
            height: 2rem;
            line-height: 2rem;
            font-size: 16px;
            font-weight: 700;
            color: #000;
          }

          .two_cat {
            display: flex;
            flex-wrap: wrap;

            .childs-name {
              border-radius: 1rem;
              padding: 0 0.75rem;
              margin-right: 0.75rem;
              background: #f3f3f3;
              height: 1.5rem;
              line-height: 1.5rem;
            }

            .color_text {
              background: #f15353;
              color: #fff;
            }
          }
        }
      }
    }
  }

  .Locations {
    width: 100%;
    height: 100%;

    .searchbox {
      display: flex;
      padding-top: 0.47rem;
      padding-bottom: 0.47rem;
      border-bottom: 0.06rem solid #ebedf0;

      .left {
        display: flex;
        align-items: center;
        margin-left: 0.94rem;
        width: 18.13rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;

        .searchion {
          font-size: 0.81rem;
          color: #999;
          margin-left: 0.5rem;
          margin-right: 0.41rem;
        }

        input {
          border: none;
        }
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.94rem;
        color: #333;
      }
    }
  }

  .addgoodslist {
    width: 100%;
    height: 100%;

    .searchbox {
      display: flex;
      padding-top: 0.47rem;
      padding-bottom: 0.47rem;
      border-bottom: 0.06rem solid #ebedf0;

      .left {
        display: flex;
        align-items: center;
        margin-left: 0.94rem;
        width: 18.13rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;

        .searchion {
          font-size: 0.81rem;
          color: #999;
          margin-left: 0.5rem;
          margin-right: 0.41rem;
        }

        .van-cell {
          background-color: transparent;
          padding: 0;
        }
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.94rem;
        color: #333;
      }
    }

    .addgoodslist_list {
      ul {
        padding-left: 0.63rem;

        li {
          padding-top: 0.63rem;
          padding-bottom: 0.63rem;
          display: flex;
          align-items: center;
          border-bottom: solid 0.06rem #f5f5f5;

          .left {
            width: 3.75rem;
            height: 3.75rem;
            border-radius: 0.19rem;
            margin-right: 0.78rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .center {
            width: 14.13rem;

            .top {
              width: 14.13rem;
              font-size: 0.94rem;
              line-height: 1.25rem;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
              padding-bottom: 0.7rem;
            }

            .bottom {
              display: flex;
              align-items: center;

              .picleft {
                font-size: 0.81rem;
                line-height: 1.25rem;
                color: #f15353;
                margin-right: 1.16rem;
              }

              .picright {
                font-size: 0.75rem;
                line-height: 1.25rem;
                color: #8c8c8c;
              }
            }
          }

          .right {
            width: 1.21rem;
            height: 1.05rem;
            margin-left: 2.38rem;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .storelist {
    width: 100%;
    height: 100%;

    .searchbox {
      display: flex;
      padding-top: 0.47rem;
      padding-bottom: 0.47rem;
      border-bottom: 0.06rem solid #ebedf0;

      .left {
        display: flex;
        align-items: center;
        margin-left: 0.94rem;
        width: 18.13rem;
        height: 1.88rem;
        background-color: #f5f5f5;
        border-radius: 0.94rem;

        .searchion {
          font-size: 0.81rem;
          color: #999;
          margin-left: 0.5rem;
          margin-right: 0.41rem;
        }

        .van-cell {
          background-color: transparent;
          padding: 0;
        }
      }

      .right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.94rem;
        color: #333;
      }
    }

    .astorelist_list {
      ul {
        padding-left: 0.75rem;

        li {
          padding-top: 0.63rem;
          padding-bottom: 0.63rem;
          border-bottom: 0.06rem solid #ebedf0;
          display: flex;
          align-items: center;

          .left {
            width: 3rem;
            height: 3rem;
            border-radius: 0.94rem;
            margin-right: 0.66rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .center {
            width: 14.13rem;

            .top {
              width: 14.13rem;
              font-size: 0.88rem;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
            }

            .start_1 {
              text-align: left;

              img {
                width: 0.38rem;
                height: 0.38rem;
              }
            }

            .fobottom {
              width: 14.13rem;
              font-size: 0.75rem;
              color: #999;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
            }
          }

          .right {
            width: 1.21rem;
            height: 1.05rem;
            margin-left: 2.38rem;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .van-popup {
    z-index: 201 !important;
  }
}

.wxchooseImg {
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  border: 1px dashed #c0ccda;
  margin-left: 0.2rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  .van-icon {
    font-size: 24px;
    line-height: 4.5rem;
    color: #666;
  }
}
</style>
