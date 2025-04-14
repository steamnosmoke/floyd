let vertexCount = 3;
let distanceMatrix = [];
let pathMatrix = [];

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generateMatrix")
    .addEventListener("click", generateMatrix);
  document
    .getElementById("findPath")
    .addEventListener("click", findShortestPath);
  generateMatrix();
});

function generateMatrix() {
  vertexCount = parseInt(document.getElementById("vertexCount").value);
  if (vertexCount < 2) vertexCount = 2;
  if (vertexCount > 10) vertexCount = 10;

  document.getElementById("matrixInput").innerHTML = "";
  document.getElementById("initialMatrix").innerHTML = "";
  document.getElementById("pathMatrix").innerHTML = "";
  document.getElementById("result").style.display = "none";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

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

  endSelect.selectedIndex = vertexCount - 1;
}

function findShortestPath() {
  distanceMatrix = [];
  for (let i = 0; i < vertexCount; i++) {
    distanceMatrix[i] = [];
    for (let j = 0; j < vertexCount; j++) {
      if (i === j) {
        distanceMatrix[i][j] = Infinity;
      } else {
        const input = document.getElementById(`cell-${i}-${j}`);
        distanceMatrix[i][j] =
          input.value === "" || input.value === "∞"
            ? Infinity
            : parseInt(input.value);
      }
    }
  }

  pathMatrix = [];
  for (let i = 0; i < vertexCount; i++) {
    pathMatrix[i] = [];
    for (let j = 0; j < vertexCount; j++) {
      if (i === j) {
        pathMatrix[i][j] = "-";
      } else {
        pathMatrix[i][j] = distanceMatrix[i][j] === Infinity ? -1 : j + 1;
      }
    }
  }

  // Алгоритм Флойда
  for (let k = 0; k < vertexCount; k++) {
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < vertexCount; j++) {
        if (
          distanceMatrix[i][k] + distanceMatrix[k][j] <
          distanceMatrix[i][j]
        ) {
          distanceMatrix[i][j] = distanceMatrix[i][k] + distanceMatrix[k][j];
          pathMatrix[i][j] = pathMatrix[i][k];
        }
      }
    }
  }

  displayMatrix(distanceMatrix, "initialMatrix", false);
  displayMatrix(pathMatrix, "pathMatrix", true);

  displayPath();
}

function displayMatrix(matrix, elementId, isPathMatrix) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
  for (let i = 0; i < vertexCount; i++) {
    const th = document.createElement("th");
    th.textContent = `V${i + 1}`;
    headerRow.appendChild(th);
  }
  table.appendChild(headerRow);

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

function displayPath() {
  const start = parseInt(document.getElementById("startVertex").value);
  const end = parseInt(document.getElementById("endVertex").value);
  const resultDiv = document.getElementById("resultContent");

  if (start === end) {
    resultDiv.innerHTML = `<p>Начальная и конечная вершины совпадают</p>`;
  } else if (distanceMatrix[start][end] === Infinity) {
    resultDiv.innerHTML = `<p>Пути из вершины V${start + 1} в вершину V${
      end + 1
    } не существует</p>`;
  } else {
    let path = `V${start + 1}`;
    let current = start;

    while (current !== end) {
      current = pathMatrix[current][end] - 1;
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
