<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-8 font-sans">

    <!-- Header -->
    <div class="max-w-[1600px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">經典組隊</h1>
        <p class="text-[#a6937c] text-sm mt-1">分配角色至各隊伍・自動儲存</p>
      </div>
      <div class="flex gap-2 flex-wrap items-center">
        <button @click="showAcceptModal = true"
                class="bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-4 py-2 rounded shadow-md transition font-bold border border-[#a8c0f0]/20 text-sm">
          🔗 輸入邀請碼
        </button>
        <button @click="showCreateModal = true" :disabled="ownCount >= 3"
                class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-6 py-2.5 rounded shadow-md transition font-bold border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed">
          ＋ 建立分隊
          <span v-if="ownCount >= 3" class="text-xs ml-1">（已達上限）</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="max-w-[1600px] mx-auto text-center py-20 text-[#a6937c] italic text-lg">讀取中...</div>

    <div v-else class="max-w-[1600px] mx-auto">

      <div v-if="classics.length === 0"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
        尚未建立任何分隊，點右上角「建立分隊」開始
      </div>

      <div v-else>
        <!-- 分隊選擇列 -->
        <div class="flex flex-wrap items-center gap-2 mb-6 bg-[#3d2b1f] border border-[#5e4b37] rounded-xl px-4 py-3">
          <span class="text-[#f1d483] text-sm font-bold shrink-0">選擇分隊：</span>
          <div class="flex flex-wrap gap-2 flex-1">
            <button v-for="c in classics" :key="c.id"
                    @click="selectClassic(c.id)"
                    class="px-3 py-1.5 rounded-lg text-sm font-bold border transition"
                    :class="activeId === c.id
                      ? 'bg-[#5e4b37] border-[#f1d483] text-[#f1d483]'
                      : 'bg-[#2c1e14] border-[#5e4b37] text-[#a6937c] hover:border-[#8b7a64]'">
              {{ c.name }}
              <span class="text-[10px] ml-1 opacity-60">
                {{ c.permission === 'owner' ? '我的' : c.permission === 'edit' ? '編輯' : '查看' }}
              </span>
            </button>
          </div>

          <template v-if="activeId && activeDetail">
            <div class="flex items-center gap-2 shrink-0 flex-wrap">
              <div class="flex items-center gap-1.5">
                <span class="text-[#f1d483] text-sm font-bold">隊伍數量:</span>
                <select v-model="squadCount" :disabled="!canEdit"
                        class="bg-[#2c1e14] text-[#f1d483] outline-none font-mono border border-[#5e4b37] rounded px-2 py-1 cursor-pointer disabled:opacity-50">
                  <option v-for="n in 12" :key="n" :value="n">{{ n }} 隊</option>
                </select>
              </div>
              <button v-if="canEdit" @click="resetAll"
                      class="bg-[#5e4b37] hover:bg-[#8b3a3a] text-white px-3 py-1.5 rounded font-bold border border-white/10 transition text-sm">
                全部重置
              </button>
              <button v-if="activeDetail.permission === 'owner'" @click="openShareModal"
                      class="bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-3 py-1.5 rounded font-bold border border-[#a8c0f0]/20 transition text-sm">
                分享
              </button>
              <button v-if="activeDetail.permission === 'owner'" @click="startRename"
                      class="bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-3 py-1.5 rounded font-bold border border-[#a8f0c8]/20 transition text-sm">
                改名
              </button>
              <button v-if="activeDetail.permission === 'owner'" @click="confirmDelete"
                      class="bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1.5 rounded font-bold border border-[#f0a8a8]/20 transition text-sm">
                刪除
              </button>
            </div>
          </template>
        </div>

        <div v-if="!activeId" class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37]">
          請選擇上方的分隊開始分配
        </div>

        <div v-else-if="detailLoading" class="text-center py-20 text-[#a6937c] italic">載入中...</div>

        <div v-else-if="activeDetail" class="grid grid-cols-1 xl:grid-cols-12 gap-8">

          <!-- ══ 左側角色名冊 ══ -->
          <div class="xl:col-span-3 space-y-4">
            <h2 class="text-[#f1d483] font-bold text-xl flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span>📜</span>
                <span>角色名冊</span>
                <span class="text-sm font-normal text-[#a6937c]">({{ allChars.length }} 員)</span>
              </div>
              <div class="flex gap-2">
                <button @click="setAllCollapse(false)" class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">展開</button>
                <button @click="setAllCollapse(true)"  class="text-[10px] bg-[#5e4b37] hover:bg-[#8b7a64] text-[#f1d483] px-2 py-1 rounded transition border border-[#f1d483]/30">收起</button>
              </div>
            </h2>

            <div class="flex gap-3 text-[10px] text-[#a6937c] flex-wrap">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#a0c878] inline-block"></span>場外 BUFF</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#8d7a64] inline-block"></span>已分配</span>
            </div>

            <div v-if="charGroups.length === 0" class="text-[#a6937c] italic py-10 text-center bg-[#3d2b1f] rounded">
              尚無角色資料
            </div>

            <div v-else class="space-y-3 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
              <div v-for="(group, gIdx) in charGroups" :key="group.id"
                   class="bg-[#3d2b1f] border border-[#5e4b37] rounded overflow-hidden">

                <div @click="toggleGroup(gIdx)"
                     class="bg-[#2c1e14] px-4 py-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                  <div class="flex items-center gap-2 overflow-hidden flex-1">
                    <span class="text-[#f1d483] text-[10px] font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>
                    <span class="text-[#e0d3b8] font-bold truncate">{{ group.name }}</span>
                  </div>
                  <span class="transition-transform duration-300 text-[#a6937c] text-xs shrink-0 ml-2"
                        :class="{ 'rotate-180': !collapsedGroups[gIdx] }">▼</span>
                </div>

                <div v-show="!collapsedGroups[gIdx]" class="p-3 grid gap-2 border-t border-[#5e4b37]">
                  <div v-for="char in group.roles" :key="char.charName"
                       class="bg-[#f5f1e6] text-[#2c1e14] p-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
                       :class="[
                         char.isSupport ? 'border-2 border-[#a0c878]' :
                         char.assignedTo ? 'opacity-40 grayscale scale-95' :
                         'hover:bg-[#fffcf5] border-2 border-transparent hover:border-[#f1d483]'
                       ]">

                    <div class="relative shrink-0 pt-1 pb-4">
                      <div class="w-12 h-12 bg-[#ede4cf] rounded-full border-2 border-[#dcd2bb] flex items-center justify-center overflow-hidden shadow-inner">
                        <img :src="getJobImg(char.job)" :alt="char.job" class="w-9 h-9 object-contain">
                      </div>
                      <span class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#5e4b37] text-[#f1d483] text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap border border-[#2c1e14]">
                        {{ char.job || '冒險者' }}
                      </span>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-center mb-1">
                        <div class="font-black text-base text-[#4a3728] truncate leading-tight">{{ char.charName }}</div>
                        <div class="flex items-center gap-1 shrink-0">
                          <span v-if="char.level" class="text-[#8d7a64] text-[10px] font-mono">Lv.{{ char.level }}</span>
                          <button v-if="canEdit" @click="toggleSupport(char)"
                                  :title="char.isSupport ? '取消 BUFF' : '設為場外 BUFF'"
                                  class="text-[10px] px-1.5 py-0.5 rounded border transition font-bold"
                                  :class="char.isSupport
                                    ? 'bg-[#a0c878] text-[#2c1e14] border-[#7aaa4a]'
                                    : 'bg-transparent text-[#8d7a64] border-[#c5b99a] hover:border-[#a0c878]'">
                            🎵
                          </button>
                        </div>
                      </div>

                      <div v-if="char.isSupport"
                           class="text-center py-1 bg-[#d4edb8] text-[#4a7a1a] text-[10px] font-bold rounded border border-[#a0c878]">
                        🎵 場外 BUFF
                      </div>
                      <div v-else-if="char.assignedTo"
                           class="text-center py-1 bg-[#dcd2bb] text-[#8d7a64] text-[10px] font-bold rounded">
                        已分配 → 隊伍 {{ String.fromCharCode(64 + char.assignedTo) }}
                      </div>
                      <div v-else-if="canEdit" class="grid grid-cols-4 sm:grid-cols-6 gap-1 mt-1">
                        <button v-for="sIdx in squadCount" :key="sIdx"
                                @click="addToSquad(char, sIdx - 1, gIdx)"
                                :disabled="!char.isSupport && isAccountInSquad(gIdx, sIdx - 1)"
                                class="py-1 text-[10px] font-bold rounded border transition uppercase"
                                :class="getButtonClass(sIdx - 1, gIdx, char.isSupport)">
                          {{ String.fromCharCode(64 + sIdx) }}
                        </button>
                      </div>
                      <div v-else class="text-[#a6937c] text-[10px] italic text-center py-1">查看模式</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ══ 右側隊伍編成 ══ -->
          <div class="xl:col-span-9 space-y-4">
            <h2 class="text-[#f1d483] font-bold text-xl flex items-center gap-2">
              <span>⚔️</span> 隊伍編成結果
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
              <div v-for="(squad, sIdx) in squads" :key="sIdx"
                   class="bg-[#f5f1e6] rounded shadow-xl border-t-8 flex flex-col"
                   :class="getSquadColor(sIdx).border">

                <div class="p-4 border-b border-[#dcd2bb] flex justify-between items-center">
                  <h3 class="font-black text-xl text-[#2c1e14]">隊伍 {{ String.fromCharCode(64 + sIdx + 1) }}</h3>
                  <span class="bg-white/40 px-2 py-0.5 rounded text-[10px] font-bold text-[#8d7a64]">
                    SQUAD {{ String.fromCharCode(64 + sIdx + 1) }}
                  </span>
                </div>

                <div class="px-3 pt-2 pb-1 flex flex-wrap gap-1 min-h-[26px]">
                  <span v-for="(count, job) in getJobComposition(squad.members)" :key="job"
                        class="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                        :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                    {{ job }} ×{{ count }}
                  </span>
                  <span v-if="!Object.keys(getJobComposition(squad.members)).length"
                        class="text-[9px] text-[#c2b9a3] italic">尚無成員</span>
                </div>

                <div class="p-3 flex-1 min-h-[360px] space-y-2">
                  <div v-for="member in squad.members" :key="member.charName + member.accountId"
                       class="bg-white border border-[#e8dfc8] p-2.5 rounded-xl shadow-sm flex items-center group">
                    <div class="relative shrink-0 pt-1 pb-3">
                      <div class="w-11 h-11 bg-[#f8f5ee] rounded-full border border-[#dcd2bb] flex items-center justify-center overflow-hidden">
                        <img :src="getJobImg(member.job)" class="w-7 h-7 object-contain">
                      </div>
                      <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap text-white font-bold"
                            :style="{ backgroundColor: getSquadColor(sIdx).tagBg }">
                        {{ member.job || '無' }}
                      </span>
                    </div>
                    <div class="flex-1 text-center px-3">
                      <span class="text-[#2c1e14] font-black text-base block truncate leading-tight">{{ member.charName }}</span>
                      <span class="text-[#8d7a64] text-[10px]">{{ member.accountName }}</span>
                      <span v-if="member.level" class="text-[#8d7a64] text-[10px] font-mono ml-1">Lv.{{ member.level }}</span>
                    </div>
                    <button v-if="canEdit" @click="removeFromSquad(member)"
                            class="text-[#d1cfcf] hover:text-[#8b3a3a] transition p-1 opacity-0 group-hover:opacity-100">
                      <span class="text-lg">✕</span>
                    </button>
                  </div>
                  <div v-if="squad.members.length === 0"
                       class="h-28 flex items-center justify-center text-[#c2b9a3] italic border-2 border-dashed border-[#dcd2bb] rounded-xl">
                    尚未配置隊員
                  </div>
                </div>

                <div v-if="squad.supporters.length > 0"
                     class="px-3 pb-2 pt-2 border-t border-dashed border-[#c8be9e]">
                  <div class="text-[9px] text-[#8d7a64] font-bold mb-1">🎵 場外 BUFF</div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="sup in squad.supporters" :key="sup.charName + sup.accountId"
                          class="text-[10px] bg-[#d4edb8] text-[#3d6818] px-2 py-0.5 rounded-full border border-[#a0c878] font-bold">
                      {{ sup.charName }} <span class="opacity-60 text-[9px]">{{ sup.job }}</span>
                    </span>
                  </div>
                </div>

                <div class="p-3 bg-[#ede4cf] border-t border-[#dcd2bb] rounded-b-lg flex justify-between items-center">
                  <span class="text-xs text-[#4a3728] font-bold">隊內人數</span>
                  <span class="text-lg font-mono font-black text-[#4a3728] px-3 py-0.5 bg-white/40 rounded-lg">
                    {{ squad.members.length }} <span class="text-xs">人</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 建立分隊 Modal ══ -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showCreateModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">建立新分隊</h3>
        <input v-model="newName" placeholder="分隊名稱（例：週常A組）"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3" />
        <p v-if="createError" class="text-red-400 text-sm mb-3">{{ createError }}</p>
        <div class="flex gap-2">
          <button @click="createClassic" :disabled="!newName.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
            {{ isSaving ? '建立中...' : '建立' }}
          </button>
          <button @click="showCreateModal = false" class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">取消</button>
        </div>
      </div>
    </div>

    <!-- ══ 改名 Modal ══ -->
    <div v-if="renameModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="renameModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">分隊改名</h3>
        <input v-model="renameModal.name"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-[#e0d3b8] outline-none focus:border-[#f1d483] transition mb-3" />
        <div class="flex gap-2">
          <button @click="submitRename" :disabled="!renameModal.name.trim() || isSaving"
                  class="flex-1 py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">儲存</button>
          <button @click="renameModal.show = false" class="flex-1 py-2 bg-[#3d2b1f] border border-[#5e4b37] text-[#a6937c] rounded transition hover:bg-[#5e4b37]">取消</button>
        </div>
      </div>
    </div>

    <!-- ══ 刪除確認 ══ -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認刪除分隊？</h3>
        <p class="text-[#a6937c] mb-5">分隊「<span class="text-[#e0d3b8] font-bold">{{ activeDetail?.name }}</span>」及所有分配資料將永久刪除。</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeleteConfirm = false" class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="deleteClassic" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 分享 Modal ══ -->
    <div v-if="shareModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="shareModal.show = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[#f1d483] font-bold text-lg">分享分隊：{{ activeDetail?.name }}</h3>
          <button @click="shareModal.show = false" class="text-[#a6937c] hover:text-[#f0a8a8] text-xl leading-none">✕</button>
        </div>
        <div class="flex gap-2 mb-3">
          <button @click="shareModal.permission = 'view'"
                  class="flex-1 py-2 rounded border text-sm font-bold transition"
                  :class="shareModal.permission === 'view' ? 'bg-[#2a3a4a] border-[#a8c0f0] text-[#a8c0f0]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
            查看<br><span class="text-[10px] font-normal">只能看分配結果</span>
          </button>
          <button @click="shareModal.permission = 'edit'"
                  class="flex-1 py-2 rounded border text-sm font-bold transition"
                  :class="shareModal.permission === 'edit' ? 'bg-[#2a4a3a] border-[#a8f0c8] text-[#a8f0c8]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
            編輯<br><span class="text-[10px] font-normal">可修改分配</span>
          </button>
        </div>
        <button @click="generateInvite" :disabled="shareModal.generating"
                class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50 mb-3">
          {{ shareModal.generating ? '產生中...' : '產生邀請碼' }}
        </button>
        <div v-if="shareModal.code" class="bg-[#3d2b1f] border border-[#5e4b37] rounded-lg p-3 text-center mb-4">
          <div class="text-3xl font-black font-mono text-[#f1d483] tracking-[0.3em] mb-1">{{ shareModal.code }}</div>
          <div class="text-[#a6937c] text-xs">{{ shareModal.expiresAt }} 前有效</div>
          <button @click="copyCode" class="mt-2 text-xs text-[#a8f0c8] hover:text-white transition">📋 複製邀請碼</button>
        </div>
        <div>
          <p class="text-[#a6937c] text-sm font-bold mb-2">目前共享成員</p>
          <div v-if="shareModal.shareList.length === 0" class="text-[#6b5a4a] text-sm italic py-3 text-center">尚未分享給任何人</div>
          <div v-else class="space-y-2">
            <div v-for="m in shareModal.shareList" :key="m.googleId"
                 class="flex items-center justify-between bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2">
              <div>
                <span class="text-[#e0d3b8] text-sm font-bold">{{ m.name || m.email }}</span>
                <span class="ml-2 text-xs px-1.5 py-0.5 rounded"
                      :class="m.permission === 'edit' ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                  {{ m.permission === 'edit' ? '編輯' : '查看' }}
                </span>
              </div>
              <button @click="revokeShare(m.googleId)" class="text-xs text-[#f0a8a8] hover:text-red-400 transition">移除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 輸入邀請碼 Modal ══ -->
    <div v-if="showAcceptModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showAcceptModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 class="text-[#f1d483] font-bold text-lg mb-4">輸入邀請碼</h3>
        <input v-model="acceptCode" placeholder="輸入 6 碼邀請碼" maxlength="6"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-center text-2xl font-black font-mono text-[#f1d483] tracking-[0.3em] outline-none focus:border-[#f1d483] transition mb-3 uppercase" />
        <p v-if="acceptError" class="text-red-400 text-sm mb-3 text-center">{{ acceptError }}</p>
        <button @click="submitAccept" :disabled="acceptCode.length < 6 || isAccepting"
                class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
          {{ isAccepting ? '驗證中...' : '確認加入' }}
        </button>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'roz', middleware: 'roz-auth' });

import { ref, computed, watch, onMounted } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore  = useCommonStore();
const BASE_CLASSIC = () => commonStore.data.main_url + '/roz/classic';
const BASE_ACCOUNT = () => commonStore.data.main_url + '/roz/account';

const jobFileMap = { '祭師':'祭師','鐵匠':'鐵匠','騎士':'騎士','詩人':'詩人','刺客':'刺客','賢者':'賢者','巫師':'巫師','練金':'練金','十字軍':'十字軍','舞孃':'舞孃','武僧':'祭師','獵人':'詩人' };
const getJobImg  = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

const baseThemes = [
  { border: 'border-[#5b8fa4]', tagBg: '#5b8fa4' },
  { border: 'border-[#8fa45b]', tagBg: '#8fa45b' },
  { border: 'border-[#a47a5b]', tagBg: '#a47a5b' },
  { border: 'border-[#8e5ba4]', tagBg: '#8e5ba4' },
  { border: 'border-[#a45b5b]', tagBg: '#a45b5b' },
  { border: 'border-[#5ba48e]', tagBg: '#5ba48e' },
];
const getSquadColor      = (i) => baseThemes[i % baseThemes.length];
const getJobComposition  = (members) => {
  const map = {};
  members.forEach(m => { if (m.job) map[m.job] = (map[m.job] || 0) + 1; });
  return map;
};

// ── 狀態 ──────────────────────────────────────────────────────────
const loading        = ref(true);
const classics       = ref([]);
const allAccounts    = ref([]);
const activeId       = ref(null);
const activeDetail   = ref(null);
const detailLoading  = ref(false);
const isSaving       = ref(false);
const toast          = ref({ show: false, message: '' });
const charGroups     = ref([]);
const collapsedGroups = ref({});
const squadCount     = ref(4);

const showCreateModal   = ref(false);
const newName           = ref('');
const createError       = ref('');
const showDeleteConfirm = ref(false);
const renameModal       = ref({ show: false, name: '' });
const shareModal        = ref({ show: false, permission: 'view', generating: false, code: '', expiresAt: '', shareList: [] });
const showAcceptModal   = ref(false);
const acceptCode        = ref('');
const acceptError       = ref('');
const isAccepting       = ref(false);

// ── 計算 ──────────────────────────────────────────────────────────
const ownCount = computed(() => classics.value.filter(c => c.permission === 'owner').length);
const canEdit  = computed(() => activeDetail.value?.permission === 'owner' || activeDetail.value?.permission === 'edit');

// allChars：展開所有帳號的角色成一個陣列
const allChars = computed(() => charGroups.value.flatMap(g => g.roles));

const squads = computed(() => {
  const result = [];
  for (let i = 1; i <= squadCount.value; i++) {
    const assigned = allChars.value.filter(c => c.assignedTo === i);
    result.push({
      members:    assigned.filter(c => !c.isSupport),
      supporters: assigned.filter(c => c.isSupport),
    });
  }
  return result;
});

// ── 載入 ──────────────────────────────────────────────────────────
const loadAll = async () => {
  loading.value = true;
  try {
    const [classicsData, accountsData] = await Promise.all([
      (await fetch(`${BASE_CLASSIC()}/list`, { credentials: 'include' })).json(),
      (await fetch(`${BASE_ACCOUNT()}/list`, { credentials: 'include' })).json(),
    ]);
    classics.value    = Array.isArray(classicsData) ? classicsData : [];
    allAccounts.value = Array.isArray(accountsData) ? accountsData : [];
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const selectClassic = async (id) => {
  console.log('選擇: '+id)
  if (activeId.value === id) return;
  localStorage.setItem('roz_classic_last', id);
  activeId.value     = id;
  activeDetail.value = null;
  charGroups.value   = [];
  detailLoading.value = true;
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/${id}`, { credentials: 'include' })).json();
    activeDetail.value = data;
    squadCount.value   = data.squadCount || 4;
    buildCharGroups(data.assignments || []);
  } catch (e) { console.error(e); }
  finally { detailLoading.value = false; }
};

// ── 從 allAccounts 建立名冊，套用儲存的分配 ────────────────────────
const buildCharGroups = (assignments) => {
  charGroups.value = allAccounts.value.map((acc) => ({
    id:             acc.id,
    name:           acc.name,
    sharedFromName: acc.sharedFromName || '',
    roles: (acc.roles || [])
        .filter(r => r.name)                    // ← 用 r.name（新版 API 欄位）
        .map(r => {
          const saved = assignments.find(
              a => a.charName === r.name && a.accountId === acc.id
          );
          return {
            charName:      r.name,              // ← r.name 轉成 charName 供內部使用
            accountName:   acc.name,
            ownerGoogleId: acc.ownerGoogleId || '',
            accountId:     acc.id,
            job:           r.job   || '',
            level:         r.level || null,
            assignedTo:    saved?.assignedTo ?? null,
            isSupport:     saved?.isSupport  ?? false,
          };
        })
  }));
  // 預設全部收起
  charGroups.value.forEach((_, i) => { collapsedGroups.value[i] = true; });
};

// ── 名冊操作 ──────────────────────────────────────────────────────
const toggleGroup    = (idx) => { collapsedGroups.value[idx] = !collapsedGroups.value[idx]; };
const setAllCollapse = (v)   => { charGroups.value.forEach((_, i) => { collapsedGroups.value[i] = v; }); };

const toggleSupport = (char) => {
  char.isSupport = !char.isSupport;
  if (!char.isSupport) char.assignedTo = null;
  saveAssignments();
};

// 判斷同一帳號是否已有角色在某小隊（每帳號每小隊最多一個非BUFF角色）
const isAccountInSquad = (gIdx, sIdx) =>
    squads.value[sIdx].members.some(m =>
        charGroups.value[gIdx].roles.some(r => !r.isSupport && r.charName === m.charName)
    );

const getButtonClass = (sIdx, gIdx, isSupport) => {
  const theme = getSquadColor(sIdx);
  if (!isSupport && isAccountInSquad(gIdx, sIdx))
    return 'bg-[#dcd2bb] text-[#b4a992] cursor-not-allowed border-transparent';
  return `border-2 text-[#4a3728] hover:text-white transition`
      + ` border-current`; // 簡化：用 theme tagBg 內嵌 style 更好，這裡用預設樣式
};

const addToSquad = (char, sIdx, gIdx) => {
  if (!char.isSupport && isAccountInSquad(gIdx, sIdx)) return;
  char.assignedTo = sIdx + 1;
  saveAssignments();
};

const removeFromSquad = (member) => {
  const char = allChars.value.find(
      c => c.charName === member.charName && c.accountId === member.accountId
  );
  if (char) {
    char.assignedTo = null;
    saveAssignments();
  }
};

const resetAll = () => {
  allChars.value.forEach(c => {
    c.assignedTo = null;
    c.isSupport = false;
  });
  saveAssignments();
};

// ── 自動儲存（節流 500ms） ────────────────────────────────────────
let saveTimer = null;
const saveAssignments = () => {
  if (!canEdit.value || !activeId.value) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await fetch(`${BASE_CLASSIC()}/${activeId.value}/save`, {
        method: 'POST', credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          squadCount: squadCount.value,
          assignments: allChars.value.map(c => ({
            charName: c.charName,
            accountName: c.accountName,
            ownerGoogleId: c.ownerGoogleId,
            accountId: c.accountId,
            job: c.job,
            level: c.level,
            assignedTo: c.assignedTo ?? null,
            isSupport: c.isSupport ?? false,
          }))
        })
      });
    } catch (e) {
      console.error('儲存失敗:', e);
    }
  }, 500);
};

