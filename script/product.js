fetch('json/products.json')
  .then(response => response.json())
  .then(data => {
    const products = data.products;
    const urlHash = window.location.hash.substring(1);
    const productID = "product" + urlHash.replace('product', '').padStart(3, '0');
    const product = products.find(p => p.id === productID);

    if (product) {
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productPrice').textContent = product.price;
      document.getElementById('productDescription').textContent = product.description || "No description available.";
      document.title = product.name;
      const slidesContainer = document.getElementById('slides');
      product.images.forEach(imageSrc => {
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.alt = product.name;
        slidesContainer.appendChild(imgElement);
      });
      let currentSlideIndex = 0;
      const slideImages = slidesContainer.getElementsByTagName('img');
      const totalSlides = slideImages.length;
      const showSlide = index => {
        if (index >= totalSlides) currentSlideIndex = 0;
        if (index < 0) currentSlideIndex = totalSlides - 1;
        Array.from(slideImages).forEach(slide => {
          slide.style.display = 'none';
        });
        slideImages[currentSlideIndex].style.display = 'block';
      };
      showSlide(currentSlideIndex);
      document.getElementById('nextSlide').addEventListener('click', () => {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
      });
      document.getElementById('prevSlide').addEventListener('click', () => {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
      });
    } else {
      console.error("Product not found.");
      alert("Product not found.");
    }
  })
  .catch(error => {
    console.error("Error loading the products data: ", error);
    alert("Failed to load product details.");
  });
