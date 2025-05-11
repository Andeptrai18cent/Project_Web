const reportModal = document.getElementById('reportModal');
const cancelReport = document.getElementById('cancelReport');
const sendReport = document.getElementById('sendReport');
const reportButtons = document.querySelectorAll('.report-btn');

// Current order being reported
let currentOrderId = null;

// Add click event to all report buttons
reportButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log("Confirm open report form")
        // Get the order ID from the parent card (you can extract this from the heading)
        const orderCard = this.closest('.order-card');
        const orderHeading = orderCard.querySelector('h3').textContent;
        currentOrderId = orderHeading;
        
        // Show the modal
        reportModal.style.display = 'flex';
        document.getElementById("id_modal").style.display = 'block';
    });
});

// Close modal when cancel button is clicked
cancelReport.addEventListener('click', function() {
    reportModal.style.display = 'none';
    document.getElementById('reportReason').value = '';
});

// Handle send report button click
sendReport.addEventListener('click', function() {
    const reason = document.getElementById('reportReason').value;
    if (reason.trim() === '') {
        alert('Please provide a reason for your report.');
        return;
    }
    
    // Here you would typically send this data to your server
    console.log(`Report submitted for ${currentOrderId}. Reason: ${reason}`);
    
    // Close the modal and reset form
    reportModal.style.display = 'none';
    document.getElementById('reportReason').value = '';
    
    // Show confirmation to user
    alert('Your report has been sent to the admin.');
});