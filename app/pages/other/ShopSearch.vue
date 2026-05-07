<template>
  <div class="shop-search-wrapper">
    <iframe
      src="https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch"
      class="shop-iframe"
      title="露天商店查詢"
      allowfullscreen
    />
    <div v-if="blocked" class="blocked-msg">
      <p>⚠️ 無法嵌入頁面，請直接前往官網查詢。</p>
      <a href="https://event.gnjoy.com.tw/RoZ/RoZ_ShopSearch" target="_blank">
        前往露天商店查詢 →
      </a>
    </div>
  </div>
</template>

<script setup>
const blocked = ref(false);

onMounted(() => {
  const iframe = document.querySelector('.shop-iframe');
  iframe.addEventListener('error', () => { blocked.value = true; });

  // 有些瀏覽器不觸發 error 事件，改用 load 後嘗試讀取 contentDocument 判斷
  iframe.addEventListener('load', () => {
    try {
      // 若被 X-Frame-Options 擋住，contentDocument 會是 null 或拋例外
      const doc = iframe.contentDocument;
      if (!doc) blocked.value = true;
    } catch {
      blocked.value = true;
    }
  });
});
</script>

<style scoped>
.shop-search-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 56px); /* 56px 是 navbar 高度，視實際情況調整 */
}

.shop-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.blocked-msg {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #2c1e14;
  color: #a6937c;
  font-size: 1rem;
}

.blocked-msg a {
  color: #f1d483;
  text-decoration: underline;
  font-weight: bold;
}
</style>
