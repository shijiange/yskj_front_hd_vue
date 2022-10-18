<template>
  <div>
    <c-title :hide="false" :text="'门店'+appointmentLang.worker">
    </c-title>
    <div class="te_list_box">
      <div class="te_list_list">
        <div class="te_list_content" v-for="item in technicianList" :key="item.id">
          <div class="content_img">
            <img :src="item.thumb" alt="">
            <span>{{item.name}}</span>
          </div>

          <div class="content_button">
            <span class="button_edit" @click="toAdd(item)">编辑</span>
            <span class="button_delete" @click="deleteItem(item)">删除</span>
          </div>
        </div>

      </div>
    </div>
    <div class="add_stores" @click="toAdd">
      <img src="../../../assets/images/appointment_add@2x.png"/>
    </div>

  </div>
</template>

<script>
import stores_technician_controller from "./stores_technician_controller";

export default stores_technician_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>


.te_list_box .te_list_list {
  padding: 0.5rem;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
}

.te_list_box .te_list_content {
  padding: 1rem;
  box-shadow: 0 0 1rem 0 rgba(169, 169, 169, 0.24);
  border-radius: 5px;
  display: -webkit-flex;
  display: flex;
  background: #fff;
  justify-content: space-between;
  margin-top: 1rem;
  align-items: center;
}

.te_list_content img {
  border-radius: 100%;
  width: 3rem;
  height: 3rem;
  margin: 0;
}

.content_img span {
  font-size: 16px;
  padding: 1rem;
  line-height: 1rem;
  color: #000;
}

.content_button span {
  border-radius: 1rem;
  font-size: 14px;
  color: #fff;
  padding: 0.1rem 0.5rem;
  border: none;
  text-align: center;
  line-height: 2rem;
}

.te_list_content .button_edit {
  background: #f4a82e;
  margin-right: 1rem;
}

.te_list_content .button_delete {
  background: #ccc;
}

.content_img {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}

.add_stores {
  position: fixed;
  right: 0;
  bottom: 2rem;
}

.add_stores img {
  width: 3rem;
  height: 3rem;
  margin: 0;
}

</style>
