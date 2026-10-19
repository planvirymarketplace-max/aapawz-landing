'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  LayoutGrid,
  ChevronRight,
  Receipt,
  RotateCcw,
  Heart,
  Calendar,
  Gift,
  CalendarCheck,
  Stethoscope,
  GraduationCap,
  Pill,
  Building2,
  PawPrint,
  CreditCard,
  Home,
  Bell,
  Sparkles,
  Handshake,
  HelpCircle,
  LogOut,
} from 'lucide-react';

type IntentKey = 'care' | 'shop' | 'question' | 'learn';
type AnimalKey = 'Dog' | 'Cat' | 'Bird' | 'Reptiles' | 'Small Animal';
type FilterKey = 'All' | AnimalKey;
type DrawerTab = 'ask' | 'book' | 'triage';

interface ProductItem {
  id: string;
  kind: AnimalKey;
  subKind: string;
  title: string;
  badge: string;
  price: string;
  indexStr: string;
  image: string;
  alt: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    kind: 'Dog',
    subKind: 'Dog · Nutrition',
    title: 'Everyday nutrition',
    badge: 'Daily essential',
    price: 'Catalog price',
    indexStr: '01 / 04',
    image:
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80',
    alt: 'Dog food in a bowl',
  },
  {
    id: 'prod-2',
    kind: 'Cat',
    subKind: 'Cat · Play',
    title: 'Cat enrichment',
    badge: 'Enrichment',
    price: 'Catalog price',
    indexStr: '02 / 04',
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80',
    alt: 'Cat resting',
  },
  {
    id: 'prod-3',
    kind: 'Bird',
    subKind: 'Bird · Habitat',
    title: 'Habitat essentials',
    badge: 'Habitat',
    price: 'Catalog price',
    indexStr: '03 / 04',
    image:
      'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=700&q=80',
    alt: 'Colorful bird perched',
  },
  {
    id: 'prod-4',
    kind: 'Small Animal',
    subKind: 'Small animal · Habitat',
    title: 'Habitat comfort',
    badge: 'Comfort',
    price: 'Catalog price',
    indexStr: '04 / 04',
    image:
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=700&q=80',
    alt: 'Hamster on bedding',
  },
];

const INTENT_DATA: Record<
  IntentKey,
  { title: string; text: string; action: string }
> = {
  care: {
    title: "Let's find the right care.",
    text: "Choose a service and we'll help you find a sensible next step for your pet.",
    action: 'Explore care',
  },
  shop: {
    title: "Let's shop for your animal.",
    text: 'Choose an animal first, then explore products selected for their everyday needs.',
    action: 'Choose an animal',
  },
  question: {
    title: "Start with what you've noticed.",
    text: 'Pawzsly can guide you through a few questions and help identify an appropriate next step.',
    action: 'Start a triage',
  },
  learn: {
    title: 'Find a useful place to begin.',
    text: 'Explore lessons, quick explainers, and pet-care education built around your questions.',
    action: 'Explore learning',
  },
};

const ANIMAL_DATA: Record<AnimalKey, { title: string; text: string }> = {
  Dog: {
    title: 'Dog essentials, thoughtfully chosen.',
    text: 'Browse everyday nutrition, grooming, play, and wellness.',
  },
  Cat: {
    title: 'A better world for curious cats.',
    text: 'Find nutrition, litter, enrichment, grooming, and wellness essentials.',
  },
  Bird: {
    title: 'Good care takes the right environment.',
    text: 'Explore feed, habitat, enrichment, and accessories for birds.',
  },
  Reptiles: {
    title: 'Build the right habitat.',
    text: 'Explore habitat, heating, lighting, nutrition, and essential supplies.',
  },
  'Small Animal': {
    title: 'Small companions, considered care.',
    text: 'Browse bedding, habitat, nutrition, and enrichment essentials.',
  },
};

const MEGA_DATA = {
  shop: {
    k: 'Find their kind of good',
    h: 'Shop with your animal in mind.',
    p: 'Start with the animal, then discover the categories that belong in their world.',
    links: [
      ['Dog essentials', 'Dog'],
      ['Cat essentials', 'Cat'],
      ['Bird supplies', 'Bird'],
      ['Reptile habitat', 'Reptiles'],
      ['Small animal care', 'Small Animal'],
      ['Browse all products', 'All'],
    ] as [string, string][],
    f: 'A more thoughtful way to fill the basket.',
  },
  care: {
    k: 'Care, connected',
    h: 'The right support, at the right time.',
    p: 'Discover in-person services, veterinary pathways, and guided help.',
    links: [
      ['Dog grooming', 'Grooming'],
      ['Veterinary care', 'Veterinary'],
      ['Virtual guidance', 'Virtual'],
      ['Start a triage', 'Triage'],
      ['Find local care', 'Location'],
      ['Ask Pawzsly', 'AI'],
    ] as [string, string][],
    f: 'Start with what you need. We’ll help you find the next step.',
  },
};

