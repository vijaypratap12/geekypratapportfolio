document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const blogPosts = document.querySelectorAll('.blog-post');
    const resultsContainer = document.querySelector('.search-results');

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        resultsContainer.innerHTML = '';
        
        if(query.length < 3) return;

        Array.from(blogPosts).forEach(post => {
            const title = post.dataset.title.toLowerCase();
            const categories = post.dataset.categories.toLowerCase();
            const content = post.textContent.toLowerCase();
            
            if(title.includes(query) || categories.includes(query) || content.includes(query)) {
                const clone = post.cloneNode(true);
                resultsContainer.appendChild(clone);
            }
        });
    });
});