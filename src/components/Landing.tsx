import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              SHREEYANSH
              <br />
              <span>ASATI</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>AI/ML &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AI Engineer</div>
              <div className="landing-h2-2">ML Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Generative AI Engineer</div>
              <div className="landing-h2-info-1">Generative AI Engineer</div>
            </h2>
          </div>
          <div className="landing-tagline">
            <p>"Building logic-driven AI solutions with real-world impact"</p>
          </div>
          <div className="landing-cta">
            <a href="#work" className="landing-btn" data-cursor="disable">
              View Work
            </a>
            <a href="#contact" className="landing-btn landing-btn-secondary" data-cursor="disable">
              Contact Me
            </a>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
