import { genres } from "../constants/genre";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Genres({ setSelectedGenres }) {
  const navigate = useNavigate();
  const handleClick = (item) => {
    setSelectedGenres(item);
    navigate("/shop");
  };
  return (
    <div className="container flex justify-around mb-12">
      {genres.map((genre) => (
        <div
          onClick={() => handleClick([genre])}
          key={genre.title}
          className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg text-gray-800 font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-opacity-80 mx-2"
        >
          {genre.title}
        </div>
      ))}
    </div>
  );
}
export default Genres;

Genres.propTypes = {
  selectedGenres: PropTypes.array,
  setSelectedGenres: PropTypes.func,
};
