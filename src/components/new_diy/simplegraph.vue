<template>
  <div class="component-wrapper" :style="wrapper_style">
    <template v-if="list && list.length > 0">
      <div style="position: relative;" v-for="(item, index) in list" :key="index">
        <img :src="item.image || emptyImage" :style="img_style" @click="toUrl(item)" @load="imgLoad" />
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" v-if="item.is_minApp == 2 && !fun.isApp() && !fun.isCPS()" @click.stop v-html="item.html"></div>
        <template v-if="datas.choose_style == 3 && item.hotArea && item.hotArea.length > 0">
          <div
            class="hotarea-rnd"
            v-for="(area, index) in item.hotArea"
            :style="{
              top: area.top * (clientWidth / 400) + 'px',
              left: area.left * (clientWidth / 400) + 'px',
              width: area.width * (clientWidth / 400) + 'px',
              height: area.height * (clientWidth / 400) + 'px'
            }"
            :key="index"
            @click="toAreaUrl(area)"
          >
            <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" v-if="area.is_minApp == 2 && !fun.isApp() && !fun.isCPS()" @click.stop v-html="area.html"></div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <img :src="emptyImage" :style="img_style" />
    </template>
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/banner.png";
export default {
  props: ["id", "styles", "datas","fatherTitle"],
  data() {
    return {
      emptyImage,
      clientWidth: "375"
    };
  },
  computed: {
    /** 样式 */
    wrapper_style() {
      if (this.datas.list) {
        const { padding_top, padding_bottom, padding_left, padding_right } = this.datas;
        return `
                width: 100%;
                background: #ffffff;
                padding-top: ${padding_top}px;
                padding-bottom: ${padding_bottom}px;
                padding-left: ${padding_left}px;
                padding-right: ${padding_right}px;
            `;
      } else {
        return ``;
      }
    },

    img_style() {
      const { picture_border } = this.datas;
      return `
				        width: 100%;
                border-radius: ${picture_border}px;
            `;
    },

    /** 标题 */
    list() {
      return this.datas.list;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initButtons();
    });
  },
  activated() {
    this.$nextTick(() => {
      this.initButtons();
    });
  },
  methods: {
    imgLoad(e) {
      this.$emit('imgLoad',e);
    },
    toUrl(item) {
      //console.log(this.emptyImage);
      if(item.is_minApp == 2 && this.fun.isApp()) {
        YDB.MiniWX(item.gh_id, item.minApp_link);
        return;
      }
      if(item.is_minApp == 2 &&  this.fun.isCPS()) {
        let json = {
          mini_route: item.minApp_link,
          mini_id: item.gh_id,
        };
        if (this.fun.isIosOrAndroid() === "ios") {
          miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
        } else {
          miniWXAndroid(JSON.stringify(json));
        }
        return;
      }

      if(item.is_minApp == 7) {
        if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
          let json = { name: 'task' };
          if (this.fun.isIosOrAndroid() === "ios") {
            toUrlIOS({ body: "toUrlIOS", json: JSON.stringify(json) });
          } else {
            toUrlAndroid(JSON.stringify(json));
          }
        }else if(item.h5_link) {
          zhuge.track(this.fatherTitle+'-点击广告位',{
            '图片src':item.image || this.emptyImage,
            '活动名称':''
          });
          window.location.href = item.h5_link;
        }
      }else if (item.is_minApp == 1 && item.h5_link && this.datas.choose_style == 2) {
        zhuge.track(this.fatherTitle+'-点击广告位',{
          '图片src':item.image || this.emptyImage,
          '活动名称':''
        });
        window.location.href = item.h5_link;
      }
    },
    toAreaUrl(item) {
      if(item.is_minApp == 2 && this.fun.isApp()) {
        YDB.MiniWX(item.gh_id, item.minApp_link);
        return;
      }
      if(item.is_minApp == 2 &&  this.fun.isCPS()) {
        let json = {
          mini_route: item.minApp_link,
          mini_id: item.gh_id,
        };
        if (this.fun.isIosOrAndroid() === "ios") {
          miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
        } else {
          miniWXAndroid(JSON.stringify(json));
        }
        return;
      }

      if(item.is_minApp == 7) {
        if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
          let json = { name: 'task' };
          if (this.fun.isIosOrAndroid() === "ios") {
            toUrlIOS({ body: "toUrlIOS", json: JSON.stringify(json) });
          } else {
            toUrlAndroid(JSON.stringify(json));
          }
        }else if(item.h5_link) {
          window.location.href = item.h5_link;
        }
      }else if (item.is_minApp == 1 && item.h5_link) {
        window.location.href = item.h5_link;
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log("图片加载出错");
        };
      }
    },
    initButtons() {
      let that = this;
      if (this.fun.getPhoneEnv() == 3) {
        this.clientWidth = 375;
      } else {
        this.clientWidth = document.body.clientWidth;
      }

      if (this.datas.choose_style == 2) {
        // 普通模式
        for (let j = 0; j < this.datas.list.length; j++) {
          this.getImg(this.datas.list[j].image, function(scale) {
            // 图片加载完后获取图片高度
            let script = document.createElement("script");
            script.type = "text/wxtag-template";
            script.text = `<div style="width: ${that.clientWidth}px;height: ${that.clientWidth * scale}px;"></div>`;
            that.datas.list[j].html = `<wx-open-launch-weapp username="${that.datas.list[j].gh_id}" path="${that.datas.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;

            that.datas.list.reverse().reverse(); //改变原始数组从而更新数组
          });
        }
      } else {
        // 热区模式
        for (let i = 0; i < this.datas.list.length; i++) {
          if (this.datas.list[i].hotArea) {
            for (let j = 0; j < this.datas.list[i].hotArea.length; j++) {
              let script = document.createElement("script");
              script.type = "text/wxtag-template";
              script.text = `<div style="width: ${this.datas.list[i].hotArea[j].width * (this.clientWidth / 400)}px;height: ${this.datas.list[i].hotArea[j].height *
                (this.clientWidth / 400)}px;"></div>`;
              this.datas.list[i].hotArea[
                j
              ].html = `<wx-open-launch-weapp username="${this.datas.list[i].hotArea[j].gh_id}" path="${this.datas.list[i].hotArea[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
            }
          }
        }

        this.datas.list.reverse().reverse(); //改变原始数组从而更新数组
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.component-wrapper {
  width: 100%;
  overflow: hidden;
  margin-top: -1px;

  img {
    display: block;
  }
}

.hotarea-rnd {
  position: absolute;
  user-select: auto;

  /* touch-action: none; */
  display: inline-block;
  top: 5px;
  left: 5px;
  width: 60px;
  height: 50px;
  padding: 5px 10px;
  box-sizing: border-box;

  /* border: 1px solid #29ba9c; */

  /* background: rgba(41, 186, 156, 0.3); */
  font-size: 12px;
  color: #fff;
}
</style>
