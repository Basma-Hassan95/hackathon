  // Supabase Configuration
  const SUPABASE_URL = 'https://ywchfwrienbgastlicye.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y2hmd3JpZW5iZ2FzdGxpY3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MDY3ODIsImV4cCI6MjA4MzA4Mjc4Mn0.4GxhWuEC3IbCxti6tAgwEh-nFr0tK1VhW2YbnyUk2uc';
  
  // Initialize Supabase
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase Connected');

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      alert(error.message);
    } else {
      alert('Login successful');
      window.location.href = 'post.html'; 
    }
  });