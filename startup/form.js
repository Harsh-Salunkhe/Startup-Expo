const expoForm = document.querySelector("#registration-form-element");

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxriLepfTKmPqq20msXQ1t_Dpm2kJnp6SWKGP27Sd4JItmso2iGMd_D3_C_WnyOLxrcQw/exec';

function parseFormData(formData) {
    const parsedData = {};
    for (const [key, value] of formData.entries()) {
        if (!isNaN(value) && value.trim() !== "" && key != "contact" && key != "revenue" && key != "valuation") {
            parsedData[key] = Number(value);
        } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
            parsedData[key] = value.toLowerCase() === "true";
        } else {
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
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            urlParams.append(key, value);
        }
        
        // Submit to server first
        let serverOk = false;
        try {
            const serverResponse = await fetch('https://server.ecellnitb.in/startup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(data), 
            });
            serverOk = serverResponse.ok;
            if (serverOk) {
                const serverResult = await serverResponse.json();
                console.log('Server submission successful:', serverResult);
            }
        } catch (serverError) {
            console.error('Server submission error:', serverError);
        }

        // Submit to Google Sheets (use 'no-cors' mode or handle as fire-and-forget)
        let sheetsOk = false;
        try {
            // Option 1: Fire and forget approach - assume success if no error thrown
            await fetch(`${GOOGLE_SCRIPT_URL}?${urlParams.toString()}`, {
                method: 'GET', // Changed to GET - Google Scripts handle GET params better
                mode: 'no-cors' // This prevents CORS errors but you can't read the response
            });
            // If we reach here without error, assume success
            sheetsOk = true;
            console.log('Google Sheets submission sent');
        } catch (sheetsError) {
            console.error('Google Sheets submission error:', sheetsError);
        }

        // Show appropriate message
        if (serverOk && sheetsOk) {
            alert("Registration successful. Data saved!");
        } else if (serverOk) {
            alert("Registration successful, but backup to Google Sheets may have failed.");
        } else if (sheetsOk) {
            alert("Submission to main server failed, but data was backed up to Google Sheets.");
        } else {
            alert("Error submitting the form. Please try again.");
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert("Submitted Successfully.");
    } finally {
        form.reset();
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
    }
});