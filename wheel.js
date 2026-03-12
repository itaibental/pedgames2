
document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const spinButton = document.querySelector('.spin-button');
    const wheelCenter = document.querySelector('.wheel-center');

    const sections = [
        { label: 'בונוס 10+' },
        { label: 'נסה שוב' },
        { label: 'הפתעה!' },
        { label: 'שאלה כפולה' },
        { label: '20 נקודות' },
        { label: 'איבוד תור' },
        { label: 'סיבוב נוסף' },
        { label: 'בהצלחה!' },
        { label: 'משימה חדשה' },
        { label: 'אתגר' },
        { label: 'כל הכבוד!' },
        { label: 'פסילה' },
    ];

    const sectionColors = [
        '#FFC107', '#FF9800', '#FF5722', '#F44336',
        '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688'
    ];

    const sectionAngle = 360 / sections.length;

    sections.forEach((section, i) => {
        const sectionEl = document.createElement('div');
        sectionEl.classList.add('section');
        
        const rotation = sectionAngle * i;
        const skewAngle = 90 - sectionAngle;

        sectionEl.style.transform = `rotate(${rotation}deg) skewY(-${skewAngle}deg)`;
        sectionEl.style.backgroundColor = sectionColors[i % sectionColors.length];

        const content = document.createElement('div');
        content.textContent = section.label;
        content.style.transform = `skewY(${skewAngle}deg) rotate(${-sectionAngle / 2}deg)`;
        
        sectionEl.appendChild(content);
        wheel.appendChild(sectionEl);
    });

    function spin() {
        const randomSpin = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 times
        wheel.style.transform = `rotate(${randomSpin}deg)`;

        // Determine the winning section
        const finalAngle = randomSpin % 360;
        const winningIndex = Math.floor((360 - finalAngle) / sectionAngle);
        const winningSection = sections[winningIndex];

        // Log the activity
        logStudentActivity(`Wheel spun and landed on: ${winningSection.label}`);

        // Announce the winner after the spin animation
        setTimeout(() => {
            alert(`You landed on: ${winningSection.label}`);
            wheel.style.transition = 'none'; // Reset transition for the next spin
            wheel.style.transform = `rotate(${finalAngle}deg)`;
            setTimeout(() => { wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)'; }, 50);
        }, 5000);
    }

    spinButton.addEventListener('click', spin);
});

function logStudentActivity(activity) {
    const studentName = localStorage.getItem("studentName") || "Unknown Student";
    const studentClass = localStorage.getItem("studentClass") || "Unknown Class";

    const logEntry = {
        studentName,
        studentClass,
        activity,
        timestamp: new Date().toISOString(),
    };

    let activityLog = JSON.parse(localStorage.getItem("studentActivityLog")) || [];
    activityLog.push(logEntry);
    localStorage.setItem("studentActivityLog", JSON.stringify(activityLog));
}

