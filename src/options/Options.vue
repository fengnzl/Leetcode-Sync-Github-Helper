<script setup lang="ts">
import 'uno.css'
import { clearStorage, gihubUserNameStorage, githubRepoNameStorage, leetcodeSyncToken } from '../logic/storage'
import { useCreateRepository } from '~/composables/useCreateRepository'
import { PickOptions } from '~/Types/options'
import { useAttatchRepository } from '~/composables/useAttatchRepository'

const pickOption = ref<PickOptions>(PickOptions.none)
const options = [
  {
    value: PickOptions.public,
    label: 'Create a new public repository',
    icon: '🌍',
    desc: 'Anyone can see this repository',
  },
  {
    value: PickOptions.private,
    label: 'Create a new private repository',
    icon: '🔒',
    desc: 'You choose who can see this',
  },
  {
    value: PickOptions.attatch,
    label: 'Attach an existing repository',
    icon: '🔗',
    desc: 'Connect to your existing repo',
  },
]
const repoName = ref<string>('')
const errorMsg = ref<string>('')
const btnLoading = ref(false)

function checkValid(): boolean {
  const msg = []
  if (!pickOption.value)
    msg.push('Please pick an option')
  if (!repoName.value)
    msg.push('Please fill the repository name')

  errorMsg.value = msg.join(' and ')
  return msg.length === 0
}

const handleStarted = async () => {
  if (checkValid()) {
    const isAttatch = pickOption.value === PickOptions.attatch
    if (isAttatch && !gihubUserNameStorage.value) {
      leetcodeSyncToken.value = ''
      errorMsg.value = 'Authenticate error, Please authenticate first (left click the extension to processed)!'
      return
    }
    btnLoading.value = true
    const { data, message, isSuccess, isFetching } = isAttatch
      ? await useAttatchRepository(`${gihubUserNameStorage.value}/${repoName.value}`)
      : await useCreateRepository({
        name: repoName.value,
        private: pickOption.value === PickOptions.private,
      })

    errorMsg.value = message
    btnLoading.value = isFetching.value
    if (isSuccess)
      githubRepoNameStorage.value = data.value!.full_name
  }
}
const hasAttatched = computed(() => !!githubRepoNameStorage.value)
</script>

<template>
  <main class="modern-container">
    <!-- Animated gradient background -->
    <div class="animated-bg" />

    <!-- Floating particles -->
    <div class="particles">
      <div class="particle" />
      <div class="particle" />
      <div class="particle" />
    </div>

    <!-- Main content -->
    <div class="glass-card">
      <!-- Logo section with glow -->
      <div class="logo-section">
        <div class="icon-wrapper">
          <img src="/assets/icon.svg" class="floating-icon" alt="extension icon">
        </div>
        <h1 class="gradient-text">
          Leetcode Sync GitHub Helper
        </h1>
        <p class="subtitle">
          Automatically sync your LeetCode submissions to GitHub
        </p>
      </div>

      <!-- Setup form -->
      <template v-if="!hasAttatched">
        <div class="form-section">
          <h2 class="section-title">
            Choose Your Setup
          </h2>

          <!-- Option cards (radio buttons) -->
          <div class="option-cards">
            <div
              v-for="item in options"
              :key="item.value"
              class="option-card"
              :class="{ active: pickOption === item.value }"
              @click="pickOption = item.value"
            >
              <div class="option-icon">
                {{ item.icon }}
              </div>
              <div class="option-content">
                <h3>{{ item.label }}</h3>
                <p>{{ item.desc }}</p>
              </div>
              <div class="option-check">
                <div class="checkmark" />
              </div>
            </div>
          </div>

          <!-- Repository name input -->
          <div class="input-section">
            <label class="input-label">Repository Name</label>
            <el-input
              v-model="repoName"
              class="modern-input"
              placeholder="e.g., leetcode-solutions"
              size="large"
            >
              <template #prefix>
                <span class="input-icon">📁</span>
              </template>
            </el-input>
          </div>

          <!-- Error message with animation -->
          <transition name="slide-down">
            <div v-if="errorMsg" class="error-message">
              <span class="error-icon">⚠️</span>
              <span v-html="errorMsg" />
            </div>
          </transition>

          <!-- Get started button -->
          <button
            class="gradient-btn"
            :class="{ loading: btnLoading }"
            :disabled="btnLoading"
            @click="handleStarted"
          >
            <span v-if="!btnLoading">Get Started</span>
            <span v-else>Setting up...</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </template>

      <!-- Success state -->
      <div v-else class="success-section">
        <div class="success-header">
          <div class="success-icon">
            ✓
          </div>
          <h2>Successfully Connected!</h2>
          <p>Your LeetCode solutions are now syncing to GitHub</p>
        </div>

        <ProblemSolved count-size="26px" class="stats-card" total-size="30px" />

        <div class="unlink-section">
          <p class="unlink-text">
            Connected to the wrong repository?
          </p>
          <button class="unlink-btn" @click="clearStorage">
            <span>Unlink Repository</span>
            <span class="unlink-icon">🔓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span>Powered by Vite</span>
      <pixelarticons-zap class="footer-icon" />
    </footer>
  </main>
