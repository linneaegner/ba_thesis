export function initUIFlow() {
    const breathingSection = document.getElementById("breathingExercise");
    const commentBox = document.querySelector(".comment-box");
    const doneReadingBtn = document.getElementById("doneReadingBtn");

    if (breathingSection && commentBox && doneReadingBtn) {
        doneReadingBtn.addEventListener("click", () => {
            breathingSection.style.display = "block";
            doneReadingBtn.style.display = "none";

            setTimeout(() => {
                breathingSection.style.display = "none";
                commentBox.style.display = "block";
            }, 10000); // Change to 15000 for 15 seconds
        });
    }
}
