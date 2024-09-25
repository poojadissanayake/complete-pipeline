function submitted() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let review = document.getElementById('review').value;

    $.ajax({
        url: '/feedback',
        type: 'POST',
        data: JSON.stringify({ name, email, review }),
        contentType: 'application/json',
        success: (result) => {
            alert(result.message);
            fetchFeedback();

            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('review').value = '';
        },
        error: (xhr, status, error) => {
            alert('Error occured: ' + error); // 'xhr' - XMLHttpRequest object that contains the response from the server.
        }
    });
}

function fetchFeedback() {
    $.ajax({
        url: '/feedback',
        type: 'GET',
        success: (feedback) => {
            displayFeedback(feedback);
        },
        error: (xhr, status, error) => {
            console.error('Error fetching: ' + error);
        }
    });
}

function displayFeedback(feedback) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = '';

    feedback.forEach(item => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('feedback-item');
        cardDiv.innerHTML = `
            <div class="card horizontal review-card">
                        <div class="card-content">
                            <p><strong>${item.name}</strong></p>
                            <p>${item.review}</p>
                        </div>
                    </div>
        `;
        reviewsContainer.appendChild(cardDiv);
    });
}

// display existing feedback
document.addEventListener('DOMContentLoaded', fetchFeedback);
