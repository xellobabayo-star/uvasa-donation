// Donation history array
let donationHistory = [];

// Fetch latest donation when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchLatestDonation();
    loadHistoryFromStorage();
    
    // Auto-refresh setiap 3 detik
    setInterval(fetchLatestDonation, 3000);
});

async function fetchLatestDonation() {
    try {
        const response = await fetch('/data');
        const donation = await response.json();
        
        if (donation && donation.platform) {
            displayLatestDonation(donation);
            addToHistory(donation);
        }
    } catch (error) {
        console.error('Error fetching donation:', error);
    }
}

function displayLatestDonation(donation) {
    const box = document.getElementById('latestDonation');
    const timestamp = new Date().toLocaleTimeString('id-ID');
    
    const platformClass = donation.platform.toLowerCase();
    const platformEmoji = {
        'socialbuzz': '💬',
        'saweria': '🎁',
        'bagibagi': '📦'
    }[platformClass] || '💝';
    
    box.innerHTML = `
        <span class="platform ${platformClass}">${platformEmoji} ${donation.platform.toUpperCase()}</span>
        <div class="donor-name">${donation.username || 'Anonymous'}</div>
        <div class="amount">Rp ${formatNumber(donation.amount)}</div>
        ${donation.message ? `<div class="message">"${donation.message}"</div>` : ''}
        <div class="timestamp">Just now at ${timestamp}</div>
    `;
}

function addToHistory(donation) {
    // Cek apakah donor ini sudah ada di history dengan data yang sama
    const isDuplicate = donationHistory.some(item => 
        item.username === donation.username && 
        item.amount === donation.amount && 
        item.platform === donation.platform
    );
    
    if (!isDuplicate) {
        const historyItem = {
            ...donation,
            timestamp: new Date().toLocaleTimeString('id-ID')
        };
        
        donationHistory.unshift(historyItem); // Tambah ke awal
        
        // Simpan max 50 donation terakhir
        if (donationHistory.length > 50) {
            donationHistory.pop();
        }
        
        saveHistoryToStorage();
        displayHistory();
    }
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    
    if (donationHistory.length === 0) {
        historyList.innerHTML = '<p class="loading">No donations yet</p>';
        return;
    }
    
    historyList.innerHTML = donationHistory.map((item, index) => `
        <div class="history-item ${item.platform.toLowerCase()}">
            <div class="item-info">
                <div class="donor">
                    <span class="platform-label ${item.platform.toLowerCase()}">
                        ${item.platform.toUpperCase()}
                    </span>
                    ${item.username || 'Anonymous'}
                </div>
                ${item.message ? `<div style="margin-top: 5px; color: #666; font-size: 0.9rem;">"${item.message}"</div>` : ''}
                <div style="margin-top: 5px; color: #999; font-size: 0.85rem;">${item.timestamp}</div>
            </div>
            <div class="item-amount">Rp ${formatNumber(item.amount)}</div>
        </div>
    `).join('');
}

function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

function saveHistoryToStorage() {
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
}

function loadHistoryFromStorage() {
    const saved = localStorage.getItem('donationHistory');
    if (saved) {
        try {
            donationHistory = JSON.parse(saved);
            displayHistory();
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }
}
