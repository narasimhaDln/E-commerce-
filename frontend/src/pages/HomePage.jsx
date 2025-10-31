import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [debouncedQ, setDebouncedQ] = useState(searchParams.get('q') || '');
  const scrollerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Scroll to products section if URL has #products-section
  useEffect(() => {
    if (window.location.hash === '#products-section') {
      // Small delay to ensure products are loaded
      const timer = setTimeout(() => {
        const element = document.getElementById('products-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [products.length]);

  const heroImages = [
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/13-laptop-platinum-right-render-fy25:VP2-859x540?fmt=png-alpha',
    'https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2023-06/EOSS%20Creative%202.jpg',
    'https://res.cloudinary.com/dbsg3chsc/image/upload/v1761932315/Shopping_with_ShopEase_Discounts_ia0cdt.png',
    'https://m.media-amazon.com/images/I/51yyQiEVvNL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/61Mk3YqYHpL.jpg',
  ];

  const bannerImages = [
    'https://res.cloudinary.com/dbsg3chsc/image/upload/v1761938021/IMG_20251101_004257_d38dly.jpg',
    'https://img.freepik.com/free-vector/realistic-horizontal-sale-banner-template-with-photo_23-2149017940.jpg',
    'https://res.cloudinary.com/dbsg3chsc/image/upload/v1761938464/IMG_20251101_005019_bidvbt.jpg',
  ];

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (debouncedQ) params.set('q', debouncedQ);
    if (category) params.set('category', category);
    const res = await api.get(`/products?${params.toString()}`);
    setProducts(res.data);
  }, [debouncedQ, category]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 500);

    return () => clearTimeout(timer);
  }, [q]);

  // Update search and category from URL params
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    setQ(qParam);
    setDebouncedQ(qParam);
    setCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-change hero images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-change banner images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll horizontal carousel under navbar - testimonial style
  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;

    const scrollSpeed = 2; // pixels per frame - increased speed
    let animationId;

    const animate = () => {
      container.scrollLeft += scrollSpeed;

      // Reset when scrolled through first set of products
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [products.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 py-12 md:py-24 relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover Amazing Products
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Shop the latest trends with unbeatable prices. Quality products,
                fast delivery, and exceptional customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/#products-section')}
                >
                  Shop Now
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-6 md:px-10 py-3 md:py-5 rounded-xl font-semibold text-base md:text-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-video bg-gradient-to-br from-white to-gray-50 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src={heroImages[currentImageIndex]}
                  alt="Mobile phone 3D illustration"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal scroller directly under navbar */}
      {products.length > 0 && (
        <div className="mb-6 relative bg-gray-100 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 ml-4">
            Trending
          </h2>
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-hidden px-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {/* Duplicate products for seamless loop */}
            {[...products, ...products].map((p, index) => (
              <Link
                key={`h-${p._id}-${index}`}
                to={`/product/${p._id}`}
                className="min-w-[250px] max-w-[250px] bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex-shrink-0"
              >
                <img
                  src={p.image || 'https://via.placeholder.com/600x400'}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="font-medium truncate text-gray-900">
                    {p.name}
                  </div>
                  <div className="text-indigo-600 font-semibold">
                    ${p.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Controls */}
          <div className="pointer-events-none hidden md:block">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() =>
                scrollerRef.current &&
                scrollerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
              }
              className="pointer-events-auto absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow rounded-full p-2 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() =>
                scrollerRef.current &&
                scrollerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
              }
              className="pointer-events-auto absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow rounded-full p-2 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="mb-8 md:mb-12 px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-72 md:h-96 object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <div id="products-section" className="text-center mb-8 md:mb-12 px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Browse our carefully curated collection of premium products. Find
          exactly what you're looking for with our advanced search and filter
          options.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <img
            className="w-32 h-32 mx-auto mb-6 opacity-80"
            src="https://cdn-icons-png.flaticon.com/512/4076/4076508.png"
            alt="empty"
          />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 text-lg">
            Try adjusting your filters or search query to find what you're
            looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-8">
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="group bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={p.image || 'https://via.placeholder.com/600x400'}
                  alt={p.name}
                  className="w-full h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {p.category && (
                  <span className="absolute top-2 md:top-3 left-2 md:left-3 text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur border border-gray-200 text-gray-800">
                    {p.category}
                  </span>
                )}
              </div>
              <div className="p-3 md:p-5">
                <div className="font-semibold text-gray-900 line-clamp-1 text-base md:text-lg">
                  {p.name}
                </div>
                <div className="mt-1 md:mt-2 text-indigo-600 text-lg md:text-xl font-bold">
                  ${p.price}
                </div>
                <div className="mt-2 md:mt-3 text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                  {p.description}
                </div>
                <div className="mt-3 md:mt-4">
                  <span className="inline-flex items-center text-xs md:text-sm font-medium text-indigo-600 group-hover:underline">
                    View details
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
