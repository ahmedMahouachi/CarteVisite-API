const form = document.getElementById('cvForm');
const resultDiv = document.getElementById('result');

// Gestion des expériences
const experiencesList = document.getElementById('experiencesList');
const addExperienceBtn = document.getElementById('addExperienceBtn');

addExperienceBtn.addEventListener('click', () => {
    const index = experiencesList.children.length;
    const expDiv = document.createElement('div');
    expDiv.classList.add('experience');
    expDiv.innerHTML = `
        <input type="text" name="position${index}" placeholder="Poste" required>
        <input type="text" name="company${index}" placeholder="Entreprise" required>
        <input type="text" name="duration${index}" placeholder="Durée" required>
        <textarea name="description${index}" placeholder="Description" required></textarea>
    `;
    experiencesList.appendChild(expDiv);
});

// Gestion des compétences
const skillsList = document.getElementById('skillsList');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillInput = document.getElementById('skillInput');

addSkillBtn.addEventListener('click', () => {
    if(skillInput.value.trim() === '') return;
    const li = document.createElement('li');
    li.textContent = skillInput.value.trim();
    skillsList.appendChild(li);
    skillInput.value = '';
});

// Gestion des langues
const langsList = document.getElementById('langsList');
const addLangBtn = document.getElementById('addLangBtn');
const langInput = document.getElementById('langInput');

addLangBtn.addEventListener('click', () => {
    if(langInput.value.trim() === '') return;
    const li = document.createElement('li');
    li.textContent = langInput.value.trim();
    langsList.appendChild(li);
    langInput.value = '';
});

// Envoi du formulaire
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const experiences = Array.from(document.querySelectorAll('.experience')).map(exp => ({
        position: exp.querySelector(`[name^="position"]`).value,
        company: exp.querySelector(`[name^="company"]`).value,
        duration: exp.querySelector(`[name^="duration"]`).value,
        description: exp.querySelector(`[name^="description"]`).value
    }));

    const skills = Array.from(skillsList.children).map(li => li.textContent);
    const languages = Array.from(langsList.children).map(li => li.textContent);

    const data = {
        personalInfo: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            address: formData.get('address')
        },
        experiences,
        skills,
        languages
    };

    try {
        const response = await fetch('http://localhost:3001/user/generatecv/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `<p style="color:green;">${result.message}</p>
                                   <a href="${result.cvLink}" target="_blank">Télécharger le CV</a>`;
        } else {
            resultDiv.innerHTML = `<p style="color:red;">${result.message}</p>`;
        }
    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = `<p style="color:red;">Erreur serveur. Veuillez réessayer.</p>`;
    }
});
