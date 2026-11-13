/*====================================================================
  // SHOPEASE- ONLINE SHOPPING SYSTEM
  // JavaScript functionality
  ================================================================*/
  /*==========1,PRODUCT DATABASE=========*/
  //an array containing all available products.
  //each product is represented as an object.
  const products = [
  
  {
    id: 1,
    name:"Wireless Headphones",
    category:"Electronics",
    price:2500,
    image:
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
  },

  {
    id:2,
    name:"SmartWatch",
    category:"Electronics",
    price:3800,
    image:
   "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    id: 3,
    name: "Laptop",
    category: "Electronics",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
  },
  {
  id: 4,
  name:'Stylish Sneakers',
  category:"Fashion",
  price:3200,
  image:
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },

  {
    id:5,
    name:"Smartphone",
    category:"Electronics",
    price:15000,
    image:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    id:6,
    name: "Travel Backpack",
    category: "Accessories",
    price: 2200,
    image:
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
  },
  {
    id:7,
    name:"Classic Wrist Watch",
    category:"Accessories",
    price:2200,
    image:
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"
  },
  {
    id:8,
    name:"Fashion Jacket",
    category:"Fashion",
    price:4200,
    image:
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
  },
  {
    id:9,
    name:"Sunglasses",
    category:"Accessories",
    price:1200,
    image:
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
  }
  ];
  //Shopping cart starts with selected items, if available.
  //Otherwise,an empty array is created.
  let cart=[];
  try{
    const savedCart=JSON.parse(
      localStorage.getItem("shopEaseCart")
    );
    if(Array.isArray(savedCart)){
      function isValidCartItem(item) {
        const productExists = products.some(product => product.id === item.id);
        const validQuantity = Number.isInteger(item.quantity) && item.quantity > 0;
        return productExists && validQuantity;
      }
      cart = savedCart.filter(isValidCartItem);
    }
  } catch(error){
    cart=[];
  }
  function saveCart(){
    localStorage.setItem(
      "shopEaseCart",
      JSON.stringify(cart)
    );
  }
  /*==========2.SELECT HTML ELEMENTS==========*/
  //These elements connects Javascript to HTML elements.
  const productContainer = document.getElementById("productContainer");
  const cartButton = document.getElementById("cartButton");
  const cartSection = document.getElementById("cartSection");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutButton = document.getElementById("checkoutButton");
  const searchInput = document.getElementById("searchInput");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const successModal = document.getElementById("successModal");
  const closeCheckoutButton = document.getElementById("closeCheckout");

  /*=========3.DISPLAY PRODUCTS==========*/
  //This function creates product cards dynamically.
  // Helper function for currency formatting
  function formatCurrency(amount) {
    return "Ksh" + amount.toLocaleString("en-KE");
  }

  function displayProducts(productList) {
    if (!productContainer) return;

    productContainer.innerHTML = "";

    // Check whether products are available.
    if (productList.length === 0) {
      productContainer.innerHTML = '<p class="no-products">No products found.</p>';
      return;
    }

    productList.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">${formatCurrency(product.price)}</p>
          <button class="add-cart" data-id="${product.id}">Add to cart</button>
        </div>
      `;

      productContainer.appendChild(productCard);
    });
  }

  function getCartTotals() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    return { totalQuantity, total };
  }

  function updateCart() {
    const { totalQuantity, total } = getCartTotals();

    if (cartCount) {
      cartCount.textContent = totalQuantity;
    }

    if (cartTotal) {
      cartTotal.textContent = formatCurrency(total);
    }

    if (checkoutTotal) {
      checkoutTotal.textContent = formatCurrency(total);
    }

    if (checkoutButton) {
      checkoutButton.disabled = cart.length === 0;
    }

    if (cartItems) {
      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
      } else {
        cartItems.innerHTML = cart
          .map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return "";

            return `
              <div class="cart-item">
                <div class="cart-item-info">
                  <h4>${product.name}</h4>
                  <p>${formatCurrency(product.price)}</p>
                </div>
                <div class="cart-item-controls">
                  <button data-action="decrease" data-id="${product.id}">-</button>
                  <span>${item.quantity}</span>
                  <button data-action="increase" data-id="${product.id}">+</button>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }
  }

  function addToCart(productId) {
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity < 99) {
        existingItem.quantity += 1;
      }
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    updateCart();
    saveCart();
  }

  if (productContainer) {
    productContainer.addEventListener("click", (event) => {
      const addButton = event.target.closest(".add-cart");
      if (!addButton || !productContainer.contains(addButton)) return;

      const productId = Number(addButton.dataset.id);
      if (products.some((product) => product.id === productId)) {
        addToCart(productId);
      }
    });
  }

  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (!actionButton || !cartItems.contains(actionButton)) return;

      const productId = Number(actionButton.dataset.id);
      const item = cart.find((product) => product.id === productId);
      if (!item) return;

      if (actionButton.dataset.action === "increase") {
        if (item.quantity < 99) item.quantity += 1;
      } else if (actionButton.dataset.action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart = cart.filter((product) => product.id !== productId);
        }
      }

      saveCart();
      updateCart();
    });
  }

  updateCart();

  /*==========6. CHANGE QUANTITY==========*/
  //Handle increase, decrease and remove operations.
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      if (cartSection) {
        cartSection.classList.add("open");
      }
    });
  }
