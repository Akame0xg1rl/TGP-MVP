import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">That Girl Planner</h3>
            <p className="text-sm text-gray-600">Discover a world of stories, knowledge, and imagination.</p>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Home</Link></li>
              <li><Link to="/shop" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Shop</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Wishlist</Link></li>
              <li><Link to="/cards" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Cart</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <address className="text-sm text-gray-600 not-italic">
              <p className="mb-2">123 Bookstore Street</p>
              <p className="mb-2">City, State 12345</p>
              <p className="mb-2">Email: info@thatgirlplanner.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-medium mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 text-sm text-center text-gray-600">
          <p>&copy; 2023 That Girl Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
