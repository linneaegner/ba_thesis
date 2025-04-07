export function initConsentFlow() {
    const consentCheckbox = document.getElementById('consent');
    const startStudyButton = document.getElementById('startStudyButton');

    if (consentCheckbox && startStudyButton) {
        startStudyButton.disabled = !consentCheckbox.checked;

        consentCheckbox.addEventListener('change', () => {
            startStudyButton.disabled = !consentCheckbox.checked;
        });

        startStudyButton.addEventListener('click', () => {
            if (consentCheckbox.checked) {
                window.location.href = 'questionnaire.html';
            }
        });
    }
}
