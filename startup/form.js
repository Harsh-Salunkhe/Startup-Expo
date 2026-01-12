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

expoForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const form = evt.target;
    const formData = new FormData(form);
    const submitBtn = document.querySelector("#submit-expo");

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";
    
    const data = parseFormData(formData);
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
        alert("Network error. Please check your connection and try again.");
    } finally {
        form.reset();
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
    }
});