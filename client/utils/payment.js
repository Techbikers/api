/* global Stripe */

/**
 * Wrap the createToken function in a promise so we can call it
 * from within sagas.
 * @param  {string} publicKey   - Stripe public key
 * @param  {Object} cardDetails - Card details object
 */
export function stripeCreateToken(publicKey, cardDetails) {
  Stripe.setPublishableKey(publicKey);
  return new Promise(resolve =>
    Stripe.card.createToken(cardDetails, (status, response) => resolve({ status, response }))
  );
}
