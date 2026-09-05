const products = [
  {
    id: 1,
    name: "LUXORA Noir Classic",
    category: "كلاسيكية",
    brand: "LUXORA",
    price: 24900,
    oldPrice: 29900,
    sales: 88,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Royal Gold Edition",
    category: "فاخرة",
    brand: "LUXORA",
    price: 38900,
    oldPrice: 45900,
    sales: 96,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Urban Chronograph",
    category: "رياضية",
    brand: "LUXORA",
    price: 31900,
    oldPrice: 36900,
    sales: 74,
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Silver Prestige",
    category: "رجالية",
    brand: "LUXORA",
    price: 27900,
    oldPrice: 0,
    sales: 51,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Midnight Automatic",
    category: "فاخرة",
    brand: "LUXORA",
    price: 49900,
    oldPrice: 57900,
    sales: 67,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Minimal White",
    category: "نسائية",
    brand: "LUXORA",
    price: 22900,
    oldPrice: 26900,
    sales: 60,
    image: "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7,
    name: "Executive Black",
    category: "رجالية",
    brand: "LUXORA",
    price: 34900,
    oldPrice: 39900,
    sales: 91,
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8,
    name: "Rose Elegance",
    category: "نسائية",
    brand: "LUXORA",
    price: 29900,
    oldPrice: 34900,
    sales: 44,
    image: "https://images.unsplash.com/photo-1451290337906-ac938fc89b28?auto=format&fit=crop&w=900&q=85"
  }
];

let cart = JSON.parse(localStorage.getItem("luxora_cart")) || [];

const productsGrid = document.getElementById("productsGrid");
const emptyProducts = document.getElementById("emptyProducts");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");
const successMessage = document.getElementById("successMessage");
const checkoutFormWrapper = document.getElementById("checkoutFormWrapper");
const toastElement = document.getElementById("toast");

function formatPrice(price) {
  return new Intl.NumberFormat("ar-DZ").format(price) + " دج";
}

function saveCart() {
  localStorage.setItem("luxora_cart", JSON.stringify(cart));
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2500);
}

function getDiscount(product) {
  if (!product.oldPrice) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "featured") {
    filteredProducts.sort((a, b) => b.sales - a.sales);
  }

  if (sort === "new") {
    filteredProducts.sort((a, b) => b.id - a.id);
  }

  productsGrid.innerHTML = filteredProducts.map(createProductCard).join("");

  emptyProducts.classList.toggle("hidden", filteredProducts.length !== 0);
}

function createProductCard(product) {
  const discount = getDiscount(product);

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${
          discount
            ? `<span class="product-badge sale">-${discount}%</span>`
            : `<span class="product-badge">مميز</span>`
        }
      </div>

      <div class="product-info">
        <span class="product-category">
          ${product.category} · ${product.brand}
        </span>

        <h3 class="product-name">${product.name}</h3>

        <div class="product-price">
          ${formatPrice(product.price)}
          ${
            product.oldPrice
              ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>`
              : ""
          }
        </div>

        <div class="product-actions">
          <button onclick="addToCart(${product.id})">
            أضف للسلة
          </button>

          <button onclick="buyNow(${product.id})">
            اطلب الآن
          </button>
        </div>
      </div>
    </article>
  `;
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast("تمت إضافة الساعة إلى السلة");
  openCart();
}

function buyNow(productId) {
  addToCart(productId);
  openCheckout();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(cartItem => cartItem.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find(productItem => productItem.id === item.id);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
}

function renderCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(getCartTotal());

  cartEmpty.classList.toggle("show", cart.length === 0);

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(productItem => productItem.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">
        <img
          class="cart-item-image"
          src="${product.image}"
          alt="${product.name}"
        >

        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <div class="cart-item-price">${formatPrice(product.price)}</div>

          <div class="quantity-control">
            <button onclick="updateQuantity(${product.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${product.id}, 1)">+</button>
          </div>
        </div>

        <button
          class="remove-item"
          onclick="removeFromCart(${product.id})"
          aria-label="حذف المنتج"
        >
          ×
        </button>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("أضف منتجًا إلى السلة أولًا");
    return;
  }

  closeCart();
  checkoutModal.classList.remove("hidden");
  checkoutFormWrapper.classList.remove("hidden");
  successMessage.classList.add("hidden");
}

function closeCheckout() {
  checkoutModal.classList.add("hidden");
}

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();

  return `LX-${year}-${random}`;
}

function submitOrder(event) {
  event.preventDefault();

  const formData = new FormData(checkoutForm);
  const orderNumber = generateOrderNumber();

  const order = {
    orderNumber,
    date: new Date().toISOString(),
    customer: {
      name: formData.get("name"),
      phone: formData.get("phone"),
      wilaya: formData.get("wilaya"),
      commune: formData.get("commune"),
      address: formData.get("address"),
      notes: formData.get("notes")
    },
    products: cart.map(item => {
      const product = products.find(productItem => productItem.id === item.id);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      };
    }),
    total: getCartTotal(),
    payment: "الدفع عند الاستلام",
    status: "جديد"
  };

  const orders = JSON.parse(localStorage.getItem("luxora_orders")) || [];

  orders.unshift(order);
  localStorage.setItem("luxora_orders", JSON.stringify(orders));

  document.getElementById("orderNumber").textContent =
    `رقم الطلب: ${orderNumber}`;

  document.getElementById("orderSummary").innerHTML = `
    <p>العميل: ${order.customer.name}</p>
    <p>الإجمالي: ${formatPrice(order.total)}</p>
    <p>طريقة الدفع: الدفع عند الاستلام</p>
  `;

  checkoutForm.reset();
  cart = [];
  saveCart();
  renderCart();

  checkoutFormWrapper.classList.add("hidden");
  successMessage.classList.remove("hidden");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
checkoutForm.addEventListener("submit", submitOrder);

document.getElementById("continueShopping").addEventListener("click", () => {
  closeCheckout();
  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("mobileMenu").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("show");
  });
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

renderProducts();
renderCart();
