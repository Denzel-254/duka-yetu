import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaPaypal, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PaymentSettingsPage = () => {
  const [settings, setSettings] = useState({
    cash_enabled: true,
    mpesa_enabled: true,
    card_enabled: true,
    bank_enabled: false,
    mpesa_shortcode: '174379',
    mpesa_passkey: 'your_passkey_here',
    card_processor: 'stripe',
    stripe_publishable_key: '',
    stripe_secret_key: '',
    currency: 'KES',
    tax_rate: 16,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Payment settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaCreditCard className="text-primary-600" />
          Payment Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure payment methods and gateways</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Cash</p>
                    <p className="text-sm text-gray-500">In-store cash payments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('cash_enabled')}
                  className="text-2xl text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {settings.cash_enabled ? <FaToggleOn className="text-primary-600" /> : <FaToggleOff />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaMobileAlt className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">M-Pesa</p>
                    <p className="text-sm text-gray-500">Mobile money payments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('mpesa_enabled')}
                  className="text-2xl text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {settings.mpesa_enabled ? <FaToggleOn className="text-primary-600" /> : <FaToggleOff />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Card Payments</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('card_enabled')}
                  className="text-2xl text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {settings.card_enabled ? <FaToggleOn className="text-primary-600" /> : <FaToggleOff />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaPaypal className="text-blue-600 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Direct bank payments</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('bank_enabled')}
                  className="text-2xl text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {settings.bank_enabled ? <FaToggleOn className="text-primary-600" /> : <FaToggleOff />}
                </button>
              </div>
            </div>
          </div>

          {settings.mpesa_enabled && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-4">M-Pesa Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-primary">Shortcode</label>
                  <input
                    type="text"
                    value={settings.mpesa_shortcode}
                    onChange={(e) => setSettings({ ...settings, mpesa_shortcode: e.target.value })}
                    className="input-primary bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="label-primary">Passkey</label>
                  <input
                    type="password"
                    value={settings.mpesa_passkey}
                    onChange={(e) => setSettings({ ...settings, mpesa_passkey: e.target.value })}
                    className="input-primary bg-white text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {settings.card_enabled && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-800 mb-4">Card Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-primary">Card Processor</label>
                  <select
                    value={settings.card_processor}
                    onChange={(e) => setSettings({ ...settings, card_processor: e.target.value })}
                    className="input-primary bg-white text-gray-800"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="flutterwave">Flutterwave</option>
                    <option value="paystack">Paystack</option>
                  </select>
                </div>
                <div>
                  <label className="label-primary">Publishable Key</label>
                  <input
                    type="text"
                    value={settings.stripe_publishable_key}
                    onChange={(e) => setSettings({ ...settings, stripe_publishable_key: e.target.value })}
                    className="input-primary bg-white text-gray-800"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label-primary">Secret Key</label>
                  <input
                    type="password"
                    value={settings.stripe_secret_key}
                    onChange={(e) => setSettings({ ...settings, stripe_secret_key: e.target.value })}
                    className="input-primary bg-white text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-800 mb-4">Tax Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-primary">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="input-primary bg-white text-gray-800"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="label-primary">Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.tax_rate}
                  onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
                  className="input-primary bg-white text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <FaSave /> Save Payment Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentSettingsPage;