export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accessory_descriptions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessory_descriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sections: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          order_index: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          order_index?: number | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          order_index?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          product_id: string
          quantity: number
          session_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          session_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_levels: {
        Row: {
          calculation: string
          category: string
          color: string
          commission: string
          created_at: string | null
          display_order: number | null
          examples: string
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          calculation: string
          category: string
          color?: string
          commission: string
          created_at?: string | null
          display_order?: number | null
          examples: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          calculation?: string
          category?: string
          color?: string
          commission?: string
          created_at?: string | null
          display_order?: number | null
          examples?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          archived: boolean
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string
          read_at: string | null
          status: string
          subject: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          message: string
          name: string
          phone: string
          read_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string
          read_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      custom_colors: {
        Row: {
          created_at: string | null
          display_name: string
          hex: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          hex: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          hex?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      device_evaluation_requests: {
        Row: {
          accessories: string[] | null
          brand: string
          condition: string
          created_at: string
          customer_email: string | null
          customer_location: string | null
          customer_name: string
          customer_phone: string
          description: string | null
          id: string
          model: string
          status: string
          storage: string
        }
        Insert: {
          accessories?: string[] | null
          brand: string
          condition: string
          created_at?: string
          customer_email?: string | null
          customer_location?: string | null
          customer_name: string
          customer_phone: string
          description?: string | null
          id?: string
          model: string
          status?: string
          storage: string
        }
        Update: {
          accessories?: string[] | null
          brand?: string
          condition?: string
          created_at?: string
          customer_email?: string | null
          customer_location?: string | null
          customer_name?: string
          customer_phone?: string
          description?: string | null
          id?: string
          model?: string
          status?: string
          storage?: string
        }
        Relationships: []
      }
      device_repair_requests: {
        Row: {
          created_at: string
          customer_name: string
          device_type: string
          estimated_cost: number | null
          id: string
          issue_description: string
          notes: string | null
          phone_number: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          device_type: string
          estimated_cost?: number | null
          id?: string
          issue_description: string
          notes?: string | null
          phone_number: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          device_type?: string
          estimated_cost?: number | null
          id?: string
          issue_description?: string
          notes?: string | null
          phone_number?: string
          status?: string
        }
        Relationships: []
      }
      email_broadcast_recipients: {
        Row: {
          broadcast_id: string | null
          created_at: string | null
          email: string
          id: string
          sent_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          broadcast_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          broadcast_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_broadcast_recipients_broadcast_id_fkey"
            columns: ["broadcast_id"]
            isOneToOne: false
            referencedRelation: "email_broadcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_broadcasts: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          message: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      join_requests: {
        Row: {
          created_at: string
          experience: string
          full_name: string
          help_description: string
          id: string
          phone_number: string
        }
        Insert: {
          created_at?: string
          experience: string
          full_name: string
          help_description: string
          id?: string
          phone_number: string
        }
        Update: {
          created_at?: string
          experience?: string
          full_name?: string
          help_description?: string
          id?: string
          phone_number?: string
        }
        Relationships: []
      }
      kv_store_69a0f51b: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_a2b37f49: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      maintenance_services: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          features: Json | null
          id: string
          image: string
          is_active: boolean | null
          is_popular: boolean | null
          price: string
          rating: number | null
          reviews: number | null
          time: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          features?: Json | null
          id?: string
          image: string
          is_active?: boolean | null
          is_popular?: boolean | null
          price: string
          rating?: number | null
          reviews?: number | null
          time?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          features?: Json | null
          id?: string
          image?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          price?: string
          rating?: number | null
          reviews?: number | null
          time?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          location: string
          name: string
          rating: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          rating?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      movie_website_access: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      news_ticker_items: {
        Row: {
          created_at: string
          description: string
          duration: number | null
          id: string
          image: string | null
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          duration?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          additional_details: string | null
          address: string
          created_at: string | null
          customer_name: string
          id: string
          items: Json | null
          order_number: string | null
          payment_method_id: string | null
          payment_status: string | null
          phone_number: string
          product_id: string | null
          promo_code: string | null
          quantity: number
          status: string | null
          total_price: number
        }
        Insert: {
          additional_details?: string | null
          address: string
          created_at?: string | null
          customer_name: string
          id?: string
          items?: Json | null
          order_number?: string | null
          payment_method_id?: string | null
          payment_status?: string | null
          phone_number: string
          product_id?: string | null
          promo_code?: string | null
          quantity?: number
          status?: string | null
          total_price: number
        }
        Update: {
          additional_details?: string | null
          address?: string
          created_at?: string | null
          customer_name?: string
          id?: string
          items?: Json | null
          order_number?: string | null
          payment_method_id?: string | null
          payment_status?: string | null
          phone_number?: string
          product_id?: string | null
          promo_code?: string | null
          quantity?: number
          status?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_fkey"
            columns: ["promo_code"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      package_products: {
        Row: {
          created_at: string | null
          id: string
          package_id: string
          product_id: string
          selected_color: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          package_id: string
          product_id: string
          selected_color?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          package_id?: string
          product_id?: string
          selected_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_products_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          description: string | null
          discount: number
          featured_order: number | null
          id: string
          image: string | null
          is_featured: boolean | null
          is_hot_sale: boolean | null
          name: string
          original_price: number
          sale_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount?: number
          featured_order?: number | null
          id: string
          image?: string | null
          is_featured?: boolean | null
          is_hot_sale?: boolean | null
          name: string
          original_price: number
          sale_price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount?: number
          featured_order?: number | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          is_hot_sale?: boolean | null
          name?: string
          original_price?: number
          sale_price?: number
        }
        Relationships: []
      }
      partner_success_stories: {
        Row: {
          created_at: string | null
          date: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          partner_image: string | null
          partner_name: string
          partner_role: string
          rating: number | null
          revenue: string
          revenue_label: string
          testimonial: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          partner_image?: string | null
          partner_name: string
          partner_role: string
          rating?: number | null
          revenue: string
          revenue_label: string
          testimonial: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          partner_image?: string | null
          partner_name?: string
          partner_role?: string
          rating?: number | null
          revenue?: string
          revenue_label?: string
          testimonial?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_method_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          api_credentials: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          merchant_id: string | null
          name: string
          terminal_id: string | null
          type: string
        }
        Insert: {
          api_credentials?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          merchant_id?: string | null
          name: string
          terminal_id?: string | null
          type: string
        }
        Update: {
          api_credentials?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          merchant_id?: string | null
          name?: string
          terminal_id?: string | null
          type?: string
        }
        Relationships: []
      }
      product_filter_categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_photos: {
        Row: {
          created_at: string
          id: string
          photo_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_photos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_photos: string[] | null
          brand_id: string | null
          colors: Json | null
          created_at: string | null
          discount: number
          featured_order: number | null
          filter_category_id: string | null
          id: string
          image: string | null
          is_featured: boolean | null
          is_hot_sale: boolean | null
          name: string
          original_price: number
          sale_price: number
          specifications: Json | null
          type: string
        }
        Insert: {
          additional_photos?: string[] | null
          brand_id?: string | null
          colors?: Json | null
          created_at?: string | null
          discount?: number
          featured_order?: number | null
          filter_category_id?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          is_hot_sale?: boolean | null
          name: string
          original_price: number
          sale_price: number
          specifications?: Json | null
          type?: string
        }
        Update: {
          additional_photos?: string[] | null
          brand_id?: string | null
          colors?: Json | null
          created_at?: string | null
          discount?: number
          featured_order?: number | null
          filter_category_id?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          is_hot_sale?: boolean | null
          name?: string
          original_price?: number
          sale_price?: number
          specifications?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_filter_category_id_fkey"
            columns: ["filter_category_id"]
            isOneToOne: false
            referencedRelation: "product_filter_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          phone_number: string | null
          phone_verified: boolean | null
          shipping_address: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          shipping_address?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          shipping_address?: string | null
        }
        Relationships: []
      }
      promo_code_brand_discounts: {
        Row: {
          brand_id: string
          created_at: string | null
          discount_percentage: number
          id: string
          profit_percentage: number
          promo_code_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          discount_percentage: number
          id?: string
          profit_percentage?: number
          promo_code_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          discount_percentage?: number
          id?: string
          profit_percentage?: number
          promo_code_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_brand_discounts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_brand_discounts_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_package_discounts: {
        Row: {
          created_at: string | null
          discount_percentage: number
          id: string
          package_id: string
          profit_percentage: number | null
          promo_code_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage: number
          id?: string
          package_id: string
          profit_percentage?: number | null
          promo_code_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          id?: string
          package_id?: string
          profit_percentage?: number | null
          promo_code_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_package_discounts_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_package_discounts_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          discount_percentage: number
          id: string
          is_active: boolean
          profit_percentage: number
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_percentage: number
          id?: string
          is_active?: boolean
          profit_percentage?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_percentage?: number
          id?: string
          is_active?: boolean
          profit_percentage?: number
        }
        Relationships: []
      }
      realtime_presence: {
        Row: {
          created_at: string | null
          current_page: string | null
          id: string
          last_seen_at: string
          location: string | null
        }
        Insert: {
          created_at?: string | null
          current_page?: string | null
          id?: string
          last_seen_at: string
          location?: string | null
        }
        Update: {
          created_at?: string | null
          current_page?: string | null
          id?: string
          last_seen_at?: string
          location?: string | null
        }
        Relationships: []
      }
      related_products: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          related_product_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          related_product_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          related_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_codes: {
        Row: {
          code: string
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          discounted_price: number
          id: string
          is_used: boolean | null
          original_price: number
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discounted_price: number
          id?: string
          is_used?: boolean | null
          original_price: number
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discounted_price?: number
          id?: string
          is_used?: boolean | null
          original_price?: number
          used_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          product_id: string
          rating: number
          reviewer_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id: string
          rating: number
          reviewer_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id?: string
          rating?: number
          reviewer_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      section_products: {
        Row: {
          created_at: string | null
          id: string
          order_index: number | null
          product_id: string | null
          section_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          section_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_index?: number | null
          product_id?: string | null
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_products_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "admin_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          description: string | null
          device_info: string | null
          id: string
          service_type: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          description?: string | null
          device_info?: string | null
          id?: string
          service_type: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          description?: string | null
          device_info?: string | null
          id?: string
          service_type?: string
          status?: string
        }
        Relationships: []
      }
      sliding_photos: {
        Row: {
          button1_link: string | null
          button1_text: string | null
          button2_link: string | null
          button2_text: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          link: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button1_link?: string | null
          button1_text?: string | null
          button2_link?: string | null
          button2_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button1_link?: string | null
          button1_text?: string | null
          button2_link?: string | null
          button2_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stat_boxes: {
        Row: {
          color: string | null
          created_at: string | null
          display_order: number | null
          icon: string
          id: string
          is_active: boolean | null
          label: string
          number: string
          page: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon: string
          id?: string
          is_active?: boolean | null
          label: string
          number: string
          page?: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean | null
          label?: string
          number?: string
          page?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          brands: Json | null
          category: string
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_color: string
          logo_url: string | null
          name: string
          name_en: string | null
          updated_at: string | null
        }
        Insert: {
          brands?: Json | null
          category: string
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_color?: string
          logo_url?: string | null
          name: string
          name_en?: string | null
          updated_at?: string | null
        }
        Update: {
          brands?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_color?: string
          logo_url?: string | null
          name?: string
          name_en?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          location: string
          name: string
          rating: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          rating?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      trade_in_requests: {
        Row: {
          accessories: string | null
          brand: string
          condition: string
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          estimated_price: number | null
          id: string
          model: string
          notes: string | null
          status: string | null
          storage: string | null
          updated_at: string | null
        }
        Insert: {
          accessories?: string | null
          brand: string
          condition: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_price?: number | null
          id?: string
          model: string
          notes?: string | null
          status?: string | null
          storage?: string | null
          updated_at?: string | null
        }
        Update: {
          accessories?: string | null
          brand?: string
          condition?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_price?: number | null
          id?: string
          model?: string
          notes?: string | null
          status?: string | null
          storage?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trade_in_testimonials: {
        Row: {
          avatar_url: string | null
          comment: string
          created_at: string | null
          device_received: string | null
          device_traded: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          location: string
          name: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          comment: string
          created_at?: string | null
          device_received?: string | null
          device_traded?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          rating?: number
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          comment?: string
          created_at?: string | null
          device_received?: string | null
          device_traded?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          created_at: string | null
          id: string
          points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points_history: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          points_change: number
          reason: string | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          points_change: number
          reason?: string | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          points_change?: number
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wishes: {
        Row: {
          created_at: string | null
          id: string
          package_id: string | null
          product_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          package_id?: string | null
          product_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          package_id?: string | null
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishes_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_package_to_wishlist: {
        Args: { package_id_param: string; user_id_param: string }
        Returns: undefined
      }
      check_package_in_wishlist: {
        Args: { package_id_param: string; user_id_param: string }
        Returns: boolean
      }
      delete_sliding_photo: {
        Args: { photo_id: string }
        Returns: boolean
      }
      execute_sql: {
        Args: { sql_query: string }
        Returns: Json
      }
      get_customer_testimonials: {
        Args: { limit_count?: number }
        Returns: {
          comment: string
          created_at: string
          helpful_count: number
          id: string
          product_name: string
          rating: number
          user_avatar: string
          user_location: string
          user_name: string
        }[]
      }
      get_user_wishlist_items: {
        Args: { user_id_param: string }
        Returns: Json[]
      }
      insert_sliding_photo: {
        Args:
          | {
              photo_button1_link?: string
              photo_button1_text?: string
              photo_button2_link?: string
              photo_button2_text?: string
              photo_description?: string
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_description?: string
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_image_url: string
              photo_is_active: boolean
              photo_title: string
            }
        Returns: string
      }
      remove_package_from_wishlist: {
        Args: { package_id_param: string; user_id_param: string }
        Returns: undefined
      }
      toggle_sliding_photo_active: {
        Args: { new_active_state: boolean; photo_id: string }
        Returns: boolean
      }
      update_sliding_photo: {
        Args:
          | {
              photo_button1_link?: string
              photo_button1_text?: string
              photo_button2_link?: string
              photo_button2_text?: string
              photo_description?: string
              photo_id: string
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_description?: string
              photo_id: string
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_id: string
              photo_image_url: string
              photo_is_active: boolean
              photo_link?: string
              photo_title: string
            }
          | {
              photo_id: string
              photo_image_url: string
              photo_is_active: boolean
              photo_title: string
            }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      specification_type: {
        os: string | null
        ram: string | null
        battery: string | null
        display: string | null
        storage: string | null
        processor: string | null
        back_camera: string | null
        front_camera: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
