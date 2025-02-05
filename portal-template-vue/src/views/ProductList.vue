<template>
  <div class="product-list">
    <!-- 搜索和过滤区域 -->
    <div class="search-section glass-card">
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="搜索产品..." class="search-input" />
      </div>
      <div class="category-filters">
        <button
          class="category-chip glass-button"
          :class="{ active: !selectedCategory }"
          @click="selectedCategory = ''"
        >
          所有类别
        </button>
        <button
          v-for="category in categories"
          :key="category"
          class="category-chip glass-button"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 产品网格 -->
    <div class="products-grid">
      <router-link
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="product-card glass-card"
      >
        <div class="product-image-container">
          <img :src="product.imageUrl" :alt="product.name" class="product-image" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.shortDescription }}</p>
          <div class="product-category">{{ product.category }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'

  // 模拟产品数据，实际项目中应该从API获取
  const products = ref([
    {
      id: 1,
      name: '高性能工作站',
      shortDescription: '专业级工作站，为创意工作者打造',
      category: '电脑设备',
      imageUrl: '/src/assets/slide1.jpg'
    },
    {
      id: 2,
      name: '智能监控系统',
      shortDescription: '先进的AI监控解决方案',
      category: '安防设备',
      imageUrl: '/src/assets/slide2.jpg'
    },
    {
      id: 3,
      name: '云存储服务器',
      shortDescription: '高可靠性企业级存储方案',
      category: '服务器',
      imageUrl: '/src/assets/slide3.jpg'
    }
  ])

  const searchQuery = ref('')
  const selectedCategory = ref('')

  // 提取所有unique的产品类别
  const categories = computed(() => {
    return [...new Set(products.value.map(product => product.category))]
  })

  // 过滤产品列表
  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
  })
</script>

<style scoped>
  .product-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .search-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .search-box {
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    color: inherit;
  }

  .search-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.5rem 0;
  }

  .category-chip {
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .category-chip:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .category-chip.active {
    background: rgba(var(--v-theme-primary), 0.15);
    border-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
  }

  .category-chip.active:hover {
    background: rgba(var(--v-theme-primary), 0.2);
  }

  /* 移动端优化 */
  @media (max-width: 600px) {
    .category-filters {
      gap: 0.5rem;
      margin: 1rem -1rem;
      padding: 0.5rem 1rem;
      overflow-x: auto;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }

    .category-filters::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }

    .category-chip {
      padding: 0.4rem 1rem;
      font-size: 0.8125rem;
      white-space: nowrap;
    }
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .product-card {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-5px);
  }

  .product-image-container {
    width: 100%;
    height: 200px;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-info {
    padding: 1.5rem;
  }

  .product-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .product-description {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  .product-category {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    font-size: 0.75rem;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .product-list {
      padding: 1rem;
    }

    .search-section {
      flex-direction: column;
    }

    .products-grid {
      grid-template-columns: 1fr;
    }
  }

  /* 主题过渡效果 */
  .product-list * {
    transition: var(--theme-transition-duration) ease;
  }
</style>
