import { Circles } from "react-loader-spinner";

function LoadingPlanner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Circles
        visible={true}
        height="120"
        width="120"
        ariaLabel="planner-loading"
        wrapperStyle={{}}
        wrapperClass="planner-loader-wrapper"
        color="#FF69B4"
        secondaryColor="#8A2BE2"
      />
      <p className="mt-4 text-lg font-semibold text-gray-600">Loading your planner...</p>
    </div>
  );
}

export default LoadingPlanner;