watch(squadCount, (newVal) => {
  allChars.value.forEach(c => {
    if (c.assignedTo > newVal) c.assignedTo = null;
  });
  saveAssignments();
});

// ── 建立 / 改名 / 刪除 ───────────────────────────────────────────
const createClassic = async () => {
  if (!newName.value.trim()) return;
  isSaving.value = true;
  createError.value = '';
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/create`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: newName.value.trim()})
    })).json();
    if (data.error) {
      createError.value = data.error;
      return;
    }
    showCreateModal.value = false;
    newName.value = '';
    await loadAll();
    showToast('分隊已建立');
    selectClassic(data.id);
  } catch {
    createError.value = '建立失敗';
  } finally {
    isSaving.value = false;
  }
};

const startRename = () => {
  renameModal.value = {show: true, name: activeDetail.value?.name || ''};
};
const submitRename = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/rename/${activeId.value}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: renameModal.value.name.trim()})
    })).json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    renameModal.value.show = false;
    if (activeDetail.value) activeDetail.value.name = renameModal.value.name.trim();
    classics.value = classics.value.map(c => c.id === activeId.value ? {...c, name: renameModal.value.name.trim()} : c);
    showToast('已改名');
  } catch {
    showToast('改名失敗');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};
const deleteClassic = async () => {
  isSaving.value = true;
  try {
    await fetch(`${BASE_CLASSIC()}/remove/${activeId.value}`, {method: 'DELETE', credentials: 'include'});
    showDeleteConfirm.value = false;
    activeId.value = null;
    activeDetail.value = null;
    charGroups.value = [];
    await loadAll();
    showToast('分隊已刪除');
  } catch {
    showToast('刪除失敗');
  } finally {
    isSaving.value = false;
  }
};

// ── 分享 ──────────────────────────────────────────────────────────
const openShareModal = async () => {
  shareModal.value = {show: true, permission: 'view', generating: false, code: '', expiresAt: '', shareList: []};
  await loadShareList();
};
const loadShareList = async () => {
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/share-list/${activeId.value}`, {credentials: 'include'})).json();
    shareModal.value.shareList = Array.isArray(data) ? data : [];
  } catch {
    shareModal.value.shareList = [];
  }
};
const generateInvite = async () => {
  shareModal.value.generating = true;
  shareModal.value.code = '';
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/share/${activeId.value}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({permission: shareModal.value.permission})
    })).json();
    if (data.error) {
      showToast(data.error);
      return;
    }
    shareModal.value.code = data.code;
    shareModal.value.expiresAt = data.expiresAt;
  } catch {
    showToast('產生失敗');
  } finally {
    shareModal.value.generating = false;
  }
};
const copyCode = () => {
  navigator.clipboard?.writeText(shareModal.value.code);
  showToast('邀請碼已複製');
};
const revokeShare = async (targetGoogleId) => {
  try {
    await fetch(`${BASE_CLASSIC()}/revoke-share/${activeId.value}/${targetGoogleId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    await loadShareList();
    showToast('已移除共享');
  } catch {
    showToast('移除失敗');
  }
};

const submitAccept = async () => {
  if (acceptCode.value.length < 6) return;
  isAccepting.value = true;
  acceptError.value = '';
  try {
    const data = await (await fetch(`${BASE_CLASSIC()}/accept-share`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code: acceptCode.value.toUpperCase()})
    })).json();
    if (data.error) {
      acceptError.value = data.error;
      return;
    }
    showAcceptModal.value = false;
    acceptCode.value = '';
    await loadAll();
    showToast(`已加入分隊「${data.name}」（${data.permission === 'edit' ? '編輯' : '查看'}權限）`);
  } catch {
    acceptError.value = '驗證失敗，請再試一次';
  } finally {
    isAccepting.value = false;
  }
};

// ── 工具 ──────────────────────────────────────────────────────────
const showToast = (msg) => {
  toast.value = {show: true, message: msg};
  setTimeout(() => {
    toast.value.show = false;
  }, 2500);
};

onMounted(async () => {
  document.title = '經典組隊';
  await loadAll();

  // 自動選取上次的分隊
  const lastId = localStorage.getItem('roz_classic_last');
  console.log('讀取: ' + lastId)
  if (lastId && classics.value.some(c => c.id === lastId)) {
    console.log('A')
    selectClassic(lastId);
  } else if (classics.value.length > 0) {
    console.log('B')
    selectClassic(classics.value[0].id);  // 沒有記錄就選第一個
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #2c1e14;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #5e4b37;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #8d7a64;
}

select option {
  background-color: #3d2b1f;
  color: #f1d483;
}
</style>