import React from 'react';
import './ContactButtons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function ContactButtons() {
  return (
    <div className="contact-buttons">
      <a
        href="https://www.linkedin.com/in/paul-doherty-a4a383339/"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-button linkedin"
      >
        <FontAwesomeIcon icon={faLinkedin} size="2x" />
      </a>
      <a
        href="mailto:pauldoherty514@outlook.com"
        className="contact-button email"
      >
        <FontAwesomeIcon icon={faEnvelope} size="2x" />
      </a>
    </div>
  );
}

export default ContactButtons;