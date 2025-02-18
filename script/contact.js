const scriptURL = 'https://script.google.com/macros/s/AKfycbyYdCyoxw3xZeMY2vn13cwm4jGzWMMd7jNmxHJkM9TwwkyG7--OdRjlsd0_wDHc-ysKWQ/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
  
  e.preventDefault();

  let btn = document.getElementById("submit");

  
  btn.value = "Așteptați...";
  
 
  let spinner = document.createElement("span");
  spinner.classList.add("spinner");
  btn.parentNode.insertBefore(spinner, btn);

  setTimeout(() => {
    spinner.remove(); 
    btn.style.backgroundColor = "#93B7D1"; 
}, 5000);
  
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => btn.value = "Mulțumim!")
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})
