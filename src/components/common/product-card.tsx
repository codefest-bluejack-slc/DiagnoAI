import React from 'react';
import { Star, ExternalLink, Eye } from 'lucide-react';
import { IProduct } from '../../interfaces/IProduct';

export const SkeletonCard: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => (
  <div
    className={`${
      viewMode === 'grid'
        ? 'p-6 border rounded-xl'
        : 'flex p-4 border rounded-lg'
    } animate-pulse`}
    style={{
      background: 'var(--background-glass)',
      borderColor: 'var(--border-default)',
    }}
  >
    <div
      className={`${
        viewMode === 'grid'
          ? 'aspect-square mb-4 rounded-lg bg-white/10'
          : 'w-20 h-20 rounded-lg bg-white/10 flex-shrink-0 mr-4'
      }`}
    ></div>
    
    <div className="flex-1 flex flex-col">
      <div className={`bg-white/10 rounded mb-2 ${viewMode === 'grid' ? 'h-4' : 'h-3'}`}></div>
      <div className={`bg-white/10 rounded mb-3 ${viewMode === 'grid' ? 'h-4 w-3/4' : 'h-3 w-1/2'}`}></div>
      
      <div className={`flex items-center ${viewMode === 'grid' ? 'justify-between mb-3' : 'gap-4 mb-2'}`}>
        <div className="bg-white/10 rounded-full h-6 w-16"></div>
        <div className="bg-white/10 rounded-full h-6 w-12"></div>
      </div>
      
      <div className={`mt-auto flex items-center ${viewMode === 'grid' ? 'justify-between gap-2' : 'gap-4'}`}>
        <div className="bg-white/10 rounded h-6 w-16"></div>
        <div className="flex gap-2">
          <div className="bg-white/10 rounded-full h-8 w-16"></div>
          <div className="bg-white/10 rounded-full h-8 w-16"></div>
        </div>
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
    className={`group relative ${
      viewMode === 'grid'
        ? 'p-6 border rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl'
        : 'flex p-4 border rounded-lg transition-all duration-200'
    }`}
    style={{
      background: 'var(--background-glass)',
      borderColor: 'var(--border-default)',
    }}
  >
    <div
      className={`${
        viewMode === 'grid'
          ? 'aspect-square mb-4 rounded-lg p-4 flex items-center justify-center overflow-hidden'
          : 'w-20 h-20 rounded-lg p-2 flex items-center justify-center overflow-hidden flex-shrink-0 mr-4'
      }`}
      style={{ background: 'var(--background-glass)' }}
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/300x300/1e293b/94a3b8?text=No+Image';
        }}
      />
    </div>

    <div className="flex-1 flex flex-col">
      <h3
        className={`text-white font-medium mb-2 group-hover:text-purple-200 transition-colors duration-200 ${
          viewMode === 'grid'
            ? 'line-clamp-2 text-sm leading-relaxed'
            : 'text-sm truncate'
        }`}
        title={product.title}
      >
        {product.title}
      </h3>

      <div
        className={`flex items-center ${viewMode === 'grid' ? 'justify-between mb-3' : 'gap-4 mb-2'}`}
      >
        <span
          className="text-purple-300/80 text-xs truncate px-2 py-1 rounded-full"
          style={{
            background: 'var(--primary-purple-100)',
          }}
        >
          {product.source || 'Unknown'}
        </span>
        {product.rating && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border"
            style={{
              background: 'var(--warning-yellow-100)',
              borderColor: 'var(--border-warning)',
            }}
          >
            <Star size={10} className="text-amber-400 fill-current" />
            <span className="text-amber-300 text-xs font-medium">
              {product.rating}
            </span>
          </div>
        )}
      </div>

      <div
        className={`mt-auto flex items-center ${viewMode === 'grid' ? 'justify-between gap-2' : 'gap-4'}`}
      >
        <p
          className="text-lg font-bold text-purple-300"
          style={{
            background:
              'linear-gradient(to right, var(--primary-purple-light), var(--secondary-pink-light))',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {product.price}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate(product.product_id)}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-full border"
            style={{
              background: 'var(--primary-purple-100)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <Eye size={12} />
            <span>Details</span>
          </button>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 text-sm font-medium px-3 py-1 rounded-full border"
            style={{
              background: 'var(--tertiary-indigo-100)',
              borderColor: 'var(--border-secondary)',
            }}
          >
            <span>Visit</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  </div>
));
