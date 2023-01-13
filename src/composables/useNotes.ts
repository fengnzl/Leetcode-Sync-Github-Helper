import type { Ref } from 'vue'
import { isNewUI } from '../config/leetcode'
import { getLeetcodeInfo } from '~/config/leetcode'

const { oldNotesSelector, rootSelectorId, newRootSelectorId }
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
  const isNew = isNewUI()
  const rootSelector = isNew ? newRootSelectorId : rootSelectorId

  const app = document.getElementById(rootSelector)
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  }
  function observeCb() {
    notesWrapperNode.value = getWrapperNode(isNew)
    if (notesWrapperNode.value)
      mutationObserver.disconnect()
  }
  mutationObserver.observe(app!, observeConfig)
}

function getWrapperNode(isNew: boolean): Element | null {
  if (!isNew)
    return document.querySelector<Element>(oldNotesSelector)
  return null
}

export function getChangedNotes(notesWrapperNode: Element, notesInfo: Ref<string>) {
  const isNew = isNewUI()
  const targetNode = isNew ? notesWrapperNode : notesWrapperNode
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    attributes: true,
    subtree: true,
    attributeOldValue: true,
    attributeFilter: ['status'],
  }
  function observeCb(mutations: MutationRecord[]) {
    const { oldValue } = mutations[0]
    if (isNew) {
      // TODO
    }
    else {
      // entered -> existed
      if (oldValue === 'entered')
        notesInfo.value = getNotesInfo(targetNode)
    }
  }
  mutationObserver.observe(targetNode, observeConfig)
  return mutationObserver
}

function getNotesInfo(targetNode: Element): string {
  return isNewUI() ? ' ' : getNotesInfoInOld(targetNode)
}

function getNotesInfoInOld(targetNode: Element): string {
  const notesDiv = targetNode
    .querySelector('.notewrap__eHkN')
    ?.querySelector('.CodeMirror-code')
  if (notesDiv) {
    return Array.from(notesDiv.childNodes).reduce((prev, cur) => {
      if (cur.childNodes.length === 0) {
        return prev
      }
      else {
        const notes = (cur.childNodes[0] as HTMLElement).innerText
        prev += `\n${notes.trim()}`
        return prev
      }
    }, '').trim()
  }
  else {
    return ''
  }
}
