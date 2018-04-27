self.addEventListener('paymentrequest', (evt) => {
    evt.respondWith({
        methodName: 'basic-card',
        details: {
            billingAddress: {
                addressLine: [
                    '109 Rue de l\'Innovation, 31670 Labège',
                ],
                city: 'Labège',
                country: 'FR',
                dependentLocality: '',
                languageCode: '',
                organization: 'Lyra-Network',
                phone: '+15555555555',
                postalCode: '31670',
                recipient: 'Le Swin',
                region: 'Occitanie',
                sortingCode: ''
            },
            cardNumber: '4111111111111111',
            cardSecurityCode: '123',
            cardholderName: 'Le Swin',
            expiryMonth: '01',
            expiryYear: '2020',
        },
    });
});