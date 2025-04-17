// Entry point (main logic)
import { initConsentFlow } from './modules/consentHandler.js';
import { initFormHandlers } from './modules/formHandler.js';
// import { getRandomExperiment } from './modules/mathUtils.js'; // Importeras i de moduler som behöver den
import { initUIFlow } from './modules/uiFlow.js';
import { initNudgeButtons } from './modules/nudges.js';
import { initEndStudyButtons } from './modules/navigationHandler.js'; // <-- NY IMPORT

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed. Initializing modules..."); // Bra för felsökning
  initConsentFlow();
  initFormHandlers(); // Denna initierar fortfarande logiken i formHandler.js
  initUIFlow();
  initNudgeButtons();
  initEndStudyButtons(); // <-- ANROPA DEN NYA FUNKTIONEN HÄR
  console.log("All modules initialized.");
});