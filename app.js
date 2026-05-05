// Modelos de datos
let plannedMeals = JSON.parse(localStorage.getItem('plannedMeals')) || {};
let dishHistory = JSON.parse(localStorage.getItem('dishHistory')) || [];

// Tema eliminado para diseño Bauhaus (siempre Light/Primary)

// Elementos del DOM principales
const viewMain = document.getElementById('view-main');
const viewAdd = document.getElementById('view-add');
const viewSettings = document.getElementById('view-settings');

// Botones de Navegación
const fabAdd = document.getElementById('fab-add');
const btnBackAdd = document.getElementById('btn-back-add');
const btnBackSettings = document.getElementById('btn-back-settings');
const btnSettings = document.getElementById('btn-settings');
const btnShare = document.getElementById('btn-share');

// Formularios e inputs
const daysList = document.getElementById('days-list');
const btnSave = document.getElementById('btn-save');
const mealDateInput = document.getElementById('meal-date');
const mealDish1Input = document.getElementById('meal-dish-1');
const mealDish2Input = document.getElementById('meal-dish-2');
const suggestions1 = document.getElementById('suggestions-1');
const suggestions2 = document.getElementById('suggestions-2');

// Botones de Ajustes
const btnExport = document.getElementById('btn-export');
const btnImport = document.getElementById('btn-import');
const fileImport = document.getElementById('file-import');

// Iconos SVG
const iconTrash = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
// Migración de datos antigua (por si acaso)
function migrateData() {
  let needsSave = false;
  for (const date in plannedMeals) {
    if (Array.isArray(plannedMeals[date])) {
      const oldMeals = plannedMeals[date];
      plannedMeals[date] = { lunch: oldMeals, dinner: [] };
      needsSave = true;
    }
  }
  if (needsSave) saveData();
}
migrateData();

// Inicializar datos Mock
function initMockData() {
  if (Object.keys(plannedMeals).length === 0 && dishHistory.length === 0) {
    const today = new Date();
    
    for(let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      plannedMeals[dateStr] = { lunch: [], dinner: [] };
      
      if(i === 0) {
        plannedMeals[dateStr].lunch = ["Lentejas estofadas", "Ensalada verde"];
        plannedMeals[dateStr].dinner = ["Tortilla francesa"];
      }
      if(i === 1) {
        plannedMeals[dateStr].lunch = ["Macarrones con tomate"];
        plannedMeals[dateStr].dinner = ["Pescado a la plancha"];
      }
      if(i === 2) {
        plannedMeals[dateStr].lunch = ["Pechuga a la plancha", "Puré de patatas"];
      }
      if(i === 3) {
        plannedMeals[dateStr].dinner = ["Pizza casera"];
      }
      
      if (plannedMeals[dateStr].lunch.length === 0 && plannedMeals[dateStr].dinner.length === 0) {
        delete plannedMeals[dateStr];
      }
    }
    
    dishHistory = [
      "Lentejas estofadas", "Ensalada verde", "Macarrones con tomate", 
      "Pechuga a la plancha", "Puré de patatas", "Tortilla francesa",
      "Pescado a la plancha", "Arroz a la cubana", "Sopa de fideos",
      "Hamburguesa con queso", "Gazpacho", "Pizza casera"
    ];
    
    saveData();
  }
}

// Navegación de Vistas
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  if(viewId === 'view-main') {
    renderMainView();
  } else if (viewId === 'view-add') {
    mealDateInput.value = new Date().toISOString().split('T')[0];
    mealDish1Input.value = '';
    mealDish2Input.value = '';
    document.getElementById('type-lunch').checked = true;
    renderSuggestions();
  }
}

fabAdd.addEventListener('click', () => showView('view-add'));
btnBackAdd.addEventListener('click', () => showView('view-main'));
btnSettings.addEventListener('click', () => showView('view-settings'));
btnBackSettings.addEventListener('click', () => showView('view-main'));

// Formateo de fechas
const getDayName = (dateStr) => {
  const date = new Date(dateStr + "T12:00:00"); 
  const today = new Date();
  today.setHours(12,0,0,0);
  
  const diffTime = date - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'HOY';
  if (diffDays === 1) return 'MAÑANA';
  
  const options = { weekday: 'long' };
  const dayName = date.toLocaleDateString('es-ES', options);
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
};

const getFormattedDate = (dateStr) => {
  const date = new Date(dateStr + "T12:00:00");
  const options = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('es-ES', options);
};

// ==========================================
// RENDERIZADO Y SWIPE TO DELETE
// ==========================================
function deleteMeal(date, type, index) {
  plannedMeals[date][type].splice(index, 1);
  if (plannedMeals[date].lunch.length === 0 && plannedMeals[date].dinner.length === 0) {
    delete plannedMeals[date];
  }
  saveData();
  renderMainView();
}

