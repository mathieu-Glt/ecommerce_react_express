{
  /* <select id="categorySelect">
  <option value="">-- Select Category --</option>
  <option value="68af1360ad37cf7ede6bd1ea">Phone</option>
  <option value="68af139bad37cf7ede6bd1ef">Accessories</option>
  <option value="68b19f460b53f26752322b14">Maintenance</option>
</select>

<div id="productsContainer"></div> */
}

const select = document.getElementById("categorySelect");
const container = document.getElementById("productsContainer");

select.addEventListener("change", async () => {
  const categoryId = select.value;
  if (!categoryId) {
    container.innerHTML = "<p>Please select a category</p>";
    return;
  }

  try {
    const response = await fetch(`/products/category/${categoryId}`);
    const data = await response.json();

    if (!data.success || data.results.length === 0) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    container.innerHTML = data.results
      .map(
        (p) => `
      <div>
        <h3>${p.title}</h3>
        <p>Price: $${p.price}</p>
        <p>Category: ${p.categoryInfo.name}</p>
        <p>Sub-category: ${p.subInfo.name}</p>
      </div>
    `
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<p>Error fetching products: ${err.message}</p>`;
  }
});
