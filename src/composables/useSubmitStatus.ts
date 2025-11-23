import type { Ref } from 'vue'
import { getLeetcodeInfo } from '~/config/leetcode'

const { oldSubmitBtnSelector, newSubmitBtnSelector, rootSelectorId, newRootSelectorId } = getLeetcodeInfo()

export function useSubmitStatus() {
  // get submit button
  const submitBtnNode = ref<Element | null>(null)

  // Track both click and completion
  const isSubmitClicked = ref<boolean>(false)
  const isSubmitFinished = ref<boolean>(false)


  // Store the button observer so we can keep it running
  let buttonObserver: MutationObserver | null = null

  // Get submit button node and keep observing
  buttonObserver = getSubmitBtnNode(submitBtnNode)

  // CRITICAL FIX: Add event listener to the initial button immediately
  // The watch callback below won't trigger on initial assignment, only on changes
  if (submitBtnNode.value) {
    console.log('🎯 Initial submit button found, adding click listener')
    submitBtnNode.value.addEventListener('click', handleSubmitClick as EventListener)
  }

  // Watch for button node changes
  watch(submitBtnNode, (newNode, oldNode) => {
    // Remove old listeners
    if (oldNode) {
      oldNode.removeEventListener('click', handleSubmitClick as EventListener)
    }

    if (newNode) {
      console.log('🔄 Submit button node updated, rebinding event listener')
      // Add click event listener
      newNode.addEventListener('click', handleSubmitClick as EventListener)
    }
  })

  // Watch for submission completion to re-check button
  watch(isSubmitFinished, (finished) => {
    if (finished) {
      // After submission completes, re-check button in case it was re-rendered
      setTimeout(() => {
        const currentButton = getSubmitNode()
        if (currentButton && currentButton !== submitBtnNode.value) {
          console.log('🔄 Button was re-rendered, updating reference')
          submitBtnNode.value = currentButton
        }
      }, 500) // Small delay to allow DOM to settle
    }
  })

  // Handle submit button click
  function handleSubmitClick(event: Event) {
    const button = event.currentTarget as HTMLElement

    // Check if button is disabled
    if (button.classList.contains('cursor-not-allowed') || button.classList.contains('opacity-50')) {
      console.log('⚠️ Submit button is disabled, click ignored')
      return
    }

    console.log('✅ Submit button clicked!')
    isSubmitClicked.value = true

    // pretend submit finished after 1.5s
    setTimeout(() => {
      isSubmitClicked.value = false
      isSubmitFinished.value = true
    }, 1500)
  }

  const changeSubmitStatus = (status: boolean) => {
    isSubmitFinished.value = status
  }

  onUnmounted(() => {
    buttonObserver?.disconnect()
    // Clean up event listener
    if (submitBtnNode.value) {
      submitBtnNode.value.removeEventListener('click', handleSubmitClick as EventListener)
    }
  })

  return {
    isSubmitClicked,    // New: emits when button is clicked
    isSubmitFinished,   // Existing: emits when submission completes
    changeSubmitStatus,
  }
}

// Observer to watch for submission result appearing in DOM
export function getSubmitBtnNode(targetNode: Ref<Element | null>): MutationObserver {
  const rootSelector = newRootSelectorId

  const app = document.getElementById(rootSelector)
  const mutationObserver = new MutationObserver(observeCb)
  const observeConfig: MutationObserverInit = {
    childList: true,
    subtree: true,
  }

  function observeCb() {
    const newButton = getSubmitNode()
    // Only update if button actually changed (to avoid infinite loops)
    if (newButton && newButton !== targetNode.value) {
      console.log('🔍 Submit button detected/changed in DOM')
      targetNode.value = newButton
    }
  }

  // Initial check
  observeCb()

  // Keep observing (don't disconnect) to detect button re-renders
  mutationObserver.observe(app!, observeConfig)

  return mutationObserver
}

function getSubmitNode(): Element | null {
  // Try the new selector first (more specific with data-e2e-locator)
  const newButton = document.querySelector<Element>(newSubmitBtnSelector)
  if (newButton)
    return newButton

  // Fallback to old selector for backward compatibility
  return document.querySelector<Element>(oldSubmitBtnSelector)
}