export default function HomePage() {
  // State
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mega menu
  const [activeMega, setActiveMega] = useState<'shop' | 'care' | null>(null);

  // Intent selection
  const [selectedIntent, setSelectedIntent] = useState<IntentKey>('care');

  // Animal selection & product filtering
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalKey>('Dog');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('ask');

  // Drawer Form States
  const [askAnimal, setAskAnimal] = useState('Dog');
  const [askQuestion, setAskQuestion] = useState('');
  const [askResponse, setAskResponse] = useState<string | null>(null);

  const [bookType, setBookType] = useState('Grooming appointment');
  const [bookPet, setBookPet] = useState('Dog');
  const [bookLocation, setBookLocation] = useState('Memphis, TN');
  const [bookResponse, setBookResponse] = useState<string | null>(null);

  const [triageAnimal, setTriageAnimal] = useState('Dog');
  const [triageConcern, setTriageConcern] = useState('Change in behavior');
  const [triageDetails, setTriageDetails] = useState('');
  const [triageResponse, setTriageResponse] = useState<string | null>(null);

  // Search Panel
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Newsletter Form
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  const openDrawer = (tab: DrawerTab = 'ask') => {
    setDrawerTab(tab);
    setIsDrawerOpen(true);
    document.body.classList.add('lock');
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    document.body.classList.remove('lock');
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const closeSearch = React.useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Account Drawer
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

  const openAccount = () => {
    setIsAccountOpen(true);
    document.body.classList.add('lock');
  };

  const closeAccount = React.useCallback(() => {
    setIsAccountOpen(false);
    if (!isDrawerOpen) {
      document.body.classList.remove('lock');
    }
  }, [isDrawerOpen]);

  // Keyboard shortcut for Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        if (isAccountOpen) closeAccount();
        if (isDrawerOpen) closeDrawer();
        if (isSearchOpen) closeSearch();
        if (activeMega) setActiveMega(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountOpen, isDrawerOpen, isSearchOpen, activeMega, closeAccount, closeSearch]);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setActiveMega(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAnimalSelect = (animal: AnimalKey) => {
    setSelectedAnimal(animal);
    setActiveFilter(animal);
  };

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    triggerToast(`${productName} added to demo cart`);
  };

  const handleCartClick = () => {
    if (cartCount > 0) {
      triggerToast(
        `${cartCount} demo item(s) in your bag. Checkout is not connected.`
      );
    } else {
      triggerToast(
        'Your bag is empty. Add a sample product to preview the cart.'
      );
    }
  };

  const handleAccountClick = () => {
    triggerToast(
      'Account login will connect to the customer account system.'
    );
  };

  const handleIntentAction = () => {
    if (selectedIntent === 'care') {
      openDrawer('book');
    } else if (selectedIntent === 'question') {
      openDrawer('triage');
    } else if (selectedIntent === 'shop') {
      document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' });
    } else if (selectedIntent === 'learn') {
      document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResponse('Type a product, service, or question to search.');
      return;
    }
    if (q.includes('triage') || q.includes('concern')) {
      closeSearch();
      openDrawer('triage');
      return;
    }
    if (q.includes('groom') || q.includes('vet') || q.includes('care')) {
      closeSearch();
      openDrawer('book');
      return;
    }
    if (
      q.includes('learn') ||
      q.includes('academy') ||
      q.includes('education')
    ) {
      closeSearch();
      document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSearchResponse(
      `Search for “${searchQuery}” is ready to connect to the live product and content catalog.`
    );
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterFeedback(
      'Thanks — email validated in this prototype. Newsletter signup needs a live service connection.'
    );
    setNewsletterEmail('');
  };

  // Filtered products list
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.kind === activeFilter;
  });

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="announcement">
        CARE, COMMERCE &amp; CURIOSITY — ALL IN ONE PLACE{' '}
        <a href="#start">Explore the experience ↗</a>
      </div>

      {/* 2. HEADER */}
      <header>
        <div className="container head">
          <div className="head-start">
            <button
              className="icon"
              id="menuOpen"
              aria-label="Open Pawzsly drawer"
              onClick={() => openDrawer('ask')}
            >
              <svg viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              className="searchbtn"
              id="searchOpen"
              onClick={openSearch}
              aria-label="Open search"
            >
              <svg viewBox="0 0 24 24">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
              <span>Search anything</span>
              <span className="mono">⌘ K</span>
            </button>
          </div>

          <a className="brand" href="#">
            <b>p</b>
            <span>
              all about <span>pawz.</span>
            </span>
          </a>

          <nav className="nav">
            <button
              type="button"
              className="navlink bg-transparent border-0"
              aria-expanded={activeMega === 'shop'}
              onClick={() =>
                setActiveMega((prev) => (prev === 'shop' ? null : 'shop'))
              }
            >
              Shop
            </button>
            <button
              type="button"
              className="navlink bg-transparent border-0"
              aria-expanded={activeMega === 'care'}
              onClick={() =>
                setActiveMega((prev) => (prev === 'care' ? null : 'care'))
              }
            >
              Book care
            </button>
            <a className="navlink" href="#learn">
              Learn
            </a>
            <button
              type="button"
              className="navlink bg-transparent border-0"
              onClick={() => openDrawer('ask')}
            >
              Pawzsly AI ↗
            </button>
          </nav>

          <div className="head-actions">
            <button
              className="icon"
              id="account"
              aria-label="My account"
              onClick={openAccount}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 21v-1.8a7.5 7.5 0 0 1 15 0V21" />
              </svg>
            </button>
            <button
              className="icon"
              id="cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              onClick={handleCartClick}
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 8h14l-1 12H6L5 8Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              <span className="cartcount" id="cartCount">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Mega menu dropdown */}
          <div className={`mega ${activeMega ? 'open' : ''}`} id="mega">
            {activeMega && (
              <div className="container megainner" id="megaInner">
                <div>
                  <div className="eyebrow">{MEGA_DATA[activeMega].k}</div>
                  <h3>{MEGA_DATA[activeMega].h}</h3>
                  <p>{MEGA_DATA[activeMega].p}</p>
                </div>
                <div className="megalinks">
                  {MEGA_DATA[activeMega].links.map(([label, val]) => (
                    <button
                      key={label}
                      type="button"
                      className="border-0 bg-transparent cursor-pointer"
                      onClick={() => {
                        if (val in ANIMAL_DATA) {
                          handleAnimalSelect(val as AnimalKey);
                          document
                            .querySelector('#shop')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        } else if (val === 'All') {
                          setActiveFilter('All');
                          document
                            .querySelector('#products')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        } else if (val === 'Triage') {
                          openDrawer('triage');
                        } else if (val === 'AI') {
                          openDrawer('ask');
                        } else if (
                          val === 'Veterinary' ||
                          val === 'Virtual' ||
                          val === 'Grooming' ||
                          val === 'Location'
                        ) {
                          openDrawer('book');
                        }
                        setActiveMega(null);
                      }}
                    >
                      {label}
                      <span>↗</span>
                    </button>
                  ))}
                </div>
                <div className="megafeature">
                  <span className="micro">
                    ALL ABOUT PAWZ / {activeMega.toUpperCase()}
                  </span>
                  <strong>{MEGA_DATA[activeMega].f}</strong>
                  <a
                    href="#start"
                    onClick={() => setActiveMega(null)}
                  >
                    Find your next step ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* SECTION 1 (CONVERTED TO WHITE BACKGROUND): HERO */}
        <section className="hero">
          <div className="container herogrid">
            <div className="herocopy">
              <div className="kicker">
                <span className="dot"></span>
                <span className="eyebrow">
                  The connected pet-care experience
                </span>
              </div>
              <h1>
                Every part of their world.
                <br />
                <em>One better place.</em>
              </h1>
              <p className="lede">
                Find the right care, the right products, and the right answers
                for the animals who make your life better.
              </p>
              <div className="actions">
                <a className="btn primary" href="#start">
                  Find your next step <span>↗</span>
                </a>
                <button
                  className="btn quiet"
                  id="heroAsk"
                  onClick={() => openDrawer('ask')}
                >
                  Ask Pawzsly <span>✳</span>
                </button>
              </div>
              <div className="proof">
                <span className="proofmark">✳</span>
                <div>
                  <strong>Care that connects the dots.</strong>Shop, book, learn,
                  and get guidance in one place.
                </div>
              </div>
            </div>
            <div>
              <img
                className="heroimg"
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1500&q=88"
                alt="Golden dog looking toward the camera"
                referrerPolicy="no-referrer"
              />
              <div className="caption">
                <span>For the life you share</span>
                <span>01 / The All About Pawz experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTENT SECTION (TEAL) */}
        <section className="intent" id="start">
          <div className="container">
            <div className="intenthead">
              <h2>What brings you here today?</h2>
              <p>
                Start with what you need. We&apos;ll shape the next step around you.
              </p>
            </div>
            <div
              className="intentgrid"
              role="group"
              aria-label="Choose what you need"
            >
              <button
                className="intentcard"
                data-intent="care"
                aria-pressed={selectedIntent === 'care'}
                onClick={() => setSelectedIntent('care')}
              >
                <span className="intentnum">01</span>
                <span>
                  <strong>I need care</strong>
                  <small>Grooming, veterinary services, appointments</small>
                </span>
                <span className="arrow">↗</span>
              </button>
              <button
                className="intentcard"
                data-intent="shop"
                aria-pressed={selectedIntent === 'shop'}
                onClick={() => setSelectedIntent('shop')}
              >
                <span className="intentnum">02</span>
                <span>
                  <strong>I&apos;m shopping</strong>
                  <small>Find essentials for your animal</small>
                </span>
                <span className="arrow">↗</span>
              </button>
              <button
                className="intentcard"
                data-intent="question"
                aria-pressed={selectedIntent === 'question'}
                onClick={() => setSelectedIntent('question')}
              >
                <span className="intentnum">03</span>
                <span>
                  <strong>I have a concern</strong>
                  <small>Start guided pet-care triage</small>
                </span>
                <span className="arrow">↗</span>
              </button>
              <button
                className="intentcard"
                data-intent="learn"
                aria-pressed={selectedIntent === 'learn'}
                onClick={() => setSelectedIntent('learn')}
              >
                <span className="intentnum">04</span>
                <span>
                  <strong>I want to learn</strong>
                  <small>Clear answers, useful lessons, better care</small>
                </span>
                <span className="arrow">↗</span>
              </button>
            </div>

            <div className="intentresult" aria-live="polite">
              <div>
                <strong id="intentTitle">
                  {INTENT_DATA[selectedIntent].title}
                </strong>
                <p id="intentText">{INTENT_DATA[selectedIntent].text}</p>
              </div>
              <button
                className="btn"
                id="intentAction"
                onClick={handleIntentAction}
              >
                {INTENT_DATA[selectedIntent].action} <span>↗</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2 (CONVERTED TO WHITE BACKGROUND): SHOP BY ANIMAL */}
        <section className="content section" id="shop">
          <div className="container">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">A world of their own</div>
                <h2>
                  Shop by <em>animal.</em>
                </h2>
              </div>
              <p>
                Different animals. Different needs. A more thoughtful way to
                find what belongs in their world.
              </p>
            </div>

            <div
              className="animals"
              role="group"
              aria-label="Shop by animal"
            >
              <button
                className="animal"
                data-animal="Dog"
                aria-pressed={selectedAnimal === 'Dog'}
                onClick={() => handleAnimalSelect('Dog')}
              >
                <div className="animalimg">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=650&q=80"
                    alt="Golden retriever"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="animalname">
                  <strong>Dog</strong>
                  <span>↗</span>
                </div>
                <div className="animalnote">Food · Walk · Play · Care</div>
              </button>

              <button
                className="animal"
                data-animal="Cat"
                aria-pressed={selectedAnimal === 'Cat'}
                onClick={() => handleAnimalSelect('Cat')}
              >
                <div className="animalimg">
                  <img
                    src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=650&q=80"
                    alt="Cat looking toward camera"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="animalname">
                  <strong>Cat</strong>
                  <span>↗</span>
                </div>
                <div className="animalnote">
                  Nutrition · Litter · Enrichment
                </div>
              </button>

              <button
                className="animal"
                data-animal="Bird"
                aria-pressed={selectedAnimal === 'Bird'}
                onClick={() => handleAnimalSelect('Bird')}
              >
                <div className="animalimg">
                  <img
                    src="https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=650&q=80"
                    alt="Colorful parrot"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="animalname">
                  <strong>Bird</strong>
                  <span>↗</span>
                </div>
                <div className="animalnote">Feed · Habitat · Enrichment</div>
              </button>

              <button
                className="animal"
                data-animal="Reptiles"
                aria-pressed={selectedAnimal === 'Reptiles'}
                onClick={() => handleAnimalSelect('Reptiles')}
              >
                <div className="animalimg">
                  <img
                    src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=650&q=80"
                    alt="Green iguana"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="animalname">
                  <strong>Reptiles</strong>
                  <span>↗</span>
                </div>
                <div className="animalnote">Habitat · Heat · Nutrition</div>
              </button>

              <button
                className="animal"
                data-animal="Small Animal"
                aria-pressed={selectedAnimal === 'Small Animal'}
                onClick={() => handleAnimalSelect('Small Animal')}
              >
                <div className="animalimg">
                  <img
                    src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=650&q=80"
                    alt="Small hamster"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="animalname">
                  <strong>Small animal</strong>
                  <span>↗</span>
                </div>
                <div className="animalnote">Bedding · Habitat · Feed</div>
              </button>
            </div>

            <div className="animalfeedback" aria-live="polite">
              <div>
                <strong id="animalTitle">
                  {ANIMAL_DATA[selectedAnimal].title}
                </strong>{' '}
                <span id="animalText">{ANIMAL_DATA[selectedAnimal].text}</span>
              </div>
              <a
                href="#products"
                id="animalLink"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector('#products')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore {selectedAnimal.toLowerCase()} →
              </a>
            </div>
          </div>
        </section>

        {/* STORY / PAWZSLY SECTION (SAGE) */}
        <section className="content section story" id="pawzsly">
          <div className="container storygrid">
            <div className="storyintro">
              <div className="eyebrow">More than a chatbot</div>
              <h2>
                Less searching.
                <br />
                <em>More understanding.</em>
              </h2>
              <p>
                Pawzsly connects the question you have with a next step that
                makes sense—whether that&apos;s a care professional, a product, or a
                trusted lesson.
              </p>
              <button
                className="btn primary"
                id="storyAsk"
                onClick={() => openDrawer('ask')}
              >
                Meet Pawzsly <span>↗</span>
              </button>
            </div>
            <div className="steps">
              <article className="step">
                <span className="stepno">01 / ASK</span>
                <div>
                  <h3>Start with the real question.</h3>
                  <p>
                    Describe what you need in your own words. You don&apos;t have to
                    know which service or category to look for first.
                  </p>
                </div>
                <span className="stepmark">↗</span>
              </article>
              <article className="step">
                <span className="stepno">02 / UNDERSTAND</span>
                <div>
                  <h3>Get a clearer path forward.</h3>
                  <p>
                    Use guided prompts to add context about your animal and
                    what you&apos;re trying to solve.
                  </p>
                </div>
                <span className="stepmark">↗</span>
              </article>
              <article className="step">
                <span className="stepno">03 / CONNECT</span>
                <div>
                  <h3>Move from answer to action.</h3>
                  <p>
                    Continue to relevant products, learning resources, or
                    available care options without starting over.
                  </p>
                </div>
                <span className="stepmark">↗</span>
              </article>
              <article className="step">
                <span className="stepno">04 / CONTINUE</span>
                <div>
                  <h3>Keep the bigger picture in view.</h3>
                  <p>
                    A connected experience can make each visit more useful as
                    your pet&apos;s needs change.
                  </p>
                </div>
                <span className="stepmark">↗</span>
              </article>
            </div>
          </div>
        </section>

        {/* FEATURE DARK TRIAGE SECTION */}
        <section className="content section dark">
          <div className="container featuregrid">
            <div className="featurephoto">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85"
                alt="Dog relaxing comfortably at home"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className="stamp">Human judgment stays in the loop</span>
            </div>
            <div className="featurecopy">
              <div className="eyebrow">When the question feels bigger</div>
              <h2>
                Start a triage.
                <br />
                <em>Find the next step.</em>
              </h2>
              <p>
                When something seems off, it can be hard to know what to do
                first. A guided triage helps gather context and point toward
                appropriate next steps—not replace a veterinarian.
              </p>
              <div className="featurelist">
                <div className="featureline">
                  <span className="n">01</span>
                  <strong>Tell us what you&apos;re noticing</strong>
                  <span>↗</span>
                </div>
                <div className="featureline">
                  <span className="n">02</span>
                  <strong>Add your animal&apos;s context</strong>
                  <span>↗</span>
                </div>
                <div className="featureline">
                  <span className="n">03</span>
                  <strong>Understand possible next steps</strong>
                  <span>↗</span>
                </div>
              </div>
              <button
                className="btn"
                id="triageOpen"
                onClick={() => openDrawer('triage')}
              >
                Start a triage <span>↗</span>
              </button>
              <div className="disclaimer">
                URGENT? CONTACT AN EMERGENCY VETERINARY PROVIDER IMMEDIATELY.
              </div>
            </div>
          </div>
        </section>

        {/* THREE SERVICE PROMISE CARDS: ORDERING, SHIPPING & DELIVERY GUARANTEE */}
        <section className="white py-14 md:py-20 border-b border-[var(--line)]" id="promises">
          <div className="container">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">Dependable Care Logistics</div>
                <h2>
                  Ordering, shipping &amp; our <em>promise.</em>
                </h2>
              </div>
              <p>
                From thoughtful checkout to your pet&apos;s doorstep, every order is backed by dependable logistics and a 100% care guarantee.
              </p>
            </div>

            <div className="servicegrid">
              {/* CARD 1: ORDERING */}
              <article className="service" style={{ background: '#ffffff' }}>
                <div className="servicetop">
                  <span className="serviceno">01 / ORDERING</span>
                  <PackageCheck className="w-5 h-5 text-[var(--teal)] stroke-[1.8]" />
                </div>
                <h3>Simple, flexible ordering.</h3>
                <p>
                  Order on demand or schedule automatic recurring deliveries with subscriber perks. Pause, swap flavors, or bundle nutrition and care supplies in one seamless basket.
                </p>
                <a href="#care" className="textlink">
                  Explore auto-ordering <span>↗</span>
                </a>
              </article>

              {/* CARD 2: SHIPPING */}
              <article className="service" style={{ background: '#ffffff' }}>
                <div className="servicetop">
                  <span className="serviceno">02 / SHIPPING</span>
                  <Truck className="w-5 h-5 text-[var(--teal)] stroke-[1.8]" />
                </div>
                <h3>Fast, climate-care transit.</h3>
                <p>
                  Temperature-monitored nutrition and sensitive wellness items packed with care. Free standard shipping on orders over $49 with live door-to-door transit notifications.
                </p>
                <button
                  type="button"
                  onClick={() => triggerToast('Orders over $49 ship free. Standard delivery takes 2-3 business days.')}
                  className="textlink"
                >
                  Shipping &amp; tracking <span>↗</span>
                </button>
              </article>

              {/* CARD 3: DELIVERY GUARANTEE PROMISE */}
              <article className="service" style={{ background: '#ffffff' }}>
                <div className="servicetop">
                  <span className="serviceno">03 / DELIVERY GUARANTEE</span>
                  <ShieldCheck className="w-5 h-5 text-[var(--teal)] stroke-[1.8]" />
                </div>
                <h3>100% delivery guarantee.</h3>
                <p>
                  If an item arrives damaged, doesn&apos;t agree with your animal, or isn&apos;t what you expected, we make it right. Free 30-day returns and fresh batch guarantee.
                </p>
                <button
                  type="button"
                  onClick={() => triggerToast('Our promise: 100% satisfaction guarantee with free 30-day returns.')}
                  className="textlink"
                >
                  Our care guarantee <span>↗</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 3 (CONVERTED TO WHITE BACKGROUND): PRODUCTS SECTION */}
        <section className="content section" id="products">
          <div className="container">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">Useful things, well considered</div>
                <h2>
                  Good choices for <em>everyday care.</em>
                </h2>
              </div>
              <p>
                Sample product discovery. Product listings, pricing, and checkout
                must connect to the live catalog.
              </p>
            </div>

            <div className="toolbar">
              <div
                className="filters"
                role="group"
                aria-label="Filter products"
              >
                {(
                  [
                    'All',
                    'Dog',
                    'Cat',
                    'Bird',
                    'Reptiles',
                    'Small Animal',
                  ] as FilterKey[]
                ).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`chip ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f === 'All'
                      ? 'All picks'
                      : f === 'Small Animal'
                      ? 'Small animal'
                      : f}
                  </button>
                ))}
              </div>
              <span
                className="productcount"
                id="productCount"
                aria-live="polite"
              >
                {String(filteredProducts.length).padStart(2, '0')} sample product
                {filteredProducts.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="products" id="productGrid">
              {filteredProducts.map((p) => (
                <article key={p.id} className="product" data-kind={p.kind}>
                  <div className="productphoto">
                    <img
                      src={p.image}
                      alt={p.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className="badge">{p.badge}</span>
                    <button
                      className="add"
                      data-product={p.title}
                      aria-label={`Add ${p.title} to cart`}
                      onClick={() => handleAddToCart(p.title)}
                    >
                      +
                    </button>
                  </div>
                  <div className="productinfo">
                    <div className="kind">{p.subKind}</div>
                    <h3>{p.title}</h3>
                    <div className="productbottom">
                      <strong>{p.price}</strong>
                      <span>{p.indexStr}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="center">
              <a className="btn primary" href="#shop">
                Explore the marketplace <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* CARE SERVICES SECTION (WHITE) */}
        <section className="content section white" id="care">
          <div className="container">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">Care, connected</div>
                <h2>
                  When it&apos;s time to <em>take action.</em>
                </h2>
              </div>
              <p>
                Move from discovery to a useful next step, with the right kind of
                support for the moment.
              </p>
            </div>
            <div className="servicegrid">
              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">01 / IN PERSON</span>
                  <span className="serviceicon">✳</span>
                </div>
                <h3>Grooming that feels good.</h3>
                <p>
                  Explore grooming services and appointment options, starting with
                  Memphis and expanding to the wider marketplace.
                </p>
                <a className="textlink" href="#start">
                  Explore grooming <span>↗</span>
                </a>
              </article>

              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">02 / VETERINARY</span>
                  <span className="serviceicon">＋</span>
                </div>
                <h3>Care when you have questions.</h3>
                <p>
                  Find the appropriate veterinary pathway, from general guidance
                  to professional care and urgent escalation.
                </p>
                <button
                  type="button"
                  className="textlink"
                  data-open="triage"
                  onClick={() => openDrawer('triage')}
                >
                  Explore vet care <span>↗</span>
                </button>
              </article>

              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">03 / PERSONALIZED</span>
                  <span className="serviceicon">↗</span>
                </div>
                <h3>A little help choosing.</h3>
                <p>
                  Use Pawzsly to navigate products, services, and education based
                  on the question you came in with.
                </p>
                <button
                  type="button"
                  className="textlink"
                  data-open="ask"
                  onClick={() => openDrawer('ask')}
                >
                  Ask Pawzsly <span>↗</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* LEARN BAND (ORANGE) */}
        <section className="learnband" id="learn">
          <div className="container learngrid">
            <div>
              <div className="eyebrow" style={{ color: '#171916' }}>
                Learn with purpose
              </div>
              <h2>
                Better informed.
                <br />
                <em>Better prepared.</em>
              </h2>
            </div>
            <div className="learnright">
              <p>
                Make learning a natural part of pet care—from quick answers to
                deeper lessons through the Learning Academy, Pawzsly U, and Pet
                Education Center.
              </p>
              <a className="btn" href="#education">
                Explore learning <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 4 (CONVERTED TO WHITE BACKGROUND): EDUCATION SECTION */}
        <section className="content section" id="education">
          <div className="container">
            <div className="sectionhead">
              <div>
                <div className="eyebrow">The learning ecosystem</div>
                <h2>
                  Knowledge for the <em>whole journey.</em>
                </h2>
              </div>
              <p>
                Helpful information should meet people where they are, then give
                them a way to go deeper.
              </p>
            </div>
            <div className="servicegrid">
              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">01 / LEARNING ACADEMY</span>
                  <span className="serviceicon">↗</span>
                </div>
                <h3>Learn what matters now.</h3>
                <p>
                  Practical explainers and learning paths for everyday pet
                  ownership.
                </p>
                <a className="textlink" href="#education">
                  Explore the academy <span>↗</span>
                </a>
              </article>

              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">02 / PAWZSLY U</span>
                  <span className="serviceicon">↗</span>
                </div>
                <h3>Build your knowledge.</h3>
                <p>
                  Structured lessons designed to make animal care easier to
                  understand.
                </p>
                <a className="textlink" href="#education">
                  Explore Pawzsly U <span>↗</span>
                </a>
              </article>

              <article className="service">
                <div className="servicetop">
                  <span className="serviceno">03 / PET EDUCATION CENTER</span>
                  <span className="serviceicon">↗</span>
                </div>
                <h3>Find a trusted starting point.</h3>
                <p>Browse useful guidance and discover what to ask next.</p>
                <button
                  type="button"
                  className="textlink"
                  data-open="ask"
                  onClick={() => openDrawer('ask')}
                >
                  Ask a question <span>↗</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* NEWSLETTER SECTION (TEAL) */}
        <section className="newsletter">
          <div className="container newsinner">
            <div>
              <h2>Good things for good companions.</h2>
              <p>
                Get useful care ideas, new discoveries, and updates from All
                About Pawz.
              </p>
            </div>
            <form id="newsForm" onSubmit={handleNewsletterSubmit}>
              <div className="newsform">
                <input
                  id="email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Your email address"
                  required
                />
                <button className="btn" type="submit">
                  Keep me in the loop <span>↗</span>
                </button>
              </div>
              {newsletterFeedback && (
                <div className="formfeedback" id="formFeedback" aria-live="polite">
                  {newsletterFeedback}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footgrid">
            <div className="footbrand">
              <a className="brand" href="#">
                <b>p</b>
                <span>
                  all about <span>pawz.</span>
                </span>
              </a>
              <p>
                A more connected world of pet care—bringing products, services,
                learning, and guidance together.
              </p>
              <div className="contact">
                699 Waring Rd, Memphis, TN 38122
                <br />
                <a href="tel:+19017221114">(901) 722-1114</a>
                <br />
                <a href="mailto:booking@aapawz.com">booking@aapawz.com</a>
                <br />
                <br />
                Tue–Sat 9am–6pm · Sun 10am–4pm
                <br />
                Monday closed
              </div>
            </div>

            <div className="footcol">
              <h3>Support</h3>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Support ticket portal will connect to customer care.'); }}>Open a Ticket</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Returns portal will connect to order lookup.'); }}>Start a Return</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Feedback submitted. Thank you!'); }}>Leave Feedback</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Help center search ready to connect.'); }}>Find Help</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Partner directory connecting...'); }}>Partner Directory</a>
            </div>

            <div className="footcol">
              <h3>Services</h3>
              <button type="button" className="footlink" onClick={() => openDrawer('book')}>Book Grooming</button>
              <button type="button" className="footlink" onClick={() => openDrawer('book')}>Book Veterinary Care</button>
              <button type="button" className="footlink" onClick={() => openDrawer('triage')}>AI teletriage</button>
            </div>

            <div className="footcol">
              <h3>Shop</h3>
              <a href="#care">Subscription Perks</a>
              <a href="#shop" onClick={(e) => { e.preventDefault(); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }); }}>Shop by Animal</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Gift cards will connect to marketplace checkout.'); }}>Gift Cards</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Coupons and promo code center.'); }}>Promo</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Pet insurance quotes connecting...'); }}>Pet Insurance</a>
            </div>

            <div className="footcol">
              <h3>Partners</h3>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Seller registration portal.'); }}>Become a Seller</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Veterinary partnership inquiry.'); }}>Become a Veterinary Partner</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Grooming partner application.'); }}>Become a Grooming Partner</a>
              <a href="#footer" onClick={(e) => { e.preventDefault(); triggerToast('Pharmacy partner network.'); }}>Become a Pharmacy Partner</a>
            </div>

            <div className="footcol">
              <h3>Education</h3>
              <a href="#education" onClick={(e) => { e.preventDefault(); document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }); }}>Enroll in Pawzsly U</a>
              <a href="#education" onClick={(e) => { e.preventDefault(); document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }); }}>Pet Education Center</a>
              <a href="#learn" onClick={(e) => { e.preventDefault(); document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' }); }}>Pet – Care Blog</a>
            </div>

            <div className="footcol">
              <h3>Corporate</h3>
              <a href="#footer">About Us</a>
              <a href="#footer">Investors</a>
              <a href="#footer">Sustainability</a>
              <a href="#footer">Advertise With Us</a>
              <a href="#footer">Legal</a>
              <a href="#footer">Developers</a>
            </div>
          </div>

          {/* TRADEMARK LOGO ON THE LINE ABOVE THE TRADEMARK VIEW */}
          <div className="pt-10 pb-6 flex justify-center items-center">
            <img
              src="/AaPAWZFOOGTERLOGOTRANAPARENT.png"
              alt="All About Pawz"
              className="w-[200px] sm:w-[280px] md:w-[380px] lg:w-[480px] xl:w-[540px] max-w-full h-auto object-contain"
            />
          </div>

          <div className="footbottom">
            <span>© 2026 All About Pawz · All creatures welcome.</span>
            <div className="social">
              <a href="#footer" aria-label="Facebook">
                f
              </a>
              <a href="#footer" aria-label="Instagram">
                ig
              </a>
              <a href="#footer" aria-label="TikTok">
                tk
              </a>
              <a href="#footer" aria-label="Pinterest">
                p
              </a>
            </div>
            <a href="#footer">Privacy &amp; accessibility</a>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobilebar" aria-label="Quick navigation">
        <button
          type="button"
          id="mobileMenu"
          onClick={() => openDrawer('ask')}
        >
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Guide
        </button>
        <button
          type="button"
          onClick={() => {
            document
              .querySelector('#shop')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          Shop
        </button>
        <button type="button" id="mobileSearch" onClick={openSearch}>
          <svg viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
          Search
        </button>
        <button type="button" id="mobileAccount" onClick={openAccount}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 21v-1.8a7.5 7.5 0 0 1 15 0V21" />
          </svg>
          Account
        </button>
      </nav>

      {/* BACKDROP */}
      <div
        className={`backdrop ${isDrawerOpen ? 'open' : ''}`}
        id="backdrop"
        onClick={closeDrawer}
      />

      {/* PAWZSLY WORKSPACE DRAWER */}
      <aside
        className={`drawer bg-white ${isDrawerOpen ? 'open' : ''}`}
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Pawzsly workspace"
        aria-hidden={!isDrawerOpen}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="drawerhead">
          <div>
            <div className="micro" style={{ color: 'var(--teal)' }}>
              YOUR PET-CARE COMPANION
            </div>
            <div className="drawertitle">
              Hello from <span>Pawzsly.</span>
            </div>
          </div>
          <button
            className="close"
            id="drawerClose"
            aria-label="Close drawer"
            onClick={closeDrawer}
          >
            ×
          </button>
        </div>

        <div className="tabs" role="tablist">
          <button
            className="tab"
            role="tab"
            data-tab="ask"
            aria-selected={drawerTab === 'ask'}
            onClick={() => setDrawerTab('ask')}
          >
            Ask Pawzsly
          </button>
          <button
            className="tab"
            role="tab"
            data-tab="book"
            aria-selected={drawerTab === 'book'}
            onClick={() => setDrawerTab('book')}
          >
            Book care
          </button>
          <button
            className="tab"
            role="tab"
            data-tab="triage"
            aria-selected={drawerTab === 'triage'}
            onClick={() => setDrawerTab('triage')}
          >
            Start triage
          </button>
        </div>

        <div className="drawerbody">
          {/* ASK PANEL */}
          <section
            className="panel"
            id="panel-ask"
            role="tabpanel"
            hidden={drawerTab !== 'ask'}
          >
            <div className="eyebrow">Ask · Explore · Connect</div>
            <h2>What&apos;s on your mind?</h2>
            <p>
              Ask about pet care, finding a service, or choosing what to explore
              next.
            </p>
            <label className="label" htmlFor="askAnimal">
              Who are we talking about?
            </label>
            <select
              className="field"
              id="askAnimal"
              value={askAnimal}
              onChange={(e) => setAskAnimal(e.target.value)}
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Reptile</option>
              <option>Small animal</option>
              <option>Not sure yet</option>
            </select>
            <label className="label" htmlFor="askQuestion">
              Your question
            </label>
            <textarea
              className="field"
              id="askQuestion"
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder="Tell Pawzsly what you&apos;re trying to figure out…"
            />
            <button
              className="btn primary submit"
              id="askSubmit"
              type="button"
              onClick={() => {
                const q = askQuestion.trim();
                if (q) {
                  setAskResponse(
                    `Thanks for sharing that about your ${askAnimal.toLowerCase()}. In the connected experience, Pawzsly would use this context to suggest relevant learning, products, or care options. For diagnosis or treatment, contact a veterinarian.`
                  );
                } else {
                  setAskResponse(
                    'Add a question first so we can help you choose a next step.'
                  );
                }
              }}
            >
              Find my next step <span>↗</span>
            </button>
            {askResponse && (
              <div className="response show" id="askResponse" aria-live="polite">
                {askResponse}
              </div>
            )}
            <p className="note">
              Prototype only: AI responses are not connected. This experience is
              designed to connect questions to relevant resources and services.
            </p>
          </section>

          {/* BOOK CARE PANEL */}
          <section
            className="panel"
            id="panel-book"
            role="tabpanel"
            hidden={drawerTab !== 'book'}
          >
            <div className="eyebrow">Book · Find · Connect</div>
            <h2>Let&apos;s find the right care.</h2>
            <p>
              Choose the kind of help you&apos;re looking for and where you need it.
            </p>
            <label className="label" htmlFor="bookType">
              What do you need?
            </label>
            <select
              className="field"
              id="bookType"
              value={bookType}
              onChange={(e) => setBookType(e.target.value)}
            >
              <option>Grooming appointment</option>
              <option>Veterinary care</option>
              <option>Virtual veterinary guidance</option>
              <option>Other pet service</option>
            </select>
            <label className="label" htmlFor="bookPet">
              Animal
            </label>
            <select
              className="field"
              id="bookPet"
              value={bookPet}
              onChange={(e) => setBookPet(e.target.value)}
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Reptile</option>
              <option>Small animal</option>
            </select>
            <label className="label" htmlFor="bookLocation">
              City or ZIP code
            </label>
            <input
              className="field"
              id="bookLocation"
              value={bookLocation}
              onChange={(e) => setBookLocation(e.target.value)}
              autoComplete="postal-code"
            />
            <button
              className="btn primary submit"
              id="bookSubmit"
              type="button"
              onClick={() => {
                const loc = bookLocation.trim();
                if (loc) {
                  setBookResponse(
                    `Your search is set for ${bookType.toLowerCase()} for a ${bookPet.toLowerCase()} near ${loc}. Live provider listings and appointment availability need to be connected to return real results.`
                  );
                } else {
                  setBookResponse('Enter a city or ZIP code to continue.');
                }
              }}
            >
              Find care options <span>↗</span>
            </button>
            {bookResponse && (
              <div className="response show" id="bookResponse" aria-live="polite">
                {bookResponse}
              </div>
            )}
            <p className="note">
              Prototype only: live provider listings and appointment availability
              are not connected.
            </p>
          </section>

          {/* START TRIAGE PANEL */}
          <section
            className="panel"
            id="panel-triage"
            role="tabpanel"
            hidden={drawerTab !== 'triage'}
          >
            <div className="eyebrow">Triage · Understand · Act</div>
            <h2>What have you noticed?</h2>
            <p>
              Share a few details to start organizing your concern and identify an
              appropriate next step.
            </p>
            <label className="label" htmlFor="triageAnimal">
              Animal
            </label>
            <select
              className="field"
              id="triageAnimal"
              value={triageAnimal}
              onChange={(e) => setTriageAnimal(e.target.value)}
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Reptile</option>
              <option>Small animal</option>
            </select>
            <label className="label" htmlFor="triageConcern">
              What&apos;s happening?
            </label>
            <select
              className="field"
              id="triageConcern"
              value={triageConcern}
              onChange={(e) => setTriageConcern(e.target.value)}
            >
              <option>Change in behavior</option>
              <option>Eating or drinking differently</option>
              <option>Skin, coat, or grooming concern</option>
              <option>Digestive concern</option>
              <option>Breathing or mobility concern</option>
              <option>Something else</option>
            </select>
            <label className="label" htmlFor="triageDetails">
              Anything else to share?
            </label>
            <textarea
              className="field"
              id="triageDetails"
              value={triageDetails}
              onChange={(e) => setTriageDetails(e.target.value)}
              placeholder="When did it start? What have you noticed?"
            />
            <button
              className="btn primary submit"
              id="triageSubmit"
              type="button"
              onClick={() => {
                setTriageResponse(
                  `You've selected "${triageConcern}" for your ${triageAnimal.toLowerCase()}. This prototype cannot assess symptoms or determine urgency. Contact your veterinarian for medical advice; if symptoms are severe or rapidly worsening, seek emergency veterinary care now.`
                );
              }}
            >
              Review next steps <span>↗</span>
            </button>
            {triageResponse && (
              <div
                className="response show"
                id="triageResponse"
                aria-live="polite"
              >
                {triageResponse}
              </div>
            )}
            <p className="note">
              <strong>Urgent:</strong> If your pet is struggling to breathe,
              collapsing, having seizures, experiencing severe bleeding, or may
              have ingested a toxin, contact an emergency veterinarian or animal
              poison-control service immediately. Do not wait for an online
              response.
            </p>
          </section>
        </div>
      </aside>

      {/* ACCOUNT DRAWER BACKDROP */}
      <div
        className={`backdrop ${isAccountOpen ? 'open' : ''}`}
        id="accountBackdrop"
        onClick={closeAccount}
      />

      {/* ACCOUNT DRAWER MATCHING SPECIFICATIONS */}
      <aside
        className={`drawer account-drawer bg-white ${isAccountOpen ? 'open' : ''}`}
        id="accountDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Account management"
        aria-hidden={!isAccountOpen}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto bg-white text-[#171916]">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-normal tracking-wide text-[#171916] uppercase">
                HI, PLANVIRY
              </h2>
              <p className="text-xs text-[var(--muted)] font-mono mt-1">
                planvirymarketplace@gmail.com
              </p>
            </div>
            <button
              type="button"
              className="close -mr-1 -mt-1"
              aria-label="Close account menu"
              onClick={closeAccount}
            >
              ×
            </button>
          </div>

          {/* GO TO MY ACCOUNT BUTTON WITH VISIBLE WHITE TEXT */}
          <button
            type="button"
            onClick={() => {
              triggerToast('Navigating to full account overview dashboard...');
              closeAccount();
            }}
            style={{ backgroundColor: '#171916', color: '#ffffff' }}
            className="w-full bg-[#171916] !text-white py-3.5 px-4 flex items-center justify-between font-mono text-[11px] tracking-wider uppercase hover:bg-[var(--teal)] transition-colors mb-6 cursor-pointer border-0"
          >
            <div className="flex items-center gap-3 !text-white" style={{ color: '#ffffff' }}>
              <LayoutGrid className="w-4 h-4 stroke-[2] !text-white" style={{ stroke: '#ffffff', color: '#ffffff' }} />
              <span className="!text-white font-bold tracking-wider" style={{ color: '#ffffff' }}>
                GO TO MY ACCOUNT
              </span>
            </div>
            <ChevronRight className="w-4 h-4 stroke-[2] !text-white" style={{ stroke: '#ffffff', color: '#ffffff' }} />
          </button>

          {/* GROUPS LIST */}
          <div className="space-y-6 flex-1 text-sm text-[#171916]">
            {/* 1. MY ORDERS */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#888e86] font-bold mb-2">
                MY ORDERS
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'Order History', icon: Receipt },
                  { label: 'Buy Again', icon: RotateCcw },
                  { label: 'Wish List', icon: Heart },
                  { label: 'Subscriptions', icon: Calendar },
                  { label: 'Perks Dashboard', icon: Gift },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        triggerToast(`${item.label} selected`);
                        closeAccount();
                      }}
                      className="w-full flex items-center gap-3.5 py-2.5 px-1 hover:text-[var(--teal)] hover:translate-x-1 transition-all text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 stroke-[1.8] text-[var(--muted)]" />
                      <span className="font-medium text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. MY APPOINTMENTS */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#888e86] font-bold mb-2">
                MY APPOINTMENTS
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'Grooming Appointments', icon: CalendarCheck, action: () => openDrawer('book') },
                  { label: 'Vet Appointments', icon: Stethoscope, action: () => openDrawer('book') },
                  { label: 'Learn Courses', icon: GraduationCap, action: () => { document.querySelector('#education')?.scrollIntoView({ behavior: 'smooth' }); closeAccount(); } },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          triggerToast(`${item.label} selected`);
                        }
                        closeAccount();
                      }}
                      className="w-full flex items-center gap-3.5 py-2.5 px-1 hover:text-[var(--teal)] hover:translate-x-1 transition-all text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 stroke-[1.8] text-[var(--muted)]" />
                      <span className="font-medium text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. MY PET HEALTH */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#888e86] font-bold mb-2">
                MY PET HEALTH
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'My Prescriptions', icon: Pill },
                  { label: 'My Vet', icon: Building2 },
                  { label: 'Insurance', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        triggerToast(`${item.label} records connecting...`);
                        closeAccount();
                      }}
                      className="w-full flex items-center gap-3.5 py-2.5 px-1 hover:text-[var(--teal)] hover:translate-x-1 transition-all text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 stroke-[1.8] text-[var(--muted)]" />
                      <span className="font-medium text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. MY PROFILE */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#888e86] font-bold mb-2">
                MY PROFILE
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'My Pets', icon: PawPrint },
                  { label: 'Payment Methods', icon: CreditCard },
                  { label: 'Address Book', icon: Home },
                  { label: 'Communication Preferences', icon: Bell },
                  { label: 'Pawzsly & AI', icon: Sparkles, action: () => openDrawer('ask') },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          triggerToast(`${item.label} profile settings`);
                        }
                        closeAccount();
                      }}
                      className="w-full flex items-center gap-3.5 py-2.5 px-1 hover:text-[var(--teal)] hover:translate-x-1 transition-all text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 stroke-[1.8] text-[var(--muted)]" />
                      <span className="font-medium text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. PARTNER WITH US */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#888e86] font-bold mb-2">
                PARTNER WITH US
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'Become a Partner', icon: Handshake },
                  { label: 'Need Help?', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        triggerToast(`${item.label} portal`);
                        closeAccount();
                      }}
                      className="w-full flex items-center gap-3.5 py-2.5 px-1 hover:text-[var(--teal)] hover:translate-x-1 transition-all text-left cursor-pointer"
                    >
                      <Icon className="w-4 h-4 stroke-[1.8] text-[var(--muted)]" />
                      <span className="font-medium text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIGN OUT BUTTON */}
          <div className="pt-6 mt-6 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => {
                triggerToast('Signed out of demo session');
                closeAccount();
              }}
              className="w-full py-3 px-4 border border-[var(--line)] bg-white hover:bg-[#171916] hover:text-white transition-colors flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#171916] cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[1.8]" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* SEARCH PANEL OVERLAY */}
      <div
        className={`searchpanel ${isSearchOpen ? 'open' : ''}`}
        id="searchPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Search All About Pawz"
      >
        <div className="container searchinner">
          <div className="searchhead">
            <a className="brand" href="#">
              <b>p</b>
              <span>
                all about <span>pawz.</span>
              </span>
            </a>
            <button
              className="close"
              id="searchClose"
              aria-label="Close search"
              onClick={closeSearch}
            >
              ×
            </button>
          </div>
          <h2>
            What are you
            <br />
            looking for?
          </h2>
          <form className="searchline" id="searchForm" onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              id="searchInput"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Products, care, questions…"
              aria-label="Search products, care, and questions"
            />
            <button className="icon" type="submit" aria-label="Submit search">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
          <div className="suggestions">
            {[
              'Dog grooming',
              'Cat essentials',
              'Start a triage',
              'Learning Academy',
            ].map((s) => (
              <button
                key={s}
                type="button"
                data-search={s}
                onClick={() => {
                  setSearchQuery(s);
                  searchInputRef.current?.focus();
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {searchResponse && (
            <div className="response show" id="searchResponse" aria-live="polite">
              {searchResponse}
            </div>
          )}
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div
        className={`toast ${toastVisible ? 'show' : ''}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </>
  );
}
