// ./modules/formHandler.js (Updated with fetch)

// Import needed dependencies
import { getRandomExperiment } from './mathUtils.js';

/**
 * Retrieves the participant ID from localStorage.
 * Shows an alert and returns null if not found.
 * @returns {string|null} The participant ID or null.
 */
function getParticipantId() {
    const id = localStorage.getItem('participantId');
    if (!id) {
        console.error("Participant ID not found in localStorage!");
        alert('Ett kritiskt fel uppstod: Deltagar-ID saknas. Kan inte fortsätta. Prova att gå tillbaka till startsidan.');
    }
    return id;
}

// --- Updated function for questionnaire form ---
function handleQuestionnaireForm() {
    const form = document.getElementById('questionnaireForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = Object.fromEntries(new FormData(form).entries());

        const participantId = getParticipantId();
        if (!participantId) return; // Stop if ID is missing

        console.log('Questionnaire data collected:', formData);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sparar...';
        }

        try {
            // *** Replace simulation with fetch ***
            const response = await fetch('/api/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantId,
                    formType: 'questionnaire',
                    data: formData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            console.log("Questionnaire data submitted successfully.");
            // On success, proceed to experiment
            //const experimentPage = getRandomExperiment();
            //window.location.href = experimentPage;
            window.location.href = 'experiment4.html'; // For testing purposes
            

        } catch (error) {
            console.error('Fel vid sändning av enkät:', error);
            alert('Kunde inte spara enkätsvaren. Kontrollera din anslutning och försök igen.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök igen'; // Or original text
            }
        }
    });
}

// --- Updated function for comment form ---
function handleCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = Object.fromEntries(new FormData(form).entries());

        const participantId = getParticipantId();
        if (!participantId) return; // Stop if ID is missing

        console.log('Comment data collected:', formData);
        const comment = formData['comment_text']?.trim();
        if (!comment) {
            alert('Kommentaren får inte vara tom.');
            console.log('Tom kommentar, skickar inte.');
            return; // Avbryt om kommentaren är tom
        }

        // Add experiment identifier
        const pageFilename = window.location.pathname.split('/').pop();
        formData.experimentVersion = pageFilename || 'unknown';

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }

        try {
            // *** Replace simulation with fetch ***
            const response = await fetch('/api/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantId,
                    formType: 'comment', // Changed formType
                    data: formData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            console.log("Comment data submitted successfully.");
            // On success, proceed to debriefing
            window.location.href = 'debriefing.html';

        } catch (error) {
            console.error('Fel vid sändning av kommentar:', error);
            alert('Kunde inte skicka kommentaren. Kontrollera din anslutning och försök igen.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}

// --- Updated function for feedback form (debriefing) ---
function handleDebriefingForm() {
    const form = document.getElementById('debriefingForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('.feedback-btn'); // Assuming .feedback-btn selector is correct
        const formData = Object.fromEntries(new FormData(form).entries());

        const participantId = getParticipantId();
        if (!participantId) return; // Stop if ID is missing

        console.log('Feedback data collected:', formData);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }

        try {
            // *** Replace simulation with fetch ***
            const response = await fetch('/api/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantId,
                    formType: 'feedback', // Changed formType
                    data: formData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            console.log('Feedback submitted successfully.');
            alert('Tack! Din feedback har skickats.');
            if (submitButton) {
                submitButton.textContent = 'Tack för din feedback!';
                // Keep button disabled
            }
            // Optionally disable delete button
            const deleteBtn = document.getElementById('deleteDataBtn');
            if (deleteBtn) deleteBtn.disabled = true;

            // Optionally redirect or show a message
            window.location.href = 'thanks.html'; // Uncomment if you want to redirect


        } catch (error) {
            console.error('Fel vid sändning av feedback:', error);
            alert('Kunde inte skicka feedback. Kontrollera din anslutning och försök igen.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}

// --- Updated function for delete button ---
function handleDeleteDataButton() {
    const deleteDataButton = document.getElementById('deleteDataBtn');
    const deleteConfirmMsgElement = document.getElementById('deleteConfirmationMsg');
    const feedbackFormElement = document.getElementById('debriefingForm');

    if (!deleteDataButton) return;

    if (!deleteConfirmMsgElement) console.warn("Delete confirmation message element not found.");
    if (!feedbackFormElement) console.warn("Feedback form element not found for disabling.");

    deleteDataButton.addEventListener('click', async () => {
        if (confirm('Är du säker på att du vill radera alla dina svar från denna studie? Detta kan inte ångras.')) {

            const participantId = getParticipantId();
            if (!participantId) return; // Stop if ID missing

            // --- Update UI ---
            deleteDataButton.disabled = true;
            deleteDataButton.textContent = 'Raderar data...';
            if (feedbackFormElement) {
                const feedbackSubmitButton = feedbackFormElement.querySelector('.feedback-btn');
                if (feedbackSubmitButton) {
                    feedbackSubmitButton.disabled = true;
                    feedbackSubmitButton.title = 'Du har begärt att dina data ska raderas.';
                }
            }
            if (deleteConfirmMsgElement) {
                deleteConfirmMsgElement.style.display = 'none';
                deleteConfirmMsgElement.textContent = '';
            }

            // --- Make API Call (Replace Simulation) ---
            try {
                console.log(`Requesting data deletion for participant ${participantId}...`);
                // *** Replace simulation with fetch ***
                const response = await fetch('/api/delete-data', { // Different API endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ participantId: participantId })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                console.log('Data deletion request successful.');

                // --- Update UI on Success ---
                deleteDataButton.textContent = 'Data har raderats'; // Keep disabled
                if (deleteConfirmMsgElement) {
                    deleteConfirmMsgElement.textContent = 'Dina svar har markerats för radering. Du kan nu stänga webbläsarfönstret.';
                    deleteConfirmMsgElement.style.display = 'block';
                    deleteConfirmMsgElement.className = 'confirmation-message success';
                }

                // Optionally redirect or show a message
                window.location.href = 'thanks.html'; // Uncomment if you want to redirect

            } catch (error) {
                console.error('Fel vid radering av data:', error);
                alert('Ett fel uppstod vid radering. Kontakta försöksledaren.');

                // --- Update UI on Error ---
                deleteDataButton.textContent = 'Fel vid radering';
                deleteDataButton.title = 'Försök att kontakta försöksledaren manuellt.';

                if (deleteConfirmMsgElement) {
                    deleteConfirmMsgElement.textContent = 'Ett fel uppstod när dina data skulle raderas. Vänligen kontakta försöksledaren via mail för att säkerställa att dina data tas bort.';
                    deleteConfirmMsgElement.style.display = 'block';
                    deleteConfirmMsgElement.className = 'confirmation-message error';
                }
            }
        } else {
            console.log('Radering av data avbröts av användaren.');
        }
    });
}

// --- Exported init function (no changes needed here) ---
export function initFormHandlers() {
    handleQuestionnaireForm();
    handleCommentForm();
    handleDebriefingForm();
    handleDeleteDataButton();
}