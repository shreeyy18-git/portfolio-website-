import { MdEmail, MdArrowOutward } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-subtitle">
          Have a project, collaboration, or just want to connect? Feel free to
          reach out.
        </p>
        <div className="contact-links">
          <a
            href="mailto:shreeyanshasati0@gmail.com"
            className="contact-link"
            data-cursor="disable"
          >
            <span className="contact-link-icon">
              <MdEmail />
            </span>
            <span className="contact-link-text">
              shreeyanshasati0@gmail.com
            </span>
            <span className="contact-link-arrow">
              <MdArrowOutward />
            </span>
          </a>
          <a
            href="https://github.com/SHREEYANSHGIT"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            data-cursor="disable"
          >
            <span className="contact-link-icon">
              <FaGithub />
            </span>
            <span className="contact-link-text">github.com/SHREEYANSHGIT</span>
            <span className="contact-link-arrow">
              <MdArrowOutward />
            </span>
          </a>
          <a
            href="https://linkedin.com/in/shreeyansh-asati-18shreey"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            data-cursor="disable"
          >
            <span className="contact-link-icon">
              <FaLinkedinIn />
            </span>
            <span className="contact-link-text">
              linkedin.com/in/shreeyansh-asati-18shreey
            </span>
            <span className="contact-link-arrow">
              <MdArrowOutward />
            </span>
          </a>
        </div>
        <p className="contact-footer">
          Designed & Developed by <span>Shreeyansh Asati</span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
