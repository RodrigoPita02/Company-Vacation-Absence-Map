document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionarios();
    carregarFerias();
    inicializarCalendario();
});

async function carregarFuncionarios() {
    const response = await fetch('http://localhost:5000/funcionarios');
    const funcionarios = await response.json();

    const select = document.getElementById('funcionarioSelect');  // Dropdown para selecionar o funcionário

    if (!select) {
        console.error("Erro: Dropdown de funcionários não encontrado.");
        return;
    }

    // Limpa e adiciona a opção inicial
    select.innerHTML = '<option value="">Selecione um funcionário</option>';

    funcionarios.forEach(func => {
        let option = document.createElement('option');
        option.value = func.id;  // O valor será o ID do funcionário
        option.textContent = func.nome;  // O texto será o nome do funcionário
        select.appendChild(option);  // Adiciona a opção à dropdown
    });

    console.log("Funcionários carregados com sucesso.");
}

// 🟢 Carregar os funcionários na dropdown
function carregarFuncionariosSelect(funcionarios) {
    const select = document.getElementById('funcionarioSelect');
    if (!select) {
        console.error("Erro: O elemento <select id='funcionarioSelect'> não foi encontrado.");
        return;
    }

    select.innerHTML = '<option value="">Selecione um funcionário</option>'; // Limpa e adiciona opção inicial

    funcionarios.forEach(f => {
        let option = document.createElement('option');
        option.value = f.id;
        option.textContent = f.nome;
        select.appendChild(option);
    });

    console.log("Funcionários carregados na dropdown com sucesso.");
}

// 🟢 Adicionar novas férias
async function adicionarFerias(event) {
    event.preventDefault(); // Evita recarregamento da página

    let funcionario_id = document.getElementById('funcionarioSelect').value;
    let data_inicio = document.getElementById('dataInicio').value;
    let data_fim = document.getElementById('dataFim').value;

    const response = await fetch('http://localhost:5000/ferias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funcionario_id, data_inicio, data_fim })
    });

    if (response.ok) {
        showFeedback('success', 'Férias adicionadas com sucesso!');
        carregarFerias();
    } else {
        showFeedback('error', 'Erro ao adicionar férias!');
    }
}

// 🟢 Carregar lista de férias na tabela e atualizar calendário
async function carregarFerias() {
    const response = await fetch('http://localhost:5000/ferias');
    const ferias = await response.json();

    let tabela = document.getElementById('feriasTableBody');
    tabela.innerHTML = ''; // Limpa a tabela

    ferias.forEach(f => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = f.nome;
        row.insertCell(1).textContent = f.data_inicio;
        row.insertCell(2).textContent = f.data_fim;
    });

    atualizarCalendario(ferias);
}

function atualizarCalendario(ferias) {
    let calendarioEl = document.getElementById('calendario');

    // Verifica se o calendário já existe para evitar duplicações
    if (calendarioEl.fullCalendarInstance) {
        calendarioEl.fullCalendarInstance.removeAllEvents();
        ferias.forEach(f => {
            // Corrige a data final ao adicionar 1 dia (já que o FullCalendar não inclui o último dia)
            let endDate = new Date(f.data_fim);
            endDate.setDate(endDate.getDate() + 1); // Adiciona 1 dia para corrigir o comportamento

            calendarioEl.fullCalendarInstance.addEvent({
                title: f.nome,
                start: f.data_inicio,
                end: endDate // Corrige a data final
            });
        });
    } else {
        let calendario = new FullCalendar.Calendar(calendarioEl, {
            locale: 'pt',
            initialView: 'dayGridMonth',
            events: ferias.map(f => {
                // Corrige a data final aqui também
                let endDate = new Date(f.data_fim);
                endDate.setDate(endDate.getDate() + 1);
                return {
                    title: f.nome,
                    start: f.data_inicio,
                    end: endDate
                };
            })
        });

        calendario.render();
        calendarioEl.fullCalendarInstance = calendario; // Salva referência
    }
}

// Função para inicializar o calendário
function inicializarCalendario() {
    let calendarioEl = document.getElementById('calendario'); // O elemento onde o calendário será renderizado

    let calendario = new FullCalendar.Calendar(calendarioEl, {
        locale: 'pt',  // Define o idioma como português
        initialView: 'dayGridMonth',  // Exibe o calendário no formato de mês
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('http://localhost:5000/ferias');  // Obtém as férias da API
                const ferias = await response.json();

                // Mapeia os dados das férias para o formato esperado pelo FullCalendar
                let eventos = ferias.map(f => {
                    // Adiciona 1 dia à data de fim para corrigir a exibição no calendário
                    let dataFim = new Date(f.data_fim);
                    dataFim.setDate(dataFim.getDate() + 1);  // Adiciona 1 dia à data de fim

                    return {
                        title: f.nome, // Título do evento, nome do funcionário
                        start: f.data_inicio, // Início das férias
                        end: dataFim.toISOString(),  // Fim das férias (corrigido)
                    };
                });
                // Sucesso ao carregar os eventos no calendário
                successCallback(eventos);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
                failureCallback(error);  // Caso haja falha ao carregar os eventos
            }
        }
    });

    calendario.render();  // Renderiza o calendário na página
}

// Função para mostrar feedback visual
function showFeedback(type, message) {
    let feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.innerHTML = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 3000);  // Remove o feedback após 3 segundos
}

// 🟢 Vincular evento ao botão de adicionar férias
document.getElementById('feriasForm').addEventListener('submit', adicionarFerias);
