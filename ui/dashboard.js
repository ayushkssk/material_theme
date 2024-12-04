class DashboardManager {
    constructor() {
        this.stats = {
            totalBooks: 34655,
            currentlyIssued: 2,
            totalReturned: 8,
            availableBooks: 34653,
            totalStudents: 4465,
            totalStaff: 75,
            admins: 1,
            coAdmins: 1,
            subjectBooks: {
                mathematics: 2717,
                physics: 1547,
                chemistry: 1856,
                biology: 31,
                botany: 2014,
                zoology: 1104,
                hindi: 4633,
                english: 3384
            }
        };
        
        this.init();
    }

    init() {
        this.updateDashboardStats();
        this.setupEventListeners();
        this.startLiveUpdates();
    }

    updateDashboardStats() {
        // Update main stats
        this.updateStatValue('total-books', this.stats.totalBooks);
        this.updateStatValue('currently-issued', this.stats.currentlyIssued);
        this.updateStatValue('total-returned', this.stats.totalReturned);
        this.updateStatValue('available-books', this.stats.availableBooks);
        
        // Update user stats
        this.updateStatValue('total-students', this.stats.totalStudents);
        this.updateStatValue('total-staff', this.stats.totalStaff);
        this.updateStatValue('admins', this.stats.admins);
        this.updateStatValue('co-admins', this.stats.coAdmins);
        
        // Update subject books
        Object.entries(this.stats.subjectBooks).forEach(([subject, count]) => {
            this.updateStatValue(`${subject}-books`, count);
        });
    }

    updateStatValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    }

    setupEventListeners() {
        // Add hover effects to stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    startLiveUpdates() {
        // Simulate live updates every 30 seconds
        setInterval(() => {
            // Randomly update some stats
            this.stats.currentlyIssued += Math.floor(Math.random() * 3);
            this.stats.totalReturned += Math.floor(Math.random() * 2);
            this.updateDashboardStats();
        }, 30000);
    }

    // Method to handle book transactions
    updateBookStats(type, count) {
        switch(type) {
            case 'issue':
                this.stats.currentlyIssued += count;
                this.stats.availableBooks -= count;
                break;
            case 'return':
                this.stats.currentlyIssued -= count;
                this.stats.totalReturned += count;
                this.stats.availableBooks += count;
                break;
        }
        this.updateDashboardStats();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
}); 