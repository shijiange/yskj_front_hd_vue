<template>
  <div class="speech-lib-wrap">
    <van-tabs v-model="activeName" style="width: 30%;">
      <van-tab title="话术库" name="a"></van-tab>
    </van-tabs>
    <van-divider hairline style="margin: 0"/>
    <div class="search-box">
      <van-search v-model="wordKey" shape="round" background="#ffffff" placeholder="请输入搜索关键词" show-action>
        <template #action>
          <div class="search-btn" @click="searchMaterial">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="contain">
      <div class="left-sidebar-box" v-if="groupData.length > 0">
        <div
          v-for="(item, index) in groupData" :key="index"
          :class="['side-item', {active: groupId == item.id}]"
          @click="changeGroup(item.id)"
        >{{item.group_name}}</div>
      </div>

      <!-- 这块内容滚动，其他悬浮 -->
      <div class="right-content">
        <div class="material-box" v-if="materialList.length > 0">
          <div class="material-item" v-for="(matItem) in materialList" :key="matItem.id">
            <div class="top">
              <div class="material-name">
                <span>{{matItem.material_name}}</span>
                <span>（{{matItem.content_list.length}}）</span>
              </div>
              <div v-if="fun.isPc()" class="btn sendAll-btn" @click="batchSendMessage(matItem.id)">一键发送</div>
            </div>
            <div class="message-list" v-for="(messItem, index) in matItem.content_list" :key="index">
              <div class="message-item">
                <div class="message-content">
                  <!-- 文本 -->
                  <div v-if="messItem.type == 'text'" class="message-text" v-html="messItem.news"></div>
                  <!-- 图片 -->
                  <div v-if="messItem.type == 'image'" class="img-box" @click="imagePreview(messItem.link_img)">
                    <img :src="messItem.link_img" alt="">
                  </div>
                  <!-- h5 -->
                  <div v-if="messItem.type == 'link'" class="h5-box">
                    <img class="h5-img" :src="messItem.link_img" alt="">
                    <div class="h5-text">
                      <p class="h5-title">{{messItem.title}}</p>
                      <span class="desc">{{messItem.describe}}</span>
                    </div>
                  </div>
                  <!-- 小程序 -->
                  <div v-if="messItem.type == 'applet'" class="min-pro-box">
                    <div class="min-title">{{messItem.title}}</div>
                    <img class="min-img" :src="messItem.link_img" alt="">
                    <div class="min-icon">
                      <i class="iconfont icon-all_smallprogram"></i>
                      小程序
                    </div>
                  </div>
                  <!-- 视频 -->
                  <div v-if="messItem.type == 'video'" class="video-box" >
                    <video controls>
                        <source :src="messItem.link_video">
                        您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 文件 -->
                  <div v-if="messItem.type == 'file'" class="file-box">
                    <van-icon name="description" />
                    <span>{{getFileNameByPath(messItem.link_file)}}</span>
                  </div>
                </div>
                <div class="btn send-btn" @click="sendMessage(matItem.id, index)">发送</div>
              </div>
            </div>
          </div>
        </div>
        <yz-blank :datas="materialList" text="空空如也"></yz-blank>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { ImagePreview } from 'vant';
