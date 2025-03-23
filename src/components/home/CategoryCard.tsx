
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/mockData";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      to={`/category/${category.id}`}
      className="group"
    >
      <div className="h-full bg-card hover:bg-card/90 rounded-xl p-6 border border-border/50 transition-all duration-300 shadow-soft hover:shadow-medium overflow-hidden group-hover:translate-y-[-2px]">
        <div className="flex flex-col h-full">
          <div className={cn(
            "inline-flex self-start items-center justify-center rounded-lg p-2 mb-4",
            category.color
          )}>
            {category.icon}
          </div>
          
          <div className="space-y-2 mb-2 flex-grow">
            <h3 className="font-semibold text-lg tracking-tight group-hover:text-accent transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
          
          <div className="pt-4 mt-auto border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{category.threadCount}</span> threads
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
