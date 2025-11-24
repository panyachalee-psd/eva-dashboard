export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-7xl font-extrabold text-gray-700 animate-pulse">
        404
      </h1>

      <p className="text-xl mt-4 text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>

      <p className="text-gray-500 mt-1">
        It might have been moved or deleted.
      </p>

      {/* <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </a> */}
    </div>
  );
}
