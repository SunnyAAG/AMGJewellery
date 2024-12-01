document.addEventListener("DOMContentLoaded", function () {
  const productCollage = document.getElementById("productCollage");
  let products = [];

  fetch("json/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      displayProducts(products);
    })
    .catch((error) => console.error("Error loading data:", error));

  const displayProducts = (productsList) => {
    productCollage.innerHTML = "";
    productsList.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const productImage = document.createElement("img");
      productImage.src = product.image;
      productImage.alt = product.name;

      const productLink = document.createElement("a");
      productLink.href = product.link;
      productLink.classList.add("product-link");

      const productName = document.createElement("p");
      productName.textContent = product.name;

      const productPrice = document.createElement("p");
      productPrice.textContent = `${product.price} `;
      productPrice.classList.add("product-price");

      productLink.appendChild(productImage);
      productItem.appendChild(productLink);
      productItem.appendChild(productName);
      productItem.appendChild(productPrice);
      productCollage.appendChild(productItem);
    });

    handleFadeIn(document.querySelectorAll(".product-item"));
  };

  const handleFadeIn = (elements) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  };

  const filterProducts = () => {
    const selectedCategories = Array.from(
      document.querySelectorAll("#category-list input:checked")
    ).map((input) => input.dataset.value);

    const maxPrice = parseInt(document.getElementById("price-range").value);
    const sortOption = document.getElementById("sort-by").value;

    let filteredProducts = products;

    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) => parseInt(product.price) <= maxPrice
    );

    if (sortOption === "price-low-to-high") {
      filteredProducts = filteredProducts.sort(
        (a, b) => parseInt(a.price) - parseInt(b.price)
      );
    } else if (sortOption === "price-high-to-low") {
      filteredProducts = filteredProducts.sort(
        (a, b) => parseInt(b.price) - parseInt(a.price)
      );
    }

    displayProducts(filteredProducts);
  };

  const categoryAllCheckbox = document.getElementById("category-all");
  const otherCategoryCheckboxes = document.querySelectorAll(
    "#category-list input:not(#category-all)"
  );

  categoryAllCheckbox.addEventListener("change", () => {
    if (categoryAllCheckbox.checked) {
      otherCategoryCheckboxes.forEach((checkbox) => (checkbox.checked = false));
    }
    filterProducts();
  });

  otherCategoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        categoryAllCheckbox.checked = false;
      }
      filterProducts();
    });
  });

  const priceRange = document.getElementById("price-range");
  priceRange.addEventListener("input", () => {
    document.getElementById(
      "price-value"
    ).textContent = `MDL0 - MDL${priceRange.value}`;
    filterProducts();
  });

  const sortBySelect = document.getElementById("sort-by");
  sortBySelect.addEventListener("change", filterProducts);

  const filterToggle = document.getElementById("filter-toggle");
  const filterOptions = document.getElementById("filter-options");

  const updateFilterVisibility = () => {
    if (window.innerWidth >= 768) {
      filterOptions.classList.add("show");
      filterToggle.style.display = "none";
    } else {
      filterOptions.classList.remove("show");
      filterToggle.style.display = "block";
    }
  };

  window.addEventListener("resize", updateFilterVisibility);
  updateFilterVisibility();

  filterToggle.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      filterOptions.classList.toggle("show");
      filterToggle.textContent = filterOptions.classList.contains("show")
        ? "Hide Filters"
        : "Show Filters";
    }
  });
});
