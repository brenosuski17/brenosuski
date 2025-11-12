import { useState, useEffect } from "react";

// COMPONENTE CABEÇALHO
function Cabecalho({ titulo }) {
  return (
    <header
      style={{
        backgroundColor: "#0d1117",
        padding: "20px",
        color: "#58a6ff",
        textAlign: "center",
        borderBottom: "2px solid #30363d",
      }}
    >
      <h1 style={{ margin: 0 }}>{titulo}</h1>
      <p style={{ color: "#8b949e" }}>
        Organize suas tarefas com eficiência 🚀
      </p>
    </header>
  );
}

// COMPONENTE DE TAREFA
function Tarefa({ item, onConcluir, onRemover, onEditar }) {
  return (
    <li
      style={{
        backgroundColor: item.concluida ? "#161b22" : "#21262d",
        color: item.concluida ? "#8b949e" : "#c9d1d9",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #30363d",
      }}
    >
      <div>
        <input
          type="checkbox"
          checked={item.concluida}
          onChange={onConcluir}
          style={{ marginRight: "10px" }}
        />
        <strong
          style={{
            textDecoration: item.concluida ? "line-through" : "none",
          }}
        >
          {item.texto}
        </strong>
        <div style={{ fontSize: "12px", color: "#8b949e" }}>
          Criada em: {item.data}
        </div>
      </div>

      <div>
        <button
          onClick={onEditar}
          style={{
            marginRight: "5px",
            backgroundColor: "#238636",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Editar
        </button>
        <button
          onClick={onRemover}
          style={{
            backgroundColor: "#da3633",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}

// COMPONENTE PRINCIPAL
export default function App() {
  const [tarefa, setTarefa] = useState("");
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);

  // Carregar lista do localStorage
  useEffect(() => {
    const salvo = localStorage.getItem("taskflow");
    if (salvo) setLista(JSON.parse(salvo));
  }, []);

  // Salvar lista automaticamente
  useEffect(() => {
    localStorage.setItem("taskflow", JSON.stringify(lista));
  }, [lista]);

  // Adicionar ou editar tarefa
  function adicionarTarefa() {
    if (tarefa.trim() === "") return;

    if (editando !== null) {
      const novaLista = lista.map((item, i) =>
        i === editando ? { ...item, texto: tarefa } : item
      );
      setLista(novaLista);
      setEditando(null);
    } else {
      const nova = {
        texto: tarefa,
        concluida: false,
        data: new Date().toLocaleDateString("pt-BR"),
      };
      setLista([...lista, nova]);
    }
    setTarefa("");
  }

  // Remover tarefa
  function removerTarefa(index) {
    setLista(lista.filter((_, i) => i !== index));
  }

  // Marcar como concluída
  function alternarConclusao(index) {
    const nova = lista.map((item, i) =>
      i === index ? { ...item, concluida: !item.concluida } : item
    );
    setLista(nova);
  }

  // Editar tarefa
  function editarTarefa(index) {
    setTarefa(lista[index].texto);
    setEditando(index);
  }

  // Filtrar tarefas
  const tarefasFiltradas = lista.filter((item) => {
    if (filtro === "pendentes") return !item.concluida;
    if (filtro === "concluidas") return item.concluida;
    return true;
  });

  // Buscar tarefas
  const tarefasBuscadas = tarefasFiltradas.filter((item) =>
    item.texto.toLowerCase().includes(busca.toLowerCase())
  );

  const total = lista.length;
  const concluidas = lista.filter((t) => t.concluida).length;

  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        color: "#c9d1d9",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Cabecalho titulo="TaskFlow" />

      <div
        style={{ maxWidth: "600px", margin: "30px auto", textAlign: "center" }}
      >
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar tarefa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: "60%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #30363d",
            marginBottom: "10px",
            backgroundColor: "#161b22",
            color: "white",
          }}
        />

        {/* Campo de nova tarefa */}
        <div>
          <input
            type="text"
            placeholder="Digite uma nova tarefa..."
            value={tarefa}
            onChange={(e) => setTarefa(e.target.value)}
            style={{
              width: "60%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #30363d",
              backgroundColor: "#161b22",
              color: "white",
            }}
          />
          <button
            onClick={adicionarTarefa}
            style={{
              marginLeft: "10px",
              backgroundColor: "#58a6ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 15px",
              cursor: "pointer",
            }}
          >
            {editando !== null ? "Salvar" : "Adicionar"}
          </button>
        </div>

        {/* Filtros */}
        <div style={{ margin: "15px 0" }}>
          <button onClick={() => setFiltro("todas")}>Todas</button>
          <button onClick={() => setFiltro("pendentes")}>Pendentes</button>
          <button onClick={() => setFiltro("concluidas")}>Concluídas</button>
        </div>

        {/* Lista */}
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          {tarefasBuscadas.map((item, index) => (
            <Tarefa
              key={index}
              item={item}
              onConcluir={() => alternarConclusao(index)}
              onRemover={() => removerTarefa(index)}
              onEditar={() => editarTarefa(index)}
            />
          ))}
        </ul>

        {/* Resumo */}
        <p>
          Total: {total} | Concluídas: {concluidas} | Pendentes:{" "}
          {total - concluidas}
        </p>
      </div>
    </div>
  );
}
