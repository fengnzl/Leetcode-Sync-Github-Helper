import type { Ref } from 'vue'
import { getLeetcodeInfo } from '~/config/leetcode'

const { newRootSelectorId }
  = getLeetcodeInfo()
export function useNotes() {
  // get notes wrapper
  const notesWrapperNode = ref<Element | null>(null)
  // add notes listener
  const notesInfo = ref('')
  const notesInfoObserve = ref<MutationObserver | null>(null)
  getNotesWrapperNode(notesWrapperNode)
  watch(notesWrapperNode, (newNode) => {
    if (newNode) {
      notesInfoObserve.value = getChangedNotes(
        notesWrapperNode.value!,
        notesInfo,
      )
    }
  })

  onUnmounted(() => {
    notesInfoObserve.value?.disconnect()
  })
  return {
    notesInfo,
  }
}

export function getNotesWrapperNode(notesWrapperNode: Ref<Element | null>) {
  const rootSelector = newRootSelectorId

  const app = document.getElementById(rootSelector)
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  }
  function observeCb() {
    notesWrapperNode.value = getWrapperNode()
    if (notesWrapperNode.value)
      mutationObserver.disconnect()
  }
  mutationObserver.observe(app!, observeConfig)
}

function getWrapperNode(): Element | null {
  return null
}

export function getChangedNotes(notesWrapperNode: Element, notesInfo: Ref<string>) {
  const targetNode = notesWrapperNode
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    attributes: true,
    subtree: true,
    attributeOldValue: true,
    attributeFilter: ['status'],
  }
  function observeCb(mutations: MutationRecord[]) {
  }
  mutationObserver.observe(targetNode, observeConfig)
  return mutationObserver
}
