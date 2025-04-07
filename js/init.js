// Entry point (main logic)
import { initConsentFlow } from './modules/consentHandler.js';
import { initFormHandlers } from './modules/formHandler.js';
import { getRandomExperiment } from './modules/mathUtils.js';
import { initUIFlow } from './modules/uiFlow.js';
import { initNudgeButtons } from './modules/nudges.js';

document.addEventListener('DOMContentLoaded', () => {
  initConsentFlow();
  initFormHandlers();
  initUIFlow();
  initNudgeButtons();
});
