// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
      'https://tdunvoerroyvywpljoyx.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdW52b2Vycm95dnl3cGxqb3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MDU0MzcsImV4cCI6MjA4NjA4MTQzN30.v2OIQoEbtyr8kN-RDZaA9SMyQArVMDhfhCS0hDyj2oQ'
    );

const form = document.getElementById('waitlist-form');
const messageDiv = document.getElementById('message');
let formLoadTime = Date.now();
let lastSubmitTime = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const honeypot = document.getElementById('website').value;
  const submitButton = form.querySelector('button');
  
  // Bot checks
  if (honeypot) return; // Honeypot triggered
  
  const timeToSubmit = Date.now() - formLoadTime;
  if (timeToSubmit < 2000) {
    message.textContent = 'Please take a moment to review your email';
    message.className = 'text-amber-600 text-center';
    return;
  }
  
  // Rate limiting (client-side)
  if (Date.now() - lastSubmitTime < 5000) {
    message.textContent = 'Please wait a moment before trying again';
    message.className = 'text-amber-600 text-center';
    return;
  }
  
  // Disable button during submission
  submitButton.disabled = true;
  submitButton.textContent = 'Joining...';
  
  try {
    const { data, error } = await supabaseClient
      .from('waitlist')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        message.textContent = "We appreciate your enthusiasm! But you're already on the list!";
      } else {
        throw error;
      }
    } else {
      message.textContent = "Thanks! You're on the list 🎉";
      form.reset();
      lastSubmitTime = Date.now();
    }
  } catch (err) {
    message.textContent = 'Something went wrong. Please try again.';
    message.className = 'text-red-600 text-center';
    console.error(err);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Join the Waitlist';
  }
});