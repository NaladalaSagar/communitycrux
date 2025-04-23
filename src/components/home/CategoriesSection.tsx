
import { Link } from "react-router-dom";
import CategoryCard from "@/components/home/CategoryCard";
import { categories } from "@/lib/mockData";

const CategoriesSection = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold animate-slide-in">Popular Categories</h2>
      <Link to="/categories" className="text-accent hover:underline flex items-center animate-slide-in" style={{ animationDelay: "0.1s" }}>
        View All Categories 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.slice(0, 6).map((category, i) => (
        <div key={category.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
          <CategoryCard category={category} />
        </div>
      ))}
    </div>
  </div>
);

export default CategoriesSection;
