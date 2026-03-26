import { ShoppingBag, Menu, X, Instagram, Twitter, ArrowRight, Zap, Star, Trash2, Plus, Minus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  tag: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "T-SHIRT '10 01' - BLACK",
    price: 29.99,
    image: "/images/1.jpeg",
    tag: "NEW DROP"
  },
  {
    id: 2,
    name: "T-SHIRT 'GOD'S PLAN' - BLACK",
    price: 29.99,
    image: "/images/2.jpeg",
    tag: "CLASSIC"
  },
  {
    id: 3,
    name: "GREY 'UVEOCHO' VERTICAL SET",
    price: 54.99,
    image: "/images/3.jpeg",
    tag: "SET"
  },
  {
    id: 4,
    name: "NAVY 'UVEOCHO' HOODIE",
    price: 59.99,
    image: "/images/4.jpeg",
    tag: "PREMIUM"
  },
  {
    id: 5,
    name: "OVERSIZED TRACKSUIT",
    price: 89.99,
    image: "/images/5.jpeg",
    tag: "FULL SET"
  },
  {
    id: 6,
    name: "STREETWEAR ESSENTIALS",
    price: 34.99,
    image: "/images/7.jpeg",
    tag: "LIMITED"
  }
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 3); // 3 days from now
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 font-display">
      {[
        { label: 'D', value: timeLeft.days },
        { label: 'H', value: timeLeft.hours },
        { label: 'M', value: timeLeft.minutes },
        { label: 'S', value: timeLeft.seconds }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl text-brand-neon">{String(item.value).padStart(2, '0')}</div>
          <div className="text-[10px] font-mono tracking-widest text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cart]);

  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
  [cart]);

  return (
    <div className="min-h-screen selection:bg-brand-neon selection:text-brand-black">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/80 backdrop-blur-md py-4' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-display tracking-tighter cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            UVE<span className="text-brand-neon">8</span>
          </motion.div>

          <div className="hidden md:flex space-x-12 text-sm font-bold tracking-widest uppercase">
            <a href="#drops" className="hover:text-brand-neon transition-colors">Drops</a>
            <a href="#shop" className="hover:text-brand-neon transition-colors">Shop</a>
            <a href="#vibe" className="hover:text-brand-neon transition-colors">Vibe</a>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              className="relative p-2 hover:text-brand-neon transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-neon text-brand-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-black z-[70] border-l border-gray-800 p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-display uppercase tracking-tighter">Your <span className="text-brand-neon">Bag</span></h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:text-brand-neon">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p className="font-mono text-sm uppercase tracking-widest">Your bag is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 aspect-[3/4] bg-gray-900 brutalist-border overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-bold tracking-tight leading-tight">{item.name}</h3>
                          <p className="text-brand-neon font-display mt-1">{item.price}€</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-800">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-800"><Minus size={14} /></button>
                            <span className="px-3 text-xs font-mono">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-800"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-800 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Subtotal</span>
                    <span className="text-3xl font-display text-brand-neon">{cartTotal.toFixed(2)}€</span>
                  </div>
                  <button className="w-full bg-brand-neon text-brand-black py-4 font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform">
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/1.jpeg" 
            alt="UVE8 Hero"
            className="w-full h-full object-cover opacity-50 grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block bg-brand-neon text-brand-black px-3 py-1 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                Detroit Heritage // SS26
              </div>
              <h1 className="text-[15vw] md:text-[10vw] font-display leading-[0.8] uppercase tracking-tighter mb-8">
                DROP<br />
                <span className="text-brand-neon">10 01</span>
              </h1>
              <p className="max-w-md text-lg text-gray-400 font-mono uppercase tracking-tight leading-relaxed">
                El drop más esperado. La camiseta "10 01" ya está aquí. 
                Edición ultra limitada. No te quedes fuera.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="bg-brand-neon text-brand-black px-8 py-4 font-bold uppercase tracking-widest flex items-center group hover:scale-105 transition-transform">
                  Comprar Ahora <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="glass-card p-8 brutalist-border relative z-10">
                <h3 className="text-2xl font-display uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <Clock className="text-brand-neon" /> Next Drop In:
                </h3>
                <CountdownTimer />
                <p className="mt-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
                  * Solo 100 unidades por prenda. No habrá restock.
                </p>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-neon/10 blur-[100px] -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-brand-neon text-brand-black py-4 overflow-hidden border-y-2 border-brand-black">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-display uppercase mx-8 flex items-center">
              UVE8 X SHADY <Zap className="mx-4 fill-current" size={20} /> DETROIT ROOTS <Star className="mx-4 fill-current" size={20} /> NO MERCY STREETWEAR
            </span>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <section id="shop" className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-display uppercase tracking-tighter">The<br /><span className="text-brand-neon">Collection</span></h2>
          </div>
          <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest">
            <button className="text-brand-neon border-b border-brand-neon pb-1">All</button>
            <button className="text-gray-500 hover:text-white transition-colors">Hoodies</button>
            <button className="text-gray-500 hover:text-white transition-colors">Tees</button>
            <button className="text-gray-500 hover:text-white transition-colors">Pants</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-900 brutalist-border group-hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] transition-shadow duration-500">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-brand-black text-brand-neon text-[10px] font-bold px-2 py-1 tracking-widest uppercase z-10">
                  {product.tag}
                </div>
                <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-brand-neon text-brand-black px-6 py-3 font-bold uppercase text-xs tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform hover:scale-105 active:scale-95"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold tracking-tight text-sm uppercase">{product.name}</h3>
                  <p className="text-gray-500 font-mono text-xs mt-1">UVE8-DET-0{product.id}</p>
                </div>
                <span className="font-display text-xl text-brand-neon">{product.price}€</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Eminem Vibe Section */}
      <section id="vibe" className="py-24 bg-brand-black text-brand-white overflow-hidden border-y border-gray-900">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="relative z-10 brutalist-border overflow-hidden aspect-[4/5]"
            >
              <img 
                src="/images/3.jpeg" 
                alt="UVE8 Vibe"
                className="w-full h-full object-cover grayscale contrast-150 brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-neon/10 mix-blend-overlay" />
            </motion.div>
            <div className="absolute -bottom-8 -left-8 w-full h-full border-2 border-brand-neon/30 -z-0" />
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-7xl font-display uppercase leading-[0.8] tracking-tighter mb-8">
              LOSE<br />YOURSELF<br /><span className="text-brand-neon">IN THE STYLE.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed font-mono uppercase italic">
              "Look, if you had one shot, or one opportunity to seize everything you ever wanted in one moment... would you capture it or just let it slip?"
            </p>
            <p className="text-gray-500 mb-12">
              UVE8 no es solo una marca, es el uniforme de la resistencia. Inspirados por la lírica de Detroit y la estética del hip-hop de los 2000, traemos de vuelta el estilo crudo, sin filtros y auténtico.
            </p>
            <button className="bg-brand-white text-brand-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-brand-neon hover:text-brand-black transition-colors">
              Explorar el Manifiesto
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-4xl font-display tracking-tighter mb-6">
                UVE<span className="text-brand-neon">8</span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8 font-mono text-xs uppercase tracking-widest">
                Detroit Spirit // Global Vision.
              </p>
              <div className="flex max-w-md">
                <input 
                  type="email" 
                  placeholder="TU@EMAIL.COM" 
                  className="bg-transparent border-2 border-gray-800 px-4 py-3 w-full focus:border-brand-neon outline-none font-mono text-sm"
                />
                <button className="bg-brand-white text-brand-black px-6 font-bold uppercase text-xs tracking-widest hover:bg-brand-neon transition-colors">
                  Join
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-brand-neon">Explorar</h4>
              <ul className="space-y-4 text-gray-500 text-sm uppercase font-mono">
                <li><a href="#" className="hover:text-white">Colecciones</a></li>
                <li><a href="#" className="hover:text-white">Lookbook</a></li>
                <li><a href="#" className="hover:text-white">Sostenibilidad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-brand-neon">Soporte</h4>
              <ul className="space-y-4 text-gray-500 text-sm uppercase font-mono">
                <li><a href="#" className="hover:text-white">Envíos</a></li>
                <li><a href="#" className="hover:text-white">Devoluciones</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-600 text-[10px] font-mono tracking-widest uppercase">
              © 2026 UVE8 STREETWEAR. FROM DETROIT TO THE WORLD.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-brand-neon transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-brand-neon transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
