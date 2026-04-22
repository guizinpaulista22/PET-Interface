// ===== NAVEGAÇÃO =====
const sectionTitles = {
  indicadores: 'Painel de Indicadores',
  fluxo: 'Gestão de Fluxo',
  calendario: 'Calendário da Unidade',
  relatorios: 'Gerar Relatórios',
  mapa: 'Mapa de Georreferenciamento'
};

function isMobile() {
  return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
}

function closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar || !backdrop) return;
  sidebar.classList.remove('open');
  backdrop.classList.remove('open');
}

function openSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar || !backdrop) return;
  sidebar.classList.add('open');
  backdrop.classList.add('open');
}

function toggleSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar || !backdrop) return;

  const willOpen = !sidebar.classList.contains('open');
  if (willOpen) openSidebarMobile();
  else closeSidebarMobile();
}

function showSection(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  el.classList.add('active');
  document.getElementById('topbar-title').textContent = sectionTitles[id];

  // No celular, fecha o menu após escolher uma seção
  if (isMobile()) closeSidebarMobile();
}

// Fechar menu com ESC (bom no desktop/mobile com teclado)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebarMobile();
});

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== MODAL =====
function openModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// Fechar modal ao clicar fora
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ===== ALERTA VACINAÇÃO =====
function gerarRelatorioVacina() {
  document.getElementById('alerta-vac').style.display = 'none';
  openModal(
    '✅ Relatório de Vacinação Gerado',
    'O relatório de vacinação foi gerado com sucesso e está disponível para download na seção "Gerar Relatórios". Período: Janeiro a Março de 2026.'
  );
}

// Simula download (TXT) só para demonstrar o comportamento
function downloadRelatorio(nomeArquivo, conteudo) {
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function dispensarAlerta() {
  document.getElementById('alerta-vac').style.display = 'none';
  showToast('Alerta dispensado. Você pode gerar o relatório depois.');
}

// ===== RELATÓRIOS =====
function gerarRelatorio(tipo) {
  // Mantém apenas a parte de download (sem DataSUS)
  openModal(
    `📄 Relatório de ${tipo}`,
    `O relatório de "${tipo}" foi gerado com sucesso para a UBS Juvêncio Gama referente ao mês de Março/2026. Clique em "Fechar" e o download será iniciado (simulação).`
  );

  // Inicia "download" após um pequeno delay para dar tempo de abrir o modal
  setTimeout(() => {
    const conteudo =
`Relatório: ${tipo}
Unidade: UBS Juvêncio Gama
Período: Março/2026

(Conteúdo de exemplo)
- Item 1
- Item 2
- Item 3
`;
    downloadRelatorio(`relatorio-${tipo.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.txt`, conteudo);
  }, 300);
}

// ===== GRÁFICO DE BARRAS =====
const dadosGrafico = [
  { mes: 'Jan', tv: 320, pnm: 280, covid: 150 },
  { mes: 'Fev', tv: 290, pnm: 310, covid: 180 },
  { mes: 'Mar', tv: 220, pnm: 240, covid: 120 },
  { mes: 'Abr', tv: 180, pnm: 200, covid: 90  },
  { mes: 'Mai', tv: 160, pnm: 170, covid: 80  },
];

const maxVal = 400;

function renderChart() {
  const container = document.getElementById('barChart');
  container.innerHTML = '';

  dadosGrafico.forEach(d => {
    const group = document.createElement('div');
    group.className = 'bar-group';

    const bars = document.createElement('div');
    bars.className = 'bars';

    const makeBar = (val, color, label) => {
      const b = document.createElement('div');
      b.className = 'bar';
      b.style.height = (val / maxVal * 160) + 'px';
      b.style.background = color;
      b.setAttribute('data-val', `${label}: ${val}`);
      return b;
    };

    bars.appendChild(makeBar(d.tv,    '#1a7a4a', 'Tríplice Viral'));
    bars.appendChild(makeBar(d.pnm,   '#1565C0', 'PNM-10'));
    bars.appendChild(makeBar(d.covid, '#e53935', 'Covid-19'));

    const label = document.createElement('div');
    label.className = 'bar-group-label';
    label.textContent = d.mes;

    group.appendChild(bars);
    group.appendChild(label);
    container.appendChild(group);
  });
}

renderChart();

// ===== CALENDÁRIO =====
let calYear = 2026;
let calMonth = 2; // 0-indexed: 2 = Março

const eventos = {
  '2026-2': {
    1:  ['ferias-uni', 'Férias Dra. Luiza'],
    2:  ['ferias-uni', 'Férias Dra. Luiza'],
    3:  ['ferias-uni', 'Férias Dra. Luiza'],
    4:  ['ferias-uni', 'Férias Dra. Luiza'],
    5:  ['ferias-uni', 'Férias Dra. Luiza'],
    6:  ['feriado-mun', 'Feriado Municipal'],
    7:  ['ferias-uni', 'Férias Dra. Luiza'],
    8:  ['ferias-uni', 'Férias Dra. Luiza'],
    9:  ['ferias-uni', 'Férias Dra. Luiza'],
    10: ['ferias-uni', 'Férias Dra. Luiza'],
    11: ['ferias-uni', 'Férias Dra. Luiza'],
    12: ['ferias-uni', 'Férias Dra. Luiza'],
    13: ['acao-saude', 'HIPERDIA Enf. Paula/Dr. Maria'],
    14: ['ferias-uni', 'Fim Férias Dra. Luiza'],
    19: ['feriado-nac', 'Feriado Nacional'],
    27: ['acao-saude', 'HIPERDIA Enf. João/Dr. Lucas'],
  }
};

const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

function renderCalendar() {
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  document.getElementById('cal-month-label').textContent =
    `${monthNames[calMonth].toUpperCase()} ${calYear}`;

  const dayNames = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
  dayNames.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const key = `${calYear}-${calMonth}`;
  const evts = eventos[key] || {};

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day';

    const isToday = (
      calYear === today.getFullYear() &&
      calMonth === today.getMonth() &&
      d === today.getDate()
    );
    if (isToday) cell.classList.add('today');

    if (evts[d]) {
      cell.classList.add(evts[d][0]);
      cell.title = evts[d][1];
      cell.onclick = () => showToast(`${d}/${calMonth + 1}: ${evts[d][1]}`);
    } else {
      cell.onclick = () => showToast(`${d}/${calMonth + 1} — Sem evento agendado`);
    }

    const num = document.createElement('span');
    num.textContent = d;
    cell.appendChild(num);

    if (evts[d]) {
      const tag = document.createElement('div');
      tag.className = 'cal-tag';
      tag.textContent = evts[d][1].split(' ')[0];
      cell.appendChild(tag);
    }

    grid.appendChild(cell);
  }
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  renderCalendar();
}

renderCalendar();


