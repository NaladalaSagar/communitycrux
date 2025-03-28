
import { Link } from "react-router-dom";
import { Category } from "@/lib/mockData";
import CategoryIcon from "@/components/ui/CategoryIcon";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="block h-full rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-soft hover:translate-y-[-2px] group"
    >
      <div className="flex items-start gap-4">
        <div className={`inline-flex items-center justify-center rounded-lg p-2 ${category.color} transition-all duration-300 group-hover:scale-110`}>
          <CategoryIcon iconName={category.icon} />
        </div>
        <div>
          <h3 className="font-medium mb-1 group-hover:text-accent transition-colors">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {category.description}
          </p>
          <div className="text-xs text-muted-foreground flex items-center group-hover:opacity-80 transition-opacity">
            <span className="font-medium animate-pulse">{category.threadCount}</span>
            <span className="ml-1">threads</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
