<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 py-10 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-12 border-b border-slate-700 pb-8">
        <h1 class="text-3xl font-black text-white sm:text-4xl tracking-tight mb-4">
          活動流程表 <span class="text-emerald-400">（正式版）</span>
        </h1>
        <div class="inline-flex flex-col sm:flex-row items-center gap-4 text-sm">
          <span class="px-4 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-300">
            📅 2026/02/27 (五) - 02/28 (六)
          </span>
          <span class="px-4 py-1 rounded-full bg-slate-800 border border-slate-600 text-slate-300">
            📍 台東・池上 / 延平 / 鹿野
          </span>
        </div>
      </header>

      <section class="mb-16">
        <div class="flex items-center mb-6">
          <div class="bg-sky-500 text-slate-900 px-4 py-1 rounded-md font-black mr-4 shadow-lg shadow-sky-500/20">DAY 01</div>
          <h2 class="text-2xl font-bold text-white italic">2/27（五）池上漫遊</h2>
        </div>

        <div class="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4 text-left">時間</th>
                <th class="px-6 py-4 text-left">活動內容</th>
                <th class="px-6 py-4 text-left">備註與地點</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
              <tr v-for="(item, index) in day1" :key="index" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-sky-400 align-top">{{ item.time }}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-100 align-top" v-html="item.content"></td>
                <td class="px-6 py-4 text-sm text-slate-400 leading-relaxed">
                  <div v-html="item.note"></div>
                  <a v-if="item.mapUrl" :href="item.mapUrl" target="_blank" rel="noopener noreferrer"
                     class="inline-flex items-center mt-3 px-3 py-1 rounded bg-slate-700 text-sky-300 hover:bg-sky-900/50 hover:text-sky-200 transition-all text-xs">
                    <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                    開啟導航
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center mb-6">
          <div class="bg-emerald-500 text-slate-900 px-4 py-1 rounded-md font-black mr-4 shadow-lg shadow-emerald-500/20">DAY 02</div>
          <h2 class="text-2xl font-bold text-white italic">2/28（六）森林與靈性</h2>
        </div>

        <div class="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4 text-left">時間</th>
                <th class="px-6 py-4 text-left">活動內容</th>
                <th class="px-6 py-4 text-left">備註與地點</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
              <tr v-for="(item, index) in day2" :key="index" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-400 align-top">{{ item.time }}</td>
                <td class="px-6 py-4 text-sm font-bold text-slate-100 align-top" v-html="item.content"></td>
                <td class="px-6 py-4 text-sm text-slate-400 leading-relaxed">
                  <div v-html="item.note"></div>
                  <a v-if="item.mapUrl" :href="item.mapUrl" target="_blank" rel="noopener noreferrer"
                     class="inline-flex items-center mt-3 px-3 py-1 rounded bg-slate-700 text-emerald-300 hover:bg-emerald-900/50 hover:text-emerald-200 transition-all text-xs">
                    <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                    開啟導航
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer class="mt-16 text-center border-t border-slate-800 pt-8 pb-12">
        <p class="text-slate-500 text-xs">© 2026 旅遊行程表 · 內容僅供參考</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 使用搜尋連結確保相容性與正確地點
const day1 = [
  {
    time: '14:30',
    content: '池上火車站集合',
    note: '花蓮成員: 14:28 抵達<br>台東成員: 自行前往車站門口',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=池上火車站'
  },
  {
    time: '14:30-14:40',
    content: '租用協力車',
    note: '保忠租車行<br>池上鄉中山路340號',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=保忠租車行'
  },
  {
    time: '14:40-16:40',
    content: '單車漫遊 & 團康',
    note: '大波池風景區出發',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=大波池'
  },
  {
    time: '16:40-17:00',
    content: '野灣-保育探索館',
    note: '中山路227號',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=WildOne野灣保育探索館'
  },
  {
    time: '17:10-18:30',
    content: '晚餐 & 採購時間',
    note: '池上餐廳 / 宵夜採購 (自費)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=池上夜市'
  },
  {
    time: '18:50~',
    content: '奇泰民宿 Check-in',
    note: '台東縣池上鄉文通路13號<br>自由活動、交流、桌遊',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=奇泰民宿'
  }
];

const day2 = [
  {
    time: '08:10-08:40',
    content: '皇嘉機車行集合',
    note: '租用機車',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=皇嘉機車行'
  },
  {
    time: '08:50-09:20',
    content: '鸞山派出所集合',
    note: '報到、行前說明',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=鸞山派出所'
  },
  {
    time: '09:40-14:00',
    content: '鸞山森林博物館',
    note: '上午一日遊體驗',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=鸞山森林博物館'
  },
  {
    time: '14:30-16:00',
    content: '鹿野梅花鹿公園',
    note: '鹿野鄉瑞景路一段23巷15號',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=鹿野梅花鹿公園'
  },
  {
    time: '16:55-17:30',
    content: '武陵綠色隧道',
    note: '2626市集',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=武陵綠色隧道'
  },
  {
    time: '17:30-19:15',
    content: '李伯伯食堂晚餐',
    note: '鹿野鄉永嶺路69號',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=李伯伯食堂'
  },
  {
    time: '19:30',
    content: '賦歸',
    note: '鹿野火車站 (447次 20:11)',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=鹿野火車站'
  }
];
</script>