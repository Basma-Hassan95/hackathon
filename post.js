 // Get modal elements
 const modal = document.getElementById('createPostModal');
 const openModalBtn = document.getElementById('openModalBtn');
 const closeModalBtn = document.getElementById('closeModalBtn');
 const createPostForm = document.getElementById('createPostForm');

 // Open modal
 openModalBtn.addEventListener('click', () => {
     modal.classList.add('active');
 });

 // Close modal
 closeModalBtn.addEventListener('click', () => {
     modal.classList.remove('active');
 });

 // Close modal when clicking outside
 window.addEventListener('click', (e) => {
     if (e.target === modal) {
         modal.classList.remove('active');
     }
 });

 // Handle form submission
 createPostForm.addEventListener('submit', (e) => {
     e.preventDefault();
     
     const title = document.getElementById('postTitle').value;
     const content = document.getElementById('postContent').value;
     const image = document.getElementById('postImage').files[0];
     
     console.log('Post Created:', { title, content, image });
     
     // Close modal and reset form
     modal.classList.remove('active');
     createPostForm.reset();
     
     alert('Post published successfully!');
 });