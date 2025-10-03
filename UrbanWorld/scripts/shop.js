document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("category-list");
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const showAllBtn = document.getElementById("show-all");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeLightbox = document.getElementById("close-lightbox");

  let productsData = [];
  let cart = [];

  fetch('data/products.json')
  .then(r => r.json())
  .then(data => {
    console.log('Datos cargados:', data);
    productsData = data.products || [];
    renderCategories(data.categories || []);
    renderProducts(productsData);
  })
  .catch(err => {
    productList.innerHTML = '<p style="padding:12px;">Error cargando productos.</p>';
    console.error('Error al cargar JSON:', err);
  });

  // ---------- CATEGORIES ----------
  function renderCategories(categories){
    // Botón mostrar todo
    const allBtn = document.createElement('div');
    allBtn.className = 'category';
    allBtn.innerHTML = `<button class="category-button" data-cat="__all">Todos</button>`;
    categoryList.appendChild(allBtn);
    allBtn.querySelector('button').addEventListener('click', () => {
      clearActiveCategory();
      renderProducts(productsData);
    });

    categories.forEach(cat => {
      const wrapper = document.createElement('div');
      wrapper.className = 'category';

      const btn = document.createElement('button');
      btn.className = 'category-button';
      btn.textContent = cat.name;
      btn.dataset.cat = cat.name;
      wrapper.appendChild(btn);

      if (cat.subcategories && cat.subcategories.length) {
        const sub = document.createElement('div');
        sub.className = 'subcategories';
        cat.subcategories.forEach(s => {
          const a = document.createElement('a');
          a.href = '#';
          a.textContent = s;
          a.dataset.cat = cat.name;
          a.dataset.sub = s;
          sub.appendChild(a);

          a.addEventListener('click', (e) => {
            e.preventDefault();
            clearActiveCategory();
            btn.classList.add('open');
            sub.style.display = 'block';
            highlightActive(a);
            filterProducts(cat.name, s);
          });
        });
        wrapper.appendChild(sub);

        btn.addEventListener('click', () => {
          const isOpen = btn.classList.toggle('open');
          sub.style.display = isOpen ? 'block' : 'none';
        });
      } else {
        // categoría sin sub
        btn.addEventListener('click', () => {
          clearActiveCategory();
          btn.classList.add('open');
          filterProducts(cat.name, null);
        });
      }

      categoryList.appendChild(wrapper);
    });
  }

  function highlightActive(element){
    // marcar elemento seleccionado (subcategoria)
    document.querySelectorAll('.subcategories a').forEach(a => a.classList.remove('active'));
    if(element) element.classList.add('active');
  }

  function clearActiveCategory(){
    document.querySelectorAll('.category-button').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.subcategories').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.subcategories a').forEach(a => a.classList.remove('active'));
  }

  // ---------- PRODUCTS ----------
  function renderProducts(list){
    productList.innerHTML = '';
    if(!list.length){
      productList.innerHTML = '<p style="padding:12px;">No hay productos en esta categoría.</p>';
      return;
    }
    list.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.id = prod.id;

      // MEDIA
      const media = document.createElement('div');
      media.className = 'product-media';
      const mainImg = document.createElement('img');
      mainImg.src = prod.images[0] || '';
      mainImg.className = 'product-main-img';
      mainImg.alt = prod.name;
      mainImg.addEventListener('click', () => openLightbox(mainImg.src));
      media.appendChild(mainImg);

      // thumbnails
      const thumbs = document.createElement('div');
      thumbs.className = 'product-thumbs';
      prod.images.forEach((src, i) => {
        const t = document.createElement('img');
        t.src = src;
        if(i === 0) t.classList.add('active');
        t.addEventListener('click', () => {
          // swap main image & active thumb
          media.querySelectorAll('.product-thumbs img').forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          mainImg.src = src;
        });
        thumbs.appendChild(t);
      });
      media.appendChild(thumbs);
      card.appendChild(media);

      // INFO
      const info = document.createElement('div');
      info.className = 'product-info';
      info.innerHTML = `
        <h3>${prod.name}</h3>
        <p class="price">${prod.price.toFixed(2)} €</p>
        <p class="description">${prod.description}</p>
      `;

      // color selector (si aplica)
      if (prod.colors && prod.colors.length){
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Color:';
        const sel = document.createElement('select');
        prod.colors.forEach(c => {
          const o = document.createElement('option');
          o.value = c; o.textContent = c;
          sel.appendChild(o);
        });
        info.appendChild(colorLabel);
        info.appendChild(sel);
      }

      // qty input
      const qtyRow = document.createElement('div');
      qtyRow.className = 'row';
      const qty = document.createElement('input');
      qty.type = 'number';
      qty.min = '1';
      qty.value = '1';
      qty.style.width = '90px';
      qtyRow.appendChild(qty);

      // add to cart
      const btn = document.createElement('button');
      btn.className = 'add-to-cart';
      btn.textContent = 'Añadir al carrito';
      btn.addEventListener('click', () => {
        const selectedColor = info.querySelector('select') ? info.querySelector('select').value : '-';
        addToCart(prod.id, prod.name, prod.price, parseInt(qty.value || '1', 10), selectedColor);
      });
      qtyRow.appendChild(btn);
      info.appendChild(qtyRow);

      card.appendChild(info);
      productList.appendChild(card);
    });
  }

  // FILTRADO
  function filterProducts(cat, sub){
    const filtered = productsData.filter(p => {
      if(sub) return p.category === cat && p.subcategory === sub;
      return p.category === cat;
    });
    renderProducts(filtered);
  }

  showAllBtn.addEventListener('click', () => {
    clearActiveCategory();
    renderProducts(productsData);
  });

  // ---------- CART ----------
  function addToCart(id, name, price, qty, color){
    // merge if same id & color
    const existing = cart.find(i => i.id === id && i.color === color);
    if(existing) existing.qty += qty;
    else cart.push({ id, name, price: parseFloat(price), qty: parseInt(qty,10), color });
    updateCart();
  }

  function updateCart(){
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div>
          <div class="name">${it.name} <small style="color:#777">(${it.color})</small></div>
          <div style="color:#777; font-size:0.9rem;">${it.price.toFixed(2)} € c/u</div>
        </div>
        <div style="text-align:right;">
          <input class="qty" data-i="${idx}" type="number" min="1" value="${it.qty}">
          <div style="margin-top:6px;">
            <button class="remove" data-i="${idx}" title="Eliminar">✕</button>
          </div>
          <div style="margin-top:6px; font-weight:700;">${(it.price * it.qty).toFixed(2)} €</div>
        </div>
      `;
      cartItems.appendChild(li);
      total += it.price * it.qty;
    });
    cartTotal.textContent = `Total: ${total.toFixed(2)} €`;

    // events qty change + remove
    document.querySelectorAll('.qty').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const i = parseInt(e.target.dataset.i,10);
        let val = parseInt(e.target.value,10);
        if(isNaN(val) || val < 1) val = 1;
        cart[i].qty = val;
        updateCart();
      });
    });
    document.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.i,10);
        cart.splice(i,1);
        updateCart();
      });
    });
  }

  document.getElementById('checkout').addEventListener('click', () => {
    alert('Finalizar compra: sistema de pagos aún no implementado. Esto es un prototipo frontend.');
  });

  // ---------- LIGHTBOX ----------
  function openLightbox(src){
    lightboxImg.src = src;
    lightbox.classList.remove('hidden');
  }
  closeLightbox.addEventListener('click', () => lightbox.classList.add('hidden'));
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) lightbox.classList.add('hidden');
  });
});
