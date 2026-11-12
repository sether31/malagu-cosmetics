import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-[70vh]:h-screen min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-black tracking-widest text-primary font-serif mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-sm font-semibold tracking-wide text-white bg-primary rounded-md transition-colors hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;