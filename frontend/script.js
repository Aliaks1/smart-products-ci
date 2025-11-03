const BACKEND_URL = "https://smart-products-ci.onrender.com/api/products";

const table = document.getElementById("productTable");
const addBtn = document.getElementById("addBtn");

// Загрузка списка товаров
async function loadProducts() {
  const res = await fetch(BACKEND_URL);
  const products = await res.json();
  table.innerHTML = "";

  products.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price.toFixed(2)} zł</td>
      <td>${p.code}</td>
      <td>${p.supplierEmail}</td>
      <td>${p.releaseDate}</td>
      <td>
        <button onclick="deleteProduct(${p.id})">Usuń</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Добавление товара
addBtn.addEventListener("click", async () => {
  const data = {
    name: document.getElementById("name").value,
    price: parseFloat(document.getElementById("price").value),
    code: document.getElementById("code").value,
    supplierEmail: document.getElementById("supplierEmail").value,
    releaseDate: document.getElementById("releaseDate").value
  };

  await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  await loadProducts();
});

// Удаление товара
async function deleteProduct(id) {
  await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
  await loadProducts();
}

// Загружаем товары при старте
loadProducts();