function renderMealCard(dateStr, type, meals, icon, title) {
  let mealsHtml = '';
  
  if (!meals || meals.length === 0) {
    mealsHtml = `<div class="no-meals">SIN PLANIFICAR</div>`;
  } else {
    mealsHtml = meals.map((meal, index) => `
      <div class="meal-item-container">
        <div class="meal-item-bg">
          ${iconTrash}
        </div>
        <div class="meal-item-surface" data-date="${dateStr}" data-type="${type}" data-index="${index}">
          <span class="meal-text">${meal}</span>
          <button class="btn-delete" data-date="${dateStr}" data-type="${type}" data-index="${index}" aria-label="Eliminar plato">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    `).join('');
  }
  
  return `
    <div class="day-card">
      <div class="meal-type-title">${icon} ${title}</div>
      <div class="meal-items">${mealsHtml}</div>
    </div>
  `;
}

function renderMainView() {
  daysList.innerHTML = '';
  const today = new Date();
  
  for (let i = 0; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayData = plannedMeals[dateStr] || { lunch: [], dinner: [] };
    
    const container = document.createElement('div');
    container.className = 'day-container';
    container.innerHTML = `
      <div class="day-header">
        <div class="day-name">${getDayName(dateStr)}</div>
        <div class="day-date">${getFormattedDate(dateStr)}</div>
      </div>
      <div class="meal-cards-wrapper">
        ${renderMealCard(dateStr, 'lunch', dayData.lunch, '', 'COMIDA')}
        ${renderMealCard(dateStr, 'dinner', dayData.dinner, '', 'CENA')}
      </div>
    `;
    daysList.appendChild(container);
  }
  
  // Botones de borrar clásicos (para ratón/escritorio)
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar conflictos con swipe
      const date = btn.getAttribute('data-date');
      const type = btn.getAttribute('data-type');
      const index = btn.getAttribute('data-index');
      deleteMeal(date, type, index);
    });
  });

  // Gestos de Swipe
  attachSwipeGestures();
}

function attachSwipeGestures() {
  const surfaces = document.querySelectorAll('.meal-item-surface');
  surfaces.forEach(surface => {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    surface.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
      surface.classList.add('swiping');
    }, {passive: true});

    surface.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      // Permitimos solo arrastrar hacia la izquierda (números negativos)
      if (diff < 0) {
        // Limitamos visualmente hasta -100px para que no se salga de la pantalla antes de soltar
        const translateX = Math.max(diff, -150);
        surface.style.transform = `translateX(${translateX}px)`;
      } else {
        surface.style.transform = `translateX(0px)`;
      }
    }, {passive: true});

    surface.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      surface.classList.remove('swiping');
      
      const diff = currentX - startX;
      
      // Umbral para borrar: -70px
      if (diff < -70) {
        // Animar salida hacia la izquierda
        surface.style.transform = `translateX(-100%)`;
        
        // Esperar a que termine la animación para borrar
        setTimeout(() => {
          const date = surface.getAttribute('data-date');
          const type = surface.getAttribute('data-type');
          const index = surface.getAttribute('data-index');
          deleteMeal(date, type, index);
        }, 200);
      } else {
        // Vuelve a su sitio original (efecto muelle)
        surface.style.transform = `translateX(0)`;
      }
    });
  });
}

// ==========================================
// SUGERENCIAS Y LONG-PRESS (CONTEXT MENU)
// ==========================================
function renderSuggestions() {
  let suggestions = [...dishHistory].reverse().slice(0, 10);
  
  const createSuggestionBtns = (container, inputTarget) => {
    container.innerHTML = '';
    suggestions.forEach(dish => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-btn';
      btn.textContent = dish;
      btn.type = 'button'; 
      
      // Click normal = añadir sugerencia
      btn.addEventListener('click', () => {
        inputTarget.value = dish;
      });

      // Long press (móvil) o Click derecho (PC) para borrar historial
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Evitar el menú nativo
        const confirmar = confirm(`¿Quieres eliminar '${dish}' del historial de sugerencias?`);
        if (confirmar) {
          dishHistory = dishHistory.filter(d => d !== dish);
          saveData();
          renderSuggestions();
        }
      });

      // Implementación alternativa para móviles antiguos (polyfill de long press)
      let pressTimer;
      btn.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
          // Si pasan 600ms sin soltar el dedo, forzamos el contextmenu event
          const event = new Event('contextmenu');
          btn.dispatchEvent(event);
        }, 600);
      }, {passive: true});
      
      btn.addEventListener('touchend', () => clearTimeout(pressTimer));
      btn.addEventListener('touchmove', () => clearTimeout(pressTimer));

      container.appendChild(btn);
    });
  };
  
  createSuggestionBtns(suggestions1, mealDish1Input);
  createSuggestionBtns(suggestions2, mealDish2Input);
}

