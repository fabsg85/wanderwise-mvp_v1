// Variables globales / Selectores
const authSection = document.getElementById('auth-section');
const preferencesSection = document.getElementById('preferences-section');
const itinerarySection = document.getElementById('itinerary-section');
const socialSection = document.getElementById('social-section');

// Botones
const loginBtn = document.getElementById('loginBtn');
const savePreferencesBtn = document.getElementById('savePreferencesBtn');
const createItineraryBtn = document.getElementById('createItineraryBtn');
const postReviewBtn = document.getElementById('postReviewBtn');

// Inputs
const usernameInput = document.getElementById('username');
const budgetInput = document.getElementById('budget');
const destinationInput = document.getElementById('destination');
const daysInput = document.getElementById('days');
const reviewText = document.getElementById('reviewText');

// Result containers
const itineraryResult = document.getElementById('itinerary-result');
const reviewsContainer = document.getElementById('reviewsContainer');

// Checboxes de Intereses
const interestNature = document.getElementById('interestNature');
const interestCulture = document.getElementById('interestCulture');
const interestGastro = document.getElementById('interestGastro');

// 1. Revisa si ya hay un usuario logeado en Local Storage
window.onload = () => {
  const storedUser = localStorage.getItem('wanderwiseUser');
  if (storedUser) {
    // Mostrar secciones posteriores
    authSection.style.display = 'none';
    preferencesSection.style.display = 'block';
    itinerarySection.style.display = 'block';
    socialSection.style.display = 'block';
  }
};

// 2. Manejo de Login Simulado
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    // Guardar en local storage
    localStorage.setItem('wanderwiseUser', username);
    // Transición de pantalla
    authSection.style.display = 'none';
    preferencesSection.style.display = 'block';
    itinerarySection.style.display = 'block';
    socialSection.style.display = 'block';
  } else {
    alert('Por favor, ingresa un usuario válido.');
  }
});

// 3. Guardar Preferencias en Local Storage
savePreferencesBtn.addEventListener('click', () => {
  const budget = budgetInput.value;
  const interests = [];
  if (interestNature.checked) interests.push('naturaleza');
  if (interestCulture.checked) interests.push('cultura');
  if (interestGastro.checked) interests.push('gastronomia');

  const preferences = {
    budget,
    interests
  };
  localStorage.setItem('wanderwisePreferences', JSON.stringify(preferences));
  alert('Preferencias guardadas.');
});

// 4. Crear Itinerario Basado en Reglas Simples
createItineraryBtn.addEventListener('click', () => {
  const destination = destinationInput.value.trim();
  const days = parseInt(daysInput.value, 10);
  
  if (!destination || !days) {
    alert('Por favor, ingresa destino y número de días.');
    return;
  }
  
  // Ejemplo de reglas sencillas (mock):
  // Obtenemos las preferencias del usuario
  const pref = JSON.parse(localStorage.getItem('wanderwisePreferences')) || {};
  const { budget = 0, interests = [] } = pref;

  let recommendation = '';
  // Regla de ejemplo: si presupuesto < 300 => sugerimos destinos/actividades baratas
  if (budget < 300) {
    recommendation += `- Alojamiento económico en el centro.\n`;
  } else {
    recommendation += `- Hotel 3 o 4 estrellas cerca de la zona turística.\n`;
  }
  // Intereses
  if (interests.includes('naturaleza')) {
    recommendation += `- Visitar parques naturales y reservas cercanas.\n`;
  }
  if (interests.includes('cultura')) {
    recommendation += `- Tour por museos y monumentos históricos.\n`;
  }
  if (interests.includes('gastronomia')) {
    recommendation += `- Explorar restaurantes típicos y mercados locales.\n`;
  }

  // Generamos un itinerario simple por día
  let itineraryText = `Itinerario para ${destination} durante ${days} días:\n\n`;
  for (let i = 1; i <= days; i++) {
    itineraryText += `Día ${i}: ${recommendation}\n`;
  }

  // Mostramos resultado en pantalla
  itineraryResult.innerText = itineraryText;
});

// 5. Manejar la Publicación de Reseñas (Zona Social)
postReviewBtn.addEventListener('click', () => {
  const text = reviewText.value.trim();
  if (!text) {
    alert('Por favor, escribe tu reseña antes de publicar.');
    return;
  }
  
  // Obtenemos reseñas previas de Local Storage
  let existingReviews = JSON.parse(localStorage.getItem('wanderwiseReviews')) || [];
  
  // Agregamos la nueva reseña
  const username = localStorage.getItem('wanderwiseUser') || 'Anónimo';
  const newReview = {
    username,
    text,
    date: new Date().toLocaleString()
  };
  existingReviews.push(newReview);

  // Guardamos en local storage
  localStorage.setItem('wanderwiseReviews', JSON.stringify(existingReviews));

  // Limpiamos el textarea
  reviewText.value = '';

  // Refrescamos el listado de reseñas
  displayReviews();
});

// Función para Mostrar las Reseñas en Pantalla
function displayReviews() {
  reviewsContainer.innerHTML = '';
  const existingReviews = JSON.parse(localStorage.getItem('wanderwiseReviews')) || [];
  existingReviews.forEach((review) => {
    const div = document.createElement('div');
    div.classList.add('review-item');
    div.innerHTML = `
      <strong>${review.username}</strong> <em>${review.date}</em><br/>
      <p>${review.text}</p>
      <hr/>
    `;
    reviewsContainer.appendChild(div);
  });
}

// Llamamos a displayReviews cuando cargue la página
displayReviews();
