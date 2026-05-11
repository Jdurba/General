// ════════════════════════════════════════════════════════════════
//  ConfigTodos.js — Utilidades compartidas Adinor
//  Ubicación: repo "General" (raíz)
//  Carga:     desde cada HTML, antes de cualquier script propio
//
//  Provee:
//    · aviso(mensaje)               — modal con botón Aceptar
//    · confirmar(mensaje, callback) — modal con Aceptar/Cancelar
//    · volverAlMenu()               — vuelve a General/index.html
//    · Bloqueo de impresión (Ctrl+P, menú navegador, CSS @media print)
//
//  Configuración por página (opcional):
//    window.ADINOR_CONFIG = {
//      tituloModal: 'Adinor · Vitrinas',   // cabecera del modal
//      regresarASubMenuPA: true            // solo para PAMontada/PAMontAbatible
//    };
// ════════════════════════════════════════════════════════════════
(function () {

  // ── Configuración por página ─────────────────────────────────
  const cfg = window.ADINOR_CONFIG || {};
  const tituloModal = cfg.tituloModal || 'Adinor';

  // ── 1. CSS inyectado (@media print) ──────────────────────────
  const estilos = document.createElement('style');
  estilos.textContent = `
    @media print {
      body * { display: none !important; }
      body::after {
        display: block !important;
        content: "La impresion no esta disponible. Utiliza el boton PDF para generar el documento.";
        font-size: 18px;
        color: #2D3A4B;
        text-align: center;
        margin-top: 40mm;
        padding: 0 20mm;
      }
    }
  `;
  document.head.appendChild(estilos);

  // ── 2. Sistema de modal aviso/confirmar ──────────────────────
  function _crearModalDOM() {
    if (document.getElementById('_modal-aviso')) return;
    const overlay = document.createElement('div');
    overlay.id = '_modal-aviso';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:99999;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:#F4F0E8;border-radius:10px;overflow:hidden;width:340px;max-width:90vw;box-shadow:0 8px 32px rgba(0,0,0,0.25);">
        <div style="background:#2D3A4B;padding:13px 20px;">
          <p style="margin:0;font-size:11px;font-weight:500;color:#ffffff;letter-spacing:0.5px;text-transform:uppercase;font-family:'Jost',sans-serif;">${tituloModal}</p>
        </div>
        <div style="padding:22px 22px 18px;background:#F4F0E8;">
          <p id="_modal-msg" style="margin:0 0 20px;font-size:14px;color:#2D3A4B;line-height:1.6;font-family:'Jost',sans-serif;font-weight:300;"></p>
          <div id="_modal-btns" style="display:flex;justify-content:flex-end;gap:10px;"></div>
        </div>
      </div>`;
    if (document.body) {
      document.body.appendChild(overlay);
    } else {
      document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay));
    }
  }

  function aviso(mensaje) {
    _crearModalDOM();
    const overlay = document.getElementById('_modal-aviso');
    document.getElementById('_modal-msg').textContent = mensaje;
    const btns = document.getElementById('_modal-btns');
    btns.innerHTML = '';
    const btnAceptar = document.createElement('button');
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.style.cssText = 'background:#6B7FB8;color:#fff;border:none;border-radius:6px;padding:8px 26px;font-size:13px;font-family:inherit;cursor:pointer;';
    btnAceptar.onclick = () => { overlay.style.display = 'none'; };
    btns.appendChild(btnAceptar);
    overlay.style.display = 'flex';
    btnAceptar.focus();
  }

  function confirmar(mensaje, callbackSi) {
    _crearModalDOM();
    const overlay = document.getElementById('_modal-aviso');
    document.getElementById('_modal-msg').textContent = mensaje;
    const btns = document.getElementById('_modal-btns');
    btns.innerHTML = '';
    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.style.cssText = 'background:transparent;color:#2D3A4B;border:0.5px solid #2D3A4B;border-radius:6px;padding:8px 20px;font-size:13px;font-family:inherit;cursor:pointer;';
    btnCancelar.onclick = () => { overlay.style.display = 'none'; };
    const btnAceptar = document.createElement('button');
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.style.cssText = 'background:#6B7FB8;color:#fff;border:none;border-radius:6px;padding:8px 26px;font-size:13px;font-family:inherit;cursor:pointer;';
    btnAceptar.onclick = () => { overlay.style.display = 'none'; callbackSi(); };
    btns.appendChild(btnCancelar);
    btns.appendChild(btnAceptar);
    overlay.style.display = 'flex';
    btnCancelar.focus();
  }

  // ── 3. Bloqueo de impresión ──────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      e.stopPropagation();
      aviso('La impresión no está disponible. Utiliza el botón PDF para generar el documento.');
    }
  });
  window.addEventListener('beforeprint', function (e) {
    e.stopImmediatePropagation();
  });

  // ── 4. Navegación al menú principal ──────────────────────────
  function volverAlMenu() {
    if (cfg.regresarASubMenuPA) {
      localStorage.setItem('regresarASubMenuPA', '1');
    }
    window.location.href = location.hostname.endsWith('github.io')
      ? 'https://jdurba.github.io/General/index.html'
      : '../General/index.html';
  }

  // ── Exponer al ámbito global ─────────────────────────────────
  window.aviso = aviso;
  window.confirmar = confirmar;
  window.volverAlMenu = volverAlMenu;

})();
