// Kör all kod nedanför först när hela HTML-sidan har laddats klart
document.addEventListener('DOMContentLoaded', () => {

    // --- Kod för Förslagsknapparna ---

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

    // --- Kod för att skicka kommentaren ---

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

}); // Slut på koden som körs när sidan laddats