document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");

    // Stop if booking form does not exist
    if (!bookingForm) {
        console.log("Booking form not found on this page.");
        return;
    }

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const bookingData = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            checkin: document.getElementById("checkin").value,
            checkout: document.getElementById("checkout").value,
            guests: document.getElementById("guests").value,
            room: document.getElementById("room").value
        };

        try {

            const response = await fetch("/api/bookings", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            alert(result.message);

            if (result.success) {
                bookingForm.reset();
            }

        } catch (error) {

            console.error(error);

            alert("Cannot connect to server.");

        }

    });

});