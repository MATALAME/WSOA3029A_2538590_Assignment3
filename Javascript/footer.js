window.onload = function() {   /*This waits for the page to fully load and then reference the footer section and adds the innerHTMl content */
    const footer = document.getElementById("footerItem");
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="logo">
            <h2>FRUITS.CO</h2>
          </div>
          <div class="contact-info">
            <h3>Get in Touch</h3>
            <p>fruitsco@gmail.com</p>
            <p>+27 75 234 6723</p>
            <p>647 Sweet Road, Sandton,<br> Gauteng, South Africa</p>
          </div>
        </div>
        <hr> 
        <p class="copyright">&copy; Fruits Corp. All Rights Reserved </p> 
      </div>
    `;
  };