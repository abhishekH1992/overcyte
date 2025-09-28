"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import { PerformanceDemoItem } from "./performance-demo-item";
import { Pagination } from "./pagination";

// Deterministic pseudo-random number generator to avoid hydration mismatches
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate a large dataset with deterministic values
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is a description for item ${i}. It contains some text that makes each item unique.`,
    price: Math.floor(seededRandom(i) * 1000) + 10,
    category: `Category ${i % 10}`,
    tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`, `tag${(i + 2) % 5}`],
    inStock: seededRandom(i + 1000) > 0.3,
    rating: Math.floor(seededRandom(i + 2000) * 5) + 1,
  }));
};

const ITEMS = generateItems(5000); // 5000 items to cause performance issues

function PerformanceDemoListComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // This filter runs on every render - performance issue #1
  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesStock = !showInStockOnly || item.inStock;
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, selectedCategory, showInStockOnly]);

  // This sort runs on every render - performance issue #2
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [filteredItems, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Memoize categories generation
  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(ITEMS.map(item => item.category)))];
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls that cause re-renders */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">In stock only</span>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedItems.length)} of {sortedItems.length} items (Page {currentPage} of {totalPages})
        </div>
      </div>

      {/* The expensive list - now with pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedItems.map((item) => (
          <PerformanceDemoItem
            key={item.id}
            item={item}
            searchTerm={searchTerm}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasNext={currentPage < totalPages}
        hasPrev={currentPage > 1}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const PerformanceDemoList = memo(PerformanceDemoListComponent);