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
const btnPrint = document.getElementById('btn-print');
const btnShopping = document.getElementById('btn-shopping');
const autoPurgeInput = document.getElementById('auto-purge');
const btnResetMenus = document.getElementById('btn-reset-menus');
const btnResetHistory = document.getElementById('btn-reset-history');
const btnOpenHistory = document.getElementById('btn-open-history');
const btnBackHistory = document.getElementById('btn-back-history');
const historyListContainer = document.getElementById('history-list');
const btnFontNormal = document.getElementById('btn-font-normal');
const btnFontLarge = document.getElementById('btn-font-large');
const btnFontXlarge = document.getElementById('btn-font-xlarge');

// Ajuste local
let autoPurge = localStorage.getItem('autoPurge') === 'true';
let currentFontSize = localStorage.getItem('fontSize') || 'normal';

function applyFontSize(size) {
  document.documentElement.className = '';
  if (size === 'large') document.documentElement.classList.add('font-large');
  if (size === 'xlarge') document.documentElement.classList.add('font-xlarge');
  
  if (btnFontNormal) {
    document.querySelectorAll('.btn-font').forEach(b => b.classList.remove('active-font'));
    if (size === 'normal') btnFontNormal.classList.add('active-font');
    if (size === 'large') btnFontLarge.classList.add('active-font');
    if (size === 'xlarge') btnFontXlarge.classList.add('active-font');
  }
}
applyFontSize(currentFontSize);

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

