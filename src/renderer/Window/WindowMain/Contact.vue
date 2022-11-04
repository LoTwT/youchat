<script setup lang="ts">
import { count } from "console"
import { number } from "yargs"
import { db } from "../../../common/db"
import { ModelChat } from "../../../model/ModelChat"
import { ModelMessage } from "../../../model/ModelMessage"
import BarTop from "../../Component/BarTop.vue"
let insertData = async () => {
  let model = new ModelChat()
  model.fromName = "聊天对象"
  model.sendTime = Date.now()
  model.lastMsg = "这是此会话的最后一条消息"
  model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
  await db("Chat").insert(model)
}
let insertMultiData = async () => {
  let result = []
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat()
    model.fromName = "聊天对象" + i
    model.sendTime = Date.now() + i
    model.lastMsg = "这是此会话的最后一条消息" + i
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
    result.push(model)
  }
  result[5].isSelected = true
  await db("Chat").insert(result)
}

let selectData = async () => {
  let data = await db("Chat")
    .where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` })
    .first()
  console.log(data)
}

let updateData = async () => {
  let data = await db("Chat")
    .update({
      fromName: "三岛由纪夫",
      lastMsg: "就在刀刃猛然刺入腹部的瞬间，一轮红日在眼睑背面粲然升了上来。",
    })
    .where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` })
    .where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` })
  console.log(data)
}

let deleteData = async () => {
  let data = await db("Chat")
    .where({ id: `256d6532-fcfe-4b81-a3f8-ee940f2de3e3` })
    .delete()
  console.log(data)
}

let transaction = async () => {
  try {
    await db.transaction(async (trx) => {
      let chat = new ModelChat()
      chat.fromName = "聊天对象aaa"
      chat.sendTime = Date.now()
      chat.lastMsg = "这是此会话的最后一条消息"
      chat.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
      await trx("Chat").insert(chat)
      // throw "throw a error";
      let message = new ModelMessage()
      message.fromName = "聊天对象"
      message.chatId = chat.id
      message.createTime = Date.now()
      message.isInMsg = true
      message.messageContent = "这是我发给你的消息"
      message.receiveTime = Date.now()
      message.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`
      await trx("Message").insert(message)
    })
  } catch (error) {
    console.error(error)
  }
}
/**
 * 当前是第几页
 */
let currentPageIndex = 0
/**
 * 每页数据行数
 */
let rowCountPerPage = 6
/**
 * 总页数(可能有小数部分)
 */
let pageCount = -1
/**
 * 获取某一页数据
 */
let getOnePageData = async () => {
  let data = await db("Chat")
    .orderBy("sendTime", "desc")
    .offset(currentPageIndex * rowCountPerPage)
    .limit(rowCountPerPage)
  console.log(data)
}
/**
 * 获取第一页数据
 */
let getFirstPage = async () => {
  if (pageCount === -1) {
    let { count } = await db("Chat").count("id as count").first()
    count = count as number
    pageCount = count / rowCountPerPage
    console.log(pageCount)
  }
  currentPageIndex = 0
  await getOnePageData()
}
/**
 * 获取下一页数据
 */
let getNextPage = async () => {
  if (currentPageIndex + 1 >= pageCount) {
    currentPageIndex = Math.ceil(pageCount) - 1
  } else {
    currentPageIndex = currentPageIndex + 1
  }
  await getOnePageData()
}
/**
 * 获取上一页数据
 */
let getPrevPage = async () => {
  if (currentPageIndex - 1 < 0) {
    currentPageIndex = 0
  } else {
    currentPageIndex = currentPageIndex - 1
  }
  await getOnePageData()
}
/**
 * 获取最后一页数据
 */
let getLastPage = async () => {
  currentPageIndex = Math.ceil(pageCount) - 1
  await getOnePageData()
}
</script>
<template>
  <div class="ContactBoard">
    <BarTop />
    <div class="contentTest">
      <button @click="insertData">增加一行数据</button>

      <button @click="insertMultiData">增加多行数据</button>

      <button @click="selectData">查询一行数据</button>

      <button @click="updateData">修改一行数据</button>

      <button @click="deleteData">删除一行数据</button>

      <br />

      <button @click="transaction">使用事务</button>
      <br />
      <button @click="getFirstPage()">获取第一页数据</button>
      <button @click="getNextPage()">获取下一页数据</button>
      <button @click="getPrevPage()">获取上一页数据</button>
      <button @click="getLastPage()">获取最后一页数据</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ContactBoard {
  flex: 1;
}
.contentTest {
  padding: 18px;
}
</style>
