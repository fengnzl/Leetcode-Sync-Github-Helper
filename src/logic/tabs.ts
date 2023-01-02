import { tabs } from 'webextension-polyfill'

export const getCurrentTab = async () => await tabs.getCurrent()
export const removeCurrentTab = () => getCurrentTab().then(tab => tabs.remove(tab.id!))

