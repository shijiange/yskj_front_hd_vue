<template>
  <div class="U000007-template1" :style="{backgroundColor: datas.preview_color}" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="decorate-cube" v-if="datas.preview_color">
      <div v-if="!havePicture" style="text-align: center; display: flex; height: 100%; font-size: 16px;">
        <span style="flex: 1; align-self: center;">暂无设置图片</span>
      </div>

      <template v-if="havePicture">
        <div class="cube-selected" @click.stop="toUrl(item)"
             v-for="(item, index) in datas.picture.cudeSelected" :key="index"
             :style="{'width':getCubeSelectedWidth(item)+'px','height':getCubeSelectedHeight(item)+'px','top':getCubeSelectedTop(item)+'px','left':getCubeSelectedLeft(item)+'px',backgroundImage: `url(${item.value.image ? item.value.image : ''})`, backgroundSize: '100% 100%',backgroundPosition: 'center',backgroundRepeat: 'no-repeat'}">
          <div class="cube-selected-text" v-if="item.value.is_minApp == 2 && !fun.isApp() && !fun.isCPS()" @click.stop v-html="item.html">
          </div>
        </div>
      </template>

    </div>

  </div>
</template>

<script>
// 自定义样式
const css = function () {
  if(this.datas.preview_color) {
    const {
      margin,
    } = this.datas;

    return `
        .component-${this.id} .decorate-cube {
            width: ${this.cubeWidth - (margin/2)}px;
            height: ${this.datas.picture.icon == '1' ? this.cubeItemHeight*2 : this.cubeItemHeight*this.cubeX}px;
            margin: 0 ${margin/2}px 0 ${margin/2}px;
        }

    `;
  }
};

