document.addEventListener("DOMContentLoaded", () => {
  // Slider de producto
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach(slider => {
    const imgs = slider.querySelectorAll("img");
    let index = 0;
    imgs[index].classList.add("active");

    setInterval(() => {
      imgs[index].classList.remove("active");
      index = (index + 1) % imgs.length;
      imgs[index].classList.add("active");
    }, 3000);

    // Abrir lightbox
    imgs.forEach(img => {
      img.addEventListener("click", () => {
        document.getElementById("lightbox-img").src = img.src;
        document.getElementById("lightbox").classList.remove("hidden");
      });
    });
  });

  // Cerrar lightbox
  document.getElementById("close-lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").classList.add("hidden");
  });

  // Carrito
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let cart = [];

  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} (${item.color}) x${item.qty} - ${(item.price * item.qty).toFixed(2)} €
        <button data-i="${i}" class="remove">❌</button>
      `;
      cartItems.appendChild(li);
      total += item.price * item.qty;
    });
    cartTotal.textContent = `Total: ${total.toFixed(2)} €`;

    // Botón eliminar
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", e => {
        cart.splice(e.target.dataset.i, 1);
        updateCart();
      });
    });
  }

  // Añadir al carrito
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const name = card.querySelector("h3").textContent;
      const price = parseFloat(card.querySelector(".price").textContent.replace("€",""));
      const color = card.querySelector("select").value;
      const qty = parseInt(card.querySelector("input[type='number']").value);

      cart.push({ name, price, color, qty });
      updateCart();
    });
  });
});
