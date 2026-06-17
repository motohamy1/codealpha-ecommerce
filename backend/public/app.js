const productGrid = document.getElementById("productGrid");
const sortProducts = document.getElementById("sortProducts");
const cartCount = document.getElementById("cartCount");

let cart = 0;

const products = Array.from({ length: 12 }, (_, i) => {
  const id = i + 1;
  const price = Math.floor(Math.random() * 220) + 30;
  const categories = ["Electronics", "Fashion", "Home", "Beauty"];
  const category = categories[i % categories.length];

  return {
    id,
    title: `Product ${id}`,
    category,
    price,
    image: `https://picsum.photos/seed/product-${id}/400/300`,
  };
});

function renderProducts(list) {
  if (!productGrid) return;

  productGrid.innerHTML = list
    .map(
      (item) => `
      <article class="product-card">
        <img class="product-image" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="product-info">
          <h4 class="product-title">${item.title}</h4>
          <p class="product-price">$${item.price}</p>
          <div class="product-footer">
            <small>${item.category}</small>
            <button class="add-btn" data-id="${item.id}">Add</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = String(cart);
  }
}

function handleSortChange() {
  if (!sortProducts) return;

  const value = sortProducts.value;
  const sorted = [...products];

  if (value === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (value === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
}

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains("add-btn")) {
    cart += 1;
    updateCartCount();
  }
});

sortProducts?.addEventListener("change", handleSortChange);

renderProducts(products);
updateCartCount();