// Inicializar datos Mock y Purga
function initMockData() {
  if (autoPurge) {
    const today = new Date();
    today.setHours(0,0,0,0);
    let needsSave = false;
    for (const dateStr in plannedMeals) {
      const mealDate = new Date(dateStr + "T12:00:00");
      mealDate.setHours(0,0,0,0);
      if (mealDate < today) {
        delete plannedMeals[dateStr];
        needsSave = true;
      }
    }
    if (needsSave) saveData();
  }

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
  
  for (let i = 0; i <= 9; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayData = plannedMeals[dateStr] || { lunch: [], dinner: [] };
    
    const isExpanded = (i === 0 || i === 1);
    const expandClass = isExpanded ? 'expanded' : 'collapsed';

    const container = document.createElement('div');
    container.className = 'day-container';
    if (getDayName(dateStr) === 'HOY') {
      container.classList.add('is-today');
    }
    container.innerHTML = `
      <div class="day-header accordion-toggle" data-index="${i}">
        <div class="day-header-info">
          <div class="day-name">${getDayName(dateStr)}</div>
          <div class="day-date">${getFormattedDate(dateStr)}</div>
        </div>
        <div class="accordion-icon ${expandClass}">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      <div class="meal-cards-wrapper ${expandClass}">
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

  // Accordion Logic
  document.querySelectorAll('.accordion-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const icon = toggle.querySelector('.accordion-icon');
      const wrapper = toggle.nextElementSibling;
      const isCollapsed = icon.classList.contains('collapsed');
      
      if (isCollapsed) {
        icon.classList.remove('collapsed');
        icon.classList.add('expanded');
        wrapper.classList.remove('collapsed');
        wrapper.classList.add('expanded');
      } else {
        icon.classList.remove('expanded');
        icon.classList.add('collapsed');
        wrapper.classList.remove('expanded');
        wrapper.classList.add('collapsed');
      }
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

      container.appendChild(btn);
    });
  };
  
  createSuggestionBtns(suggestions1, mealDish1Input);
  createSuggestionBtns(suggestions2, mealDish2Input);
}

// Lógica de filtrado en tiempo real para las sugerencias
function setupSuggestionFiltering() {
  const filterSuggestions = (inputElem, container) => {
    inputElem.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const btns = container.querySelectorAll('.suggestion-btn');
      btns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(query)) {
          btn.style.display = 'inline-block';
        } else {
          btn.style.display = 'none';
        }
      });
    });
  };
  filterSuggestions(mealDish1Input, suggestions1);
  filterSuggestions(mealDish2Input, suggestions2);
}
setupSuggestionFiltering();

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

// Modal de Compartir
const shareModal = document.getElementById('share-modal');
const btnCloseShare = document.getElementById('btn-close-share');
const btnShareText = document.getElementById('btn-share-text');
const btnShareQr = document.getElementById('btn-share-qr');
const btnShareWatch = document.getElementById('btn-share-watch');
const qrContainer = document.getElementById('qr-container');
const qrcodeElem = document.getElementById('qrcode');
let currentQrCode = null;

btnShare.addEventListener('click', () => {
  if (Object.keys(plannedMeals).length === 0) {
    alert("Aún no has planificado ningún menú para compartir.");
    return;
  }
  qrContainer.style.display = 'none';
  shareModal.style.display = 'flex';
});

btnCloseShare.addEventListener('click', () => {
  shareModal.style.display = 'none';
});

// Compartir Menú por Texto
btnShareText.addEventListener('click', async () => {
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
      copyToClipboard();
    }
  } else {
    copyToClipboard();
  }
});

// Compartir por QR
btnShareQr.addEventListener('click', () => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const futureMeals = {};
  
  Object.keys(plannedMeals).forEach(date => {
    if (date >= todayDateStr) {
      futureMeals[date] = plannedMeals[date];
    }
  });
  
  const dataStr = JSON.stringify(futureMeals);
  const base64Data = btoa(unescape(encodeURIComponent(dataStr)));
  const url = window.location.origin + window.location.pathname + '?import=' + base64Data;
  
  if (currentQrCode) {
    currentQrCode.clear();
    qrcodeElem.innerHTML = '';
  }
  
  if (url.length > 2000) {
    alert("Tienes demasiados días planificados para un solo código QR. Por favor, usa la opción de exportar datos en Ajustes.");
    return;
  }
  
  currentQrCode = new QRCode(qrcodeElem, {
    text: url,
    width: 250,
    height: 250,
    colorDark : "#121212",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
  
  qrContainer.style.display = 'block';
});

// Sincronizar con Reloj (Vía App Puente)
btnShareWatch.addEventListener('click', () => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  const futureMeals = {};
  
  // Solo mandamos desde hoy en adelante para no saturar el buffer
  Object.keys(plannedMeals).forEach(date => {
    if (date >= todayDateStr) {
      futureMeals[date] = plannedMeals[date];
    }
  });

  if (Object.keys(futureMeals).length === 0) {
    alert("No hay menús futuros para sincronizar.");
    return;
  }

  const dataStr = JSON.stringify(futureMeals);
  // Codificación Base64 segura para URL
  const base64Data = btoa(unescape(encodeURIComponent(dataStr)));
  
  // Intentar abrir el esquema de la App Puente
  const syncUrl = `quecomemos://sync?data=${base64Data}`;
  
  window.location.href = syncUrl;

  // Feedback visual
  setTimeout(() => {
    shareModal.style.display = 'none';
    alert("Intentando conectar con el reloj...\n\nSi no tienes la app puente instalada, no ocurrirá nada.");
  }, 500);
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

// Ajustes: Accesibilidad y Recetas
btnFontNormal.addEventListener('click', () => { currentFontSize = 'normal'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });
btnFontLarge.addEventListener('click', () => { currentFontSize = 'large'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });
btnFontXlarge.addEventListener('click', () => { currentFontSize = 'xlarge'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });

btnOpenHistory.addEventListener('click', () => {
  showView('view-history');
  renderHistoryView();
});

btnBackHistory.addEventListener('click', () => showView('view-settings'));

function renderHistoryView() {
  historyListContainer.innerHTML = '';
  if (dishHistory.length === 0) {
    historyListContainer.innerHTML = '<p class="no-meals">NO HAY RECETAS GUARDADAS.</p>';
    return;
  }
  
  const sortedHistory = [...dishHistory].sort((a,b) => a.localeCompare(b));
  
  sortedHistory.forEach(dish => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <span>${dish}</span>
      <button class="btn-del-history" data-dish="${dish}" aria-label="Eliminar receta">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    historyListContainer.appendChild(div);
  });
  
  document.querySelectorAll('.btn-del-history').forEach(btn => {
    btn.addEventListener('click', () => {
      const dishToDel = btn.getAttribute('data-dish');
      if(confirm(`¿Eliminar '${dishToDel}' del historial?`)){
        dishHistory = dishHistory.filter(d => d !== dishToDel);
        saveData();
        renderHistoryView();
      }
    });
  });
}

// Ajustes: Nuevas Funciones
autoPurgeInput.checked = autoPurge;
autoPurgeInput.addEventListener('change', (e) => {
  autoPurge = e.target.checked;
  localStorage.setItem('autoPurge', autoPurge);
  if (autoPurge) {
    initMockData(); // Ejecuta la purga
    renderMainView();
  }
});

btnResetMenus.addEventListener('click', () => {
  if (confirm("🚨 ¿Seguro que quieres borrar TODOS los menús planificados?\n\nEsta acción no se puede deshacer.")) {
    plannedMeals = {};
    saveData();
    renderMainView();
    alert("Todos los menús han sido borrados.");
  }
});

btnResetHistory.addEventListener('click', () => {
  if (confirm("🚨 ¿Seguro que quieres borrar tu HISTORIAL de platos sugeridos?\n\nEsta acción no se puede deshacer.")) {
    dishHistory = [];
    saveData();
    alert("Historial de sugerencias borrado.");
  }
});

btnPrint.addEventListener('click', () => {
  showView('view-main');
  setTimeout(() => window.print(), 300);
});

btnShopping.addEventListener('click', () => {
  if (Object.keys(plannedMeals).length === 0) {
    alert("No hay menús planificados para hacer la lista.");
    return;
  }
  
  const dates = Object.keys(plannedMeals).sort();
  const allDishes = new Set();
  
  dates.forEach(dateStr => {
    const dayData = plannedMeals[dateStr];
    dayData.lunch.forEach(d => allDishes.add(d));
    dayData.dinner.forEach(d => allDishes.add(d));
  });
  
  let listText = "🛒 *LISTA DE LA COMPRA*\n\nIngredientes para:\n";
  allDishes.forEach(dish => {
    listText += `☐ ${dish}\n`;
  });
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(listText).then(() => {
      alert("¡Lista de la compra copiada al portapapeles!\n\nPégala en tus notas o WhatsApp.");
    }).catch(() => {
      alert("Error al copiar al portapapeles.");
    });
  }
});

