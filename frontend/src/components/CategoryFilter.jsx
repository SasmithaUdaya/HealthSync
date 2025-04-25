import React from 'react';

const CategoryFilter = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <span className="text-secondary-orange font-bold">CATEGORIES</span>
        <button className="ml-2 bg-secondary-orange text-white px-4 py-2 rounded hover:bg-[#DB3535] transition">
          MORE CATEGORY
        </button>
      </div>
      <div>
        <span className="text-secondary-orange font-bold">SORT</span>
        <select className="ml-2 bg-secondary-orange text-white px-4 py-2 rounded hover:bg-[#DB3535] transition">
          <option value="default">Default</option>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );
};

export default CategoryFilter;