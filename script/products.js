document.addEventListener("DOMContentLoaded", function () {
  const productCollage = document.getElementById("productCollage");
  let products = [];

  // Fetching data from the products JSON file
  fetch("json/products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      displayProducts(products);
    })
    .catch((error) => console.error("Error loading data:", error));

  // Function to display products on the page
  const displayProducts = (productsList) => {
    if (!productCollage) {
      console.error("Error: The product collage element is null or undefined.");
      return;
    }

    const productItems = productsList.map((product) => {
      if (
        !product || 
        !product.images || 
        !Array.isArray(product.images) || 
        product.images.length === 0 || 
        !product.link || 
        !product.name || 
        !product.price
      ) {
        console.error("Error: A product in the products list has missing or invalid properties.");
        return null;
      }

      const productItem = document.createElement("div");
      productItem.classList.add("product-item");

      const productImage = document.createElement("img");
      productImage.src = product.images[0]; // Use the first image in the array
      productImage.alt = product.name;
      productImage.classList.add("product-image");

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

      return productItem;
    }).filter((productItem) => !!productItem);

    productCollage.innerHTML = "";
    productCollage.append(...productItems);

    handleFadeIn(document.querySelectorAll(".product-item"));
  };

  // Function to handle fade-in effect for products when they appear in the viewport
  const handleFadeIn = (elements) => {
    if (!elements || elements.length === 0) {
      console.error("Error: No elements provided for fade-in.");
      return;
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
              target.classList.add("fade-in");
              observer.unobserve(target);
            }
          });
        },
        { threshold: 0.5 }
      );

      elements.forEach((element) => {
        if (element) {
          observer.observe(element);
        } else {
          console.error("Error: A null or undefined element was provided.");
        }
      });
    } catch (error) {
      console.error("Error initializing IntersectionObserver:", error);
    }
  };

  // Function to filter products based on selected category, price range, and sorting options
  const filterProducts = (sortOption = null) => {
    const selectedCategories = Array.from(
      document.querySelectorAll("#category-list input:checked")
    ).map((input) => {
      if (!input || !input.dataset || !input.dataset.value) {
        console.error("Error: A category checkbox is missing the 'value' dataset property.");
        return null;
      }
      return input.dataset.value;
    }).filter((value) => !!value);

    const maxPriceInput = document.getElementById("price-range");
    if (!maxPriceInput) {
      console.error("Error: The price range input element is null or undefined.");
      return;
    }

    const maxPrice = parseInt(maxPriceInput.value);
    if (isNaN(maxPrice)) {
      console.error("Error: The price range input value is not a valid number.");
      return;
    }

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

    if (!filteredProducts || filteredProducts.length === 0) {
      console.error("Error: No products match the filter criteria.");
      return;
    }

    displayProducts(filteredProducts);
  };

  // Event listeners for sorting buttons
  const sortByButtonGroup = document.getElementById("sort-by");
  if (sortByButtonGroup) {
    const sortButtons = sortByButtonGroup.querySelectorAll("button");
    sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const sortOption = button.dataset.sort;
        filterProducts(sortOption);
      });
    });
  }

  // Apply the initial filters and display products
  filterProducts();

  // Category filtering logic
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

  // Price range filtering logic
  const priceRange = document.getElementById("price-range");
  priceRange.addEventListener("input", () => {
    document.getElementById("price-value").textContent = `MDL0 - MDL${priceRange.value}`;
    filterProducts();
  });

  // Filter toggle visibility logic
  const filterToggle = document.getElementById("filter-toggle");
  const filterOptions = document.getElementById("filter-options");
  const closeFilterButton = document.getElementById("close-filter-button");

  let isFilterVisible = false;
  let isInteractingWithFilter = false;

  const updateFilterVisibility = () => {
    if (!filterOptions || !filterToggle) return;

    try {
      if (window.innerWidth >= 768) {
        filterOptions.classList.add("show");
        filterToggle.style.display = "none";
      } else {
        filterOptions.classList.remove("show");
        filterToggle.style.display = "block";
      }
    } catch (error) {
      console.error("Error updating filter visibility:", error);
    }
  };

  window.addEventListener("resize", updateFilterVisibility);
  updateFilterVisibility();

  filterToggle.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      isFilterVisible = !isFilterVisible;
      filterOptions.classList.toggle("show", isFilterVisible);
      filterToggle.textContent = isFilterVisible ? "Hide Filters" : "Show Filters";
      document.body.style.overflow = isFilterVisible ? '' : '';
    }
  });

  closeFilterButton.addEventListener("click", () => {
    filterOptions.classList.remove("show");
    isFilterVisible = false;
    filterToggle.textContent = "Show Filters";
    document.body.style.overflow = '';
  });

  filterOptions.addEventListener("touchstart", () => {
    isInteractingWithFilter = true;
  });

  filterOptions.addEventListener("touchend", () => {
    isInteractingWithFilter = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (isInteractingWithFilter) {
      e.stopPropagation();
    }
  }, { passive: false });
});
