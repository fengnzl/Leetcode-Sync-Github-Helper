import { tabs } from 'webextension-polyfill'

// https://stackoverflow.com/questions/4619219/chrome-tab-extensions-getcurrent-vs-getselected
// getCurrentTab should be used only inside extension's own pages (options.html for example)
export const getInsideCurrentTab = async () => await tabs.getCurrent()
export const removeInsideCurrentTab = () =>
  getInsideCurrentTab().then(tab => tabs.remove(tab.id!))

export const getActiveCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await tabs.query(queryOptions)
  return tab
}

export const removeActiveCurrentTab = () => getActiveCurrentTab().then(tab => tabs.remove(tab.id!))
