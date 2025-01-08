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

// 🟢 Função para carregar férias e atualizar o calendário
async function carregarFerias() {
    const response = await fetch('http://localhost:5000/ferias');
    const ferias = await response.json();

    const feriasTableBody = document.getElementById('feriasTableBody');
    feriasTableBody.innerHTML = ''; // Limpa a tabela

    ferias.forEach(feria => {
        const row = document.createElement('tr');
        
        // Formata as datas para remover a parte da hora
        const dataInicioFormatted = new Date(feria.data_inicio).toLocaleDateString('pt-PT');
        const dataFimFormatted = new Date(feria.data_fim).toLocaleDateString('pt-PT');

        row.innerHTML = `
            <td>${feria.nome}</td> <!-- Corrigido: agora usa 'nome' diretamente -->
            <td>${dataInicioFormatted}</td> <!-- Exibindo a data formatada -->
            <td>${dataFimFormatted}</td> <!-- Exibindo a data formatada -->
            <td>
                <button class="action-btn edit" onclick="editarFerias(${feria.id})">Editar</button>
                <button class="action-btn delete" onclick="excluirFerias(${feria.id})">Excluir</button>
            </td>
        `;
        
        feriasTableBody.appendChild(row);
    });
}

// Função para editar férias
async function editarFerias(id) {
    const response = await fetch(`http://localhost:5000/ferias/${id}`);
    const feria = await response.json();

    // Carrega os funcionários no dropdown
    const funcionariosResponse = await fetch('http://localhost:5000/funcionarios');
    const funcionarios = await funcionariosResponse.json();

    const funcionarioSelect = document.getElementById('modalFuncionarioSelect');
    funcionarioSelect.innerHTML = '<option value="">Selecione um funcionário</option>';
    
    funcionarios.forEach(funcionario => {
        const option = document.createElement('option');
        option.value = funcionario.id;
        option.textContent = funcionario.nome;
        funcionarioSelect.appendChild(option);
    });

    // Preenche os campos do modal com os dados das férias
    document.getElementById('modalDataInicio').value = feria.data_inicio.split('T')[0];
    document.getElementById('modalDataFim').value = feria.data_fim.split('T')[0];

    // Exibe o modal
    const modal = document.getElementById('editarFeriasModal');
    modal.style.display = 'block';

    // Função de cancelar
    document.getElementById('cancelarEditarFerias').onclick = () => {
        modal.style.display = 'none';
    };

    // Altera o comportamento do formulário de edição
    const form = document.getElementById('editarFeriasForm');
    form.onsubmit = async (event) => {
        event.preventDefault();

        const funcionario_id = document.getElementById('modalFuncionarioSelect').value;
        const data_inicio = document.getElementById('modalDataInicio').value;
        const data_fim = document.getElementById('modalDataFim').value;

        // Faz a requisição para atualizar as férias
        const updateResponse = await fetch(`http://localhost:5000/ferias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcionario_id, data_inicio, data_fim })
        });

        if (updateResponse.ok) {
            alert('Férias atualizadas com sucesso!');
            carregarFerias();
            inicializarCalendario();
            modal.style.display = 'none';
        } else {
            alert('Erro ao atualizar férias');
        }
    };
}

// Função para excluir férias
async function excluirFerias(id) {
    const response = confirm('Tem certeza de que deseja excluir as férias?');
    
    if (response) {
        const deleteResponse = await fetch(`http://localhost:5000/ferias/${id}`, { method: 'DELETE' });

        if (deleteResponse.ok) {
            alert('Férias excluídas com sucesso!');
            inicializarCalendario();
            carregarFerias();
        } else {
            alert('Erro ao excluir férias');
        }
    }
}

// Carregar as férias na tabela ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarFerias);

function atualizarCalendario(ferias) {
    let calendarioEl = document.getElementById('calendario');

    if (calendarioEl.fullCalendarInstance) {
        calendarioEl.fullCalendarInstance.destroy();
    }

    console.log("📅 Atualizando calendário com eventos:");
    console.table(ferias);  // 🔴 Exibe os eventos formatados no console para debug

    let calendario = new FullCalendar.Calendar(calendarioEl, {
        locale: 'pt',
        initialView: 'dayGridMonth',
        events: ferias.map(f => {
            let endDate = new Date(f.data_fim);
            endDate.setDate(endDate.getDate() + 1);

            console.log(`🎨 Evento: ${f.nome} - Cor: ${f.cor}`); // 🔴 Verifica se a cor está chegando

            return {
                title: f.nome,
                start: f.data_inicio,
                end: endDate,
                backgroundColor: f.cor || '#808080',  // 🔴 Aplica a cor correta (ou cinza se não tiver)
                borderColor: f.cor || '#808080'        // 🔴 Mantém a borda da mesma cor
            };
        })
    });

    calendario.render();
    calendarioEl.fullCalendarInstance = calendario;
}

function inicializarCalendario() {
    let calendarioEl = document.getElementById('calendario');

    let calendario = new FullCalendar.Calendar(calendarioEl, {
        locale: 'pt',
        initialView: 'dayGridMonth',
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('http://localhost:5000/ferias');
                const ferias = await response.json();

                console.log("📅 Carregando eventos no calendário:");
                console.table(ferias);

                let eventos = ferias.map(f => {
                    let dataFim = new Date(f.data_fim);
                    dataFim.setDate(dataFim.getDate() + 1); // Corrige a data final

                    // Verifica se a cor está definida e usa a cor do cargo
                    let cor = f.cor || '#808080'; // #808080 é a cor de fallback

                    return {
                        title: f.nome,
                        start: f.data_inicio,
                        end: dataFim.toISOString(),
                        backgroundColor: cor, // Aplica a cor
                        borderColor: cor      // Mantém a borda com a mesma cor
                    };
                });

                successCallback(eventos);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
                failureCallback(error); // Caso haja erro ao carregar eventos
            }
        }
    });

    calendario.render(); // Renderiza o calendário com os eventos carregados
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
