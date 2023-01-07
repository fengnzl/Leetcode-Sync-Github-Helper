import type { Ref } from 'vue'
import { getLeetcodeInfo } from '~/config/leetcode'

const { submitBtnSelector, rootSelectorId, newRootSelectorId } = getLeetcodeInfo()
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
  const app = document.getElementById(rootSelectorId) || document.getElementById(newRootSelectorId)
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  }
  function observeCb() {
    targetNode.value = document.querySelector<Element>(submitBtnSelector)
    if (targetNode.value)
      mutationObserver.disconnect()
  }
  mutationObserver.observe(app!, observeConfig)
}

export function getSubmitStatus(
  submitBtn: Element,
  isSubmitFinished: Ref<boolean>,
) {
  const targetNode = submitBtn.querySelector('span')!
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    attributes: true,
    subtree: true,
    attributeOldValue: true,
    attributeFilter: ['disabled'],
  }
  function observeCb(mutations: MutationRecord[]) {
    const { oldValue } = mutations[0]
    const curVal = targetNode.getAttribute('disabled')
    isSubmitFinished.value
      = (oldValue === '' || oldValue === 'true') && curVal === null
  }
  mutationObserver.observe(targetNode, observeConfig)
  return mutationObserver
}

