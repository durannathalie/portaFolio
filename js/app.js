
let recursos = [];
let chart;
let darkMode = false;


const homeView = document.getElementById('homeView');
const resourcesView = document.getElementById('resourcesView');

const form = document.getElementById('resourceForm');
const resourceId = document.getElementById('resourceId');

const nombreInput = document.getElementById('nombre');
const rolInput = document.getElementById('rol');
const proyectoInput = document.getElementById('proyecto');
const horasInput = document.getElementById('horas');

const errorMsg = document.getElementById('errorMsg');
const table = document.getElementById('resourceTable');

const totalRecursos = document.getElementById('totalRecursos');
const totalHoras = document.getElementById('totalHoras');
const recursosActivos = document.getElementById('recursosActivos');

const chartCanvas = document.getElementById('projectChart');


const showView = (view) => {
    homeView.classList.add('d-none');
    resourcesView.classList.add('d-none');
    document.getElementById(view + 'View').classList.remove('d-none');
};


const toggleDarkMode = () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
};


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = resourceId.value;
    const nombre = nombreInput.value.trim();
    const rol = rolInput.value.trim();
    const proyecto = proyectoInput.value.trim();
    const horas = Number(horasInput.value);

    if (!nombre || !rol || !proyecto || horas <= 0) {
        errorMsg.textContent = 'Todos los campos son obligatorios y las horas deben ser mayores a 0';
        return;
    }

    errorMsg.textContent = '';

    if (id) {
        const recurso = recursos.find(r => r.id === Number(id));
        recurso.nombre = nombre;
        recurso.rol = rol;
        recurso.proyecto = proyecto;
        recurso.horas = horas;
    } else {
        recursos.push({
            id: Date.now(),
            nombre,
            rol,
            proyecto,
            horas,
            estado: 'Activo'
        });
    }

    form.reset();
    resourceId.value = '';
    renderApp();
});


const renderApp = () => {
    renderTable();
    renderMetrics();
    renderChart();
};


const renderTable = () => {
    table.innerHTML = '';

    recursos.forEach((r) => {
        table.innerHTML += `
      <tr>
        <td>${r.nombre}</td>
        <td>${r.rol}</td>
        <td>${r.proyecto}</td>
        <td>${r.horas}</td>
        <td>
          <span class="badge bg-success">${r.estado}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editResource(${r.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteResource(${r.id})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
    });
};


const editResource = (id) => {
    const r = recursos.find(r => r.id === id);

    resourceId.value = r.id;
    nombreInput.value = r.nombre;
    rolInput.value = r.rol;
    proyectoInput.value = r.proyecto;
    horasInput.value = r.horas;

    showView('resources');
};


const deleteResource = (id) => {
    recursos = recursos.filter(r => r.id !== id);
    renderApp();
};


const renderMetrics = () => {
    totalRecursos.textContent = recursos.length;
    totalHoras.textContent = recursos.reduce((acc, r) => acc + r.horas, 0);
    recursosActivos.textContent = recursos.length;
};


const renderChart = () => {
    const data = {};

    recursos.forEach(r => {
        data[r.proyecto] = (data[r.proyecto] || 0) + r.horas;
    });

    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Horas por proyecto',
                data: Object.values(data),
                backgroundColor: '#0d6efd'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};
