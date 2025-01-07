document.addEventListener('DOMContentLoaded', () => {
    carregarFuncionarios();
    carregarFaltas();
    carregarFaltasTabela();
    inicializarCalendario();
});

async function carregarFuncionarios() {
    const response = await fetch('http://localhost:5000/funcionarios');
    const funcionarios = await response.json();

    const select = document.getElementById('funcionarioSelect');
    select.innerHTML = '<option value="">Selecione o Funcionário</option>'; // Limpa o select

    funcionarios.forEach(func => {
        const option = document.createElement('option');
        option.value = func.id;
        option.textContent = func.nome;
        select.appendChild(option);
    });
}

// Função para formatar a data no formato yyyy-MM-dd
function formatDateToInputDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const day = date.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
    return `${year}-${month}-${day}`;
}

// Função para carregar as faltas na tabela
async function carregarFaltasTabela() {
    const response = await fetch('http://localhost:5000/faltas');
    const faltas = await response.json();

    const tabelaFaltas = document.querySelector('#tabelaFaltas tbody');
    tabelaFaltas.innerHTML = ''; // Limpa a tabela antes de adicionar as faltas

    faltas.forEach(falta => {
        const tr = document.createElement('tr');
        tr.dataset.id = falta.id; // Armazena o ID da falta no próprio elemento

        const dataInicio = new Date(falta.data_falta).toLocaleDateString('pt-PT');  // Formatar data de início
        const dataFim = falta.data_fim ? new Date(falta.data_fim).toLocaleDateString('pt-PT') : 'N/A';  // Verificar se há data fim

        // Criação de uma célula com a cor do cargo
        const corCelula = document.createElement('td');
        corCelula.style.backgroundColor = falta.cor || '#808080'; // Cor do cargo
        corCelula.style.color = '#fff'; // Cor do texto para garantir boa visibilidade
        corCelula.textContent = 'Cor';  // Texto de exemplo ou pode ser deixado vazio

        tr.innerHTML = `
            <td>${falta.nome}</td>
            <td>${dataInicio}</td>
            <td>${dataFim}</td>
            <td>${falta.motivo}</td>
            <td>
                <button class="editarFalta" onclick="editarFalta(${falta.id})">Editar</button>
                <button class="apagarFalta" onclick="apagarFalta(${falta.id})">Apagar</button>
            </td>
        `;

        tr.insertBefore(corCelula, tr.childNodes[0]);  // Insere a célula de cor antes do nome

        tabelaFaltas.appendChild(tr);
    });
}

