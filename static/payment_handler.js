const origin = 'localhost:3000';
const methodName = `${origin}/pages/authentication.html`;
const checkoutURL = `${origin}/checkout`;
let resolver;
let payment_request_event;


self.addEventListener('canmakepayment', function(e) {
    console.log("yes i can make payment \\o/");
    e.respondWith(true);
  });

self.addEventListener('paymentrequest', (evt) => {
    
    payment_request_event = evt
    resolver = new PromiseResolver();
    console.log(methodName);

    evt.respondWith(resolver.promise)
    
    evt.openWindow(methodName)
    .then((unknowData) => {

        console.log(unknowData);
        if (unknowData == null) {
            resolver.reject('failed to open, not very cool imho')
            alert('no clue')   
        }
        if (unknowData.status && unknowData.status === 'failed') {
            console.log('failed');
            alert('failed but something is returned')
            
        } else if (unknowData.status && unknowData.status === 'ok') {
            alert('auth OK')

        }
    }).catch((err) => {
        resolver.reject(err)
    })
//    evt.respondWith({
//        methodName: 'basic-card',
//        details: {
//            billingAddress: {
//                addressLine: [
//                    '109 Rue de l\'Innovation, 31670 Labège',
//                ],
//                city: 'Labège',
//                country: 'FR',
//                dependentLocality: '',
//                languageCode: '',
//                organization: 'Lyra-Network',
//                phone: '+15555555555',
//                postalCode: '31670',
//                recipient: 'Le Swin',
//                region: 'Occitanie',
//                sortingCode: ''
//            },
//            cardNumber: '4111111111111111',
//            cardSecurityCode: '123',
//            cardholderName: 'Le Swin',
//            expiryMonth: '01',
//            expiryYear: '2020',
//        },

function PromiseResolver() {
    /** @private {function(T=): void} */
    this.resolve_;
  
    /** @private {function(*=): void} */
    this.reject_;
  
    /** @private {!Promise<T>} */
    this.promise_ = new Promise(function(resolve, reject) {
      this.resolve_ = resolve;
      this.reject_ = reject;
    }.bind(this));
  }
  
  PromiseResolver.prototype = {
    /** @return {!Promise<T>} */
    get promise() {
      return this.promise_;
    },
  
    /** @return {function(T=): void} */
    get resolve() {
      return this.resolve_;
    },
  
    /** @return {function(*=): void} */
    get reject() {
      return this.reject_;
    },
  };
});