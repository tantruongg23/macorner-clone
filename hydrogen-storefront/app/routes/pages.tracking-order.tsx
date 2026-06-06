import {useState} from 'react';
import {useNavigate} from 'react-router';

export function meta() {
  return [{title: 'Track Your Order | Macorner'}];
}

export default function TrackingOrder() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Order tracking on Macorner is gated behind the customer account.
    // Send shoppers to their order history where live status is available.
    navigate('/account/orders');
  }

  const inputClass =
    'w-full h-[50px] px-4 bg-white text-[15px] text-black border border-[#d1d6dc] rounded-[8px] outline-none focus:border-[#FC6514] transition-colors';

  return (
    <div style={{fontFamily: 'Poppins, sans-serif', background: '#fff'}}>
      <div style={{maxWidth: 560, margin: '0 auto', padding: '48px 18px 72px'}}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: '0.6px',
            color: 'rgb(18,18,18)',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          Track Your Order
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'rgba(18,18,18,0.6)',
            textAlign: 'center',
            margin: '0 0 32px',
          }}
        >
          Enter your order number and email to view the latest status.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="order-id"
              className="block text-[13px] font-medium tracking-[0.6px] text-[rgb(18,18,18)] mb-2"
            >
              Order number
            </label>
            <input
              id="order-id"
              name="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. #MA12345"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label
              htmlFor="order-email"
              className="block text-[13px] font-medium tracking-[0.6px] text-[rgb(18,18,18)] mb-2"
            >
              Email
            </label>
            <input
              id="order-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            className="h-[50px] mt-2 bg-[#FC6514] text-white text-[18px] font-bold tracking-wide rounded-[8px] hover:bg-[#e85a10] transition-colors"
          >
            TRACK ORDER
          </button>
        </form>

        <p
          style={{
            fontSize: 13,
            color: 'rgba(18,18,18,0.5)',
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          Tracking is available in your account order history once you&apos;re
          signed in.
        </p>
      </div>
    </div>
  );
}
