// Kör all kod nedanför först när hela HTML-sidan har laddats klart
document.addEventListener('DOMContentLoaded', () => {

    /*
    ==========================================================================
    Kod för att hantera/skicka/spara datan från enkätformuläret (questionnaire page)
    ==========================================================================
    Förklaring: Denna kod hanterar insamling av enkätsvar från användaren.
    Den samlar in data från formuläret och skickar det till servern via fetch().
    Efter att datan har skickats, skickas användaren vidare till nästa sida. 
    */

    // Hitta enkätformuläret via dess ID
    const questionnaireForm = document.getElementById('questionnaireForm');

    // Om formuläret finns på den aktuella sidan...
    if (questionnaireForm) {

        // ...lägg på en "lyssnare" som kör kod när man försöker skicka det
        questionnaireForm.addEventListener('submit', (event) => {

            // Stoppa webbläsarens standardbeteende (att ladda om sidan)
            event.preventDefault();

            console.log('Enkätformulär skickat (via JS)'); // För felsökning

            // Skapa ett objekt för att samla in all data
            const formData = {};

            // 1. Hämta Ålder (från input med id="age")
            const ageInput = document.getElementById('age');
            if (ageInput) {
                formData.age = ageInput.value;
            }

            // 2. Hämta valt Kön (från radioknappar med name="gender")
            const selectedGender = questionnaireForm.querySelector('input[name="gender"]:checked');
            if (selectedGender) {
                formData.gender = selectedGender.value;
            } else {
                formData.gender = null; // Om ingen är vald (bör inte hända med 'required')
            }

            // 3. Hämta vald Klimatinställning (från name="climate_stance")
            const selectedClimateStance = questionnaireForm.querySelector('input[name="climate_stance"]:checked');
            if (selectedClimateStance) {
                formData.climate_stance = selectedClimateStance.value;
            } else {
                formData.climate_stance = null;
            }

            // 4. Hämta vald Engagemangsfrekvens (från name="engagement_frequency")
            const selectedEngagementFreq = questionnaireForm.querySelector('input[name="engagement_frequency"]:checked');
            if (selectedEngagementFreq) {
                formData.engagement_frequency = selectedEngagementFreq.value;
            } else {
                formData.engagement_frequency = null;
            }

            // 5. Hämta Engagemangssyfte (från textarea med id="engagement_purpose")
            const purposeTextarea = document.getElementById('engagement_purpose');
            if (purposeTextarea) {
                formData.engagement_purpose = purposeTextarea.value.trim();
            }
            


            
            // (För felsökning) Visa den insamlade datan i konsolen
            console.log('Insamlad enkätdata:', formData);

            // *** VIKTIGT: Här ska du skicka datan till din server! ***
            // Använd fetch() för att skicka 'formData'-objektet (ofta som JSON) 
            // till din '/save-questionnaire' endpoint.
            // Exempelstruktur:
            /*
            fetch('/save-questionnaire', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData) 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Något gick fel vid sparande av enkätsvar.');
                }
                // Om allt gick bra, gå vidare till nästa sida (experimentet)
                console.log('Enkätsvar sparade, går till experiment.');
                window.location.href = 'experiment1.html'; // <-- OBS: Rätt sökväg?
            })
            .catch(error => {
                console.error('Fel vid sändning av enkät:', error);
                alert('Kunde inte skicka dina enkätsvar. Försök igen.');
            });
            */

            // Tillfällig kod för att visa att det funkar och gå vidare (byt ut sen):
            alert('Enkätsvar skickade (simulerat): ' + JSON.stringify(formData)); // Ta bort denna rad sen
            window.location.href = 'experiment1.html'; // Gå till nästa sida <-- OBS: Se till att sökvägen är rätt!

        }); // Slut på submit-lyssnaren
    } // Slut på if (om formuläret finns)


    /*
    ==========================================================================
    Kod för att använda nudge-knapparna (förslagsknapparna) till sin text (experiment page)
    ==========================================================================
    */
    
    // Hitta textrutan där man skriver kommentaren
    const commentTextarea = document.getElementById('commentTextarea');
    // Hitta alla knappar som ger textförslag
    const nudgeButtons = document.querySelectorAll('.nudge-btn');

    // Kolla så att vi faktiskt hittade textrutan och knapparna
    if (commentTextarea && nudgeButtons.length > 0) {

        // Gör detta för varje förslagsknapp som hittades:
        nudgeButtons.forEach(button => {
            // Lägg på en "lyssnare" som kör kod när knappen klickas
            button.addEventListener('click', (event) => {

                // Hämta texten som står på knappen
                let buttonText = event.target.textContent.trim();

                // Ta bort de tre punkterna "..." från slutet av texten (om de finns)
                buttonText = buttonText.replace(/\.\.\.$/, '').trim();

                // Lägg in knappens text i textrutan, följt av ett mellanslag
                commentTextarea.value = buttonText + ' ';

                // Sätt markören i textrutan, redo att skriva mer
                commentTextarea.focus();
            }); // Slut på vad som händer när en knapp klickas
        }); // Slut på genomgången av alla knappar

    } // Slut på if-satsen (om elementen hittades)

    /*
    ==========================================================================
    Kod för att hantera/skicka/spara datan från kommentar (experiment page)
    ==========================================================================
    */

    // Hitta själva kommentarsformuläret
    const commentForm = document.getElementById('commentForm');

    // Om formuläret hittades...
    if (commentForm) {
        // ...lägg på en "lyssnare" som kör kod när man försöker skicka formuläret
        commentForm.addEventListener('submit', (event) => {

            // Stoppa det vanliga sättet att skicka formulär (som laddar om sidan)
            event.preventDefault();

            // Hämta den färdiga kommentaren från textrutan
            const userComment = commentTextarea.value.trim();

            // (För felsökning, kan tas bort sen) Skriv ut kommentaren i webbläsarens konsol
            console.log('Formulär skickat (via JS). Kommentar:', userComment);

            // *** VIKTIGT: Här ska du skicka kommentaren till din server! ***
            // Använd fetch() eller liknande för att skicka variabeln 'userComment'.
            // Se till att du bara skickar vidare användaren till nästa sida 
            // EFTER att datan har skickats (inuti .then() för fetch).

            // Tillfällig kod för att visa att det funkar och gå vidare (byt ut sen):
            if (userComment) { // Skicka bara om det finns text
                alert('Kommentar skickad (simulerat): ' + userComment); // Ta bort denna rad sen
                window.location.href = 'debriefing.html'; // Gå till nästa sida
            } else {
                alert('Skriv gärna en kommentar innan du skickar.'); // Påminnelse om tom kommentar
            }
        }); // Slut på vad som händer när formuläret skickas
    } // Slut på if-satsen (om formuläret hittades)




     /*
    ==========================================================================
    Kod för att hantera/skicka/spara datan från feedback frågorna (debriefing page)
    ==========================================================================
    */

    // Hitta feedback-formuläret via dess ID
    const debriefingForm = document.getElementById('debriefingForm');

    // Om formuläret finns på den aktuella sidan...
    if (debriefingForm) {
        
        // ...lägg på en "lyssnare" som kör kod när man försöker skicka det
        debriefingForm.addEventListener('submit', (event) => {
            
            // Stoppa webbläsarens standardbeteende
            event.preventDefault(); 
            
            console.log('Feedback-formulär skickat (via JS)'); // För felsökning

            // Hitta textrutorna
            const observationsTextarea = document.getElementById('interesting_observations');
            const issuesTextarea = document.getElementById('technical_issues');
            // Hitta knappen inuti formuläret
            const submitButton = debriefingForm.querySelector('.feedback-btn'); // Eller annan selektor om klassen ändras

            // Skapa ett objekt för att samla in datan
            const feedbackData = {};

            // Hämta text från fälten (om de finns)
            if (observationsTextarea) {
                feedbackData.observations = observationsTextarea.value.trim();
            }
            if (issuesTextarea) {
                feedbackData.issues = issuesTextarea.value.trim();
            }

            // (För felsökning) Visa den insamlade datan i konsolen
            console.log('Insamlad feedback:', feedbackData);

            // *** VIKTIGT: Här ska du skicka datan till din server! ***
            // Använd fetch() för att skicka 'feedbackData'-objektet 
            // till din '/save-feedback' endpoint.
            // Eftersom detta är sista steget, behöver du inte omdirigera,
            // men du bör ge användaren feedback (t.ex. tackmeddelande) och 
            // kanske inaktivera knappen.

            // Exempelstruktur:
            
            // Inaktivera knappen direkt för att förhindra dubbelklick
            /*if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Skickar...'; // Tillfällig text
            }

            fetch('/save-feedback', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData) 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Något gick fel vid sparande av feedback.');
                }
                // Om allt gick bra:
                console.log('Feedback sparad.');
                // Visa ett tackmeddelande för användaren
                if (submitButton) {
                    submitButton.textContent = 'Tack för din feedback!'; 
                }
                // Man kan också lägga till ett tackmeddelande i själva HTML:en
                const feedbackSection = document.querySelector('.feedback-section');
                if (feedbackSection) {
                     const thankYouMsg = document.createElement('p');
                     thankYouMsg.textContent = 'Tack! Din feedback har skickats.';
                     thankYouMsg.style.marginTop = '1rem'; // Lite stil
                     thankYouMsg.style.fontWeight = 'bold';
                     feedbackSection.appendChild(thankYouMsg); // Lägg till meddelandet
                }

            })
            .catch(error => {
                console.error('Fel vid sändning av feedback:', error);
                alert('Kunde inte skicka din feedback. Du kan stänga fönstret.');
                // Återaktivera knappen om det gick fel?
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Skicka feedback & Avsluta';
                }
            });
            */

            // Tillfällig kod för test (ta bort när fetch fungerar)
            alert('Feedback skickad (simulerat): ' + JSON.stringify(feedbackData)); 
            if (submitButton) {
                 submitButton.disabled = true;
                 submitButton.textContent = 'Tack för din feedback!';
            }
            

        }); // Slut på submit-lyssnaren
    } // Slut på if (om formuläret finns)
   /*
    ==========================================================================
    Slut på koden som körs när sidan laddats
    ==========================================================================
    */
}); 