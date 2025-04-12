let vertexCount = 3;
let distanceMatrix = [];
let pathMatrix = [];

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("generateMatrix").addEventListener("click", generateMatrix);
  document.getElementById("findPath").addEventListener("click", findShortestPath);
  generateMatrix();
});

// Генерация матрицы смежности
function generateMatrix() {
  vertexCount = parseInt(document.getElementById("vertexCount").value);
  if (vertexCount < 2) vertexCount = 2;
  if (vertexCount > 10) vertexCount = 10;

  // Очищаем предыдущие данные
  document.getElementById("matrixInput").innerHTML = "";
  document.getElementById("initialMatrix").innerHTML = "";
  document.getElementById("pathMatrix").innerHTML = "";
  document.getElementById("result").style.display = "none";
  // document.getElementsByClassName("matrix").style.display = "none";

  // Создаем таблицу для ввода матрицы смежности
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Заголовок таблицы
  const headerRow = document.createElement("tr");
  const emptyHeader = document.createElement("th");
  headerRow.appendChild(emptyHeader);

  for (let i = 0; i < vertexCount; i++) {
    const th = document.createElement("th");
    th.textContent = `V${i + 1}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Тело таблицы
  for (let i = 0; i < vertexCount; i++) {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.textContent = `V${i + 1}`;
    row.appendChild(rowHeader);

    for (let j = 0; j < vertexCount; j++) {
      const cell = document.createElement("td");
      if (i === j) {
        cell.textContent = "-";
        cell.classList.add("diagonal");
      } else {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `cell-${i}-${j}`;
        input.value = "";
        input.placeholder = "∞";
        cell.appendChild(input);
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  document.getElementById("matrixInput").appendChild(table);

  // Заполняем выпадающие списки для выбора вершин
  const startSelect = document.getElementById("startVertex");
  const endSelect = document.getElementById("endVertex");
  startSelect.innerHTML = "";
  endSelect.innerHTML = "";

  for (let i = 0; i < vertexCount; i++) {
    const option1 = document.createElement("option");
    option1.value = i;
    option1.textContent = `V${i + 1}`;
    startSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = i;
    option2.textContent = `V${i + 1}`;
    endSelect.appendChild(option2);
  }

  // Устанавливаем разные вершины по умолчанию
  endSelect.selectedIndex = vertexCount - 1;
}

// Поиск кратчайшего пути
function findShortestPath() {
  // Считываем матрицу смежности
  distanceMatrix = [];
  for (let i = 0; i < vertexCount; i++) {
    distanceMatrix[i] = [];
    for (let j = 0; j < vertexCount; j++) {
      if (i === j) {
        distanceMatrix[i][j] = Infinity; // Главная диагональ
      } else {
        const input = document.getElementById(`cell-${i}-${j}`);
        distanceMatrix[i][j] = input.value === "" || input.value === "∞" 
          ? Infinity 
          : parseInt(input.value);
      }
    }
  }

  // Инициализируем матрицу путей
  pathMatrix = [];
  for (let i = 0; i < vertexCount; i++) {
    pathMatrix[i] = [];
    for (let j = 0; j < vertexCount; j++) {
      if (i === j) {
        pathMatrix[i][j] = "-"; // Главная диагональ
      } else {
        pathMatrix[i][j] = distanceMatrix[i][j] === Infinity ? -1 : j + 1;
      }
    }
  }

  // Алгоритм Флойда
  for (let k = 0; k < vertexCount; k++) {
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < vertexCount; j++) {
        if (distanceMatrix[i][k] + distanceMatrix[k][j] < distanceMatrix[i][j]) {
          distanceMatrix[i][j] = distanceMatrix[i][k] + distanceMatrix[k][j];
          pathMatrix[i][j] = pathMatrix[i][k];
        }
      }
    }
  }

  // Отображаем матрицы
  displayMatrix(distanceMatrix, "initialMatrix", false);
  displayMatrix(pathMatrix, "pathMatrix", true);

  // Находим и отображаем путь
  displayPath();
  
}

// Отображение матрицы
function displayMatrix(matrix, elementId, isPathMatrix) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  const table = document.createElement("table");

  // Заголовок
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
  for (let i = 0; i < vertexCount; i++) {
    const th = document.createElement("th");
    th.textContent = `V${i + 1}`;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

  // Тело таблицы
  for (let i = 0; i < vertexCount; i++) {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.textContent = `V${i + 1}`;
    row.appendChild(rowHeader);

    for (let j = 0; j < vertexCount; j++) {
      const cell = document.createElement("td");
      if (i === j) {
        cell.textContent = "-";
        cell.classList.add("diagonal");
      } else if (matrix[i][j] === Infinity) {
        cell.textContent = "∞";
        cell.classList.add("infinity");
      } else if (isPathMatrix && matrix[i][j] === -1) {
        cell.textContent = "-";
      } else {
        cell.textContent = matrix[i][j];
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  container.appendChild(table);
}

// Отображение найденного пути
function displayPath() {
  const start = parseInt(document.getElementById("startVertex").value);
  const end = parseInt(document.getElementById("endVertex").value);
  const resultDiv = document.getElementById("resultContent");

  if (start === end) {
    resultDiv.innerHTML = `<p>Начальная и конечная вершины совпадают</p>`;
  } else if (distanceMatrix[start][end] === Infinity) {
    resultDiv.innerHTML = `<p>Пути из вершины V${start + 1} в вершину V${end + 1} не существует</p>`;
  } else {
    let path = `V${start + 1}`;
    let current = start;

    while (current !== end) {
      current = pathMatrix[current][end] - 1; // -1 потому что вершины нумеруются с 1
      path += ` → V${current + 1}`;
    }

    resultDiv.innerHTML = `
      <p>Кратчайшее расстояние из V${start + 1} в V${end + 1}: 
      <span class="path">${distanceMatrix[start][end]}</span></p>
      <p>Путь: <span class="path">${path}</span></p>
    `;
  }

  document.getElementById("result").style.display = "flex";
  document.getElementById("matrix-container").style.display = "flex";
}