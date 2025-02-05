<template>
  <div class="product-detail">
    <!-- 产品展示区 -->
    <section class="product-hero">
      <div class="product-image-container">
        <img :src="product.imageUrl" :alt="product.name" class="product-image" />
        <div class="product-image-overlay" />
      </div>
      <div class="product-hero-content">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-subtitle">{{ product.shortDescription }}</p>
      </div>
    </section>

    <!-- 产品信息区 -->
    <section class="product-info glass-card">
      <div class="product-description">
        <h2>{{ $t('products.details.description') }}</h2>
        <p>{{ product.description }}</p>
      </div>

      <!-- 技术参数表格 -->
      <div class="product-specs">
        <h2>{{ $t('products.details.specifications') }}</h2>
        <table class="specs-table">
          <tbody>
            <tr v-for="(value, key) in product.specifications" :key="key">
              <td class="spec-name">{{ $t(`products.details.${key}`) }}</td>
              <td class="spec-value">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const product = ref({
    name: t('products.items.workstation.name'),
    shortDescription: t('products.items.workstation.shortDescription'),
    description: t('about.company.description'),
    imageUrl: '/src/assets/slide1.jpg',
    specifications: {
      dimensions: '200 x 300 x 400 mm',
      weight: '2.5 kg',
      material: t('products.details.material'),
      power: '1000W',
      voltage: '220V'
    }
  })
</script>

<style scoped>
  .product-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .product-hero {
    position: relative;
    height: 60vh;
    min-height: 400px;
    margin-bottom: 2rem;
    border-radius: 1rem;
    overflow: hidden;
  }

  .product-image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }

  .product-hero-content {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    color: white;
  }

  .product-title {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .product-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .product-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .product-description h2,
  .product-specs h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .specs-table {
    width: 100%;
    border-collapse: collapse;
  }

  .specs-table tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .specs-table td {
    padding: 1rem 0;
  }

  .spec-name {
    font-weight: 500;
    width: 40%;
  }

  .spec-value {
    color: rgba(255, 255, 255, 0.8);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .product-info {
      grid-template-columns: 1fr;
    }

    .product-hero {
      height: 40vh;
    }

    .product-title {
      font-size: 2rem;
    }
  }

  /* 主题过渡效果 */
  .product-detail * {
    transition: var(--theme-transition-duration) ease;
  }
</style>
