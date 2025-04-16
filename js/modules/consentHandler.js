// ./modules/consentHandler.js (Updated)

/**
 * Generates a unique participant ID.
 * Example format: P_2024_04_16_XYZ123
 * @returns {string} A unique participant ID.
 */
function generateParticipantId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    // Generate a random alphanumeric string (simple example)
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `P_${year}_${month}_${day}_${randomPart}`;
}

export function initConsentFlow() {
    const consentCheckbox = document.getElementById('consent');
    const startStudyButton = document.getElementById('startStudyButton');

    // Check if we are on the welcome page
    if (consentCheckbox && startStudyButton) {
        // Disable button initially based on checkbox state
        startStudyButton.disabled = !consentCheckbox.checked;

        consentCheckbox.addEventListener('change', () => {
            startStudyButton.disabled = !consentCheckbox.checked;
        });

        startStudyButton.addEventListener('click', () => {
            if (consentCheckbox.checked) {
                // --- NEW: Generate and store Participant ID ---
                let participantId = localStorage.getItem('participantId');
                if (!participantId) {
                    participantId = generateParticipantId();
                    localStorage.setItem('participantId', participantId);
                    console.log('Generated and stored new participant ID:', participantId);
                    // Optional: Initial backend registration call (if needed)
                    // fetch('/api/register-participant', { /* ... */ }).catch(/* ... */);
                } else {
                    console.log('Using existing participant ID:', participantId);
                }
                // --- End of NEW ---

                // Redirect to the next step
                window.location.href = 'questionnaire.html';
            }
        });
    }
}