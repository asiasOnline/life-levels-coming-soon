const supabase = supabase.createClient(
      'YOUR_PROJECT_URL',
      'YOUR_ANON_KEY'
    );

    const form = document.getElementById('waitlist-form');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const submitButton = form.querySelector('button');
      
      // Disable button during submission
      submitButton.disabled = true;
      submitButton.textContent = 'Joining...';
      
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .insert([{ email }]);

        if (error) {
          if (error.code === '23505') { // Unique violation
            messageDiv.textContent = 'You\'re already on the list!';
            messageDiv.className = 'info';
          } else {
            throw error;
          }
        } else {
          messageDiv.textContent = 'Thanks! You\'re on the list 🎉';
          messageDiv.className = 'success';
          form.reset();
        }
      } catch (err) {
        messageDiv.textContent = 'Something went wrong. Please try again.';
        messageDiv.className = 'error';
        console.error(err);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Join Waitlist';
      }
    });