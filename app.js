let biblia = {};
let libroSelect = document.getElementById('libroSelect');
let capituloSelect = document.getElementById('capituloSelect');
let resultadoDiv = document.getElementById('resultado');

fetch('biblia.json')
  .then(res => res.json())
  .then(data => {
    biblia = data;
    cargarLibros();
  });

function cargarLibros() {
  Object.keys(biblia).forEach(libro => {
    const option = document.createElement('option');
    option.value = libro;
    option.textContent = libro;
    libroSelect.appendChild(option);
  });
}

function cargarCapitulos() {
  capituloSelect.innerHTML = '<option value="">-- Selecciona un capítulo --</option>';
  const libro = libroSelect.value;
  if (!libro || !biblia[libro]) return;

  const capitulos = Object.keys(biblia[libro]);
  capitulos.forEach(cap => {
    const option = document.createElement('option');
    option.value = cap;
    option.textContent = `Capítulo ${cap}`;
    capituloSelect.appendChild(option);
  });
}

function mostrarVersiculos() {
  resultadoDiv.innerHTML = '';
  const libro = libroSelect.value;
  const cap = capituloSelect.value;
  if (!libro || !cap) return;

  const versiculos = biblia[libro][cap];
  for (let num in versiculos) {
    const p = document.createElement('p');
    p.className = 'versiculo';
    p.textContent = `${num}. ${versiculos[num]}`;
    resultadoDiv.appendChild(p);
  }
}

function buscarVersiculo() {
  const input = document.getElementById('versiculoInput').value.trim();
  const match = input.match(/^(.+?)\s+(\d+):(\d+)$/);
  resultadoDiv.innerHTML = '';

  if (!match) {
    resultadoDiv.innerHTML = '<p style="color:red">❌ Formato incorrecto. Usa Libro 1:1</p>';
    return;
  }

  const [_, libro, cap, ver] = match;
  if (biblia[libro] && biblia[libro][cap] && biblia[libro][cap][ver]) {
    const p = document.createElement('p');
    p.className = 'versiculo';
    p.textContent = `${libro} ${cap}:${ver} — ${biblia[libro][cap][ver]}`;
    resultadoDiv.appendChild(p);
  } else {
    resultadoDiv.innerHTML = '<p style="color:red">❌ Versículo no encontrado.</p>';
  }
}

function generarDevocional() {
  const libros = Object.keys(biblia);
  const libro = libros[Math.floor(Math.random() * libros.length)];

  const capitulos = Object.keys(biblia[libro]);
  const capitulo = capitulos[Math.floor(Math.random() * capitulos.length)];

  const versiculos = Object.keys(biblia[libro][capitulo]);
  const versiculo = versiculos[Math.floor(Math.random() * versiculos.length)];

  const texto = biblia[libro][capitulo][versiculo];
  document.getElementById('devocionalTexto').innerHTML = `<strong>${libro} ${capitulo}:${versiculo}</strong> — ${texto}`;
}

// Mostrar uno al cargar
window.onload = () => {
  generarDevocional();
};

function buscarTema() {
  const palabra = document.getElementById("buscadorTema").value.trim().toLowerCase();
  const contenedor = document.getElementById("resultadosTema");
  contenedor.innerHTML = '';

  if (!palabra) {
    contenedor.innerHTML = '<p style="color: red;">⚠️ Ingresa una palabra para buscar.</p>';
    return;
  }

  let encontrados = [];

  for (let libro in biblia) {
    for (let capitulo in biblia[libro]) {
      for (let versiculo in biblia[libro][capitulo]) {
        const texto = biblia[libro][capitulo][versiculo].toLowerCase();
        if (texto.includes(palabra)) {
          encontrados.push({
            ref: `${libro} ${capitulo}:${versiculo}`,
            texto: biblia[libro][capitulo][versiculo]
          });
        }
      }
    }
  }

  if (encontrados.length === 0) {
    contenedor.innerHTML = `<p style="color:red;">❌ No se encontraron resultados para "${palabra}".</p>`;
    return;
  }

  contenedor.innerHTML = `<p>🔎 Se encontraron <strong>${encontrados.length}</strong> resultados para "<strong>${palabra}</strong>":</p>`;
  encontrados.forEach(v => {
    const p = document.createElement("p");
    p.className = "versiculo";
    p.textContent = `${v.ref} — ${v.texto}`;
    contenedor.appendChild(p);
  });
}