async function editarFalta(id) {
    console.log("ID da falta para edição:", id); // Log para verificar se o ID está correto
    
    // Faz a requisição para buscar a falta com o ID específico
    const response = await fetch(`http://localhost:5000/faltas/${id}`);
    
    if (!response.ok) {
        console.error("Erro ao buscar falta:", response.statusText); // Log de erro caso a resposta não seja ok
        return;
    }

    const falta = await response.json(); // Converte a resposta em JSON

    if (!falta) {
        console.error("Falta não encontrada ou erro na resposta.");
        return;
    }

    // Preenche o modal com os dados da falta
    document.getElementById('funcionarioSelect').value = falta.funcionario_id;
    document.getElementById('dataInicio').value = falta.data_falta.split('T')[0];  // Apenas a parte da data
    document.getElementById('dataFim').value = falta.data_fim ? falta.data_fim.split('T')[0] : ''; // Se houver, caso contrário, vazio
    document.getElementById('motivo').value = falta.motivo;

    // Exibe o modal
    document.getElementById('editarModal').style.display = 'block';

    // Função para cancelar a edição
    document.getElementById('cancelarEditar').onclick = () => {
        document.getElementById('editarModal').style.display = 'none';
    };

    // Altera o comportamento do formulário para edição
    const form = document.getElementById('editarFaltaForm');
    form.onsubmit = async function(event) {
        event.preventDefault();  // Evita o envio tradicional do formulário

        // Obtém os dados do formulário
        const funcionario_id = document.getElementById('funcionarioSelect').value;
        const data_inicio = document.getElementById('dataInicio').value;
        const data_fim = document.getElementById('dataFim').value || null;  // Pode ser nulo
        const motivo = document.getElementById('motivo').value;

        // Verifica se todos os campos obrigatórios estão preenchidos
        if (!funcionario_id || !data_inicio || !motivo) {
            showFeedback('error', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Faz a requisição para atualizar a falta
        const updateResponse = await fetch(`http://localhost:5000/faltas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ funcionario_id, data_inicio, data_fim, motivo })
        });

        if (updateResponse.ok) {
            showFeedback('success', 'Falta atualizada com sucesso!');
            carregarFaltasTabela(); // Atualiza a tabela com os novos dados
            document.getElementById('editarModal').style.display = 'none'; // Fecha o modal
        } else {
            const error = await updateResponse.json();
            showFeedback('error', `Erro ao atualizar falta: ${error.message}`);
            console.error("Erro ao atualizar falta:", error);  // Log para debug
        }
    };
}

async function apagarFalta(id) {
    const response = await fetch(`http://localhost:5000/faltas/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        showFeedback('success', 'Falta removida com sucesso!');
        carregarFaltasTabela(); // Atualiza a tabela e o calendário
        carregarFaltas();
    } else {
        showFeedback('error', 'Erro ao remover falta!');
    }
}

async function carregarFaltas() {
    const response = await fetch('http://localhost:5000/faltas');
    const faltas = await response.json();

    let calendarioEl = document.getElementById('calendarioFaltas');
    
    if (calendarioEl.fullCalendarInstance) {
        calendarioEl.fullCalendarInstance.removeAllEvents();
        faltas.forEach(f => {
            let dataFalta = new Date(f.data_falta);
            let dataFim = new Date(f.data_fim);

            // Verifica se a data de 'data_falta' é válida
            if (isNaN(dataFalta.getTime())) {
                console.error('Data de falta inválida:', f.data_falta);
                return; // Se a data for inválida, ignora este evento
            }

            // Verifica se a data de 'data_fim' é válida
            if (isNaN(dataFim.getTime())) {
                console.error('Data de fim inválida:', f.data_fim);
                dataFim = dataFalta; // Se não houver data_fim, utiliza data_falta
            }

            dataFim.setDate(dataFim.getDate() + 1); // Ajuste para incluir o último dia

            // Adicionando evento com nome do funcionário e motivo
            calendarioEl.fullCalendarInstance.addEvent({
                title: `${f.nome} - ${f.motivo}`,  // Exibindo nome e motivo
                start: dataFalta.toISOString(),
                end: dataFim.toISOString(),
                allDay: true, // Isso faz com que o evento ocupe todo o dia, mesmo sendo de um único dia
                backgroundColor: f.cor,  // Cor do cargo
                borderColor: f.cor,      // Cor da borda
                description: f.motivo    // Motivo na descrição (opcional)
            });
        });
    } else {
        let calendario = new FullCalendar.Calendar(calendarioEl, {
            locale: 'pt',
            initialView: 'dayGridMonth',
            events: faltas.map(f => {
                let dataFalta = new Date(f.data_falta);
                let dataFim = new Date(f.data_fim);

                // Verifica se as datas são válidas
                if (isNaN(dataFalta.getTime())) {
                    console.error('Data de falta inválida:', f.data_falta);
                    return {}; // Ignora este evento se a data de falta for inválida
                }

                if (isNaN(dataFim.getTime())) {
                    console.error('Data de fim inválida:', f.data_fim);
                    dataFim = dataFalta; // Se não houver data_fim, usa data_falta
                }

                dataFim.setDate(dataFim.getDate() + 1); // Ajuste para incluir o último dia

                return {
                    title: `${f.nome} - ${f.motivo}`,  // Exibe o nome e motivo
                    start: dataFalta.toISOString(),
                    end: dataFim.toISOString(),
                    allDay: true, // Força o evento a ocupar todo o dia
                    backgroundColor: f.cor || '#808080',  // Cor do cargo
                    borderColor: f.cor || '#808080',      // Cor da borda
                    description: f.motivo,                // Motivo na descrição (opcional)
                    extendedProps: {
                        motivoCompleto: f.motivo          // Passa o motivo completo como dado extra
                    }
                };
            }),
            eventDidMount: function(info) {
                // Adiciona um evento de "hover" para exibir o tooltip com o motivo completo
                info.el.addEventListener('mouseover', function() {
                    let tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.textContent = info.event.extendedProps.motivoCompleto;
                    document.body.appendChild(tooltip);

                    // Calcula a posição do tooltip
                    let rect = info.el.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + window.scrollX}px`;
                    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;

                    // Remove o tooltip quando o mouse sair do evento
                    info.el.addEventListener('mouseleave', function() {
                        tooltip.remove();
                    });
                });
            }
        });

        calendario.render();
        calendarioEl.fullCalendarInstance = calendario;
    }
}

async function registrarFalta(event) {
    event.preventDefault();

    const funcionario_id = document.getElementById('funcionarioSelect').value;
    const data_falta = document.getElementById('dataInicio').value;  // Renomeado para data_falta
    const data_fim = document.getElementById('dataFim').value;
    const motivo = document.getElementById('motivo').value;  // Obtém o motivo da falta

    if (!funcionario_id || !data_falta || !motivo) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const response = await fetch('http://localhost:5000/faltas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            funcionario_id, 
            data_falta, 
            data_fim: data_fim || data_falta,  // Envia data_fim ou data_falta se não tiver data_fim
            motivo 
        })
    });

    if (response.ok) {
        showFeedback('success', 'Falta registrada com sucesso!');
        carregarFaltas(); // Atualiza o calendário
        carregarFaltasTabela();
    } else {
        showFeedback('error', 'Erro ao registrar falta!');
    }
}

// Função para inicializar o calendário
function inicializarCalendario() {
    let calendarioEl = document.getElementById('calendarioFaltas');

    let calendario = new FullCalendar.Calendar(calendarioEl, {
        locale: 'pt',
        initialView: 'dayGridMonth',
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('http://localhost:5000/faltas');
                const faltas = await response.json();

                console.log("📅 Carregando faltas no calendário:");
                console.table(faltas);

                let eventos = faltas.map(f => {
                    let dataFalta = new Date(f.data_falta);
                    let dataFim = new Date(f.data_fim);

                    // Verifica se as datas são válidas
                    if (isNaN(dataFalta.getTime())) {
                        console.error('Data de falta inválida:', f.data_falta);
                        return {}; // Ignora este evento se a data de falta for inválida
                    }

                    if (isNaN(dataFim.getTime())) {
                        console.error('Data de fim inválida:', f.data_fim);
                        dataFim = dataFalta; // Se não houver data_fim, usa data_falta
                    }

                    dataFim.setDate(dataFim.getDate() + 1); // Ajuste para incluir o último dia

                    return {
                        title: `${f.nome} - ${f.motivo}`,  // Exibe o nome e motivo
                        start: dataFalta.toISOString(),
                        end: dataFim.toISOString(),
                        allDay: true, // Força o evento a ocupar todo o dia
                        backgroundColor: f.cor || '#808080',  // Cor do cargo
                        borderColor: f.cor || '#808080',      // Cor da borda
                        description: f.motivo,                // Motivo na descrição (opcional)
                        extendedProps: {
                            motivoCompleto: f.motivo          // Passa o motivo completo como dado extra
                        }
                    };
                });

                successCallback(eventos);
            } catch (error) {
                console.error("Erro ao carregar faltas:", error);
                failureCallback(error);
            }
        },
        eventDidMount: function(info) {
            // Adiciona um evento de "hover" para exibir o tooltip com o motivo completo
            info.el.addEventListener('mouseover', function() {
                let tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = info.event.extendedProps.motivoCompleto;
                document.body.appendChild(tooltip);

                // Calcula a posição do tooltip
                let rect = info.el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;

                // Remove o tooltip quando o mouse sair do evento
                info.el.addEventListener('mouseleave', function() {
                    tooltip.remove();
                });
            });
        }
    });

    calendario.render();
}

function showFeedback(type, message) {
    let feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.innerHTML = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 3000); // Remove feedback após 3 segundos
}

document.getElementById('faltasForm').addEventListener('submit', registrarFalta);
