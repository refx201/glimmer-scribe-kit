import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CompactProductCard } from '../CompactProductCard'

interface RelatedProduct {
  id: string
  name: string
  sale_price: number
  original_price: number
  discount: number
  image: string | null
}

interface RelatedProductsSectionProps {
  productId: string
  onNavigate?: (page: string, productId?: string) => void
}

export function RelatedProductsSection({ 
  productId, 
  onNavigate 
}: RelatedProductsSectionProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Get related product IDs
        const { data: relations, error: relationsError } = await supabase
          .from('related_products')
          .select('related_product_id')
          .eq('product_id', productId)
          .limit(4)

        if (relationsError) throw relationsError

        if (!relations || relations.length === 0) {
          setRelatedProducts([])
          setLoading(false)
          return
        }

        const relatedProductIds = relations.map(r => r.related_product_id)

        // Get the actual product details
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, sale_price, original_price, discount, image')
          .in('id', relatedProductIds)

        if (productsError) throw productsError

        setRelatedProducts(products || [])
      } catch (error) {
        console.error('Error fetching related products:', error)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [productId])

  if (loading) {
    return (
      <section className="py-8 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-8 bg-background/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">منتجات ذات صلة</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <CompactProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}