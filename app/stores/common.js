import { defineStore } from 'pinia'

export const useCommonStore = defineStore('useFamilyStore', () => {
  // https://madustrialtd.asuscomm.com:9100
  // http://localhost:9100
  // https://madustrialtd.asuscomm.com:8080
  // https://madustrialtd.asuscomm.com:8080
  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:8080',
    roz_url:  'http://madustrialtd.asuscomm.com:4000',
  })

  const rozUser = reactive({ name: '', email: '', picture: '' })

  const setRozUser = (user) => {
    rozUser.name    = user?.name    ?? ''
    rozUser.email   = user?.email   ?? ''
    rozUser.picture = user?.picture ?? ''
  }

  const clearRozUser = () => {
    rozUser.name    = ''
    rozUser.email   = ''
    rozUser.picture = ''
  }

  return { data, rozUser, setRozUser, clearRozUser }
})