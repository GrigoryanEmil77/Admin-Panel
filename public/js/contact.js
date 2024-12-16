document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('http://localhost:3000/api/contact');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // Update email
      const emailLink = document.getElementById('emailLink');
      if (data.email) {
        emailLink.href = `mailto:${data.email}`;
        emailLink.innerText = data.email;
      } else {
        emailLink.innerText = 'Email not available';
      }
  
      // Update phone
      const phoneLink = document.getElementById('phoneLink');
      if (data.phone) {
        phoneLink.href = `tel:${data.phone}`;
        phoneLink.innerText = data.phone;
      } else {
        phoneLink.innerText = 'Phone not available';
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
  
      // Fallback display if there's an error
      document.getElementById('emailLink').innerText = 'Error loading email';
      document.getElementById('phoneLink').innerText = 'Error loading phone';
    }
  });
  