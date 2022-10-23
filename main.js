// Global Variables
let vectors = [];
let dim = 0;
let vecNum = 0;
let orthoBasisVectors = [];

// Elements
const dimensionForm = document.getElementById("dimension_form");
const vectorsForm = document.getElementById("vectors_form");
const executeBtn = document.getElementById("execute_button");
const dimensionInput = document.getElementById("dimension_input");
const vecNumInput = document.getElementById("vectors_num_input");

// When Dimension and Vector Number are Submitted
const handleDimSubmit = (event) => {
  event.preventDefault();
  dim = parseInt(dimensionInput.value);
  vecNum = parseInt(vecNumInput.value);
  if (!dim || !vecNum) {
    window.alert("No Input");
  } else {
    addVectorInputs();
  }
};

// Setting Minimum of Vector Number
const handleInputChange = () => {
  vecNumInput.setAttribute("placeholder", `at least ${dimensionInput.value}`);
  vecNumInput.setAttribute("min", dimensionInput.value);
};

// Adding Inputs for Vector
const addVectorInputs = () => {
  const vectorsUl = document.getElementById("vectors_list");
  vectorsUl.innerHTML = "";

  for (let i = 0; i < vecNum; i++) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.innerText = `Vector ${i + 1} (a${i + 1})`;
    label.className = "vector_label";
    input.setAttribute("placeholder", `Vector ${i + 1}`);
    input.id = `vector_${i + 1}`;
    li.className = "vector_li";
    li.appendChild(label);
    li.appendChild(input);
    vectorsUl.append(li);
  }

  executeBtn.className = "";
};

// Execution
const handleExecute = (event) => {
  event.preventDefault();
  const resultUl = document.getElementById("result_ul");
  vectors = [];
  orthoBasisVectors = [];
  resultUl.innerHTML = "";

  for (let i = 0; i < dim; i++) {
    const vectorInput = document.getElementById(`vector_${i + 1}`);
    if (vectorInput.value) {
      const vector = vectorInput.value.split(" ").map((item) => parseInt(item));
      if (vector.length === dim) {
        vectors.push(vector);
        const orthoVec = i === 0 ? vector : orthogonalization(vector);
        const normalVec = normalization(orthoVec);
        orthoBasisVectors.push(normalVec);

        const li = document.createElement("li");
        li.innerText = `q${i + 1}: ${JSON.stringify(normalVec)}`;

        resultUl.append(li);
      } else {
        window.alert(`Invalid Dimension in Vector ${i + 1}`);
        break;
      }
    } else {
      window.alert(`No Values in Vector ${i + 1}`);
      break;
    }
  }
};

// Main Orthogonalization
const orthogonalization = (vector) => {
  const k = vectors.length - 1;
  let proj;
  for (let i = 0; i < k; i++) {
    const firstCal = innerProduct(orthoBasisVectors[i], vector);
    const secondCal = multi(firstCal, orthoBasisVectors[i]);
    proj = i === 0 ? secondCal : vecAdd(proj, secondCal);
  }
  return vecSub(vector, proj);
};

// Inner Product between Two Vectors
const innerProduct = (front, back) => {
  let result = null;
  if (front.length === back.length) {
    result = 0;
    front.forEach((item, index) => {
      result += item * back[index];
    });
  }
  return result;
};

// Real Number Multiplication
const multi = (num, vector) => {
  const result = [];

  for (const item of vector) {
    result.push(item * num);
  }
  return result;
};

// Vector Addition
const vecAdd = (front, back) => {
  const result = [];
  if (front.length === back.length) {
    for (let i = 0; i < front.length; i++) {
      result.push(front[i] + back[i]);
    }
  } else {
    result = null;
  }

  return result;
};

// Vector Subtraction
const vecSub = (front, back) => {
  const result = [];
  if (front.length === back.length) {
    for (let i = 0; i < front.length; i++) {
      result.push(front[i] - back[i]);
    }
  } else {
    result = null;
  }
  return result;
};

// Vector Normalization
const normalization = (vector) => {
  let vectorValue = 0;
  const result = [];

  vector.forEach((item) => {
    vectorValue += item * item;
  });

  vectorValue = Math.sqrt(vectorValue);

  for (const item of vector) {
    result.push(item / vectorValue);
  }

  return result;
};

dimensionForm.addEventListener("submit", handleDimSubmit);
vectorsForm.addEventListener("submit", handleExecute);
dimensionInput.addEventListener("change", handleInputChange);
