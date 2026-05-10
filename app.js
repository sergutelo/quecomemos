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

// Botones de Tema
const btnThemeLight = document.getElementById('btn-theme-light');
const btnThemeDark = document.getElementById('btn-theme-dark');
const btnThemeSystem = document.getElementById('btn-theme-system');

// Ajuste local
// Estado persistente
let autoPurge = localStorage.getItem('autoPurge') === 'true';
let currentFontSize = localStorage.getItem('fontSize') || 'normal';
let currentTheme = localStorage.getItem('theme') || 'system';

function applyFontSize(size) {
  document.documentElement.classList.remove('font-large', 'font-xlarge');
  if (size === 'large') document.documentElement.classList.add('font-large');
  if (size === 'xlarge') document.documentElement.classList.add('font-xlarge');
  
  document.querySelectorAll('#btn-font-normal, #btn-font-large, #btn-font-xlarge').forEach(b => {
    if (b) b.classList.remove('active-font');
  });
  
  const activeBtn = document.getElementById('btn-font-' + size);
  if (activeBtn) activeBtn.classList.add('active-font');
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  
  document.querySelectorAll('#btn-theme-light, #btn-theme-dark, #btn-theme-system').forEach(b => {
    if (b) b.classList.remove('active-font');
  });
  
  const activeBtn = document.getElementById('btn-theme-' + theme);
  if (activeBtn) activeBtn.classList.add('active-font');
}

// Inicializar preferencias
applyFontSize(currentFontSize);
applyTheme(currentTheme);

// Escuchar cambios de sistema en tiempo real si el tema es 'system'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme === 'system') applyTheme('system');
});

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

