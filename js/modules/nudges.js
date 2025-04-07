export function initNudgeButtons() {
    const textarea = document.getElementById('commentTextarea');
    const nudgeButtons = document.querySelectorAll('.nudge-btn');

    if (textarea && nudgeButtons.length > 0) {
        nudgeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                let text = event.target.textContent.trim().replace(/\.\.\.$/, '').trim();
                textarea.value = text + ' ';
                textarea.focus();
            });
        });
    }
}