</template>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

/* Main container */
.modern-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

/* Animated gradient background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #667eea);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: -2;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Floating particles */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

.particle:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: 5s;
}

.particle:nth-child(3) {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-30px) translateX(20px);
  }
  50% {
    transform: translateY(-60px) translateX(-20px);
  }
  75% {
    transform: translateY(-30px) translateX(-40px);
  }
}

/* Glassmorphic card */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 80px rgba(102, 126, 234, 0.15);
  animation: fadeIn 0.8s ease;
  position: relative;
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo section */
.logo-section {
  text-align: center;
  margin-bottom: 3rem;
}

.icon-wrapper {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.floating-icon {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.6));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

.gradient-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

/* Form section */
.form-section {
  width: 100%;
}

.section-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

/* Option cards */
.option-cards {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(240, 147, 251, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.option-card:hover {
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.option-card:hover::before {
  opacity: 1;
}

.option-card.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

.option-card.active::before {
  opacity: 1;
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
  z-index: 1;
}

.option-content {
  flex: 1;
  z-index: 1;
}

.option-content h3 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.option-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
}

.option-check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1;
}

.option-card.active .option-check {
  background: #667eea;
  border-color: #667eea;
}

.checkmark {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.option-card.active .checkmark {
  transform: scale(1);
}

/* Input section */
.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.input-icon {
  font-size: 1.2rem;
}

/* Modern input styling - Override Element Plus */
:deep(.modern-input) {
  --el-input-bg-color: rgba(255, 255, 255, 0.08);
  --el-input-border-color: rgba(255, 255, 255, 0.2);
  --el-input-hover-border-color: rgba(102, 126, 234, 0.5);
  --el-input-focus-border-color: #667eea;
  --el-input-text-color: white;
  --el-input-placeholder-color: rgba(255, 255, 255, 0.5);
}

:deep(.modern-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

:deep(.modern-input .el-input__wrapper:hover) {
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

:deep(.modern-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
}

:deep(.modern-input .el-input__inner) {
  color: white;
  font-size: 1rem;
}

/* Error message */
.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  color: #fca5a5;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Gradient button */
.gradient-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.gradient-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.gradient-btn:hover::before {
  left: 100%;
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.gradient-btn:active {
  transform: translateY(0);
}

.gradient-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.gradient-btn.loading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.btn-arrow {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.gradient-btn:hover .btn-arrow {
  transform: translateX(5px);
}

/* Success section */
.success-section {
  text-align: center;
}

.success-header {
  margin-bottom: 2rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin: 0 auto 1.5rem;
  animation: successPop 0.6s ease;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-header h2 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.success-header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0;
}

.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
}

.unlink-section {
  margin-top: 2rem;
}

.unlink-text {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.unlink-btn {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: #fca5a5;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.unlink-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.unlink-icon {
  font-size: 1.25rem;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
}

.footer-icon {
  color: #fbbf24;
  animation: zap 2s ease-in-out infinite;
}

@keyframes zap {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .modern-container {
    padding: 1rem;
  }

  .glass-card {
    padding: 2rem 1.5rem;
  }

  .gradient-text {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .option-card {
    padding: 1rem;
  }

  .option-icon {
    font-size: 1.5rem;
  }

  .option-content h3 {
    font-size: 1rem;
  }

  .option-content p {
    font-size: 0.85rem;
  }
}
</style>
