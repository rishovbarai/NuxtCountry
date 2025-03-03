<template>
  <div class="container mt-5">
    <div v-if="!country" class="text-center">
      Loading country data...
    </div>
    <template v-else>
      <!-- Section 1: Flag and Country Details -->
      <div class="row mb-5">
        <!-- Big Flag -->
        <div class="col-lg-8 col-md-12 mb-4">
          <img :src="country.flags?.png" :alt="country.name.common" class="main-flag img-fluid" />
        </div>
        
        <!-- Country Details -->
        <div class="col-lg-4 col-md-12">
          <h1 class="mb-4">{{ country.name.common }}</h1>
          <div class="country-info">
            <p><strong>Official Name:</strong> {{ country.name.official }}</p>
            <p><strong>Native Name:</strong> {{ country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A' }}</p>
            <p><strong>Capital:</strong> {{ country.capital ? country.capital.join(', ') : 'N/A' }}</p>
            <p><strong>Region:</strong> {{ country.region || 'N/A' }}</p>
            <p><strong>Subregion:</strong> {{ country.subregion || 'N/A' }}</p>
            <p><strong>Languages:</strong> {{ country.languages ? Object.values(country.languages).join(', ') : 'N/A' }}</p>
            <p><strong>Currency:</strong> {{ country.currencies ? Object.values(country.currencies)[0].name : 'N/A' }} ({{ country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A' }})</p>
            <p><strong>Time Zone:</strong> {{ country.timezones ? country.timezones[0] : 'N/A' }}</p>
            <p><strong>Population:</strong> {{ formatNumber(country.population) }}</p>
            <p><strong>Area:</strong> {{ formatNumber(country.area) }} km²</p>
            <p><strong>Driving Side:</strong> {{ country.car?.side || 'N/A' }}</p>
            <p><strong>Top Level Domain:</strong> {{ country.tld?.join(', ') || 'N/A' }}</p>
            <p><strong>UN Member:</strong> {{ country.unMember ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Neighboring Countries -->
      <div class="row mb-5">
        <div class="col-12">
          <h2 class="mb-4">Bordering Countries</h2>
          <div v-if="neighbors.length" class="row g-4 justify-content-center">
            <div v-for="neighbor in neighbors" :key="neighbor.cca3" class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
              <NuxtLink :to="`/country/${neighbor.cca3}`" class="text-decoration-none">
                <div class="border-card">
                  <div class="border-flag-wrapper">
                    <img :src="neighbor.flags.png" :alt="neighbor.name.common" class="border-flag" />
                  </div>
                  <div class="border-card-body">
                    <h5 class="border-card-title">{{ neighbor.name.common }}</h5>
                    <p class="border-card-text">Population: {{ formatNumber(neighbor.population) }}</p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
          <div v-else class="text-center">
            <p>This country has no bordering countries.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const route = useRoute()
const neighbors = ref([])

function formatNumber(num) {
  return num ? num.toLocaleString() : 'N/A'
}

// Fetch country data
const { data: countryResponse } = await useFetch(`https://restcountries.com/v3.1/alpha/${route.params.id}`)
const country = computed(() => {
  // Handle array response
  if (Array.isArray(countryResponse.value)) {
    return countryResponse.value[0]
  }
  // Handle single object response
  return countryResponse.value
})

// Watch for country changes to fetch neighbors
watchEffect(async () => {
  if (country.value?.borders?.length) {
    try {
      const borderPromises = country.value.borders.map(async border => {
        const response = await $fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        return Array.isArray(response) ? response[0] : response
      })
      neighbors.value = await Promise.all(borderPromises)
    } catch (error) {
      console.error('Error fetching neighbor countries:', error)
      neighbors.value = []
    }
  } else {
    neighbors.value = []
  }
})
</script>

<style scoped>
.main-flag {
  width: 100%;
  height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.country-info p {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.border-card {
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin: 0 auto;
  max-width: 300px;
}

.border-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.border-flag-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #f8f9fa;
}

.border-flag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.border-card-body {
  padding: 1rem;
  background: #fff;
}

.border-card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.border-card-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .main-flag {
    height: 300px;
  }
  
  .country-info p {
    font-size: 1rem;
  }
}
</style>