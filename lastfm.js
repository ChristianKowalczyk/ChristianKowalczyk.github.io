// Last.fm API Configuration
// Note: This is a public API key designed for client-side use.
// It can only access public data and cannot modify any information.
const LASTFM_API_KEY = '332d378a3ad00d6eb4e9930ad17f794b';
const LASTFM_USERNAME = 'chrisidek'; // You'll need to replace this with your Last.fm username

async function getRecentTrack() {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
        
        console.log('Fetching from URL:', url);
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error('Last.fm API Error:', data.message);
            throw new Error(data.message);
        }
        
        if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
            console.error('Unexpected API response:', data);
            throw new Error('Invalid API response format');
        }
        
        return data.recenttracks.track[0];
    } catch (error) {
        console.error('Error fetching recent track:', error);
        const container = document.getElementById('currentTrack');
        container.innerHTML = `<h3>Error Loading Track</h3><p>${error.message}</p>`;
        return null;
    }
}

function displayRecentTrack(track) {
    const container = document.getElementById('currentTrack');
    
    if (!track) {
        container.innerHTML = '<h3>No track found</h3>';
        return;
    }
    
    container.innerHTML = '<h3>Currently Listening</h3>';
    const trackCard = document.createElement('div');
    trackCard.className = 'track-card';
    
    const img = document.createElement('img');
    const imageUrl = track.image[3]['#text'] || track.image[2]['#text'];
    img.src = imageUrl;
    img.alt = `${track.name} by ${track.artist['#text']}`;
    
    // Add error handling for images
    img.onerror = function() {
        this.src = 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    };
    
    const info = document.createElement('div');
    info.className = 'track-info';
    info.innerHTML = `
        <div class="track-name">${track.name}</div>
        <div class="artist-name">${track.artist['#text']}</div>
    `;
    
    trackCard.appendChild(img);
    trackCard.appendChild(info);
    container.appendChild(trackCard);
}

async function loadLastFmData() {
    const container = document.getElementById('currentTrack');
    container.innerHTML = '<h3>Loading track...</h3>';
    
    try {
        const track = await getRecentTrack();
        displayRecentTrack(track);
    } catch (error) {
        console.error('Error in loadLastFmData:', error);
        container.innerHTML = `<h3>Error Loading Track</h3><p>${error.message}</p>`;
    }
} 