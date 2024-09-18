import PropTypes from "prop-types";
import NewArrivals from "../components/new-arrivals";
import Genres from "../components/genres";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

function Home({
  wishList,
  setWishList,
  isLogged,
  isloading,
  setSelectedGenres,
}) {
  return (
    <div className="bg-gradient-to-b from-purple-100 via-pink-100 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay loop muted className="absolute z-0 w-auto min-w-full min-h-full max-w-none">
          <source src="/assets/planner-video-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="z-10 text-center px-4">
          <h1 className="text-6xl font-extrabold text-black mb-6 leading-tight shadow-text">
            Elevate Your Planning Game
          </h1>
          <p className="text-2xl text-black mb-8 max-w-2xl mx-auto shadow-text">
            Discover our exquisite collection of digital planners designed to boost your productivity and creativity.
          </p>
          <Link to="/shop" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-300 inline-block text-xl">
            Explore Planners
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Featured Planners</h2>
          <NewArrivals
            isloading={isloading}
            isLogged={isLogged}
            setWishList={setWishList}
            wishList={wishList}
          />
        </div>
      </section>

      {/* Planner Types */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Explore Planner Types</h2>
          <Genres setSelectedGenres={setSelectedGenres} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add testimonial cards here */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Planning?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers and transform your planning experience today!</p>
          <Link to="/shop" className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 inline-block text-xl">
            Get Your Planner Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

Home.propTypes = {
  wishList: PropTypes.array,
  setWishList: PropTypes.func,
  isLogged: PropTypes.bool,
  isloading: PropTypes.bool,
  setSelectedGenres: PropTypes.func,
};
