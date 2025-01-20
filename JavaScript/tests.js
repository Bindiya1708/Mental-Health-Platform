function calculateResult(testType) {
    let form;
    let resultElement;

    // Select the form and result element based on the test type
    switch (testType) {
        case 'adhd':
            form = document.getElementById('adhd-form');
            resultElement = document.getElementById('adhd-result');
            break;
        case 'bipolar':
            form = document.getElementById('bipolar-form');
            resultElement = document.getElementById('bipolar-result');
            break;
        case 'eating-disorder':
            form = document.getElementById('eating-disorder-form');
            resultElement = document.getElementById('eating-disorder-result');
            break;
        case 'addiction':
            form = document.getElementById('addiction-form');
            resultElement = document.getElementById('addiction-result');
            break;
        case 'depression':
            form = document.getElementById('depression-form');
            resultElement = document.getElementById('depression-result');
            break;
        case 'anxiety':
            form = document.getElementById('anxiety-form');
            resultElement = document.getElementById('anxiety-result');
            break;
        default:
            console.error('Unknown test type');
            return;
    }

    // Collect the responses
    const responses = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => {
        responses[key] = value;
    });

    // Calculate the results (basic example: count "yes" responses)
    let yesCount = 0;
    for (const [key, value] of Object.entries(responses)) {
        if (value === 'yes') {
            yesCount++;
        }
    }

    let resultText = '';
    if (yesCount >= 6) {
        resultText = 'You may be experiencing significant symptoms. It might be helpful to seek professional help.';
        showAlert(resultText, 'danger');
    } else if (yesCount >= 3) {
        resultText = 'You might be experiencing some symptoms. Consider monitoring your well-being and seek help if needed.';
        showAlert(resultText, 'warning');
    } else {
        resultText = 'Your responses suggest that you are not currently experiencing significant symptoms.';
        showAlert(resultText, 'success');
    }

}

function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', `alert-${type}`);
    alertBox.textContent = message;
    
    document.body.prepend(alertBox); // Add alert to the top of the body

    // Automatically hide after 5 seconds
    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}
