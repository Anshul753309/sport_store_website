// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

// Year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Contact form (simple client-side validation)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => {
      const error = el.parentElement.querySelector('.error');
      const ok = el.value && (el.type !== 'email' || /\S+@\S+\.\S+/.test(el.value));
      if (!ok) { valid = false; if (error) error.style.display = 'block'; el.style.borderColor = '#d82a2a'; }
      else { if (error) error.style.display = 'none'; el.style.borderColor = '#e6e8eb'; }
    });
    if (valid) {
      form.reset();
      const success = form.querySelector('.form__success');
      if (success) { success.style.opacity = 1; success.style.transform = 'translateY(0)'; }
    }
  });
}

// Details toggles (event delegation)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.details-btn');
  if (!btn) return;
  e.preventDefault();

  const card = btn.closest('.product__body');
  if (!card) return;

  const details = card.querySelector('.details-text');
  if (!details) return;

  details.classList.toggle('active');
  btn.textContent = details.classList.contains('active') ? 'Hide Details' : 'Details';
});

// ---- CART FUNCTIONALITY ---- //
function loadCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Single addToCart for products page
function addToCart(name, price) {
  let cart = loadCart();
  const numericPrice = Number(price);  // force conversion to number

  if (isNaN(numericPrice)) {
    console.error("Invalid price for", name, price);
    return; // don't add bad data
  }

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price: numericPrice, quantity: 1 });
  }

  saveCart(cart);
  window.location.href = 'cart.html';
}

// Wire up "Add to Cart" buttons (products.html)
// Wire up "Add to Cart" buttons (both products.html and sale.html)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Case 1: Products page (button has data-name, data-price)
      if (btn.dataset.name && btn.dataset.price) {
        const { name, price } = btn.dataset;
        addToCart(name, price);
        return;
      }

      // Case 2: Sale page (parent article has data attributes)
      const product = btn.closest('.product');
      if (product && product.dataset.name && product.dataset.price) {
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price);
        const discount = parseFloat(product.dataset.discount || 0);

        // Apply discount before adding
        const finalPrice = price * (1 - discount);
        addToCart(name, finalPrice);
        return;
      }

      console.error("Add to cart failed: No valid dataset found.");
    });
  });
});


// Render Cart
function renderCart() {
  const cartTable = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartTable || !cartTotal) return; // not on cart page

  const cart = loadCart();
  cartTable.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" />
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}">Remove</button></td>
    `;
    cartTable.appendChild(row);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);

  // Qty change
  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const cart = loadCart();
      const idx = parseInt(e.target.dataset.index, 10);
      cart[idx].quantity = Math.max(1, parseInt(e.target.value, 10) || 1);
      saveCart(cart);
      renderCart();
    });
  });

  // Remove
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cart = loadCart();
      const idx = parseInt(e.target.dataset.index, 10);
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

// Always try to render (safe no-op off cart page)
document.addEventListener('DOMContentLoaded', renderCart);

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".section");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-target");

      // Hide all sections
      sections.forEach(sec => sec.classList.remove("active"));

      // Show selected section
      document.getElementById(targetId).classList.add("active");

      // Optional: highlight active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
});
