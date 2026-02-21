const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculateBMI();
});

const btn = document.getElementById("calcBtn");
if (btn) btn.addEventListener("click", calculateBMI);

function classifyBMI(bmi) {
  if (bmi < 18.5) return { label: "Baixo peso", class: "yellow", key: "low", msg: "Atenção à nutrição." };
  if (bmi < 25) return { label: "Peso ideal", class: "green", key: "ideal", msg: "Muito bem! Continue assim!" };
  return { label: "IMC elevado", class: "red", key: "high", msg: "Cuide da sua saúde." };
}

function calculateBMI() {
  const errorBox = document.getElementById("error");
  const resultBox = document.getElementById("result");

  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);

  if (!weight || !height) {
    errorBox.style.display = "block";
    errorBox.innerText = "Preencha peso e altura";
    return;
  }

  errorBox.style.display = "none";

  const bmi = weight / (height * height);
  const info = classifyBMI(bmi);

  document.getElementById("bmi").innerText = bmi.toFixed(2);
  document.getElementById("badge").innerText = info.label;
  document.getElementById("badge").className = "badge " + info.class;
  document.getElementById("message").innerText = info.msg;

  resultBox.style.display = "block";

  saveHistory(bmi.toFixed(2), info.label, info.key);
}

function saveHistory(bmi, label, key) {
  const history = JSON.parse(localStorage.getItem("imc-history") || "[]");
  history.unshift({ bmi, label, key, date: new Date().toLocaleString() });
  localStorage.setItem("imc-history", JSON.stringify(history));
}

function renderHistory() {
  const table = document.getElementById("historyTable");
  if (!table) return;

  const history = JSON.parse(localStorage.getItem("imc-history") || "[]");

  if (history.length === 0) {
    table.innerHTML = "<tr><td>Nenhum registro</td></tr>";
    return;
  }

  table.innerHTML = "<tr><th>Data</th><th>Resultado</th></tr>";

  history.forEach(item => {
    table.innerHTML += `<tr><td>${item.date}</td><td>${item.bmi} (${item.label})</td></tr>`;
  });
}

function clearHistory() {
  localStorage.removeItem("imc-history");
  renderHistory();
}

function renderTips() {
  const tipsBox = document.getElementById("tips");
  if (!tipsBox) return;

  const history = JSON.parse(localStorage.getItem("imc-history") || "[]");

  if (history.length === 0) {
    tipsBox.innerHTML = "<p>Calcule seu IMC primeiro 😉</p>";
    return;
  }

  const last = history[0];

  const tips = {
    low: [
      "Inclua refeições nutritivas e balanceadas.",
      "Evite pular refeições.",
      "Considere orientação profissional."
    ],
    ideal: [
      "Mantenha seus hábitos saudáveis.",
      "Continue praticando atividades físicas.",
      "Parabéns pelo equilíbrio!"
    ],
    high: [
      "Reduza alimentos ultraprocessados.",
      "Aumente atividades físicas.",
      "Beba mais água ao longo do dia."
    ]
  };

  tipsBox.innerHTML = `<div class="tip-card"><strong>${last.label}</strong></div>`;

  tips[last.key].forEach(tip => {
    tipsBox.innerHTML += `<div class="tip-card">${tip}</div>`;
  });
}

renderHistory();
renderTips();