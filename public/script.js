const form = document.getElementById('cvForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Construire l'objet à envoyer
    const data = {
        personalInfo: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            address: formData.get('address')
        },
        experiences: JSON.parse(formData.get('experiences')),
        skills: JSON.parse(formData.get('skills')),
        languages: JSON.parse(formData.get('languages'))
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