import yzBlank from "components/ui_components/yz_blank";
import { appAgentConfig } from "utils/wx_app_agent_mixin.js"; // 企业微信侧边栏应用授权
export default {
  mixins: [appAgentConfig],
  data () {
    return {
      wordKey: '',

      groupData: [],
      groupId: 0,
      userId: '',

      page: 1,
      loading: false,
      finished: false,
      materialList: [],
    };
  },

  created () {
    // 设置调用AgentConfig之后需要调用接口 appjsApiList
    this.appjsApiList = ["getCurExternalContact", "sendChatMessage"];
    // AgentConfig 之后的回调函数
    this.appSignCallback = () => {
      //调用getCurExternalContact api文档：https://developer.work.weixin.qq.com/document/path/91799
      wx.invoke('getCurExternalContact', {}, res => {
        if(res.err_msg == "getCurExternalContact:ok"){
          this.userId  = res.userId ;
        }
      });
    };
  },

  activated () {
    this.getGroupData();
  },

  methods: {
    // 分组数据
    getGroupData () {
      $http.get("plugin.speechcraft-library.frontend.controller.member.Material.getGroupList")
        .then(res => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          this.groupData = res.data;
          this.groupData.unshift({
            "id": 0,
            "group_name": "全部分组"
          });
          this.groupId = 0; // 默认选中第一个分组
          this.getMaterialData();
        });
    },

    // 素材数据
    getMaterialData () {
      if (this.finished) {
        return false;
      }
      let json = {
        page: this.page,
        group_id: this.groupId,
        search: {material_name: this.wordKey}
      };
      $http.post("plugin.speechcraft-library.frontend.controller.member.Material.getGroupMaterialList", json, "loading")
        .then(res => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          let resData = res.data;
          this.materialList = (this.page > 1) ? this.materialList.concat(resData.data) : resData.data;
          if (this.page >= resData.last_page || resData.data.length < resData.per_page) {
            this.finished = true;
          }
          console.log(this.materialList);
          this.page++;
        });
    },

    // 切换分组
    changeGroup(group_id) {
      if (this.groupId == group_id) {
        return false;
      }
      this.groupId = group_id;
      this.page = 1;
      this.finished = false;
      this.getMaterialData();
    },

    // 搜索
    searchMaterial () {
      this.page = 1;
      this.finished = false;
      this.getMaterialData();
    },

    // 获取文件名
    getFileNameByPath (path) {
      var index = path.lastIndexOf("/");
      var fileName = path.substr(index + 1);
      return fileName;
    },

    // 一键发送
    batchSendMessage (id) {
      if (!this.isSignWorkApp) {
        return this.$dialog.confirm({
          title: '提示',
          message: '企业应用未授权成功!',
        });
      }
      this.$dialog.confirm({
        title: "提示",
        message: "该操作将发送当前素材的全部话术，确认全部发送吗？"
      }).then(() => {
        this.getMediaId(id);
      });
    },

    // 单条发送
    sendMessage (id, index) {
      if (!this.isSignWorkApp) {
        return this.$dialog.confirm({
          title: '提示',
          message: '企业应用未授权成功!',
        });
      }
      this.getMediaId(id, index);
    },

    // 获取素材里所有媒体消息的media_id
    getMediaId (id, messageIndex) {
      return $http.get("plugin.speechcraft-library.frontend.controller.member.Material.getMaterialContent", {material_id: id,external_userid: this.userId})
        .then(res => {
          if (res.result != 1) {
            return this.$toast(res.msg);
          }
          this.sendChatMessage(res.data, messageIndex);
        });
    },

    // 调用 sendChatMessage api文档：https://developer.work.weixin.qq.com/document/path/94349
    sendChatMessage(list, messageInd) {
      const Loading = Toast.loading();
      if (messageInd !== undefined && messageInd !== '' && (typeof messageInd == 'number')) {
        let item = list[messageInd];
        let chatMessConfig = this.messageConfig(item);
        wx.invoke('sendChatMessage', chatMessConfig, (res) =>{
          if (res.err_msg == 'sendChatMessage:ok') {
            Toast.success("话术已生成，请点击聊天框发送按钮！");
          } else {
            Toast.fail("话术生成失败，请重新生成");
          }
          Loading.close();
        });
      } else {
        list.forEach((item, index) => {
          let chatMessConfig = this.messageConfig(item);
          wx.invoke('sendChatMessage', chatMessConfig, (res) =>{
            if (res.err_msg == 'sendChatMessage:ok') {
              //全部发送成功
              if(index === contentList.length-1) {
                Loading.close();
                Toast.success("话术已生成，请点击聊天框发送按钮！");
              }
            } else {
              Loading.close();
              Toast.fail("话术生成失败，请重新生成");
            }
          });
        });
      }
    },

    // 消息分享配置
    messageConfig (config) {
      let configObj = {};
      if (config.type == "text") {
        configObj = {
          msgtype: "text",
          text: {content: config.news},
        };
      }  else if (config.type == "link") {
        configObj = {
          msgtype: "news",
          news: {
            link: config.link, //H5消息页面url 必填
            title: config.title ? config.title : '', //H5消息标题
            desc: config.describe, //H5消息摘要
            imgUrl: config.link_img,
          },
        };
      } else if (config.type == "applet") {
        configObj = {
          msgtype: "miniprogram",
          miniprogram: {
            appid: config.appid,//小程序的appid，企业已关联的任一个小程序
            title: config.title, //小程序消息的title
            imgUrl: config.link_img,//小程序消息的封面图。
            page: config.page, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
          },
        };
      } else if (config.type == "image") {
        configObj = {
          msgtype: "image",
          image: {mediaid: config.media_id},
        };
      } else if (config.type == "video") {
        configObj = {
          msgtype: "video",
          video: {mediaid: config.media_id},
        };
      } else if (config.type == "file") {
        configObj = {
          msgtype: "file",
          file: {mediaid: config.media_id},
        };
      }
      return configObj;
    },

    // 图片预览
    imagePreview (imgUrl) {
      ImagePreview([imgUrl]);
    },
  },

  components: { yzBlank },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.speech-lib-wrap {
  background-color: #ffffff;

  .search-box {
    /deep/ .van-search {
      padding: 0.84rem;
    }
    .search-btn {
      color: #f15353;
      cursor: default;
    }
  }

  .btn {
    cursor: pointer;
  }

  .contain {
    font-size: 12px;
    display: flex;
    height: calc(100vh - 54px - 44px - 1px);
    .left-sidebar-box {
      width: 5rem;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      text-align: center;
      .active {
        color: #f15353;
      }
      .side-item {
        cursor: default;
        padding: 1rem 0;
        word-break: break-all;
      }
    }

    .right-content {
      flex: 1;
      height: 100%;
      padding: 0 0.5rem;
      background-color: #f6f6f6;
      overflow-y: auto;
      overflow-x: hidden;
      .material-box {
        .material-item {
          margin: 1rem 0;
        }
        .top {
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sendAll-btn {
          padding: 0.41rem 0.63rem;
          font-size: 0.63rem;
          color: #ffffff;
          background-color: #5ab79c;
          border-radius: 0.13rem;
        }

        .message-list {
          background-color: #ffffff;
          border-radius: 0.13rem;
          border-bottom: 1px solid #efefef;
          .message-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.63rem;
            color: #242424;
            .message-content {
              flex: 1;
              max-width: 11rem;
              text-align: left;
            }
            .img-box {
              width: 4.5rem;
              height: 4.5rem;
              overflow: hidden;
              background-color: #cccccc;
              border-radius: 0.13rem;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .h5-box {
              display: flex;
              .h5-img {
                width: 2.81rem;
                height: 2.81rem;
                background-color: #cccccc;
                border-radius: 0.13rem;
                object-fit: cover;
              }
              .h5-text {
                flex: 1;
                margin-left: 0.5rem;
                font-size: 0.75rem;
                color: #242424;
              }
              .desc {
                margin-top: 0.5rem;
                font-size: 0.69rem;
                color: #666666;
              }
            }

            .min-pro-box {
              .min-img {
                margin-top: 0.3rem;
                width: 4.97rem;
                height: 4.97rem;
                background-color: #b8b8b8;
                border-radius: 0.13rem;
              }
              .icon-all_smallprogram {
                color: #7879f0;
              }
            }

            .video-box {
                width: 10.97rem;
                height: 6.97rem;
                background-color: #b8b8b8;
                border-radius: 0.13rem;
              video {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }

            .file-box {
              color: #606266;
              word-break: break-all;
            }


            .send-btn {
              padding: 0.34rem 0.66rem;
              background-color: #f14e4e;
              border-radius: 0.13rem;
              font-size: 0.63rem;
              color: #ffffff;
            }
          }
          .message-item::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            transform: scaleY(0.5);
            background-color: #f6f6f6;
          }
        }
      }
    }
  }
}
</style>