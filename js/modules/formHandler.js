// Importera eventuella beroenden om de behövs överst
import { getRandomExperiment } from './mathUtils.js'; // Behövs bara om den används

// --- Befintlig funktion för enkätformulär ---
function handleQuestionnaireForm() {
    const form = document.getElementById('questionnaireForm');
    if (!form) return; // Avsluta om formuläret inte finns på sidan

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Questionnaire data collected:', data);
        console.log('Full questionnaire data as string:', JSON.stringify(data, null, 2));

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sparar...';
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulering
            const experimentPage = getRandomExperiment(); // Om du vill randomisera
            window.location.href = experimentPage;
            //window.location.href = 'experiment4.html'; // Gå till experimentet
        } catch (error) {
            console.error('Fel vid sändning av enkät:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök igen';
            }
        }
    });
}

// --- Befintlig funktion för kommentarsformulär ---
function handleCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return; // Avsluta om formuläret inte finns på sidan

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Comment data collected:', data);
        const comment = data['comment_text']?.trim();
        if (!comment) {
            console.log('Tom kommentar, skickar inte.');
            return; // Avbryt om kommentaren är tom
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulering
            window.location.href = 'debriefing.html'; // Gå till debriefing
        } catch (error) {
            console.error('Fel vid sändning av kommentar:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}

// --- Befintlig funktion för feedback-formulär (debriefing) ---
function handleDebriefingForm() {
    const form = document.getElementById('debriefingForm');
    if (!form) return; // Avsluta om formuläret inte finns på sidan

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('.feedback-btn'); // Anpassa selektor vid behov
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Feedback data collected:', data);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulering
            console.log('Simulated feedback submission successful.');
            if (submitButton) {
                submitButton.textContent = 'Tack för din feedback!';
                // Knappen förblir inaktiverad
            }
        } catch (error) {
            console.error('Fel vid sändning av feedback:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}

// ===========================================================
// === NY FUNKTION FÖR HANTERING AV RADERINGSKNAPPEN ===
// ===========================================================
function handleDeleteDataButton() {
    // Hitta elementen specifika för raderingsfunktionen
    const deleteDataButton = document.getElementById('deleteDataBtn');
    const deleteConfirmMsgElement = document.getElementById('deleteConfirmationMsg');
    const feedbackFormElement = document.getElementById('debriefingForm'); // Behövs för att inaktivera feedback-knapp

    // Avsluta direkt om raderingsknappen inte finns (vi är inte på rätt sida)
    if (!deleteDataButton) return;

    // Varning om de andra elementen mot förmodan saknas (men fortsätt om knappen finns)
    if (!deleteConfirmMsgElement || !feedbackFormElement) {
        console.warn("Delete button handler: Confirmation element or feedback form not found. UI might be incomplete.");
    }

    // Lägg till klick-lyssnare på raderingsknappen
    deleteDataButton.addEventListener('click', async () => {
        // Steg 1: Bekräfta med användaren
        if (confirm('Är du säker på att du vill radera alla dina svar från denna studie? Detta kan inte ångras.')) {

            // Steg 2: Uppdatera UI - Inaktivera knappar
            deleteDataButton.disabled = true;
            deleteDataButton.textContent = 'Raderar data...';
            // Försök bara inaktivera feedback-knappen om formuläret finns
            if (feedbackFormElement) {
                const feedbackSubmitButton = feedbackFormElement.querySelector('button[type="submit"]'); // Eller '.feedback-btn'
                if (feedbackSubmitButton) {
                    feedbackSubmitButton.disabled = true;
                    feedbackSubmitButton.title = 'Du har begärt att dina data ska raderas.';
                }
            }
            // Dölj ev. gammalt meddelande (om elementet finns)
            if (deleteConfirmMsgElement) {
                deleteConfirmMsgElement.style.display = 'none';
                deleteConfirmMsgElement.textContent = '';
            }

            // Steg 3: SIMULERA radering
            try {
                console.log('Simulerar radering av data...');
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulera väntetid
                console.log('Simulerad radering av data klar.');

                // Steg 4: Uppdatera UI vid lyckad simulering
                deleteDataButton.textContent = 'Data har raderats'; // Knappen förblir inaktiv
                if (deleteConfirmMsgElement) {
                    deleteConfirmMsgElement.textContent = 'Dina svar har markerats för radering (simulerat). Du kan nu stänga webbläsarfönstret.';
                    deleteConfirmMsgElement.style.display = 'block'; // Visa bekräftelse
                }

            } catch (error) {
                // Steg 5: Hantera fel vid simulering (eller senare, vid riktigt API-anrop)
                console.error('Fel vid (simulerad) radering av data:', error);
                deleteDataButton.textContent = 'Fel vid radering'; // Behåll inaktiv
                if (deleteConfirmMsgElement) {
                    deleteConfirmMsgElement.textContent = 'Ett fel uppstod när dina data skulle raderas. Vänligen kontakta försöksledaren via mail för att säkerställa att dina data tas bort.';
                    deleteConfirmMsgElement.style.display = 'block'; // Visa felmeddelande
                }
            }
        } else {
            // Användaren klickade "Avbryt"
            console.log('Radering av data avbröts av användaren.');
        }
    }); // Slut på addEventListener
}
// ===========================================================
// === SLUT PÅ NY FUNKTION ===
// ===========================================================


// --- Exporterad funktion som initierar alla formulärhanterare ---
// Uppdaterad att även inkludera anrop till den nya funktionen
export function initFormHandlers() {
    handleQuestionnaireForm();
    handleCommentForm();
    handleDebriefingForm();
    handleDeleteDataButton(); // <<< Lägg till anropet här
}