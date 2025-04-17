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
            const experimentPage = getRandomExperiment();
            window.location.href = experimentPage;

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
    const form = document.querySelector('.debriefing-container form'); // Mer specifik selector om nödvändigt
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = Object.fromEntries(new FormData(form).entries());

        const participantId = getParticipantId();
        if (!participantId) return; // Stop if ID is missing

        console.log('Debriefing/Feedback data collected:', formData);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }

        try {
            // *** Replace simulation with fetch ***
            const response = await fetch('/api/submit-feedback', { // ANTAGANDE: Din API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: participantId,
                    feedback: formData // Skicka all formulärdata
                }),
            });

            if (!response.ok) {
                let errorData = { message: 'Okänt serverfel' };
                try { errorData = await response.json(); } catch (e) { /* Ignorera */ }
                throw new Error(`Servern svarade med status ${response.status}: ${errorData.message || response.statusText}`);
            }

            // *** SUCCESS - REDIRECT TO THANK YOU PAGE ***
            console.log('Feedback skickad till servern.');
            window.location.href = './thankyou.html'; // ANTAGANDE: thankyou.html i samma mapp (pages)

            /* // --- Gammal kod (om någon fanns) för att visa meddelande på samma sida ---
            if (submitButton) {
                submitButton.textContent = 'Feedback skickad!';
                // Håll den disabled
            }
            alert('Tack för din feedback!'); // Eller någon annan UI-bekräftelse
            */

        } catch (error) {
            console.error('Fel vid skickande av feedback:', error);
            alert('Ett fel uppstod när din feedback skulle skickas. Försök igen eller hoppa över detta steg.');
            if (submitButton) {
                submitButton.disabled = false; // Återaktivera
                submitButton.textContent = 'Skicka feedback & Avsluta';
            }
        }
    });
}

// --- Updated function for delete button ---
function handleDeleteDataButton() {
    const deleteDataButton = document.getElementById('deleteDataBtn');
    const deleteConfirmMsgElement = document.getElementById('deleteConfirmationMsg');

    if (!deleteDataButton) return; // Om knappen inte finns på sidan

    deleteDataButton.addEventListener('click', async () => {
        const participantId = getParticipantId();
        if (!participantId) return; // Stop if ID is missing

        // Confirmation dialog
        const confirmed = confirm('Är du säker på att du vill radera alla dina svar och avsluta studien? Detta går inte att ångra.');

        if (confirmed) {
            console.log('Användaren bekräftade radering. Försöker radera data för ID:', participantId);

            // --- Update UI - Show progress ---
            deleteDataButton.disabled = true;
            deleteDataButton.textContent = 'Raderar...';
            if (deleteConfirmMsgElement) {
                deleteConfirmMsgElement.style.display = 'none'; // Göm eventuellt gammalt meddelande
            }

            try {
                // *** Replace simulation with fetch ***
                const response = await fetch('/api/delete-data', { // ANTAGANDE: Din API endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ participantId: participantId }),
                });

                if (!response.ok) {
                    // Försök läsa felmeddelande från servern om möjligt
                    let errorData = { message: 'Okänt serverfel' };
                    try {
                        errorData = await response.json();
                    } catch (e) { /* Ignorera json-parse fel */ }
                    throw new Error(`Servern svarade med status ${response.status}: ${errorData.message || response.statusText}`);
                }

                // *** SUCCESS - REDIRECT TO THANK YOU PAGE ***
                console.log('Data raderad (eller markerad för radering) på servern.');
                // Istället för att visa meddelande här, omdirigera direkt
                window.location.href = './thankyou.html'; // ANTAGANDE: thankyou.html i samma mapp (pages)

                /* // --- Gammal kod för att visa meddelande på samma sida (kan tas bort) ---
                deleteDataButton.textContent = 'Svar raderade'; // Keep disabled
                if (deleteConfirmMsgElement) {
                    deleteConfirmMsgElement.textContent = 'Dina svar har markerats för radering. Du kan nu stänga webbläsarfönstret.';
                    deleteConfirmMsgElement.style.display = 'block';
                    deleteConfirmMsgElement.className = 'confirmation-message success';
                }
                */

            } catch (error) {
                console.error('Fel vid radering av data:', error);
                alert('Ett fel uppstod vid radering. Kontakta försöksledaren.');

                // --- Update UI on Error --
                deleteDataButton.disabled = false; // Återaktivera knappen så användaren kan försöka igen? Eller håll den inaktiv?
                deleteDataButton.textContent = 'Fel vid radering';
                deleteDataButton.title = 'Försök igen eller kontakta försöksledaren manuellt.';

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