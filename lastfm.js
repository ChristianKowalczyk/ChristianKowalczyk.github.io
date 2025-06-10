// Last.fm API Configuration
// Note: This is a public API key designed for client-side use.
// It can only access public data and cannot modify any information.
const LASTFM_API_KEY = '332d378a3ad00d6eb4e9930ad17f794b';
const LASTFM_USERNAME = 'chrisidek'; // You'll need to replace this with your Last.fm username

async function getTopAlbums() {
    try {
        // Calculate timestamp for 90 days ago
        const now = new Date();
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        const timestamp = Math.floor(ninetyDaysAgo.getTime() / 1000);
        
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=5&period=3month`;
        
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error('Last.fm API Error:', data.message);
            throw new Error(data.message);
        }
        
        if (!data.topalbums || !data.topalbums.album) {
            console.error('Unexpected API response:', data);
            throw new Error('Invalid API response format');
        }
        
        return data.topalbums.album;
    } catch (error) {
        console.error('Error fetching top albums:', error);
        const container = document.getElementById('topAlbums');
        container.innerHTML = `<h3>Error Loading Albums</h3><p>${error.message}</p>`;
        return [];
    }
}

function displayTopAlbums(albums) {
    const container = document.getElementById('topAlbums');
    
    if (albums.length === 0) {
        container.innerHTML = '<h3>No albums found</h3>';
        return;
    }
    
    container.innerHTML = '<h3>Top Albums (Last 3 Months)</h3>';
    const albumGrid = document.createElement('div');
    albumGrid.className = 'album-grid';
    
    albums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.className = 'album-card';
        
        const img = document.createElement('img');
        // Use the large image size, fallback to medium if large isn't available
        const imageUrl = album.image[3]['#text'] || album.image[2]['#text'];
        img.src = imageUrl;
        img.alt = `${album.name} by ${album.artist.name}`;
        
        // Add error handling for images
        img.onerror = function() {
            this.src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
        };
        
        const info = document.createElement('div');
        info.className = 'album-info';
        info.innerHTML = `
            <div class="album-name">${album.name}</div>
            <div class="artist-name">${album.artist.name}</div>
        `;
        
        albumCard.appendChild(img);
        albumCard.appendChild(info);
        albumGrid.appendChild(albumCard);
    });
    
    container.appendChild(albumGrid);
}

async function loadLastFmData() {
    const container = document.getElementById('topAlbums');
    container.innerHTML = '<h3>Loading albums...</h3>';
    
    try {
        const albums = await getTopAlbums();
        displayTopAlbums(albums);
    } catch (error) {
        console.error('Error in loadLastFmData:', error);
        container.innerHTML = `<h3>Error Loading Albums</h3><p>${error.message}</p>`;
    }
} 