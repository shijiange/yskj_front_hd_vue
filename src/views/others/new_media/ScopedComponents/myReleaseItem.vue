<template>
  <div class="item">
    <div class="time" >投放时间: 2021.07.05 15:23:25-2021.07.05 15:23:25</div>
    <div class="content">
      <div class="face">
        <image
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F30%2F20200530112650_4XXME.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628920299&t=256bfafcb6e7e7eafe7eeda610b56d7e"
        >
        </image>
      </div>
      <div class="left">
        <div class="title"><span class="label">上架</span>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</div>
        <div class="tags">
          <div class="tag">视频</div>
        </div>
        <div class="desc">12流量值/小时 时长2h</div>
      </div>
    </div>
    <div class="operation">
      <div class="operation-item">
        <i class="iconfont icon-massage_order"></i>
        <span class="num">12256</span>
      </div>
      <div class="operation-item">
        <i class="iconfont icon-fontclass-dianzan"></i>
        <span class="num">12256</span>
      </div>
      <div class="operation-item">
        <i class="iconfont icon-fontclass-xinghao"></i>
        <span class="num">12256</span>
      </div>
      <div class="operation-item">
        <i class="iconfont icon-fontclass-pinglun"></i>
        <span class="num">12256</span>
      </div>
      <div class="operation-item">
        <i class="iconfont icon-share"></i>
        <span class="num">12256</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  padding: 0.45rem 0.4rem;
  background-color: #fff;
  border-radius: 0.25rem;
}

.item .time {
  padding-bottom: 0.45rem;
  font-size: 0.5rem;
  color: #aeaeae;
}

.item .content {
  display: flex;
}

.item .content .face {
  width: 4rem;
  height: 4rem;
  border-radius: 0.25rem;
}

.item .content .face image {
  width: 4rem;
  height: 4rem;
  border-radius: 0.25rem;
}

.item .content .left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 0.5rem;
}

.item .content .left .title {
  font-size: 0.65rem;
  color: #1e1e1e;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item .content .left .title .label {
  display: inline-flex;
  align-items: center;
  height: 0.925rem;
  padding: 0 0.375rem;
  margin-right: 0.375rem;
  font-size: 0.55rem;
  color: #fff;
  background-color: #ff9d57;
  border-radius: 0.1rem;
}

.item .content .left .tags .tag {
  display: inline;
  height: 0.85rem;
  line-height: 0.85rem;
  padding: 0 0.375rem;
  font-size: 0.5rem;
  color: #7c7c7c;
  background-color: #eee;
  border-radius: 0.15rem;
}

.item .content .left .desc {
  font-size: 0.5rem;
  color: #ee2e2b;
}

.item .operation {
  display: flex;
  padding-top: 0.5rem;
  padding-left: 0.3rem;
}

.item .operation .operation-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item .operation .operation-item .iconfont {
  color: #979797;
}

.item .operation .operation-item .num {
  margin-left: 0.175rem;
  font-size: 0.5rem;
  color: #4f4f4f;
}

.item .operation .operation-item .iconfont.icon-massage_order {
  font-size: 0.65rem;
}

.item .operation .operation-item .iconfont.icon-fontclass-pinglun {
  font-size: 0.95rem;
}

.item .operation .operation-item .iconfont.icon-share {
  font-size: 0.65rem;
}
</style>