// Abre el planificador con fecha y turno ya preseleccionados
function openPlannerFor(dateStr, mealType) {
  showView('view-add');             // Resetea defaults primero
  mealDateInput.value = dateStr;    // Sobreescribimos con la fecha del día pulsado
  mealDish1Input.value = '';
  mealDish2Input.value = '';
  const radio = document.getElementById(mealType === 'lunch' ? 'type-lunch' : 'type-dinner');
  if (radio) radio.checked = true;
  renderSuggestions();
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
    // data-date y data-type permiten abrir el planificador con contexto al pulsar
    mealsHtml = `<div class="no-meals no-meals-tap" data-date="${dateStr}" data-type="${type}" role="button" tabindex="0" aria-label="Planificar ${title} del ${dateStr}">
      <span class="no-meals-icon">+</span> PLANIFICAR
    </div>`;
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

  
  // Tap en "SIN PLANIFICAR" → abre planificador con fecha y turno preseleccionados
  document.querySelectorAll('.no-meals-tap').forEach(el => {
    const handler = () => openPlannerFor(el.dataset.date, el.dataset.type);
    el.addEventListener('click', handler);
    // Accesibilidad: teclado
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });

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

// Sincronizar con Reloj (Mejorado con Logs Persistentes)
btnShareWatch.addEventListener('click', () => {
  const debugConsole = document.getElementById('debug-console');
  const debugMsg = document.getElementById('debug-messages');
  
  if (debugConsole) {
    debugConsole.style.display = 'block';
    debugConsole.style.backgroundColor = '#1e1e1e'; 
    debugConsole.style.color = '#00ff00';           
  }
  
  if (debugMsg) debugMsg.innerHTML = '<div>> Iniciando...</div>';

  const log = (msg, color = '#00ff00') => {
    if (debugMsg) {
      debugMsg.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
      debugConsole.scrollTop = debugConsole.scrollHeight;
    }
    console.log(msg);
  };

  try {
    const todayDateStr = new Date().toISOString().split('T')[0];
    const futureMeals = {};
    
    Object.keys(plannedMeals).forEach(date => {
      if (date >= todayDateStr) {
        futureMeals[date] = plannedMeals[date];
      }
    });

    if (Object.keys(futureMeals).length === 0) {
      log("ERROR: No hay menús futuros.", "#ff3b30");
      alert("No hay menús futuros para sincronizar.");
      return;
    }

    const dataStr = JSON.stringify(futureMeals);
    log(`JSON generado: ${dataStr.length} bytes`);

    const base64Data = btoa(unescape(encodeURIComponent(dataStr)));
    const encodedData = encodeURIComponent(base64Data);
    const syncUrl = `quecomemos://sync?data=${encodedData}`;
    
    log(`URL lista (${syncUrl.length} chars)`);
    
    const a = document.createElement('a');
    a.href = syncUrl;
    document.body.appendChild(a);
    
    log("Lanzando petición al teléfono...", "#ffd700");
    a.click();
    
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
      log("¡Petición enviada!", "#00ff00");
      log("Si el móvil no reacciona, revisa permisos.", "#ffd700");
    }, 1000);

  } catch (err) {
    log("CRASH EN WEB: " + err.message, "#ff3b30");
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

// Ajustes: Accesibilidad y Recetas
if (btnFontNormal) btnFontNormal.addEventListener('click', () => { currentFontSize = 'normal'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });
if (btnFontLarge) btnFontLarge.addEventListener('click', () => { currentFontSize = 'large'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });
if (btnFontXlarge) btnFontXlarge.addEventListener('click', () => { currentFontSize = 'xlarge'; localStorage.setItem('fontSize', currentFontSize); applyFontSize(currentFontSize); });

if (btnThemeLight) btnThemeLight.addEventListener('click', () => applyTheme('light'));
if (btnThemeDark) btnThemeDark.addEventListener('click', () => applyTheme('dark'));
if (btnThemeSystem) btnThemeSystem.addEventListener('click', () => applyTheme('system'));

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
    let userRequestedUpdate = false;

    const showUpdateBanner = (worker) => {
      const toast = document.getElementById('update-toast');
      const btnUpdate = document.getElementById('btn-update-app');
      if (!toast || !btnUpdate) return;

      setTimeout(() => { toast.style.setProperty('display', 'flex', 'important'); }, 400);

      btnUpdate.onclick = () => {
        userRequestedUpdate = true;
        toast.style.display = 'none';
        if (worker) {
          worker.postMessage({ type: 'SKIP_WAITING' });
        } else {
          // Actualización silenciosa: solo recargar
          window.location.reload();
        }
      };
    };

    // ── Estrategia 1: actualización mientras la app está abierta ──────────
    navigator.serviceWorker.register('sw.js').then(reg => {

      // A) SW nuevo ya estaba esperando al abrir
      if (reg.waiting) {
        showUpdateBanner(reg.waiting);
      }

      // B) SW nuevo se descarga mientras la app está abierta
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(newWorker);
          }
        });
      });

      // Forzar comprobación de actualización al volver al foco
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update();
      });

    }).catch(err => console.error('Error al registrar SW.', err));

    // Recargar solo si el usuario lo pidió explícitamente
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (userRequestedUpdate) window.location.reload();
    });

    // ── Estrategia 2: detectar actualización silenciosa entre sesiones ────
    let versionCheckInterval;
    const requestVersionFromSW = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
        return true;
      }
      return false;
    };

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'SW_VERSION') {
        clearInterval(versionCheckInterval);
        const newVersion = event.data.version;
        const lastVersion = localStorage.getItem('sw-version');
        
        console.log(`[PWA] Versión SW actual: ${newVersion} (Última conocida: ${lastVersion})`);

        // Si hay una versión previa y no coincide
        if (lastVersion && lastVersion !== newVersion) {
          console.log("[PWA] ¡Detectada actualización! Mostrando banner...");
          showUpdateBanner(null);
        }
        localStorage.setItem('sw-version', newVersion);
      }
    });

    // --- TEST MANUAL: Si entras con ?forceUpdate=1, mostramos el banner sí o sí ---
    if (window.location.search.includes('forceUpdate=1')) {
      console.log("[PWA] Modo TEST detectado (?forceUpdate=1). Forzando banner...");
      showUpdateBanner(null);
    }

    // Intentar pedir la versión y reintentar si el SW aún no controla la página
    if (!requestVersionFromSW()) {
      versionCheckInterval = setInterval(requestVersionFromSW, 1000);
      setTimeout(() => clearInterval(versionCheckInterval), 5000);
    } else {
      // Pedir de nuevo tras un pequeño delay por si acaso
      setTimeout(requestVersionFromSW, 2000);
    }
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
