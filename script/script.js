document.addEventListener("DOMContentLoaded", function () {
  const categories = document.querySelectorAll('.category');
  const products = document.querySelectorAll('.product-item');

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

  handleFadeIn(categories);
  handleFadeIn(products);

  fetch('json/products.json')
    .then(response => response.json())
    .then(data => {
      const productCollage = document.getElementById('productCollage');
      const popularProducts = data.products
        .filter(product => product.isPopular)
        .slice(0, 4);

      popularProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        const productImage = document.createElement('img');
        productImage.src = product.images[0];
        productImage.alt = product.name;
        productImage.classList.add('fade-in');

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
    })
    .catch(error => console.error('Error loading data:', error));
});
