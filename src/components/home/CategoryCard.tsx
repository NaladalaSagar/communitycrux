
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
      className="block h-full rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-soft"
    >
      <div className="flex items-start gap-4">
        <div className={`inline-flex items-center justify-center rounded-lg p-2 ${category.color}`}>
          <CategoryIcon iconName={category.icon} />
        </div>
        <div>
          <h3 className="font-medium mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {category.description}
          </p>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{category.threadCount}</span> threads
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
