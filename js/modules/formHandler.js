import { getRandomExperiment } from './mathUtils.js';


export function initFormHandlers() {
    handleQuestionnaireForm();
    handleCommentForm();
    handleDebriefingForm();
}

function handleQuestionnaireForm() {
    const form = document.getElementById('questionnaireForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Questionnaire data collected:', data);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sparar...';
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const experimentPage = getRandomExperiment();
            window.location.href = experimentPage;
        } catch (error) {
            console.error('Fel vid sändning av enkät:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök igen';
            }
        }
    });
}

function handleCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Comment data collected:', data);

        const comment = data['comment_text']?.trim();
        if (!comment) return;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = 'debriefing.html';
        } catch (error) {
            console.error('Fel vid sändning av kommentar:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}

function handleDebriefingForm() {
    const form = document.getElementById('debriefingForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('.feedback-btn');
        const data = Object.fromEntries(new FormData(form).entries());

        console.log('Feedback data collected:', data);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Skickar...';
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            submitButton.textContent = 'Tack för din feedback!';
        } catch (error) {
            console.error('Fel vid sändning av feedback:', error);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Försök skicka igen';
            }
        }
    });
}