// Manejo de Datos
function saveData() {
  localStorage.setItem('plannedMeals', JSON.stringify(plannedMeals));
  localStorage.setItem('dishHistory', JSON.stringify(dishHistory));
}

function addToHistory(dish) {
  if(!dish) return;
  dish = dish.trim();
  dish = dish.charAt(0).toUpperCase() + dish.slice(1);
  
  if (!dishHistory.map(d => d.toLowerCase()).includes(dish.toLowerCase())) {
    dishHistory.push(dish);
  } else {
    dishHistory = dishHistory.filter(d => d.toLowerCase() !== dish.toLowerCase());
    dishHistory.push(dish);
  }
}

// Guardar Menú
btnSave.addEventListener('click', () => {
  const dateStr = mealDateInput.value;
  const mealType = document.querySelector('input[name="meal-type"]:checked').value;
  
  if (!dateStr) {
    alert("Por favor selecciona una fecha.");
    return;
  }
  
  const dish1 = mealDish1Input.value.trim();
  const dish2 = mealDish2Input.value.trim();
  
  if (!dish1 && !dish2) {
    alert("Introduce al menos un plato para guardar.");
    return;
  }
  
  if (!plannedMeals[dateStr]) {
    plannedMeals[dateStr] = { lunch: [], dinner: [] };
  } else if (!plannedMeals[dateStr].lunch) {
    plannedMeals[dateStr].lunch = [];
    plannedMeals[dateStr].dinner = [];
  }
  
  if (plannedMeals[dateStr][mealType] && plannedMeals[dateStr][mealType].length > 0) {
    const tipoTexto = mealType === 'lunch' ? 'comida' : 'cena';
    const confirmar = confirm(`Ya tienes planificada la ${tipoTexto} para esta fecha.\n\n¿Quieres sobrescribir el menú actual?`);
    if (!confirmar) return;
    plannedMeals[dateStr][mealType] = [];
  }
  
  const addDish = (dish) => {
    if (dish) {
      const formattedDish = dish.charAt(0).toUpperCase() + dish.slice(1);
      addToHistory(formattedDish);
      if (!plannedMeals[dateStr][mealType].includes(formattedDish)) {
        plannedMeals[dateStr][mealType].push(formattedDish);
      }
    }
  };
  
  addDish(dish1);
  addDish(dish2);
  
  saveData();
  showView('view-main');
});

// Compartir Menú
btnShare.addEventListener('click', async () => {
  if (Object.keys(plannedMeals).length === 0) {
    alert("Aún no has planificado ningún menú para compartir.");
    return;
  }

  let shareText = "🗓️ *NUESTRO MENÚ SEMANAL*\n\n";
  const dates = Object.keys(plannedMeals).sort();
  
  dates.forEach(dateStr => {
    const dayData = plannedMeals[dateStr];
    if (dayData.lunch.length > 0 || dayData.dinner.length > 0) {
      shareText += `*${getDayName(dateStr)} ${getFormattedDate(dateStr)}*\n`;
      if (dayData.lunch.length > 0) {
        shareText += `☀️ COMIDA: ${dayData.lunch.join(', ')}\n`;
      }
      if (dayData.dinner.length > 0) {
        shareText += `🌙 CENA: ${dayData.dinner.join(', ')}\n`;
      }
      shareText += "\n";
    }
  });

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("¡Menú copiado al portapapeles! Ya puedes pegarlo.");
      }).catch(() => {
        alert("Tu menú está listo pero hubo un error al copiarlo.");
      });
    }
  };

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Menú Semanal - Quecomemos',
        text: shareText
      });
    } catch (err) {
      console.log('Compartir nativo cancelado o fallido', err);
      copyToClipboard();
    }
  } else {
    copyToClipboard();
  }
});

// Exportar Datos
btnExport.addEventListener('click', () => {
  const data = {
    plannedMeals: plannedMeals,
    dishHistory: dishHistory,
    exportDate: new Date().toISOString()
  };
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quecomemos_backup.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});

// Importar Datos
btnImport.addEventListener('click', () => {
  fileImport.click();
});

fileImport.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.plannedMeals && data.dishHistory) {
        plannedMeals = data.plannedMeals;
        dishHistory = data.dishHistory;
        saveData();
        alert("✅ ¡Datos importados con éxito!");
        event.target.value = ''; 
        showView('view-main');
      } else {
        alert("❌ El archivo no es un backup válido.");
      }
    } catch (err) {
      alert("❌ Hubo un error al intentar leer el archivo.");
    }
  };
  reader.readAsText(file);
});

// Inicialización
initMockData();
renderMainView();

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.error('Error al registrar SW.', err));
  });
}
