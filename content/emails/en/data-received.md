---
category: Data Received
title: We're on it!
subject: We're taking over from here!
---

Hey {{ $doc.client.firstName }},

thank you for the commission.

We are now checking a possible compensation claim based on your information and will contact you after completing the review.

Below, we have summarized the transmitted data again. Please check if the data is correct and let us know promptly by email if anything is incorrect. It is important that the information is truthful, complete, and in order. If all data is correct, you do not need to take any further action.

Transmitted data:
{{ $doc }}

With the following data, you can always check the status of the processing:
Case number: **{{ $doc.id }}**
Booking number: **{{ $doc.booking.number }}**

Best regards,
Dein RightsPlus-Team