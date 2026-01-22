import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce.hook";
import { Search, LogOut, User as UserIcon, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.hook";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // URL → state
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchTerm(query);
  }, [searchParams]);

  // state → URL (debounced)
  useEffect(() => {
    const currentQuery = searchParams.get("search") || "";

    if (debouncedSearchTerm === currentQuery) return;

    if (debouncedSearchTerm) {
      navigate(`/?search=${encodeURIComponent(debouncedSearchTerm)}`, {
        replace: true,
      });
    } else {
      navigate("/", { replace: true });
    }
  }, [debouncedSearchTerm, navigate, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">
                DevShare
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-lg w-full lg:max-w-xs"
            >
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="search"
                  placeholder="Search questions..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center ml-4 space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/ask"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Ask
                </Link>

                <div className="flex items-center gap-2 text-gray-700">
                  <UserIcon className="h-5 w-5" />
                  <span className="font-medium">{user?.username}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {user?.reputation} Rep
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
