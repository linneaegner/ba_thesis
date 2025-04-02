/**
 * @fileoverview Hanterar formulär och interaktioner på enkät-, experiment- och debriefingsidorna.
 * Inkluderar insamling och (simulerad) sändning av data samt interaktion med "nudge"-knappar.
 * Använder FormData för effektiv formulärdatahantering och async/await för fetch-anrop.
 */

// Vänta tills hela HTML-dokumentet har laddats och DOM:en är redo.
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ==========================================================================
     * Hantering av Enkätformulär (questionnaire page)
     * ==========================================================================
     * Samlar in data från enkätformuläret när det skickas,
     * validerar (implicit via FormData), skickar (simulerat) till servern
     * och omdirigerar användaren till nästa sida vid framgång.
     */
    const questionnaireForm = document.getElementById('questionnaireForm');

    if (questionnaireForm) {
        // Lägg till en händelselyssnare för 'submit'-händelsen.
        // Använder async för att kunna använda await inuti funktionen.
        questionnaireForm.addEventListener('submit', async (event) => {
            // Förhindra standardformulärsändning som laddar om sidan.
            event.preventDefault();
            console.log('Enkätformulär skickas...');

            // Hämta referens till submit-knappen (om den behövs för feedback)
            // Antag att knappen har typen "submit" eller ett specifikt ID/klass.
            const submitButton = questionnaireForm.querySelector('button[type="submit"]'); // Anpassa selektorn vid behov

            // Skapa ett FormData-objekt direkt från formuläret.
            // Detta samlar automatiskt alla fält med ett 'name'-attribut.
            const formData = new FormData(questionnaireForm);

            // Konvertera FormData till ett vanligt JavaScript-objekt om din server förväntar sig JSON.
            // Object.fromEntries är ett smidigt sätt att göra detta.
            const dataToSend = Object.fromEntries(formData.entries());

            // (Felsökning) Visa den insamlade datan i konsolen.
            console.log('Insamlad enkätdata:', dataToSend);

            // Inaktivera knappen medan data skickas för att förhindra dubbelklick.
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sparar...'; // Ge visuell feedback
            }

            try {
                // *** Simulerad Asynkron Operation (Ersätt med faktisk fetch) ***
                // Här skulle det riktiga fetch-anropet till '/save-questionnaire' ligga.
                // await fetch('/save-questionnaire', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         // Lägg till andra headers om nödvändigt (t.ex. CSRF-token)
                //     },
                //     body: JSON.stringify(dataToSend)
                // });

                // Simulera en nätverksfördröjning (ta bort vid faktisk implementering).
                await new Promise(resolve => setTimeout(resolve, 500)); // Vänta 0.5 sekunder

                // Kontrollera svaret från servern (exempel med fetch)
                // const response = await fetch(...);
                // if (!response.ok) {
                //    // Om servern svarar med ett fel (t.ex. 4xx, 5xx status)
                //    throw new Error(`Serverfel: ${response.status} ${response.statusText}`);
                // }

                // Om allt gick bra (simulerat):
                console.log('Enkätsvar sparade (simulerat), går vidare till experiment1.html');
                alert('Tack! Dina svar har sparats (simulerat).'); // Tillfällig feedback

                // Omdirigera till nästa sida ENDAST om sändningen lyckades.
                window.location.href = 'experiment1.html'; // Uppdatera med korrekt sökväg!

            } catch (error) {
                // Hantera eventuella fel som uppstår under fetch eller bearbetning.
                console.error('Fel vid sändning av enkät:', error);
                alert('Ett fel uppstod när dina svar skulle sparas. Försök igen eller kontakta administratören.');

                // Återaktivera knappen om ett fel inträffade.
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Skicka igen'; // Eller ursprunglig text
                }
            }
        }); // Slut på submit-lyssnaren
    } // Slut på if (questionnaireForm)


    /**
     * ==========================================================================
     * Hantering av Förslagsknappar ("Nudge Buttons") (experiment page)
     * ==========================================================================
     * Lägger till funktionalitet för knappar som föreslår text.
     * När en knapp klickas, infogas dess text (något bearbetad) i
     * kommentarsfältet och fokus sätts där.
     */
    const commentTextarea = document.getElementById('commentTextarea');
    // Använd en mer specifik selektor om `.nudge-btn` används för annat.
    const nudgeButtons = document.querySelectorAll('.nudge-btn');

    // Kontrollera att både textrutan och minst en knapp finns.
    if (commentTextarea && nudgeButtons.length > 0) {
        nudgeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Hämta textinnehållet från den klickade knappen.
                let suggestionText = event.target.textContent;

                // Rensa texten: ta bort eventuella inledande/avslutande whitespace
                // och specifikt de tre punkterna (...) i slutet.
                suggestionText = suggestionText.replace(/\.\.\.$/, '').trim();

                // Ersätt textrutans nuvarande innehåll med förslagstexten,
                // följt av ett mellanslag för att underlätta fortsatt skrivande.
                // Alternativt: commentTextarea.value += suggestionText + ' '; (för att lägga till)
                commentTextarea.value = suggestionText + ' ';

                // Sätt fokus på textrutan så att användaren kan börja skriva direkt.
                commentTextarea.focus();
            }); // Slut på click-lyssnaren
        }); // Slut på forEach (nudgeButtons)
    } // Slut på if (commentTextarea && nudgeButtons)


    /**
     * ==========================================================================
     * Hantering av Kommentarsformulär (experiment page)
     * ==========================================================================
     * Samlar in kommentaren när formuläret skickas,
     * skickar (simulerat) den till servern och omdirigerar användaren
     * till debriefingsidan vid framgång.
     * Notera: HTML5 'required' attribut på <textarea> rekommenderas för grundläggande validering.
     */
    const commentForm = document.getElementById('commentForm');

    if (commentForm && commentTextarea) { // Säkerställ att även textarean finns
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Kommentarsformulär skickas...');

            const submitButton = commentForm.querySelector('button[type="submit"]');

            // Använd FormData även här för konsistens, även om det bara är ett fält.
            const formData = new FormData(commentForm);
            const dataToSend = Object.fromEntries(formData.entries());
            const userComment = dataToSend.commentTextarea || ''; // Hämta kommentaren via 'name'-attributet

            // Validering: Kontrollera om kommentaren är tom (om 'required' inte används/fungerar).
            if (userComment.trim() === '') {
                alert('Skriv gärna en kommentar innan du skickar.');
                // Fokusera på fältet igen
                commentTextarea.focus();
                return; // Avbryt sändningen
            }

            // (Felsökning) Visa kommentaren.
            console.log('Kommentar:', userComment);


            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Skickar...';
            }

            try {
                // *** Simulerad Asynkron Operation (Ersätt med faktisk fetch) ***
                // Här skickas kommentaren, t.ex. till '/save-comment'.
                // await fetch('/save-comment', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ comment: userComment }) // Skicka som ett objekt
                // });

                // Simulera nätverksfördröjning.
                await new Promise(resolve => setTimeout(resolve, 500));

                // const response = await fetch(...);
                // if (!response.ok) {
                //    throw new Error(`Serverfel: ${response.status}`);
                // }

                // Om allt gick bra (simulerat):
                console.log('Kommentar sparad (simulerat), går vidare till debriefing.html');
                alert('Kommentar skickad (simulerat): ' + userComment); // Ta bort denna rad sen

                // Omdirigera till nästa sida.
                window.location.href = 'debriefing.html'; // Uppdatera med korrekt sökväg!

            } catch (error) {
                console.error('Fel vid sändning av kommentar:', error);
                alert('Ett fel uppstod när din kommentar skulle sparas. Försök igen.');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Skicka kommentar'; // Eller ursprunglig text
                }
            }
        }); // Slut på submit-lyssnaren
    } // Slut på if (commentForm)


    /**
     * ==========================================================================
     * Hantering av Feedback-formulär (debriefing page)
     * ==========================================================================
     * Samlar in feedback från textfälten när formuläret skickas,
     * skickar (simulerat) datan till servern och ger användaren
     * tydlig feedback om att processen är klar.
     */
    const debriefingForm = document.getElementById('debriefingForm');

    if (debriefingForm) {
        debriefingForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Feedback-formulär skickas...');

            const submitButton = debriefingForm.querySelector('button[type="submit"], .feedback-btn'); // Anpassa selektor
            // Hitta platsen där tackmeddelandet ska visas (t.ex. efter formuläret)
            const feedbackSection = debriefingForm.closest('.feedback-section') || debriefingForm.parentNode; // Hitta en lämplig container

            const formData = new FormData(debriefingForm);
            const dataToSend = Object.fromEntries(formData.entries());

            // (Felsökning) Visa insamlad feedback.
            console.log('Insamlad feedback:', dataToSend);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Skickar feedback...';
            }

            try {
                // *** Simulerad Asynkron Operation (Ersätt med faktisk fetch) ***
                // Här skickas feedbacken, t.ex. till '/save-feedback'.
                // await fetch('/save-feedback', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(dataToSend)
                // });

                // Simulera nätverksfördröjning.
                await new Promise(resolve => setTimeout(resolve, 500));

                // const response = await fetch(...);
                // if (!response.ok) {
                //     throw new Error(`Serverfel: ${response.status}`);
                // }

                // Om allt gick bra (simulerat):
                console.log('Feedback sparad (simulerat).');

                // Ge tydlig feedback till användaren - ersätt knappen eller lägg till text.
                if (submitButton) {
                    submitButton.textContent = 'Tack för din feedback!';
                    // Knappen förblir inaktiverad eftersom processen är klar.
                }

                // Alternativt, eller som tillägg: Lägg till ett tackmeddelande i DOM:en.
                // Ta bort eventuellt tidigare felmeddelande eller tackmeddelande först
                const existingMsg = feedbackSection.querySelector('.feedback-message');
                if (existingMsg) existingMsg.remove();

                const thankYouMsg = document.createElement('p');
                thankYouMsg.textContent = 'Tack! Din feedback har tagits emot. Du kan nu stänga fönstret.';
                thankYouMsg.style.marginTop = '1rem';
                thankYouMsg.style.fontWeight = 'bold';
                thankYouMsg.classList.add('feedback-message'); // Klass för enkel identifiering/styling
                feedbackSection.appendChild(thankYouMsg); // Lägg till meddelandet


                // Tillfällig alert (ta bort när fetch fungerar och UI-feedback är på plats)
                // alert('Feedback skickad (simulerat): ' + JSON.stringify(dataToSend));

            } catch (error) {
                console.error('Fel vid sändning av feedback:', error);
                alert('Kunde inte skicka din feedback. Försök igen eller stäng fönstret.');

                // Lägg till felmeddelande i DOM:en?
                const existingMsg = feedbackSection.querySelector('.feedback-message');
                if (existingMsg) existingMsg.remove();
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Ett fel uppstod. Försök skicka igen.';
                errorMsg.style.color = 'red';
                errorMsg.style.marginTop = '1rem';
                errorMsg.classList.add('feedback-message');
                feedbackSection.appendChild(errorMsg);


                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Skicka feedback & Avsluta'; // Återställ text
                }
            }
        }); // Slut på submit-lyssnaren
    } // Slut på if (debriefingForm)

    /**
     * ==========================================================================
     * Slut på kod som körs när sidan laddats
     * ==========================================================================
     */
}); // Slut på DOMContentLoaded