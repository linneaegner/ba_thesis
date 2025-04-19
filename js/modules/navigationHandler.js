// js/modules/navigationHandler.js

/**
 * Initializes event listeners for all "End Study" buttons.
 * On click, confirms with the user and redirects to the thank you page.
 */
export function initEndStudyButtons() {
    // Hitta alla knappar med klassen .end-btn som finns i en footer
    // (Detta gör selektorn lite mer specifik om du skulle ha .end-btn någon annanstans)
    const endButtons = document.querySelectorAll('footer .btn.end-btn');

    endButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Bekräftelse (valfritt men rekommenderat)
            const confirmEnd = confirm("Är du säker på att du vill avsluta studien nu?");
            if (confirmEnd) {
                console.log("Studien avslutas av användaren via generell 'Avsluta studien'-knapp.");
                // Omdirigera till tacksidan
                // ANTAGANDE: thankyou.html ligger i samma mapp (pages) som sidan du är på
                window.location.href = 'thanks.html';
                // Om thankyou.html ligger i roten: window.location.href = '../thankyou.html';
            } else {
                console.log("Användaren avbröt 'Avsluta studien'.");
            }
        });
    });

    // Logga om några knappar hittades (bra för felsökning)
    if (endButtons.length > 0) {
        console.log(`Initialized ${endButtons.length} 'Avsluta studien' button(s).`);
    }
}