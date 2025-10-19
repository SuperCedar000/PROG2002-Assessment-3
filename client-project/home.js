// Configure API base URL
const API_BASE = 'http://localhost:3000';

// Initialize after page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initializing homepage...');
    loadOrganisations();
    loadAllEvents();
});

// Load organization information
function loadOrganisations() {
    // Hard-coded organization information - can be changed to fetch from API
    const organisations = [
        {
            name: "Welcome to Our Common Home",
            description: "Here, every kindness is not in vain, every helping hand is meaningful.",
            contact: "contaxx@redcross.com.au"
        },
        {
            name: "Our Mission: Ignite Hope, Pass on Dignity, Reshape the Future.",
            description: "We are committed to providing sustainable support for the most vulnerable groups - from hungry children to the homeless, from out-of-school youth to disaster-affected families.",
            contact: "inxxo@cancomr.org.au"
        },
        {
            name: "Because of You, We Believe Change is Happening.",
            description: "Every donation, forward, volunteer service, and even a sincere share creates ripples that push the world toward goodness.",
            contact: "enquirs@wwf.com.au"
        }
    ];
    
    const organisationsGrid = document.getElementById('organisationsGrid');
    if (organisationsGrid) {
        organisationsGrid.innerHTML = organisations.map(org => `
            <div class="organisation-card">
                <h3>${org.name}</h3>
                <p>${org.description}</p>
                <div class="contact-info">Contact: ${org.contact}</div>
            </div>
        `).join('');
    }
}

// Load all events and display by category
async function loadAllEvents() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE}/api/events`);
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Successfully loaded ${result.data.length} events`);
            categorizeEvents(result.data);
        } else {
            throw new Error(result.message || 'Failed to load events');
        }
    } catch (error) {
        console.error('❌ Failed to load events:', error);
        showError('Failed to load events: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Categorize and display events
function categorizeEvents(events) {
    const now = new Date();
    const upcomingEvents = [];
    const pastEvents = [];
    const pausedEvents = [];
    
    events.forEach(event => {
        const eventDate = new Date(event.event_date);
        
        if (!event.is_active) {
            pausedEvents.push(event);
        } else if (eventDate >= now) {
            upcomingEvents.push(event);
        } else {
            pastEvents.push(event);
        }
    });
    
    displayEventsList('allEventsList', events, 'All events');
    displayEventsList('upcomingEventsList', upcomingEvents, 'Upcoming events');
    displayEventsList('pastEventsList', pastEvents, 'Ended events');
    displayEventsList('pausedEventsList', pausedEvents, 'Suspended events');
}

// Display event list
function displayEventsList(elementId, events, title) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (events.length === 0) {
        element.innerHTML = `<div class="no-events">No ${title} available</div>`;
        return;
    }
    
    element.innerHTML = events.map(event => `
        <div class="event-item" onclick="viewEventDetails(${event.id})">
            <div class="event-item-header">
                <h4>${event.name}</h4>
                <span class="event-status ${getEventStatus(event)}">${getStatusText(event)}</span>
            </div>
            <p><strong>Date:</strong> ${formatDate(event.event_date)}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category_name || 'Uncategorized'}</p>
        </div>
    `).join('');
}

// View event details
function viewEventDetails(eventId) {
    // Jump to event details page or show modal
    window.location.href = `index.html?eventId=${eventId}`;
}

// Get event status
function getEventStatus(event) {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    
    if (!event.is_active) return 'paused';
    if (eventDate >= now) return 'upcoming';
    return 'past';
}

// Get status text
function getStatusText(event) {
    const status = getEventStatus(event);
    switch(status) {
        case 'upcoming': return 'Upcoming';
        case 'past': return 'Ended';
        case 'paused': return 'Suspended';
        default: return 'Unknown';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

// Show/hide loading indicator
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

// Show error message
function showError(message) {
    alert(message);
}