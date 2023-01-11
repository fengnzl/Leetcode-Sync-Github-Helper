import type { Ref } from 'vue'
import { isNewUI } from '../config/leetcode'
import { getLeetcodeInfo } from '~/config/leetcode'

const { oldSubmitBtnSelector, newSubmitBtnSelector, rootSelectorId, newRootSelectorId } = getLeetcodeInfo()
export function useSubmitStatus() {
  // get submit button
  const submitBtnNode = ref<Element | null>(null)
  // add submit btn click listener
  const isSubmitFinished = ref<boolean>(false)
  const submitStautsObserve = ref<MutationObserver | null>(null)
  getSubmitBtnNode(submitBtnNode)
  watch(submitBtnNode, (newNode) => {
    if (newNode) {
      submitStautsObserve.value = getSubmitStatus(
        submitBtnNode.value!,
        isSubmitFinished,
      )
    }
  })
  const changeSubmitStatus = (status: boolean) => {
    isSubmitFinished.value = status
  }

  onUnmounted(() => {
    submitStautsObserve.value?.disconnect()
  })
  return {
    isSubmitFinished,
    changeSubmitStatus,
  }
}

export function getSubmitBtnNode(targetNode: Ref<Element | null>) {
  const isNew = isNewUI()
  const rootSelector = isNew ? newRootSelectorId : rootSelectorId

  const app
    = document.getElementById(rootSelector)
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  }
  function observeCb() {
    targetNode.value = getSubmitNode(isNew)
    if (targetNode.value)
      mutationObserver.disconnect()
  }
  mutationObserver.observe(app!, observeConfig)
}

function getSubmitNode(isNew: boolean): Element | null {
  if (!isNew)
    return document.querySelector<Element>(oldSubmitBtnSelector)
  const buttons = document.querySelectorAll(newSubmitBtnSelector)
  if (!buttons.length)
    return null
  return Array.from(buttons).find(item => item.textContent === 'Submit') || null
}

export function getSubmitStatus(
  submitBtn: Element,
  isSubmitFinished: Ref<boolean>,
) {
  const isNew = isNewUI()
  const targetNode = isNew ? submitBtn : submitBtn.querySelector('span')!
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    attributes: true,
    subtree: true,
    attributeOldValue: true,
    attributeFilter: ['disabled', 'class'],
  }
  function observeCb(mutations: MutationRecord[]) {
    const { oldValue } = mutations[0]
    if (isNew) {
      const prevDisabled = oldValue?.includes('cursor-not-allowed') || false
      isSubmitFinished.value
        = prevDisabled && !targetNode.className.includes('cursor-not-allowed')
    }
    else {
      const curVal = targetNode.getAttribute('disabled')
      isSubmitFinished.value
        = (oldValue === '' || oldValue === 'true') && curVal === null
    }
  }
  mutationObserver.observe(targetNode, observeConfig)
  return mutationObserver
}