// Inicialización
initMockData();
renderMainView();

// Registrar Service Worker y gestionar actualizaciones
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      
      // Detectar actualizaciones
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Hay una nueva versión disponible
            const toast = document.getElementById('update-toast');
            const btnUpdate = document.getElementById('btn-update-app');
            
            toast.style.display = 'flex';
            
            btnUpdate.addEventListener('click', () => {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            });
          }
        });
      });
    }).catch(err => console.error('Error al registrar SW.', err));

    // Recargar cuando el nuevo SW tome el control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// Recibir datos mágicos por QR
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('import')) {
    const base64Data = urlParams.get('import');
    try {
      const importedDataStr = decodeURIComponent(escape(atob(base64Data)));
      const importedMeals = JSON.parse(importedDataStr);
      
      setTimeout(() => {
        if (confirm("✨ ¡Alguien ha compartido un menú contigo!\n\n¿Quieres importarlo ahora y fusionarlo con el tuyo?")) {
          // Fusionar
          Object.keys(importedMeals).forEach(date => {
            if (!plannedMeals[date]) plannedMeals[date] = { lunch: [], dinner: [] };
            
            importedMeals[date].lunch.forEach(dish => {
               if(!plannedMeals[date].lunch.includes(dish)) plannedMeals[date].lunch.push(dish);
               addToHistory(dish);
            });
            importedMeals[date].dinner.forEach(dish => {
               if(!plannedMeals[date].dinner.includes(dish)) plannedMeals[date].dinner.push(dish);
               addToHistory(dish);
            });
          });
          
          saveData();
          renderMainView();
          alert("✅ Menú importado con éxito.");
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 500); // Dar tiempo a que la app cargue
    } catch (e) {
      alert("❌ Error al leer el código QR mágico.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
});
