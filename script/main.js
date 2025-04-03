/*
 * @fileoverview Hanterar formulär på enkät-, experiment- och debriefingsidorna.
 * Fokuserar på att samla in data med FormData och logga den insamlade datan.
 */

document.addEventListener('DOMContentLoaded', () => {
    const consentCheckbox = document.getElementById('consent');
    const startStudyButton = document.getElementById('startStudyButton');

    // Säkerhetskoll: Kör bara koden nedanför OM både kryssrutan och knappen hittades på sidan.
    if (consentCheckbox && startStudyButton) {
        startStudyButton.disabled = !consentCheckbox.checked;

        // Lägg till en "lyssnare" som reagerar NÄR kryssrutan ÄNDRAS (bockas i/ur)
        consentCheckbox.addEventListener('change', () => {
            // Uppdatera knappens status IGEN, precis som vid sidladdning.
            startStudyButton.disabled = !consentCheckbox.checked;
        });

        // Lägg till en "lyssnare" som reagerar NÄR någon KLICKAR på knappen
        startStudyButton.addEventListener('click', () => {
            // Agera BARA om rutan faktiskt är ibockad
            if (consentCheckbox.checked) {
                // Skicka användaren till nästa sida (enkäten)
                window.location.href = 'questionnaire.html';
            }
        });

    } // Slut på if-satsen (om elementen hittades)


    const questionnaireForm = document.getElementById('questionnaireForm');
    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = questionnaireForm.querySelector('button[type="submit"]');
            const formData = new FormData(questionnaireForm);
            const dataToSend = Object.fromEntries(formData.entries());

            // Logga den insamlade datan för detta formulär
            console.log('Questionnaire data collected:', dataToSend);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sparar...';
            }

            try {
                /* // Riktig fetch (ersätt simulering nedan)
                const response = await fetch('/api/save-questionnaire', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                */
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulering

                window.location.href = 'experiment1.html'; // Anpassa sökväg!

            } catch (error) {
                console.error('Fel vid sändning av enkät:', error);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Försök igen';
                }
            }
        });
    }

    const commentTextareaNudge = document.getElementById('commentTextarea');
    const nudgeButtons = document.querySelectorAll('.nudge-btn');
    if (commentTextareaNudge && nudgeButtons.length > 0) {
        nudgeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const clickedButton = event.target;
                let buttonText = clickedButton.textContent.trim().replace(/\.\.\.$/, '').trim();
                commentTextareaNudge.value = buttonText + ' ';
                commentTextareaNudge.focus();
            });
        });
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = commentForm.querySelector('button[type="submit"]');
            const formData = new FormData(commentForm);
            const dataToSend = Object.fromEntries(formData.entries());

            // Logga den insamlade datan för detta formulär
            console.log('Comment data collected:', dataToSend);

            // ANTAGANDE: Textarean har name="comment_text". Ändra vid behov.
            const commentFieldName = 'comment_text';
            const userComment = dataToSend[commentFieldName] ? dataToSend[commentFieldName].trim() : '';

            if (!userComment) {
                return; // Avbryt om kommentaren är tom
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Skickar...';
            }

            try {
                /* // Riktig fetch (ersätt simulering nedan)
                const response = await fetch('/api/save-comment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                */
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulering

                window.location.href = 'debriefing.html'; // Anpassa sökväg!

            } catch (error) {
                console.error('Fel vid sändning av kommentar:', error);
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Försök skicka igen';
                }
            }
        });
    }

    const debriefingForm = document.getElementById('debriefingForm');
    if (debriefingForm) {
        debriefingForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = debriefingForm.querySelector('.feedback-btn');
            const formData = new FormData(debriefingForm);
            const dataToSend = Object.fromEntries(formData.entries());

            // Logga den insamlade datan för detta formulär
            console.log('Feedback data collected:', dataToSend);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Skickar...';
            }

            try {
                /* // Riktig fetch (ersätt simulering nedan)
               const response = await fetch('/save-feedback', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(dataToSend)
               });
                if (!response.ok) {
                   throw new Error(`Server error: ${response.status} ${response.statusText}`);
               }
               */
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulering

                // Uppdatera UI eftersom vi inte omdirigerar
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

});