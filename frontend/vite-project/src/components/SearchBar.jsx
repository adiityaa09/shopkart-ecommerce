function SearchBar({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories = ["All Categories", "Electronics", "Fashion", "Books", "Home"],
    onClear
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            title="Clear search"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="w-full sm:w-56 shrink-0">
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full py-2.5 px-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-sm text-gray-800 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat === "All Categories" ? "" : cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters button if filters active */}
                {(searchTerm || (selectedCategory && selectedCategory !== "")) && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition border border-gray-200 whitespace-nowrap"
                    >
                        Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
