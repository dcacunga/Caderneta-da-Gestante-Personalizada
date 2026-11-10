/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  CHECKOUT_URL,
  toggleFaqItem,
  calculateStickyCtaVisibility,
  isHeaderScrolled,
} from './utils/caderneta';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);

  // Scroll listener for header blur & mobile sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(isHeaderScrolled(y, 20));

      if (heroRef.current && finalCtaRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        const finalTop = finalCtaRef.current.getBoundingClientRect().top;
        setStickyVisible(
          calculateStickyCtaVisibility(y, heroHeight, finalTop, window.innerHeight)
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on resize > 900px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile nav on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Reveal animations via IntersectionObserver
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(() => {
              el.classList.add('is-visible');
              el.setAttribute('data-visible', 'true');
            }, delay);
            observer.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      reveals.forEach((el) => {
        el.classList.add('is-visible');
        el.setAttribute('data-visible', 'true');
      });
    }
  }, []);

  // Handle initial hash navigation if opened with #historia or similar
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const handleFaqClick = (id: string) => {
    setOpenFaq((current) => toggleFaqItem(current, id));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="caderneta-app">
      {/* Sprite SVG */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.9 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.7 1.1-1.6 2.7-2.7 4.7-2.7 3.4 0 5.6 3.3 4.5 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"
          />
        </symbol>
        <symbol id="i-calendar" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
            <path d="M8 3v4M16 3v4M3.5 10h17" />
            <path d="M12 17.2s-2.6-1.6-2.6-3.2c0-.9.7-1.5 1.4-1.5.6 0 1 .3 1.2.8.2-.5.6-.8 1.2-.8.7 0 1.4.6 1.4 1.5 0 1.6-2.6 3.2-2.6 3.2z" />
          </g>
        </symbol>
        <symbol id="i-pregnant" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="4.2" r="2.2" />
            <path d="M10 7.5c-1.6.6-2.5 2.2-2.5 4v2.5M10.5 7.5c1.2.3 2 1.2 2.3 2.4 2.7.4 4.7 2.6 4.7 5.2 0 2.4-1.8 4.3-4.3 4.6M9.5 14v7M12 19.7V21" />
          </g>
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            d="M12 3.5l2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L12 16.3 6.9 19.1 8 13.4 3.8 9.5l5.7-.7L12 3.5z"
          />
        </symbol>
        <symbol id="i-book" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" />
            <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
            <path d="M12 13.5s-3-1.8-3-3.7c0-1 .8-1.8 1.7-1.8.6 0 1.1.4 1.3.9.2-.5.7-.9 1.3-.9.9 0 1.7.8 1.7 1.8 0 1.9-3 3.7-3 3.7z" />
          </g>
        </symbol>
        <symbol id="i-pen" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.5 4.5l4 4L9 19l-5 1 1-5L15.5 4.5z" />
            <path d="M13.5 6.5l4 4" />
          </g>
        </symbol>
        <symbol id="i-gift" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
            <path d="M5 12.5v8h14v-8M12 8.5v12" />
            <path d="M12 8.5c-1.5-3.5-5-4-5-1.7 0 1.7 3 1.7 5 1.7zM12 8.5c1.5-3.5 5-4 5-1.7 0 1.7-3 1.7-5 1.7z" />
          </g>
        </symbol>
        <symbol id="i-baby" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M9 11h.01M15 11h.01" />
            <path d="M9.5 15c1.4 1.2 3.6 1.2 5 0" />
            <path d="M12 3.5c-1 1.3-.6 2.8.8 3" />
          </g>
        </symbol>
        <symbol id="i-sparkle" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"
          />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12.5l4.5 4.5L19 7.5"
          />
        </symbol>
        <symbol id="i-family" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7.5" cy="5.5" r="2" />
            <circle cx="16.5" cy="5.5" r="2" />
            <circle cx="12" cy="12.5" r="1.6" />
            <path d="M4.5 20v-6.5a3 3 0 0 1 6 0M13.5 13.5a3 3 0 0 1 6 0V20M10 20v-2.5a2 2 0 0 1 4 0V20" />
          </g>
        </symbol>
        <symbol id="i-leaf" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21V8" />
            <path d="M12 12c-3.5 0-5.5-2.2-5.5-5.5 3.3 0 5.5 2 5.5 5.5zM12 9c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5zM12 16.5c3.3 0 5.5-2 5.5-5.2-3.3 0-5.5 1.9-5.5 5.2z" />
          </g>
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M12 5v14M5 12h14" />
        </symbol>
      </svg>

      <a className="skip-link" href="#conteudo">
        Saltar para o conteúdo
      </a>

      {/* ===================== CABEÇALHO ===================== */}
      <header
        className={`site-header ${scrolled ? 'is-scrolled' : ''} ${
          menuOpen ? 'menu-open' : ''
        }`}
        id="topo"
      >
        <div className="container header-inner">
          <a className="brand" href="#topo" aria-label="Caderneta da Gestante Personalizada — início">
            <svg className="brand-icon" aria-hidden="true">
              <use href="#i-heart" />
            </svg>
            <span>
              Caderneta <em>da Gestante</em>
            </span>
          </a>
          <nav
            className={`main-nav ${menuOpen ? 'is-open' : ''}`}
            id="main-nav"
            aria-label="Navegação principal"
          >
            <a href="#historia" onClick={handleNavClick}>
              A história
            </a>
            <a href="#conteudo-caderneta" onClick={handleNavClick}>
              O que inclui
            </a>
            <a href="#para-quem" onClick={handleNavClick}>
              Para quem
            </a>
            <a href="#faq" onClick={handleNavClick}>
              Perguntas
            </a>
            <a
              className="btn btn-small js-checkout"
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
            >
              Comprar
            </a>
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main id="conteudo">
        {/* ===================== 1. HERO ===================== */}
        <section className="hero" ref={heroRef} aria-labelledby="hero-title">
          <div className="blob blob-pink" aria-hidden="true"></div>
          <div className="blob blob-sage" aria-hidden="true"></div>
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-sparkle" />
                </svg>{' '}
                Caderneta da Gestante Personalizada
              </p>
              <h1 id="hero-title">
                A tua gravidez merece ser <span className="accent">recordada</span> para sempre!
              </h1>
              <p className="lead">
                Guarda os momentos mais especiais da tua gestação com a Caderneta da Gestante Personalizada.
                Regista as tuas consultas, acompanha cada etapa e transforma esta jornada numa recordação
                inesquecível.
              </p>
              <ul className="hero-benefits">
                <li>
                  <span className="tick">
                    <svg aria-hidden="true">
                      <use href="#i-heart" />
                    </svg>
                  </span>
                  Regista os momentos importantes da gravidez.
                </li>
                <li>
                  <span className="tick">
                    <svg aria-hidden="true">
                      <use href="#i-calendar" />
                    </svg>
                  </span>
                  Organiza as informações da tua gestação.
                </li>
                <li>
                  <span className="tick">
                    <svg aria-hidden="true">
                      <use href="#i-baby" />
                    </svg>
                  </span>
                  Cria uma recordação especial para partilhar com o teu bebé no futuro.
                </li>
              </ul>
              <div className="hero-actions">
                <a
                  className="btn btn-primary js-checkout"
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quero a minha caderneta
                  <svg aria-hidden="true">
                    <use href="#i-heart" />
                  </svg>
                </a>
                <a className="link-soft" href="#conteudo-caderneta">
                  Ver o que inclui ↓
                </a>
              </div>
            </div>
            <div className="hero-visual reveal" data-delay="150">
              <div className="hero-frame">
                <img
                  src="/images/hero.png"
                  width="928"
                  height="1152"
                  alt="Mulher grávida sorridente, sentada num sofá acolhedor, com a mão na barriga e uma caderneta rosa com um coração dourado na capa"
                  fetchPriority="high"
                />
              </div>
              <div className="float-card float-card-a" aria-hidden="true">
                <svg>
                  <use href="#i-calendar" />
                </svg>
                <div>
                  <strong>Consultas</strong>
                  <span>sempre organizadas</span>
                </div>
              </div>
              <div className="float-card float-card-b" aria-hidden="true">
                <svg>
                  <use href="#i-heart" />
                </svg>
                <div>
                  <strong>Memórias</strong>
                  <span>para toda a vida</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2. SECÇÃO EMOCIONAL ===================== */}
        <section className="section story" id="historia" aria-labelledby="story-title">
          <div className="container story-grid">
            <div className="story-visual reveal">
              <figure className="story-main">
                <img
                  src="/images/emotional.png"
                  width="1200"
                  height="896"
                  loading="lazy"
                  decoding="async"
                  alt="Caderneta aberta sobre uma mesa de madeira, com fotografias de ecografias, meias de bebé em tricô e ramos de eucalipto"
                />
              </figure>
              <figure className="story-small">
                <img
                  src="/images/mother-baby.png"
                  width="928"
                  height="1152"
                  loading="lazy"
                  decoding="async"
                  alt="Mãe a segurar com ternura o seu bebé recém-nascido envolto numa manta clara"
                />
              </figure>
            </div>
            <div className="story-copy reveal" data-delay="120">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-leaf" />
                </svg>{' '}
                Uma jornada única
              </p>
              <h2 id="story-title">Cada momento da tua gravidez conta uma história.</h2>
              <p>
                Desde a descoberta da gravidez até à chegada do teu bebé, existem momentos que merecem ser
                guardados com carinho. A Caderneta da Gestante Personalizada foi pensada para te ajudar a
                organizar e recordar esta fase tão especial da tua vida.
              </p>
              <div className="timeline" aria-label="Etapas da jornada">
                <span>
                  <svg aria-hidden="true">
                    <use href="#i-sparkle" />
                  </svg>
                  A descoberta
                </span>
                <span>
                  <svg aria-hidden="true">
                    <use href="#i-calendar" />
                  </svg>
                  As consultas
                </span>
                <span>
                  <svg aria-hidden="true">
                    <use href="#i-heart" />
                  </svg>
                  Os primeiros pontapés
                </span>
                <span>
                  <svg aria-hidden="true">
                    <use href="#i-baby" />
                  </svg>
                  A chegada
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3. O QUE VAIS ENCONTRAR ===================== */}
        <section className="section features" id="conteudo-caderneta" aria-labelledby="features-title">
          <div className="container">
            <header className="section-head reveal">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-book" />
                </svg>{' '}
                Dentro da caderneta
              </p>
              <h2 id="features-title">O que vais encontrar</h2>
              <p>Um espaço pensado ao pormenor para acompanhares a tua gestação com organização e carinho.</p>
            </header>
            <div className="card-grid card-grid-5">
              <article className="card feature-card reveal">
                <span className="icon-bubble">
                  <svg aria-hidden="true">
                    <use href="#i-pregnant" />
                  </svg>
                </span>
                <h3>Acompanhamento da gravidez</h3>
                <p>Espaço para registar informações importantes de cada etapa.</p>
              </article>
              <article className="card feature-card reveal" data-delay="80">
                <span className="icon-bubble">
                  <svg aria-hidden="true">
                    <use href="#i-calendar" />
                  </svg>
                </span>
                <h3>Consultas pré-natais</h3>
                <p>Organização das datas e das informações das consultas.</p>
              </article>
              <article className="card feature-card reveal" data-delay="160">
                <span className="icon-bubble">
                  <svg aria-hidden="true">
                    <use href="#i-star" />
                  </svg>
                </span>
                <h3>Registo de momentos especiais</h3>
                <p>Espaço para recordar acontecimentos marcantes.</p>
              </article>
              <article className="card feature-card reveal" data-delay="240">
                <span className="icon-bubble">
                  <svg aria-hidden="true">
                    <use href="#i-heart" />
                  </svg>
                </span>
                <h3>Memórias da gestação</h3>
                <p>Possibilidade de guardar recordações da jornada.</p>
              </article>
              <article className="card feature-card reveal" data-delay="320">
                <span className="icon-bubble">
                  <svg aria-hidden="true">
                    <use href="#i-pen" />
                  </svg>
                </span>
                <h3>Personalização</h3>
                <p>Apresentação personalizada, de acordo com as opções disponibilizadas no momento da compra.</p>
              </article>
            </div>
            <p className="disclaimer reveal">
              <svg aria-hidden="true">
                <use href="#i-leaf" />
              </svg>
              A caderneta é um recurso de organização e recordação e não substitui o acompanhamento médico.
            </p>
          </div>
        </section>

        {/* ===================== 4. PARA QUEM É ===================== */}
        <section className="section audience" id="para-quem" aria-labelledby="audience-title">
          <div className="container">
            <header className="section-head reveal">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-family" />
                </svg>{' '}
                Feita a pensar em ti
              </p>
              <h2 id="audience-title">Para quem é esta caderneta?</h2>
            </header>
            <div className="card-grid card-grid-4">
              <article className="card audience-card reveal">
                <span className="num">01</span>
                <svg className="audience-icon" aria-hidden="true">
                  <use href="#i-sparkle" />
                </svg>
                <p>
                  Para mulheres que <strong>descobriram recentemente</strong> que estão grávidas.
                </p>
              </article>
              <article className="card audience-card reveal" data-delay="80">
                <span className="num">02</span>
                <svg className="audience-icon" aria-hidden="true">
                  <use href="#i-calendar" />
                </svg>
                <p>
                  Para futuras mamãs que querem <strong>organizar a informação</strong> da gestação.
                </p>
              </article>
              <article className="card audience-card reveal" data-delay="160">
                <span className="num">03</span>
                <svg className="audience-icon" aria-hidden="true">
                  <use href="#i-heart" />
                </svg>
                <p>
                  Para mulheres que desejam <strong>guardar recordações</strong> da gravidez.
                </p>
              </article>
              <article className="card audience-card reveal" data-delay="240">
                <span className="num">04</span>
                <svg className="audience-icon" aria-hidden="true">
                  <use href="#i-gift" />
                </svg>
                <p>
                  Para quem procura um <strong>presente delicado e significativo</strong> para uma futura mamã.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== 5. BENEFÍCIOS EMOCIONAIS ===================== */}
        <section className="section benefits" aria-labelledby="benefits-title">
          <div className="container benefits-inner">
            <header className="section-head reveal">
              <p className="eyebrow eyebrow-light">
                <svg aria-hidden="true">
                  <use href="#i-heart" />
                </svg>{' '}
                Para sempre
              </p>
              <h2 id="benefits-title">Mais do que uma caderneta, uma recordação para toda a vida.</h2>
            </header>
            <ul className="benefit-list">
              <li className="reveal">
                <span className="check">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                </span>
                Guarda as memórias da tua gravidez.
              </li>
              <li className="reveal" data-delay="80">
                <span className="check">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                </span>
                Mantém as informações importantes organizadas.
              </li>
              <li className="reveal" data-delay="160">
                <span className="check">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                </span>
                Recorda a evolução desta fase especial.
              </li>
              <li className="reveal" data-delay="240">
                <span className="check">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                </span>
                Cria uma lembrança que poderás revisitar com o teu filho ou a tua filha no futuro.
              </li>
            </ul>
          </div>
        </section>

        {/* ===================== 6. APRESENTAÇÃO DO PRODUTO ===================== */}
        <section className="section product" id="caderneta" aria-labelledby="product-title">
          <div className="container product-grid">
            <figure className="product-visual reveal">
              <img
                src="/images/product.png"
                width="1200"
                height="896"
                loading="lazy"
                decoding="async"
                alt="Caderneta da Gestante Personalizada com capa em linho rosa e ilustração dourada de uma futura mamã, rodeada de flores secas e eucalipto"
              />
            </figure>
            <div className="product-copy reveal" data-delay="120">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-book" />
                </svg>{' '}
                Caderneta da Gestante Personalizada
              </p>
              <h2 id="product-title">A tua história merece um lugar especial.</h2>
              <p>
                Prepara-te para viver e registar a tua gravidez de uma forma ainda mais organizada e
                significativa. Dá a cada momento o carinho que ele merece.
              </p>

              <ul className="mini-list">
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Acompanhamento de cada etapa
                </li>
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Consultas pré-natais organizadas
                </li>
                <li>
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  Momentos e memórias da gestação
                </li>
              </ul>

              <a
                className="btn btn-primary js-checkout"
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero a minha caderneta
                <svg aria-hidden="true">
                  <use href="#i-heart" />
                </svg>
              </a>
              <p className="secure-note">
                Serás encaminhada para a página de pagamento, onde podes consultar todos os detalhes da compra.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 7. FAQ ===================== */}
        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="container faq-inner">
            <header className="section-head reveal">
              <p className="eyebrow">
                <svg aria-hidden="true">
                  <use href="#i-leaf" />
                </svg>{' '}
                Dúvidas
              </p>
              <h2 id="faq-title">Perguntas frequentes</h2>
            </header>
            <div className="faq-list">
              <div className={`faq-item reveal ${openFaq === 'faq-1' ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === 'faq-1'}
                    aria-controls="faq-a1"
                    id="faq-q1"
                    onClick={() => handleFaqClick('faq-1')}
                  >
                    O que é a Caderneta da Gestante Personalizada?
                    <svg aria-hidden="true">
                      <use href="#i-plus" />
                    </svg>
                  </button>
                </h3>
                <div className="faq-a" id="faq-a1" role="region" aria-labelledby="faq-q1">
                  <div>
                    <p>
                      É um produto concebido para ajudar a futura mamã a registar e organizar informações e
                      recordações da gravidez.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`faq-item reveal ${openFaq === 'faq-2' ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === 'faq-2'}
                    aria-controls="faq-a2"
                    id="faq-q2"
                    onClick={() => handleFaqClick('faq-2')}
                  >
                    Como posso adquirir a minha caderneta?
                    <svg aria-hidden="true">
                      <use href="#i-plus" />
                    </svg>
                  </button>
                </h3>
                <div className="faq-a" id="faq-a2" role="region" aria-labelledby="faq-q2">
                  <div>
                    <p>
                      Clica num dos botões de compra da página para aceder ao checkout e segue as instruções
                      apresentadas.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`faq-item reveal ${openFaq === 'faq-3' ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === 'faq-3'}
                    aria-controls="faq-a3"
                    id="faq-q3"
                    onClick={() => handleFaqClick('faq-3')}
                  >
                    Como recebo o produto?
                    <svg aria-hidden="true">
                      <use href="#i-plus" />
                    </svg>
                  </button>
                </h3>
                <div className="faq-a" id="faq-a3" role="region" aria-labelledby="faq-q3">
                  <div>
                    <p>
                      A forma de entrega é indicada na página de pagamento (checkout). Antes de concluíres a
                      compra, consulta aí todas as informações sobre como e quando vais receber a tua caderneta.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`faq-item reveal ${openFaq === 'faq-4' ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === 'faq-4'}
                    aria-controls="faq-a4"
                    id="faq-q4"
                    onClick={() => handleFaqClick('faq-4')}
                  >
                    A caderneta substitui as consultas pré-natais?
                    <svg aria-hidden="true">
                      <use href="#i-plus" />
                    </svg>
                  </button>
                </h3>
                <div className="faq-a" id="faq-a4" role="region" aria-labelledby="faq-q4">
                  <div>
                    <p>
                      Não. A caderneta é um recurso complementar de organização e recordação. O acompanhamento
                      da gravidez deve ser feito por profissionais de saúde.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`faq-item reveal ${openFaq === 'faq-5' ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={openFaq === 'faq-5'}
                    aria-controls="faq-a5"
                    id="faq-q5"
                    onClick={() => handleFaqClick('faq-5')}
                  >
                    Como funciona a personalização?
                    <svg aria-hidden="true">
                      <use href="#i-plus" />
                    </svg>
                  </button>
                </h3>
                <div className="faq-a" id="faq-a5" role="region" aria-labelledby="faq-q5">
                  <div>
                    <p>
                      As opções de personalização disponíveis são as indicadas pelo vendedor no processo de
                      compra. Consulta os detalhes apresentados no checkout antes de finalizares a tua encomenda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 8. CHAMADA FINAL ===================== */}
        <section className="final-cta" ref={finalCtaRef} aria-labelledby="cta-title">
          <svg className="deco deco-1" aria-hidden="true">
            <use href="#i-heart" />
          </svg>
          <svg className="deco deco-2" aria-hidden="true">
            <use href="#i-leaf" />
          </svg>
          <svg className="deco deco-3" aria-hidden="true">
            <use href="#i-sparkle" />
          </svg>
          <svg className="deco deco-4" aria-hidden="true">
            <use href="#i-leaf" />
          </svg>
          <svg className="deco deco-5" aria-hidden="true">
            <use href="#i-sparkle" />
          </svg>
          <div className="container final-inner reveal">
            <span className="final-badge">
              <svg aria-hidden="true">
                <use href="#i-heart" />
              </svg>
            </span>
            <h2 id="cta-title">Mamã, começa hoje a guardar as memórias da tua gravidez!</h2>
            <p>Cada etapa é única. Organiza os teus registos e transforma esta jornada numa recordação especial.</p>
            <a
              className="btn btn-primary btn-large js-checkout"
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero a minha caderneta
              <svg aria-hidden="true">
                <use href="#i-heart" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      {/* ===================== RODAPÉ ===================== */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand" href="#topo">
            <svg className="brand-icon" aria-hidden="true">
              <use href="#i-heart" />
            </svg>
            <span>
              Caderneta <em>da Gestante</em>
            </span>
          </a>
          <p className="footer-note">
            A Caderneta da Gestante Personalizada é um recurso de organização e recordação e não substitui o
            acompanhamento por profissionais de saúde.
          </p>
          <p className="copy">
            © <span id="year">{currentYear}</span> Caderneta da Gestante Personalizada. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão de compra fixo (telemóvel) */}
      <div className={`sticky-cta ${stickyVisible ? 'is-visible' : ''}`} aria-hidden={!stickyVisible}>
        <a
          className="btn btn-primary js-checkout"
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={stickyVisible ? 0 : -1}
        >
          Quero a minha caderneta
        </a>
      </div>
    </div>
  );
}
