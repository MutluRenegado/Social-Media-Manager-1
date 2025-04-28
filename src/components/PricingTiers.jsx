import CheckoutButton from './CheckoutButton';

export default function PricingTiers() {
  const proPriceId = 'prod_SBcwYBGj1tAPCU';
  const elitePriceId = 'prod_SBcx9kiZVYHJbs';

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 p-8 bg-background dark:bg-gray-900">
      
      {/* Free Plan */}
      <div className="relative border rounded-lg shadow-md p-6 w-64 text-center bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-foreground dark:text-gray-100">Free</h2>
        <p className="text-lg mb-4 text-gray-600 dark:text-gray-300">$0 / month</p>
        <button
          disabled
          aria-disabled="true"
          className="bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed"
        >
          Current Plan
        </button>
      </div>

      {/* Pro Plan with Featured Badge */}
      <div className="relative border-2 border-blue-600 rounded-lg shadow-lg p-6 w-64 text-center bg-white dark:bg-gray-800">
        {/* Featured Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md select-none">
          Most Popular
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-blue-600">Pro</h2>
        <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">$10 / month</p>
        <CheckoutButton priceId={proPriceId} />
      </div>

      {/* Elite Plan */}
      <div className="relative border rounded-lg shadow-md p-6 w-64 text-center bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-foreground dark:text-gray-100">Elite</h2>
        <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">$30 / month</p>
        <CheckoutButton priceId={elitePriceId} />
      </div>

    </div>
  );
}