/*==========7. OPEN AND CLOSE CART==========*/
  const closeCartButton = document.getElementById("closeCart");
  if (closeCartButton) {
    closeCartButton.addEventListener("click", function () {
      if (cartSection) {
        cartSection.classList.remove("open");
      }
    });
  }

  /*==========8.SEARCH PRODUCTS=========*/
  // search products using their names and categories.
  let activeCategory = "All";

  function applyProductFilters() {
    const searchTerm = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const selectedCategory = activeCategory || "All";

    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyProductFilters();
    });
  }

  /*==========9. FILTER BY CATEGORY ===========*/
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      activeCategory = this.dataset.category || "All";
      applyProductFilters();
    });
  });

  /*==========10. CHECKOUT==========*/
  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      if (cart.length === 0) return;

      const total = cart.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      if (checkoutTotal) {
        checkoutTotal.textContent = formatCurrency(total);
      }

      if (cartSection) {
        cartSection.classList.remove("open");
      }

      if (checkoutModal) {
        checkoutModal.classList.add("show");
      }
    });
  }

  /*==========11. CLOSE CHECKOUT MODAL==========*/
  if (checkoutModal) {
    checkoutModal.addEventListener("click", function (event) {
      if (event.target === checkoutModal) {
        checkoutModal.classList.remove("show");
      }
    });
  }
  if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener("click", function () {
      if (checkoutModal) {
        checkoutModal.classList.remove("show");
      }
    });
  }

  /*==========12.PROCESS DEMO ORDER =========*/
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (cart.length === 0) {
        alert("Your cart is empty!");
        if (checkoutModal) {
          checkoutModal.classList.remove("show");
        }
        return;
      }

      const customerName = document.getElementById("customerName").value.trim();
      const customerEmail = document.getElementById("customerEmail").value.trim();
      const customerPhone = document.getElementById("customerPhone").value.trim();
      const customerAddress = document.getElementById("customerAddress").value.trim();
      const paymentMethod = document.getElementById("paymentMethod").value;

      if (!customerName || !customerEmail || !customerPhone || !customerAddress || !paymentMethod) {
        alert("Please complete all fields.");
        return;
      }

      const finalTotal = cart.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      const orderNumber = "SE" + Date.now().toString().slice(-8);

      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.textContent = `Thank you, ${customerName}! Your order ${orderNumber} for ${formatCurrency(finalTotal)} has been placed.`;
      }

      cart = [];
      saveCart();
      updateCart();

      if (checkoutModal) {
        checkoutModal.classList.remove("show");
      }

      if (successModal) {
        successModal.classList.add("show");
      }

      checkoutForm.reset();
    });
  }

  /*==========13. CONTINUE SHOPPING==========*/
  const continueShoppingButton = document.getElementById("continueShopping");
  if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", function () {
      if (successModal) {
        successModal.classList.remove("show");
      }

      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  displayProducts(products);

  /*==========14.END OF PROGRAM==========*/
  // End of ShopEase shopping system script        