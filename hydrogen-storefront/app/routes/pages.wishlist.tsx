import {Link} from 'react-router';
import {useWishlist} from '~/lib/useWishlist';

export function meta() {
  return [{title: 'Your Wishlist | Macorner'}];
}

export default function Wishlist() {
  const {items, remove} = useWishlist();

  return (
    <div style={{fontFamily: 'Poppins, sans-serif', background: '#fff'}}>
      <div style={{maxWidth: 1440, margin: '0 auto', padding: '40px 13px 64px'}}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.6px',
            color: 'rgb(18,18,18)',
            textAlign: 'center',
            margin: '0 0 32px',
          }}
        >
          Your Wishlist
        </h1>

        {items.length === 0 ? (
          <div style={{textAlign: 'center', padding: '64px 0'}}>
            <p style={{fontSize: 16, color: 'rgba(18,18,18,0.6)', marginBottom: 24}}>
              Your wishlist is empty. Tap the heart on any product to save it here.
            </p>
            <Link
              to="/collections/all"
              className="inline-block px-7 py-3 rounded-[10px] bg-[#1e4e79] text-white text-[15px] font-semibold tracking-[0.6px] hover:bg-[#122e49] transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 min-[750px]:grid-cols-3 min-[990px]:grid-cols-4 gap-x-4 gap-y-6 list-none p-0 m-0">
            {items.map((item) => (
              <li key={item.handle} className="relative">
                <Link to={`/products/${item.handle}`} className="block group">
                  <div className="aspect-square rounded-[10px] overflow-hidden bg-[#f4f4f4]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 text-[14px] text-[rgb(18,18,18)] group-hover:text-[#1e4e79] transition-colors">
                    {item.title}
                  </p>
                  {item.price ? (
                    <p className="text-[14px] font-semibold text-[rgb(18,18,18)] mt-1">
                      {item.price}
                    </p>
                  ) : null}
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${item.title} from wishlist`}
                  onClick={() => remove(item.handle)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#1e4e79] hover:bg-[#1e4e79] hover:text-white transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
