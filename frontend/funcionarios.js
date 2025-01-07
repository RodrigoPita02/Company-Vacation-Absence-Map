document.addEventListener('DOMContentLoaded', () => {
    carregarCargos();
    carregarFuncionarios();
    document.getElementById('funcionarioForm').addEventListener('submit', adicionarFuncionario);
});

// 🟢 Carregar cargos para o dropdown
async function carregarCargos() {
    const select = document.getElementById('cargo');
    const editSelect = document.getElementById('editCargo');
    
    if (!select || !editSelect) {
        console.error("Erro: O elemento <select id='cargo'> ou <select id='editCargo'> não foi encontrado.");
        return;
    }

    const response = await fetch('http://localhost:5000/cargos');
    if (!response.ok) {
        console.error("Erro ao buscar cargos.");
        return;
    }

    const cargos = await response.json();
    select.innerHTML = '<option value="">Selecione um cargo</option>'; // Limpa e adiciona opção inicial
    editSelect.innerHTML = '<option value="">Selecione um cargo</option>'; // Limpa e adiciona opção inicial

    cargos.forEach(cargo => {
        let option = document.createElement('option');
        option.value = cargo.id;
        option.textContent = cargo.nome;
        select.appendChild(option);

        let editOption = document.createElement('option');
        editOption.value = cargo.id;
        editOption.textContent = cargo.nome;
        editSelect.appendChild(editOption);
    });

    console.log("Cargos carregados com sucesso.");
}

// 🟢 Abrir modal para edição do funcionário
function abrirModalEdicao(id, nome, cargoId) {
    document.getElementById('editFuncionarioId').value = id;
    document.getElementById('editNome').value = nome;
    document.getElementById('editCargo').value = cargoId;

    document.getElementById('editModal').style.display = 'flex';
}

// 🟢 Fechar modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// 🟢 Enviar atualização do funcionário
document.getElementById('editFuncionarioForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('editFuncionarioId').value;
    const nome = document.getElementById('editNome').value;
    const cargo_id = document.getElementById('editCargo').value;

    const response = await fetch(`http://localhost:5000/funcionarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cargo_id })
    });

    if (response.ok) {
        alert('Funcionário atualizado com sucesso!');
        document.getElementById('editModal').style.display = 'none';
        carregarFuncionarios();
    } else {
        alert('Erro ao atualizar funcionário.');
    }
});

// 🟢 Carregar funcionários na tabela
async function carregarFuncionarios() {
    const response = await fetch('http://localhost:5000/funcionarios');
    const funcionarios = await response.json();

    const tabela = document.getElementById('funcionariosTable');
    tabela.innerHTML = ''; // Limpa a tabela

    funcionarios.forEach(f => {
        const row = tabela.insertRow();
        row.insertCell(0).textContent = f.nome;
        row.insertCell(1).textContent = f.cargo;

        // Cor do cargo
        const corCell = row.insertCell(2);
        corCell.style.backgroundColor = f.cor;
        corCell.style.color = "#fff";
        corCell.style.fontWeight = "bold";
        corCell.style.borderRadius = "4px";
        corCell.textContent = " ";

        // Ações (editar/excluir)
        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `
            <button class="action-btn edit" onclick="abrirModalEdicao(${f.id}, '${f.nome}', ${f.cargo_id})">Editar</button>
            <button class="action-btn delete" onclick="excluirFuncionario(${f.id})">Excluir</button>
        `;
    });
}

// 🟢 Adicionar funcionário
async function adicionarFuncionario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cargo_id = document.getElementById('cargo').value;

    const response = await fetch('http://localhost:5000/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cargo_id }),
    });

    if (response.ok) {
        alert('Funcionário adicionado com sucesso!');
        carregarFuncionarios();
    } else {
        alert('Erro ao adicionar funcionário.');
    }
}

// 🟢 Excluir funcionário
async function excluirFuncionario(id) {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
        const response = await fetch(`http://localhost:5000/funcionarios/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Funcionário excluído com sucesso!');
            carregarFuncionarios();
        } else {
            alert('Erro ao excluir funcionário.');
        }
    }
}

// 🟢 Editar funcionário
function editarFuncionario(id, nome, cargo_id) {
    const novoNome = prompt("Novo nome do funcionário:", nome);
    if (!novoNome) return;

    const novoCargo = prompt("Novo ID do cargo:", cargo_id);
    if (!novoCargo) return;

    fetch(`http://localhost:5000/funcionarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome, cargo_id: novoCargo }),
    }).then(response => {
        if (response.ok) {
            alert("Funcionário atualizado com sucesso!");
            carregarFuncionarios();
        } else {
            alert("Erro ao atualizar funcionário.");
        }
    });
}