export default {
  props: ['id', 'datas', 'styles'],
  data() {
    return{
      // density:4, //密度
      cubeWidth:375, //魔方宽度
      cubeHeight:375, //魔方高度
      cudeSelecting:{
        start:null,
        end:null,
        data:[]
      },
      cudeSelected:[], //已经生成的单元
      havePicture: false,

      cubeX: 1,
    };
  },
  mounted() {
    if(this.fun.getPhoneEnv() == 3) {
      this.cubeHeight = this.cubeWidth = 375;
    }else {
      this.cubeHeight = this.cubeWidth = document.body.clientWidth;
    }

    this.checkhavePicture();
  },
  activated() {
    if(this.fun.getPhoneEnv() == 3) {
      this.cubeHeight = this.cubeWidth = 375;
    }else {
      this.cubeHeight = this.cubeWidth = document.body.clientWidth;
    }

    this.checkhavePicture();
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
    //密度值
    densityNum:function () {
      return parseInt(this.datas.picture.density);
    },
    //单元魔方高度
    cubeItemHeight:function () {
      return this.cubeHeight/this.datas.picture.density;
    },
    //单元魔方宽度
    cubeItemWidth:function () {
      return this.cubeWidth/this.datas.picture.density;
    },
  },
  watch: {
    datas: {
      deep: true,//深度监听
      handler: function () {
        this.havePicture = false;
        this.cubeX = 1;
        for(let i = 0; i<this.datas.picture.cudeSelected.length; i++) {
          if(this.datas.picture.cudeSelected[i].end.x> this.cubeX) {
            this.cubeX = this.datas.picture.cudeSelected[i].end.x;
          }
          if(this.datas.picture.cudeSelected[i].value.image) {
            this.havePicture = true;
          }
        }
        if(this.datas.picture.cudeSelected.length === 0 || !this.havePicture) {
          this.cubeX = 4;
        }

      }
    }
  },

  methods: {
    toUrl(item) {
      if(item.value.is_minApp == 2 && this.fun.isApp()) {
        YDB.MiniWX(item.value.gh_id, item.value.minApp_link);
        return;
      }
      if(item.value.is_minApp == 2 &&  this.fun.isCPS()) {
        let json = {
          mini_route: item.value.minApp_link,
          mini_id: item.value.gh_id,
        };
        if (this.fun.isIosOrAndroid() === "ios") {
          miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
        } else {
          miniWXAndroid(JSON.stringify(json));
        }
        return;
      }

      if(item.value.is_minApp == 1 && item.value.h5_link) {
        window.location.href = item.value.h5_link;
      }
    },
    checkhavePicture() {
      if(this.datas.picture) {
        this.havePicture = false;
        this.cubeX = 1;
        for(let i = 0; i<this.datas.picture.cudeSelected.length; i++) {
          if(this.datas.picture.cudeSelected[i].end.x> this.cubeX) {
            this.cubeX = this.datas.picture.cudeSelected[i].end.x;
          }
          if(this.datas.picture.cudeSelected[i].value.image) {
            this.havePicture = true;
          }

          let script = document.createElement('script');
          script.type = 'text/wxtag-template';
          script.text = `<div style="width: ${this.getCubeSelectedWidth(this.datas.picture.cudeSelected[i])}px;height: ${this.getCubeSelectedHeight(this.datas.picture.cudeSelected[i])}px;"></div>`;
          this.datas.picture.cudeSelected[i].html = `<wx-open-launch-weapp username="${this.datas.picture.cudeSelected[i].value.gh_id}" path="${this.datas.picture.cudeSelected[i].value.minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
        }

        this.datas.picture.cudeSelected.reverse().reverse(); //改变原始数组从而更新数组

        if(this.datas.picture.cudeSelected.length === 0 || !this.havePicture) {
          this.cubeX = 4;
        }
      }
    },
    //判断是否正在选择
    isSelecting:function (x,y) {
      var cudeSelectingData = this.cudeSelecting.data;
      for(var i = 0, len = cudeSelectingData.length; i < len; i++){
        var coord = cudeSelectingData[i];
        if(parseInt(coord.x) === parseInt(x) && parseInt(coord.y) === parseInt(y)){
          return true;
        }
      }
      return false;
    },
    //判断是否已经选择
    isSelected:function (x,y) {
      var list = this.cudeSelected;
      for(var i=0;i<list.length;i++){
        var data = list[i].data;
        for(var j=0;j<data.length;j++){
          var coord = data[j];
          if(parseInt(coord.x) === parseInt(x) && parseInt(coord.y) === parseInt(y)){
            return true;
          }
        }
      }
      return false;
    },
    //计算选中层的宽度
    getCubeSelectedWidth:function (item) {
      return (parseInt(item.end.y) - parseInt(item.start.y) + 1) * this.cubeItemWidth - this.datas.margin;
    },
    //计算选中层的高度
    getCubeSelectedHeight:function (item) {
      return (parseInt(item.end.x) - parseInt(item.start.x) + 1) * this.cubeItemHeight - this.datas.margin;
    },
    //计算选中层的右边距离
    getCubeSelectedTop:function (item) {
      return (item.start.x-1) * this.cubeItemHeight + this.datas.margin/2;
    },
    //计算选中层的左边距离
    getCubeSelectedLeft:function (item) {
      return (item.start.y-1) * this.cubeItemWidth;
    }
  },

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
  }

  .decorate-cube {
    position: relative;
    width: 100%;
  }

  .decorate-cube .cube-row:last-of-type .cube-item {
    /* border-right: 1px solid #e5e5e5; */
  }

  .decorate-cube .cube-selected {
    border: 0;
    font-size: 0;
    position: absolute;
    background-color: #fff;

    /* border: 1px solid #ebedf0; */
    text-align: center;
    color: #7d7e80;
    cursor: pointer;
    box-sizing: border-box;
  }

  .decorate-cube .cube-selected.cube-selected-click {
    background: #e0edff;

    /* border: 1px solid #155bd4; */
    color: #29ba9c;
    z-index: 2;
    cursor: auto;
  }

  .decorate-cube .cube-selected-text {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .decorate-cube .cube-row {
    float: left;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .decorate-cube .cube-item:first-child {
    /* border-top: 1px solid #e5e5e5; */
  }

  .decorate-cube .cube-item {
    background: #f8f8f8;

    /* border-left: 1px solid #e5e5e5; */

    /* border-bottom: 1px solid #e5e5e5; */
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
  }

  .decorate-cube .cube-item.item-selecting {
    background: #e0edff;
  }

  .decorate-cube .cube-item.item-selecting .van-icon {
    display: none;
  }

  .decorate-cube .cube-item.item-selected {
    background: #e0edff;
    visibility: hidden;
  }

  .decorate-cube .cube-item.item-selected .van-icon {
    display: none;
  }
</style>
