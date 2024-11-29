document.addEventListener("DOMContentLoaded", function () {
  const productCollage = document.getElementById('productCollage');
  let products = [];

  fetch('json/products.json')
    .then(response => response.json())
    .then(data => {
      products = data.products;
      displayProducts(products);
    })
    .catch(error => console.error('Error loading data:', error));

  const displayProducts = (productsList) => {
    productCollage.innerHTML = '';
    productsList.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');

      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.name;

      const productLink = document.createElement('a');
      productLink.href = product.link;
      productLink.classList.add('product-link');

      const productName = document.createElement('p');
      productName.textContent = product.name;

      const productPrice = document.createElement('p');
      productPrice.textContent = product.price;
      productPrice.classList.add('product-price');

      productLink.appendChild(productImage);
      productItem.appendChild(productLink);
      productItem.appendChild(productName);
      productItem.appendChild(productPrice);
      productCollage.appendChild(productItem);
    });

    handleFadeIn(document.querySelectorAll('.product-item'));
  };

  const handleFadeIn = (elements) => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    elements.forEach(element => {
      observer.observe(element);
    });
  };

  const filterProducts = () => {
    const category = document.getElementById('category').value;
    const material = document.getElementById('material').value;
    const maxPrice = document.getElementById('price-range').value;
    const sortBy = document.getElementById('sort').value;

    let filteredProducts = products;

    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }

    if (material !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.material.toLowerCase() === material.toLowerCase());
    }

    filteredProducts = filteredProducts.filter(product => {
      const price = parseInt(product.price.split(' ')[0]);
      return price <= maxPrice;
    });

    if (sortBy === 'price') {
      filteredProducts = filteredProducts.sort((a, b) => {
        const priceA = parseInt(a.price.split(' ')[0]);
        const priceB = parseInt(b.price.split(' ')[0]);
        return priceA - priceB;
      });
    } else if (sortBy === 'date') {
      filteredProducts = filteredProducts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    }

    displayProducts(filteredProducts);
  };

  document.getElementById('category').addEventListener('change', filterProducts);
  document.getElementById('material').addEventListener('change', filterProducts);
  document.getElementById('price-range').addEventListener('input', function () {
    document.getElementById('price-value').textContent = `${this.value} MDL`;
    filterProducts();
  });
  document.getElementById('sort').addEventListener('change', filterProducts);
});
document.addEventListener("DOMContentLoaded", () => {
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
    filterOptions.classList.toggle("show");
    filterToggle.textContent = filterOptions.classList.contains("show")
      ? "Hide Filters"
      : "Show Filters";
  });
});
