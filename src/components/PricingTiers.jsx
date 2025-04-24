import CheckoutButton from './CheckoutButton';

export default function PricingTiers() {
  const proPriceId = 'prod_SBcwYBGj1tAPCU';
  const elitePriceId = 'prod_SBcx9kiZVYHJbs';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '2rem' }}>
      <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', textAlign: 'center' }}>
        <h2>Free</h2>
        <p>$0 / month</p>
        <button disabled style={{ cursor: 'not-allowed' }}>Current Plan</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', textAlign: 'center' }}>
        <h2>Pro</h2>
        <p>$10 / month</p>
        <CheckoutButton priceId={proPriceId} />
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', textAlign: 'center' }}>
        <h2>Elite</h2>
        <p>$30 / month</p>
        <CheckoutButton priceId={elitePriceId} />
      </div>
    </div>
  );
}
