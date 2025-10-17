import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export interface Brand {
  id: string
  name: string
  logo_url?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useBrands() {
  const queryClient = useQueryClient()
  
  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("display_order", { ascending: true })
      
      if (error) throw error
      return data?.map((brand: any) => ({
        ...brand,
        order_index: brand.display_order || 0,
        is_active: true,
        updated_at: brand.created_at
      })) || []
    },
  })

  const addBrand = async (brand: Omit<Brand, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .insert([brand])
        .select()
        .single()
      
      if (error) throw error
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      return { success: true, message: "Brand created successfully", data }
    } catch (error) {
      return { success: false, message: "Failed to create brand", error }
    }
  }

  const updateBrand = async ({ id, ...brand }: Partial<Brand> & { id: string }) => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .update(brand)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      return { success: true, message: "Brand updated successfully", data }
    } catch (error) {
      return { success: false, message: "Failed to update brand", error }
    }
  }

  const deleteBrand = async (id: string) => {
    try {
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", id)
      
      if (error) throw error
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      return { success: true, message: "Brand deleted successfully" }
    } catch (error) {
      return { success: false, message: "Failed to delete brand", error }
    }
  }

  const reorderBrands = async (brands: Brand[]) => {
    try {
      for (const brand of brands) {
        const { error } = await supabase
          .from("brands")
          .update({ display_order: brand.order_index })
          .eq("id", brand.id)
        
        if (error) throw error
      }
      
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      return { success: true, message: "Brands reordered successfully" }
    } catch (error) {
      return { success: false, message: "Failed to reorder brands", error }
    }
  }

  return {
    brands: brandsQuery.data || [],
    isLoading: brandsQuery.isLoading,
    error: brandsQuery.error,
    addBrand,
    updateBrand,
    deleteBrand,
    reorderBrands
  }
}

export function useCreateBrand() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (brand: Omit<Brand, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("brands")
        .insert([brand])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...brand }: Partial<Brand> & { id: string }) => {
      const { data, error } = await supabase
        .from("brands")
        .update(brand)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
    },
  })
}