<template>
  <div class="min-h-screen bg-[#2c1e14] text-[#e0d3b8] p-4 md:p-6 font-sans">

    <!-- Header -->
    <div class="max-w-[1500px] mx-auto mb-6 border-b border-[#5e4b37] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-[#f1d483]">帳號管理</h1>
        <p class="text-[#a6937c] text-sm mt-1">管理遊戲帳號與角色，可邀請他人共享帳號</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex bg-[#1e150d] border border-[#5e4b37] rounded-lg p-0.5">
          <button @click="setViewMode('list')" class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'list' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">☰ 列表</button>
          <button @click="setViewMode('card')" class="px-3 py-1.5 text-sm font-bold rounded-md transition"
                  :class="viewMode === 'card' ? 'bg-[#5e4b37] text-[#f1d483]' : 'text-[#a6937c] hover:text-[#e0d3b8]'">⊞ 卡片</button>
        </div>
        <button @click="showAcceptModal = true"
                class="bg-[#3d5a4a] hover:bg-[#4a6b5a] text-[#a8f0c8] px-4 py-2 rounded shadow-md transition font-bold border border-[#a8f0c8]/20 text-sm">
          🔗 輸入邀請碼
        </button>
        <button @click="startAddAccount"
                class="bg-[#4a7c59] hover:bg-[#3d6849] text-white px-6 py-2.5 rounded shadow-md transition font-bold border border-white/10 text-base">
          ＋ 新增帳號
        </button>
      </div>
    </div>

    <div v-if="loading" class="max-w-[1500px] mx-auto text-center py-20 text-[#a6937c] italic text-lg">讀取中...</div>

    <div v-else class="max-w-[1500px] mx-auto">

      <!-- ══ 新增帳號 inline ══ -->
      <div v-if="isAdding" class="bg-[#3d2b1f] border-2 border-[#4a7c59] rounded-xl overflow-hidden mb-4">
        <div class="bg-[#2c1e14] px-5 py-4 flex items-center gap-3 border-b border-[#5e4b37]">
          <span class="text-[#4a7c59] text-sm font-bold bg-[#1a3326] px-3 py-1 rounded shrink-0">新增</span>
          <input v-model="newAccount.name" placeholder="輸入帳號名稱" autofocus
                 @keydown.enter="focusFirstRole"
                 class="flex-1 bg-transparent text-[#e0d3b8] font-bold outline-none placeholder-[#5e4b37] text-base" />
          <div class="flex gap-2 shrink-0">
            <button @click="saveNewAccount" :disabled="isSaving"
                    class="text-sm bg-[#4a7c59] hover:bg-[#3d6849] text-white px-4 py-1.5 rounded transition font-bold disabled:opacity-50">
              {{ isSaving ? '儲存...' : '儲存' }}
            </button>
            <button @click="cancelAdd" class="text-sm text-[#a6937c] hover:text-[#f0a8a8] transition">取消</button>
          </div>
        </div>
        <div class="p-5 space-y-3">
          <div class="grid grid-cols-12 gap-3 text-xs text-[#a6937c] font-bold px-1 mb-1">
            <div class="col-span-1"></div><div class="col-span-3">角色名稱</div><div class="col-span-4">職業</div><div class="col-span-3">等級</div>
          </div>
          <div v-for="(role, rIdx) in newAccount.roles" :key="rIdx" class="grid grid-cols-12 gap-3 items-center">
            <div class="col-span-1 flex flex-col gap-0.5 items-center">
              <button @click="moveRoleRow(newAccount.roles, rIdx, -1)" :disabled="rIdx === 0"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button @click="moveRoleRow(newAccount.roles, rIdx, 1)" :disabled="rIdx === newAccount.roles.length - 1"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
            <div class="col-span-3">
              <input v-model="role.name" :ref="el => { if(rIdx===0) firstRoleInput = el }"
                     placeholder="角色名稱" @keydown.enter="addRoleRow(newAccount.roles)"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-4">
              <select v-model="role.job" class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                <option value="">選擇職業</option>
                <option v-for="j in jobList" :key="j" :value="j">{{ j }}</option>
              </select>
            </div>
            <div class="col-span-3">
              <input v-model.number="role.level" type="number" placeholder="等級" min="1" max="999"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-1 flex justify-center">
              <button @click="removeRoleRow(newAccount.roles, rIdx)" :disabled="newAccount.roles.length <= 1"
                      class="text-[#f0a8a8] hover:text-red-400 transition text-xl disabled:opacity-20">✕</button>
            </div>
          </div>
          <button @click="addRoleRow(newAccount.roles)" class="text-sm text-[#a6937c] hover:text-[#f1d483] transition mt-1">＋ 新增角色</button>
          <p v-if="formError" class="text-red-400 text-sm mt-2">{{ formError }}</p>
        </div>
      </div>

      <!-- ══ 編輯帳號 inline（跟新增同樣風格，顯示在列表上方） ══ -->
      <div v-if="editingAcc" class="bg-[#3d2b1f] border-2 border-[#f1d483]/50 rounded-xl overflow-hidden mb-4">
        <div class="bg-[#2c1e14] px-5 py-4 flex items-center gap-3 border-b border-[#5e4b37]">
          <span class="text-[#f1d483] text-sm font-bold bg-[#3a2e10] px-3 py-1 rounded shrink-0">編輯</span>
          <input v-model="editForm.name" placeholder="帳號名稱"
                 class="flex-1 bg-transparent text-[#e0d3b8] font-bold outline-none border-b border-[#f1d483]/40 text-base" />
          <div class="flex gap-2 shrink-0">
            <button @click="saveEdit" :disabled="isSaving"
                    class="text-sm bg-[#4a7c59] hover:bg-[#3d6849] text-white px-4 py-1.5 rounded transition font-bold disabled:opacity-50">
              {{ isSaving ? '儲存...' : '儲存' }}
            </button>
            <button @click="cancelEdit" class="text-sm text-[#a6937c] hover:text-[#e0d3b8] transition">取消</button>
          </div>
        </div>
        <div class="p-5 space-y-3">
          <div class="grid grid-cols-12 gap-3 text-xs text-[#a6937c] font-bold px-1 mb-1">
            <div class="col-span-1"></div><div class="col-span-3">角色名稱</div><div class="col-span-4">職業</div><div class="col-span-3">等級</div>
          </div>
          <div v-for="(role, rIdx) in editForm.roles" :key="rIdx" class="grid grid-cols-12 gap-3 items-center">
            <div class="col-span-1 flex flex-col gap-0.5 items-center">
              <button @click="moveRoleRow(editForm.roles, rIdx, -1)" :disabled="rIdx === 0"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
              </button>
              <button @click="moveRoleRow(editForm.roles, rIdx, 1)" :disabled="rIdx === editForm.roles.length - 1"
                      class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
              </button>
            </div>
            <div class="col-span-3">
              <input v-model="role.name" placeholder="角色名稱"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-4">
              <select v-model="role.job" class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] cursor-pointer transition">
                <option value="">選擇職業</option>
                <option v-for="j in jobList" :key="j" :value="j">{{ j }}</option>
              </select>
            </div>
            <div class="col-span-3">
              <input v-model.number="role.level" type="number" placeholder="等級" min="1" max="999"
                     class="w-full bg-[#2c1e14] border border-[#5e4b37] rounded px-3 py-2 text-base text-[#e0d3b8] outline-none focus:border-[#f1d483] transition" />
            </div>
            <div class="col-span-1 flex justify-center">
              <button @click="removeRoleRow(editForm.roles, rIdx)" :disabled="editForm.roles.length <= 1"
                      class="text-[#f0a8a8] hover:text-red-400 transition text-xl disabled:opacity-20">✕</button>
            </div>
          </div>
          <button @click="addRoleRow(editForm.roles)" class="text-sm text-[#a6937c] hover:text-[#f1d483] transition mt-1">＋ 新增角色</button>
          <p v-if="formError" class="text-red-400 text-sm mt-2">{{ formError }}</p>
        </div>
      </div>

      <!-- 空狀態 -->
      <div v-if="accounts.length === 0 && !isAdding"
           class="text-center py-20 text-[#a6937c] italic bg-[#3d2b1f] rounded-xl border border-[#5e4b37] text-base mb-4">
        尚未新增任何帳號，點右上角「新增帳號」開始
      </div>

      <!-- ══ 列表視圖 ══ -->
      <div v-if="viewMode === 'list'" class="space-y-3">
        <div v-for="(acc, aIdx) in accounts" :key="acc.id"
             class="bg-[#3d2b1f] border border-[#5e4b37] rounded-xl overflow-hidden transition-all"
             :class="editingAcc?.id === acc.id ? 'border-[#f1d483]/40' : 'hover:border-[#8b7a64]'">

          <!-- 標頭 -->
          <div class="bg-[#2c1e14] px-4 py-3 flex items-center justify-between border-b border-[#5e4b37] cursor-pointer hover:bg-[#251910] transition-colors"
               @click="toggleCollapse(acc.id)">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div v-if="acc.permission === 'owner'" class="flex flex-col gap-0.5 shrink-0" @click.stop>
                <button @click="moveAccount(aIdx, -1)" :disabled="aIdx === 0"
                        class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                </button>
                <button @click="moveAccount(aIdx, 1)" :disabled="aIdx === accounts.length - 1"
                        class="p-0.5 text-[#a6937c] hover:text-[#f1d483] disabled:opacity-20 transition leading-none">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>
              <span v-if="acc.permission === 'owner'" class="text-[#f1d483] text-xs font-bold bg-[#5e4b37] px-2.5 py-1 rounded shrink-0">帳號</span>
              <span v-else-if="acc.permission === 'edit'" class="text-[#a8f0c8] text-xs font-bold bg-[#2a4a3a] px-2.5 py-1 rounded shrink-0">共享·編輯</span>
              <span v-else class="text-[#a6c8f0] text-xs font-bold bg-[#2a3a4a] px-2.5 py-1 rounded shrink-0">共享·使用</span>
              <span class="text-[#e0d3b8] font-bold truncate text-base">{{ acc.name }}</span>
              <span class="text-[#a6937c] text-sm shrink-0">{{ acc.roles?.length || 0 }} 個角色</span>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-2" @click.stop>
              <button v-if="acc.permission === 'owner'" @click="openShareModal(acc)"
                      class="text-xs bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-3 py-1 rounded border border-[#a8c0f0]/20 transition">分享</button>
              <button v-if="acc.permission === 'owner' || acc.permission === 'edit'" @click="startEdit(acc)"
                      class="text-xs bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-3 py-1 rounded border border-[#a8f0c8]/20 transition">編輯</button>
              <button v-if="acc.permission === 'owner'" @click="confirmDelete(acc)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1 rounded border border-[#f0a8a8]/20 transition">刪除</button>
              <button v-if="acc.permission !== 'owner'" @click="confirmLeaveShare(acc)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-3 py-1 rounded border border-[#f0a8a8]/20 transition">退出</button>
              <span class="text-[#a6937c] text-sm transition-transform duration-300 select-none"
                    :class="collapsed[acc.id] ? '' : 'rotate-180'">▼</span>
            </div>
          </div>

          <!-- 角色列表 -->
          <div v-if="!collapsed[acc.id]" class="p-5">
            <div class="grid grid-cols-12 gap-3 text-xs text-[#a6937c] font-bold px-1 mb-3">
              <div class="col-span-1"></div>
              <div class="col-span-5">角色名稱</div>
              <div class="col-span-4">職業</div>
              <div class="col-span-2 text-right">等級</div>
            </div>
            <div v-for="role in acc.roles" :key="role.name"
                 class="grid grid-cols-12 gap-3 items-center py-3 border-b border-[#5e4b37]/40 last:border-0">
              <div class="col-span-1 flex justify-center">
                <div class="w-10 h-10 bg-[#2c1e14] rounded-full border border-[#5e4b37] flex items-center justify-center overflow-hidden">
                  <img :src="getJobImg(role.job)" class="w-7 h-7 object-contain">
                </div>
              </div>
              <div class="col-span-5 font-bold text-base text-[#e0d3b8]">{{ role.name }}</div>
              <div class="col-span-4 text-sm text-[#a6937c]">{{ role.job || '未設定' }}</div>
              <div class="col-span-2 text-right text-sm font-mono text-[#8d7a64]">{{ role.level ? `Lv.${role.level}` : '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 卡片視圖 ══ -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="acc in accounts" :key="acc.id"
             class="bg-[#3d2b1f] border border-[#5e4b37] rounded-2xl overflow-hidden shadow-lg transition-all hover:border-[#8b7a64]">
          <div class="bg-[#2c1e14] px-4 py-3 flex items-center justify-between border-b border-[#5e4b37]">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span v-if="acc.permission === 'owner'" class="text-[#f1d483] text-xs font-bold bg-[#5e4b37] px-2 py-0.5 rounded shrink-0">帳號</span>
              <span v-else class="text-[#a8f0c8] text-xs font-bold bg-[#2a4a3a] px-2 py-0.5 rounded shrink-0">共享</span>
              <span class="text-[#e0d3b8] font-black truncate text-base">{{ acc.name }}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 ml-2">
              <button v-if="acc.permission === 'owner'" @click="openShareModal(acc)"
                      class="text-xs bg-[#3d4a6b] hover:bg-[#4a5b8a] text-[#a8c0f0] px-2.5 py-1 rounded border border-[#a8c0f0]/20 transition">分享</button>
              <button v-if="acc.permission === 'owner' || acc.permission === 'edit'" @click="startEdit(acc)"
                      class="text-xs bg-[#4a6b5e] hover:bg-[#5b8573] text-[#a8f0c8] px-2.5 py-1 rounded border border-[#a8f0c8]/20 transition">編輯</button>
              <button v-if="acc.permission === 'owner'" @click="confirmDelete(acc)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-2.5 py-1 rounded border border-[#f0a8a8]/20 transition">刪除</button>
              <button v-if="acc.permission !== 'owner'" @click="confirmLeaveShare(acc)"
                      class="text-xs bg-[#6b4a4a] hover:bg-[#853b3b] text-[#f0a8a8] px-2.5 py-1 rounded border border-[#f0a8a8]/20 transition">退出</button>
            </div>
          </div>
          <div class="p-3 grid grid-cols-2 gap-2">
            <div v-for="role in acc.roles" :key="role.name"
                 class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl p-3 flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 bg-[#3d2b1f] rounded-full border-2 border-[#5e4b37] flex items-center justify-center overflow-hidden">
                <img :src="getJobImg(role.job)" class="w-10 h-10 object-contain">
              </div>
              <div class="text-center">
                <div class="font-black text-[#e0d3b8] text-sm leading-tight">{{ role.name }}</div>
                <div class="text-[10px] text-[#a6937c] mt-0.5">{{ role.job || '未設定' }}</div>
                <div v-if="role.level" class="text-[10px] font-mono text-[#8d7a64]">Lv.{{ role.level }}</div>
              </div>
            </div>
          </div>
          <div class="px-4 py-2 border-t border-[#5e4b37] text-xs text-[#a6937c] text-right">
            {{ acc.roles?.length || 0 }} 個角色
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 刪除確認 Modal ══ -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showDeleteConfirm = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認刪除帳號？</h3>
        <p class="text-[#a6937c] text-base mb-1">帳號：<span class="text-[#e0d3b8] font-bold">{{ deleteTarget?.name }}</span></p>
        <p class="text-[#a6937c] text-sm mb-5">此操作將永久刪除該帳號下所有角色，無法復原。</p>
        <div class="flex gap-3 justify-center">
          <button @click="showDeleteConfirm = false"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="deleteAccount" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 分享 Modal ══ -->
    <div v-if="shareModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="closeShareModal">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[#f1d483] font-bold text-lg">分享帳號：{{ shareModal.accName }}</h3>
          <button @click="closeShareModal" class="text-[#a6937c] hover:text-[#f0a8a8] text-xl leading-none">✕</button>
        </div>
        <div class="mb-5">
          <p class="text-[#a6937c] text-sm mb-3">選擇權限並產生邀請碼（24小時有效，一次性）</p>
          <div class="flex gap-2 mb-3">
            <button @click="shareModal.permission = 'use'"
                    class="flex-1 py-2 rounded border text-sm font-bold transition"
                    :class="shareModal.permission === 'use' ? 'bg-[#3d4a6b] border-[#a8c0f0] text-[#a8c0f0]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
              使用權限<br><span class="text-[10px] font-normal">可放入組隊，不能改角色</span>
            </button>
            <button @click="shareModal.permission = 'edit'"
                    class="flex-1 py-2 rounded border text-sm font-bold transition"
                    :class="shareModal.permission === 'edit' ? 'bg-[#2a4a3a] border-[#a8f0c8] text-[#a8f0c8]' : 'bg-[#3d2b1f] border-[#5e4b37] text-[#a6937c]'">
              編輯權限<br><span class="text-[10px] font-normal">可放入組隊＋修改角色</span>
            </button>
          </div>
          <button @click="generateInviteCode" :disabled="shareModal.generating"
                  class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
            {{ shareModal.generating ? '產生中...' : '產生邀請碼' }}
          </button>
          <div v-if="shareModal.code" class="mt-3 bg-[#3d2b1f] border border-[#5e4b37] rounded-lg p-3 text-center">
            <div class="text-3xl font-black font-mono text-[#f1d483] tracking-[0.3em] mb-1">{{ shareModal.code }}</div>
            <div class="text-[#a6937c] text-xs">{{ shareModal.expiresAt }} 前有效</div>
            <button @click="copyCode" class="mt-2 text-xs text-[#a8f0c8] hover:text-white transition">📋 複製邀請碼</button>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-[#a6937c] text-sm font-bold">目前共享成員</p>
            <button @click="loadShareList" class="text-xs text-[#a6937c] hover:text-[#f1d483] transition">↻ 重新整理</button>
          </div>
          <div v-if="shareModal.shareList.length === 0" class="text-[#6b5a4a] text-sm italic py-3 text-center">尚未分享給任何人</div>
          <div v-else class="space-y-2">
            <div v-for="member in shareModal.shareList" :key="member.googleId"
                 class="flex items-center justify-between bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-3 py-2">
              <div>
                <span class="text-[#e0d3b8] text-sm font-bold">{{ member.name || member.email }}</span>
                <span class="ml-2 text-xs px-1.5 py-0.5 rounded"
                      :class="member.permission === 'edit' ? 'bg-[#2a4a3a] text-[#a8f0c8]' : 'bg-[#2a3a4a] text-[#a8c0f0]'">
                  {{ member.permission === 'edit' ? '編輯' : '使用' }}
                </span>
              </div>
              <button @click="revokeShare(member.googleId)" class="text-xs text-[#f0a8a8] hover:text-red-400 transition">移除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ 退出共享確認 Modal ══ -->
    <div v-if="leaveTarget" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="leaveTarget = null">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div class="text-4xl mb-3">🚪</div>
        <h3 class="text-[#f1d483] font-bold text-xl mb-2">確認退出共享？</h3>
        <p class="text-[#a6937c] text-base mb-5">退出後將無法再存取帳號「<span class="text-[#e0d3b8] font-bold">{{ leaveTarget?.name }}</span>」。</p>
        <div class="flex gap-3 justify-center">
          <button @click="leaveTarget = null"
                  class="px-5 py-2 bg-[#3d2b1f] hover:bg-[#5e4b37] text-[#a6937c] rounded border border-[#5e4b37] transition font-bold">取消</button>
          <button @click="leaveShare" :disabled="isSaving"
                  class="px-5 py-2 bg-[#8b3a3a] hover:bg-[#a04040] text-white rounded transition font-bold disabled:opacity-50">
            {{ isSaving ? '退出中...' : '確認退出' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 輸入邀請碼 Modal ══ -->
    <div v-if="showAcceptModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="showAcceptModal = false">
      <div class="bg-[#2c1e14] border border-[#5e4b37] rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[#f1d483] font-bold text-lg">輸入邀請碼</h3>
          <button @click="showAcceptModal = false" class="text-[#a6937c] hover:text-[#f0a8a8] text-xl leading-none">✕</button>
        </div>
        <input v-model="acceptCode" placeholder="輸入 6 碼邀請碼" maxlength="6"
               class="w-full bg-[#3d2b1f] border border-[#5e4b37] rounded-lg px-4 py-3 text-center text-2xl font-black font-mono text-[#f1d483] tracking-[0.3em] outline-none focus:border-[#f1d483] transition mb-3 uppercase" />
        <p v-if="acceptError" class="text-red-400 text-sm mb-3 text-center">{{ acceptError }}</p>
        <button @click="submitAcceptCode" :disabled="acceptCode.length < 6 || isAccepting"
                class="w-full py-2 bg-[#4a7c59] hover:bg-[#3d6849] text-white rounded font-bold transition disabled:opacity-50">
          {{ isAccepting ? '驗證中...' : '確認加入' }}
        </button>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show"
           class="fixed bottom-6 right-6 bg-[#3d2b1f] border border-[#5e4b37] text-[#e0d3b8] text-base px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50">
        <span class="text-green-400">✔</span> {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'roz');

import { ref, onMounted } from 'vue';
import { useCommonStore } from '~/stores/common.js';

const commonStore = useCommonStore();
const BASE = () => commonStore.data.main_url + '/roz/account';

const jobList = ['祭師', '鐵匠', '騎士', '詩人', '刺客', '賢者', '巫師', '練金', '十字軍', '舞孃', '武僧', '獵人', '流氓'];
const jobFileMap = { '祭師':'祭師','鐵匠':'鐵匠','騎士':'騎士','詩人':'詩人','刺客':'刺客','賢者':'賢者','巫師':'巫師','練金':'練金','十字軍':'十字軍','舞孃':'舞孃','武僧':'祭師','獵人':'詩人','流氓':'流氓' };
const getJobImg = (job) => `/images/profession/role/${jobFileMap[job] || '詩人'}.png`;

// ── 狀態 ──────────────────────────────────────────────────────────
const loading           = ref(true);
const accounts          = ref([]);
const collapsed         = ref({});
const viewMode          = ref('list');
const isAdding          = ref(false);
const editingAcc        = ref(null);   // 改成存整個 acc 物件，不用 id 比對
const isSaving          = ref(false);
const formError         = ref('');
const showDeleteConfirm = ref(false);
const deleteTarget      = ref(null);
const toast             = ref({ show: false, message: '' });
const firstRoleInput    = ref(null);
const newAccount        = ref({ name: '', roles: [{ name: '', job: '', level: null }] });
const editForm          = ref({ name: '', roles: [] });

// 分享
const shareModal = ref({ show: false, accId: '', accName: '', permission: 'use', generating: false, code: '', expiresAt: '', shareList: [] });
const showAcceptModal = ref(false);
const acceptCode      = ref('');
const acceptError     = ref('');
const isAccepting     = ref(false);

// ── 視圖模式 ──────────────────────────────────────────────────────
const VIEW_KEY = 'roz_accounts_view';
const setViewMode = (mode) => { viewMode.value = mode; if (import.meta.client) localStorage.setItem(VIEW_KEY, mode); };
const toggleCollapse = (id) => { collapsed.value = { ...collapsed.value, [id]: !collapsed.value[id] }; };

// ── 載入 ──────────────────────────────────────────────────────────
const loadAccounts = async () => {
  loading.value = true;
  try {
    const data = await (await fetch(`${BASE()}/list`, { credentials: 'include' })).json();
    accounts.value = Array.isArray(data) ? data : [];
    accounts.value.forEach(a => {
      if (collapsed.value[a.id] === undefined) collapsed.value[a.id] = true;
    });
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

// ── 排序 ──────────────────────────────────────────────────────────
const moveAccount = async (idx, dir) => {
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= accounts.value.length) return;
  const arr = [...accounts.value];
  [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
  accounts.value = arr;
  try {
    await fetch(`${BASE()}/reorder`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: arr.filter(a => a.permission === 'owner').map(a => a.id) })
    });
  } catch (e) { console.error('排序同步失敗:', e); }
};

// ── 新增 ──────────────────────────────────────────────────────────
const startAddAccount = () => {
  cancelEdit();
  newAccount.value = { name: '', roles: [{ name: '', job: '', level: null }] };
  formError.value = '';
  isAdding.value = true;
};
const focusFirstRole = () => { firstRoleInput.value?.focus(); };
const saveNewAccount = async () => {
  if (!newAccount.value.name.trim()) { formError.value = '請輸入帳號名稱'; return; }
  if (!newAccount.value.roles.some(r => r.name.trim())) { formError.value = '請至少輸入一個角色名稱'; return; }
  isSaving.value = true;
  try {
    const payload = {
      name: newAccount.value.name.trim(),
      roles: newAccount.value.roles.filter(r => r.name.trim()).map(r => ({ name: r.name.trim(), job: r.job || '', level: r.level || null }))
    };
    const data = await (await fetch(`${BASE()}/add`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })).json();
    if (data.error) { formError.value = data.error; return; }
    isAdding.value = false;
    await loadAccounts();
    showToast('帳號已新增');
  } catch { formError.value = '儲存失敗'; }
  finally { isSaving.value = false; }
};
const cancelAdd = () => { isAdding.value = false; formError.value = ''; };

// ── 編輯（改成跟新增一樣，頂部展開區塊）────────────────────────────
const startEdit = (acc) => {
  cancelAdd();
  formError.value = '';
  editForm.value = {
    name: acc.name,
    roles: (acc.roles || []).map(r => ({name: r.name, job: r.job || '', level: r.level || null}))
  };
  editingAcc.value = acc;  // 存整個 acc，不用 id 比對
};
const saveEdit = async () => {
  if (!editForm.value.name.trim()) {
    formError.value = '請輸入帳號名稱';
    return;
  }
  isSaving.value = true;
  try {
    const payload = {
      name: editForm.value.name.trim(),
      roles: editForm.value.roles.filter(r => r.name.trim()).map(r => ({
        name: r.name.trim(),
        job: r.job || '',
        level: r.level || null
      }))
    };
    const data = await (await fetch(`${BASE()}/update/${editingAcc.value.id}`, {
      method: 'POST', credentials: 'include',
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
    })).json();
    if (data.error) {
      formError.value = data.error;
      return;
    }
    editingAcc.value = null;
    await loadAccounts();
    showToast('帳號已更新');
  } catch {
    formError.value = '儲存失敗';
  } finally {
    isSaving.value = false;
  }
};
const cancelEdit = () => {
  editingAcc.value = null;
  formError.value = '';
};

// ── 刪除 ──────────────────────────────────────────────────────────
const confirmDelete = (acc) => {
  deleteTarget.value = acc;
  showDeleteConfirm.value = true;
};
const deleteAccount = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(`${BASE()}/remove/${deleteTarget.value.id}`, {
      method: 'DELETE', credentials: 'include'
    })).json();
    if (data.error) throw new Error(data.error);
    showDeleteConfirm.value = false;
    deleteTarget.value = null;
    await loadAccounts();
    showToast('帳號已刪除');
  } catch (e) {
    console.error(e);
  } finally {
    isSaving.value = false;
  }
};

// ── 退出共享 ──────────────────────────────────────────────────────
const leaveTarget = ref(null);
const confirmLeaveShare = (acc) => { leaveTarget.value = acc; };
const leaveShare = async () => {
  isSaving.value = true;
  try {
    const data = await (await fetch(
        `${BASE()}/leave-share/${leaveTarget.value.ownerGoogleId}/${leaveTarget.value.id}`,
        { method: 'DELETE', credentials: 'include' }
    )).json();
    if (data.error) { showToast(data.error); return; }
    leaveTarget.value = null;
    await loadAccounts();
    showToast('已退出共享');
  } catch { showToast('退出失敗'); }
  finally { isSaving.value = false; }
};

// ── 分享 ──────────────────────────────────────────────────────────
const openShareModal = async (acc) => {
  shareModal.value = {
    show: true,
    accId: acc.id,
    accName: acc.name,
    permission: 'use',
    generating: false,
    code: '',
    expiresAt: '',
    shareList: []
  };
  await loadShareList();
};
const closeShareModal = () => {
  shareModal.value.show = false;
};
const loadShareList = async () => {
  try {
    const data = await (await fetch(`${BASE()}/share-list/${shareModal.value.accId}`, {credentials: 'include'})).json();
    shareModal.value.shareList = Array.isArray(data) ? data : [];
  } catch {
    shareModal.value.shareList = [];
  }
};
const generateInviteCode = async () => {
  shareModal.value.generating = true;
  shareModal.value.code = '';
  try {
    const data = await (await fetch(`${BASE()}/share/${shareModal.value.accId}`, {
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
    await fetch(`${BASE()}/revoke-share/${shareModal.value.accId}/${targetGoogleId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    await loadShareList();
    showToast('已移除共享');
  } catch {
    showToast('移除失敗');
  }
};

// ── 接受邀請碼 ────────────────────────────────────────────────────
const submitAcceptCode = async () => {
  if (acceptCode.value.length < 6) return;
  isAccepting.value = true;
  acceptError.value = '';
  try {
    const data = await (await fetch(`${BASE()}/accept-share`, {
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
    await loadAccounts();
    showToast(`已加入帳號「${data.accountName}」（${data.permission === 'edit' ? '編輯' : '使用'}權限）`);
  } catch {
    acceptError.value = '驗證失敗，請再試一次';
  } finally {
    isAccepting.value = false;
  }
};

// ── 工具 ──────────────────────────────────────────────────────────
const addRoleRow = (roles) => roles.push({name: '', job: '', level: null});
const moveRoleRow = (roles, idx, dir) => {
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= roles.length) return;
  [roles[idx], roles[swapIdx]] = [roles[swapIdx], roles[idx]];
};
const removeRoleRow = (roles, idx) => {
  if (roles.length > 1) roles.splice(idx, 1);
};
const showToast = (msg) => {
  toast.value = {show: true, message: msg};
  setTimeout(() => {
    toast.value.show = false;
  }, 2500);
};

onMounted(() => {
  document.title = '帳號管理';
  const saved = localStorage.getItem(VIEW_KEY);
  if (saved) viewMode.value = saved;
  loadAccounts();
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

select option {
  background-color: #2c1e14;
  color: #e0d3b8;
}
</style>