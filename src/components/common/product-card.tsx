import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { IProduct } from '../../interfaces/IProduct';

export const SkeletonCard: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => (
  <div className={`${viewMode === 'grid' ? 'space-y-4 p-4' : 'flex gap-4 p-4'} bg-white/5 rounded-xl border border-white/10 animate-pulse`}>
    <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-16 h-16 flex-shrink-0'} bg-white/10 rounded-lg`}></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-3 bg-white/10 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-white/10 rounded w-16"></div>
        <div className="h-6 bg-white/10 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const ProductCard: React.FC<{ 
  product: IProduct; 
  index: number; 
  viewMode: 'grid' | 'list';
  onNavigate: (productId: string) => void;
}> = React.memo(({ product, index, viewMode, onNavigate }) => (
  <div 
    className={`${viewMode === 'grid' ? 'space-y-4' : 'flex gap-4'} p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer`}
    onClick={() => onNavigate(product.product_id)}
  >
    <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-16 h-16 flex-shrink-0'} bg-white/5 rounded-lg overflow-hidden`}>
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/300x300/374151/9ca3af?text=No+Image';
        }}
      />
    </div>
    
    <div className="flex-1 flex flex-col justify-between min-h-0">
      <div>
        <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 leading-relaxed">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
            {product.source || 'Unknown'}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Star size={12} className="fill-current" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className="text-lg font-bold text-purple-400">
          Rp.{product.extracted_price ? product.extracted_price.toLocaleString('id-ID') : product.price}
        </span>
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Visit
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  </div>
));
