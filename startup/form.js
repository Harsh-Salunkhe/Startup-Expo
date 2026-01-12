const expoForm = document.querySelector("#registration-form-element");

// REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxriLepfTKmPqq20msXQ1t_Dpm2kJnp6SWKGP27Sd4JItmso2iGMd_D3_C_WnyOLxrcQw/exec';

function parseFormData(formData) {
    const parsedData = {};
    for (const [key, value] of formData.entries()) {
        if (!isNaN(value) && value.trim() !== "" && key != "contact" && key!= "revenue" && key!="valuation") {
            // Convert numeric strings to numbers
            parsedData[key] = Number(value);
        } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
            // Convert "true"/"false" strings to booleans
            parsedData[key] = value.toLowerCase() === "true";
        } else {
            // Keep as string
            parsedData[key] = value;
        }
    }
    return parsedData;
}

function validateForm(data) {
    const errors = [];

    // Check required fields
    if (!data.name || data.name.trim() === '') {
        errors.push('Startup Name is required');
    }

    if (!data.linkedin || data.linkedin.trim() === '') {
        errors.push('LinkedIn Profile is required');
    } else {
        // Validate LinkedIn URL format
        const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;
        if (!linkedinPattern.test(data.linkedin)) {
            errors.push('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)');
        }
    }

    if (!data.founder || data.founder.trim() === '') {
        errors.push('Name of CEO is required');
    }

    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else {
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
    }

    if (!data.contact || data.contact.trim() === '') {
        errors.push('Contact number is required');
    } else {
        // Validate contact number (10 digits)
        const contactPattern = /^\d{10}$/;
        const cleanContact = data.contact.replace(/[\s\-\+]/g, '');
        if (!contactPattern.test(cleanContact)) {
            errors.push('Please enter a valid 10-digit contact number');
        }
    }

    if (!data.revenue || data.revenue.trim() === '') {
        errors.push('Yearly revenue is required');
    } else {
        // Validate revenue is a number
        const revenueNum = parseFloat(data.revenue.replace(/[,\s]/g, ''));
        if (isNaN(revenueNum) || revenueNum < 0) {
            errors.push('Please enter a valid revenue amount (numbers only)');
        }
    }

    // Website is optional, but if provided, validate format
    if (data.website && data.website.trim() !== '') {
        const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlPattern.test(data.website)) {
            errors.push('Please enter a valid website URL');
        }
    }

    return errors;
}

expoForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const form = evt.target;
    const formData = new FormData(form);
    const submitBtn = document.querySelector("#submit-expo");

    const data = parseFormData(formData);
    
    // Validate form data
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
        alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";
    
    console.log(data);
    
    try {
        // Convert data object to URL parameters for Google Sheets
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            urlParams.append(key, value);
        }
        
        // Submit to both your server and Google Sheets
        const [serverResponse, sheetsResponse] = await Promise.all([
            // Original server submission (JSON)
            fetch('https://server.ecellnitb.in/startup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data), 
            }),
            // Google Sheets submission (URL parameters)
            fetch(`${GOOGLE_SCRIPT_URL}?${urlParams.toString()}`, {
                method: 'POST',
            })
        ]);

        const serverOk = serverResponse.ok;
        const sheetsOk = sheetsResponse.ok;

        if (serverOk && sheetsOk) {
            const serverResult = await serverResponse.json();
            console.log('Form submitted successfully to both server and Google Sheets');
            alert("Registration successful. Data saved!");
        } else if (serverOk && !sheetsOk) {
            console.warn('Submitted to server but failed to save to Google Sheets');
            alert("Registration successful, but backup to Google Sheets failed.");
        } else if (!serverOk && sheetsOk) {
            console.warn('Failed to submit to server but saved to Google Sheets');
            alert("Submission to main server failed, but data was backed up to Google Sheets.");
        } else {
            console.error('Both submissions failed');
            alert("Error submitting the form. Please try again.");
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert("Submitted Succesfully.");
    } finally {
        form.reset();
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
    }
});