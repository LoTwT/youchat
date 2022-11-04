<script setup lang="ts">
import BarTop from "../../../Component/BarTop.vue"
import { useMessageStore } from "../../../store/useMessageStore"
import MessageItem from "./MessageItem.vue"

let messageStore = useMessageStore()

// 阶段1
// import { ref } from "vue";
// let store = useChatStore();
// let logInfo = ref("");
// let curId = "";
// store.$subscribe((mutations, state) => {
//   let item = state.data.find((v) => v.isSelected);
//   let id = item?.id as string;
//   if (id != curId) {
//     logInfo.value = `现在应该加载ID为${item?.id}的聊天记录`;
//     curId = id;
//   }
// });

// 阶段2
// import { ModelChat } from "../../../../model/ModelChat";
// import { useChatStore } from "../../../store/useChatStore";
// let chatStore = useChatStore();
// let curId = "";
// chatStore.$subscribe((mutations, state) => {
//   let item = state.data.find((v) => v.isSelected) as ModelChat;
//   if (item.id != curId) {
//     messageStore.initData(item);
//     curId = item.id;
//   }
// });
</script>
<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">
      <MessageItem
        :data="item"
        v-for="item in messageStore.data"
        :key="item.id"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.MessageList {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(245, 245, 245);
}
</style>
