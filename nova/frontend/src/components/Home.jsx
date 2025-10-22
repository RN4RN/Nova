import React, { useEffect, useState } from "react";
import "./Home.css"; // Asegúrate de tener este archivo CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandshake, faMicrochip, faSyringe, faFlask, faEye, 
  faQuoteLeft, faStar, faBoxOpen, faBell, faChartLine, 
  faUsers, faGlobe, faLaptopMedical, faDollyFlatbed, faChartArea,
  faMobileAlt, faShoppingCart, faTruck
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const heroImages = [
    "/images/pharmaflow-corporate-1.jpg", // Reemplaza con imágenes corporativas y limpias
    "/images/pharmaflow-corporate-2.jpg",
    "/images/pharmaflow-corporate-3.jpg",
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="home-container">
      {/* Sección Hero - Minimalista y Corporativa */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImages[currentHeroImage]})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animate-fade-in-up">
            NovaSalud: <span className="text-accent-blue">Inteligencia</span> para la Farmacia Moderna
          </h1>
          <p className="subtitle animate-fade-in-up delay-200">
            Optimiza operaciones. Mejora la atención al paciente. Lidera el futuro.
          </p>
         
        </div>
      </section>

      {/* Sección Visión General del Dashboard */}
      <section className="dashboard-overview-section animate-fade-in">
        <h2 className="section-title">Dashboard Overview</h2>
        <div className="overview-content">
          <div className="overview-image slide-in-left">
            <img src="/images/botica1.jpg" alt="PharmaFlow Dashboard Mockup" />
          </div>
          <div className="overview-stats slide-in-right">
            <div className="stat-grid-small">
              <div className="stat-card-small">
                <FontAwesomeIcon icon={faBoxOpen} className="stat-icon-small" />
                <h3>Productos Activos</h3>
                <p className="stat-number-small">2,870</p>
              </div>
              <div className="stat-card-small">
                <FontAwesomeIcon icon={faBell} className="stat-icon-small" />
                <h3>Alertas Críticas</h3>
                <p className="stat-number-small warning">8</p>
              </div>
              <div className="stat-card-small">
                <FontAwesomeIcon icon={faChartLine} className="stat-icon-small" />
                <h3>Ventas Diarias</h3>
                <p className="stat-number-small success">$3,125.50</p>
              </div>
            </div>
            <div className="text-content">
              <h3>Gestión Intuitiva, Datos Precisos.</h3>
              <p>
                Nuestro dashboard centralizado te ofrece una visión 360° de tu farmacia. Desde el inventario en tiempo real hasta las tendencias de ventas, todo lo que necesitas para tomar decisiones estratégicas está a tu alcance, presentado de forma clara y accesible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Nuestra Visión */}
      <section className="vision-section-clean animate-fade-in delay-300">
        <h2 className="section-title">Nuestra Visión</h2>
        <div className="vision-grid">
          <div className="vision-card hover-subtle-lift">
            <FontAwesomeIcon icon={faEye} className="vision-icon" />
            <h3>Claridad y Transparencia</h3>
            <p>Empoderamos a las farmacias con herramientas que simplifican la complejidad.</p>
          </div>
          <div className="vision-card hover-subtle-lift">
            <FontAwesomeIcon icon={faGlobe} className="vision-icon" />
            <h3>Impacto Global</h3>
            <p>Facilitamos el acceso a la salud a través de la gestión eficiente.</p>
          </div>
          <div className="vision-card hover-subtle-lift">
            <FontAwesomeIcon icon={faLaptopMedical} className="vision-icon" />
            <h3>Innovación Continua</h3>
            <p>Nos adaptamos y evolucionamos con las necesidades del sector.</p>
          </div>
        </div>
      </section>

      {/* Sección de Características Clave */}
      <section className="features-section-clean animate-fade-in delay-400">
        <h2 className="section-title">Características Clave</h2>
        <div className="features-grid-clean">
          <div className="feature-item-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faDollyFlatbed} className="feature-icon-clean" />
            <h3>Control de Inventario Avanzado</h3>
            <p>Trazabilidad RFID, gestión de lotes y alertas proactivas para stock y caducidad.</p>
          </div>
          <div className="feature-item-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faChartArea} className="feature-icon-clean" />
            <h3>Analíticas Predictivas</h3>
            <p>Modelos de IA para pronóstico de demanda y optimización de precios.</p>
          </div>
          <div className="feature-item-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faMobileAlt} className="feature-icon-clean" />
            <h3>Plataforma Móvil Integrada</h3>
            <p>Acceso y gestión desde cualquier dispositivo, en cualquier momento.</p>
          </div>
          <div className="feature-item-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faShoppingCart} className="feature-icon-clean" />
            <h3>E-commerce y Fidelización</h3>
            <p>Crea una experiencia de compra online excepcional y retén a tus clientes.</p>
          </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section className="testimonials-section-clean animate-fade-in delay-500">
        <h2 className="section-title">Testimonios</h2>
        <div className="testimonials-grid-clean">
          <div className="testimonial-card-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon-clean" />
            <p>"La simplicidad y potencia de PharmaFlow son inigualables. Ha transformado nuestra gestión diaria."</p>
            <div className="testimonial-author-clean">
              <img src="/images/botica2.jpg" alt="Avatar Cliente 1" className="author-avatar-clean" />
              <div>
                <h4>Dr. Alejandro Vargas</h4>
                <p>Director, Farmacia Central</p>
              </div>
            </div>
            <div className="testimonial-rating-clean">
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
          <div className="testimonial-card-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon-clean" />
            <p>"El soporte es excepcional y la plataforma se integra perfectamente con nuestros sistemas existentes."</p>
            <div className="testimonial-author-clean">
              <img src="/images/botica3.jpg" alt="Avatar Cliente 2" className="author-avatar-clean" />
              <div>
                <h4>Lic. Valeria Mendoza</h4>
                <p>Gerente de Operaciones, Grupo Farma</p>
              </div>
            </div>
             <div className="testimonial-rating-clean">
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
          <div className="testimonial-card-clean hover-subtle-lift">
            <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon-clean" />
            <p>"Ahora tomamos decisiones basadas en datos sólidos, lo que ha impulsado nuestra rentabilidad."</p>
            <div className="testimonial-author-clean">
              <img src="/images/botica4.jpg" alt="Avatar Cliente 3" className="author-avatar-clean" />
              <div>
                <h4>Farm. Roberto Fuentes</h4>
                <p>Jefe de Farmacia, Hospital Regional</p>
              </div>
            </div>
             <div className="testimonial-rating-clean">
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} /><FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Galería de Soluciones / Casos de Uso (Diseño de tarjetas clean) */}
      <section className="solutions-gallery-section-clean animate-fade-in delay-600">
        <h2 className="section-title">Soluciones para tu Farmacia</h2>
        <p className="gallery-intro-clean">Explora cómo PharmaFlow puede optimizar cada aspecto de tu operación.</p>
        <div className="gallery-grid-clean">
          <div className="gallery-item-clean hover-subtle-lift">
            <img src="/images/botica5.png" alt="Gestión de Inventario" />
            <div className="gallery-content-clean">
              <h3>Gestión de Inventario</h3>
              <p>Control preciso y automatizado.</p>
            </div>
          </div>
          <div className="gallery-item-clean hover-subtle-lift">
            <img src="/images/botica6.png" alt="Analíticas de Ventas" />
            <div className="gallery-content-clean">
              <h3>Analíticas de Ventas</h3>
              <p>Reportes claros para decisiones inteligentes.</p>
            </div>
          </div>
          <div className="gallery-item-clean hover-subtle-lift">
            <img src="/images/botica7.jpg" alt="Atención al Cliente" />
            <div className="gallery-content-clean">
              <h3>Atención al Cliente</h3>
              <p>Fidelización y servicio excepcional.</p>
            </div>
          </div>
        
        </div>
      </section>

      {/* Call to Action Final - Minimalista */}
      <section className="cta-banner-clean animate-fade-in delay-700">
        <div className="cta-content-clean">
          <h2>¿Listo para <span className="text-accent-white">transformar</span> tu Farmacia?</h2>
          <p>Agenda una demostración personalizada con nuestros expertos.</p>
          <button className="cta-button">
            <FontAwesomeIcon icon={faHandshake} className="icon-left" /> ¡Agenda tu Demo!
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;