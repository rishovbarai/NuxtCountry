<template>
  <div class="container mt-5">
    <div v-if="!country" class="text-center">
      Loading country data...
    </div>
    <template v-else>
      <!-- Main country section with flag and details -->
      <div class="d-flex mb-5">
        <!-- Country details on left -->
        <div class="country-details" style="flex: 0 0 40%;">
          <h1 class="mb-4">{{ country.name.common }}</h1>
          <div class="country-info">
            <p><strong>Official Name:</strong> {{ country.name.official }}</p>
            <p><strong>Native Name:</strong> {{ country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A' }}</p>
            <p><strong>Top-Level Domain:</strong> {{ country.tld?.join(', ') || 'N/A' }}</p>
            <p><strong>Capital:</strong> {{ country.capital ? country.capital.join(', ') : 'N/A' }}</p>
            <p><strong>Region:</strong> {{ country.region || 'N/A' }}</p>
            <p><strong>Subregion:</strong> {{ country.subregion || 'N/A' }}</p>
            <p><strong>Languages:</strong> {{ country.languages ? Object.values(country.languages).join(', ') : 'N/A' }}</p>
            <p><strong>Translations:</strong> {{ country.translations ? Object.values(country.translations).map(translation => translation.common).join(', ') : 'N/A' }}</p>
            <p><strong>Latitude and Longitude:</strong> {{ country.latlng?.join(', ') || 'N/A' }}</p>
            <p><strong>Area:</strong> {{ country.area?.toLocaleString() || 'N/A' }} km²</p>
            <p><strong>Demonyms:</strong> {{ country.demonyms?.eng ? `${country.demonyms.eng.m} / ${country.demonyms.eng.f}` : 'N/A' }}</p>
            <p><strong>Currency:</strong> {{ country.currencies ? Object.values(country.currencies)[0].name : 'N/A' }} ({{ country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A' }})</p>
            <p><strong>Time:</strong> {{ country.timezones ? country.timezones[0] : 'N/A' }}</p>
            <p><strong>Population:</strong> {{ country.population?.toLocaleString() || 'N/A' }}</p>
          </div>
        </div>

        <!-- Large flag on right -->
        <div class="flag-container d-flex align-items-center justify-content-center" style="flex: 0 0 60%;">
          <img 
            :src="country.flags.png" 
            :alt="country.name.common" 
            class="img-fluid" 
            style="max-height: 600px; width: 100%; object-fit: contain;"
          />
        </div>
      </div>

      <!-- Neighboring countries section -->
      <div v-if="neighbors.length" class="neighboring-countries mt-5">
        <h2 class="mb-4">Bordering Countries</h2>
        <div class="d-flex flex-wrap gap-4">
          <div v-for="neighbor in neighbors" :key="neighbor.cca3" style="flex: 0 0 200px;">
            <NuxtLink :to="`/country/${neighbor.cca3}`" class="text-decoration-none">
              <div class="card h-100">
                <img 
                  :src="neighbor.flags.png" 
                  :alt="neighbor.name.common" 
                  class="card-img-top" 
                  style="height: 120px; object-fit: cover;"
                />
                <div class="card-body">
                  <h5 class="card-title">{{ neighbor.name.common }}</h5>
                  <p class="card-text">Population: {{ neighbor.population.toLocaleString() }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: countryResponse } = await useFetch(`https://restcountries.com/v3.1/alpha/${route.params.country}`)
const country = computed(() => countryResponse.value?.[0])

const neighbors = ref([])

watchEffect(async () => {
  if (country.value?.borders?.length) {
    try {
      const borderPromises = country.value.borders.map(border =>
        $fetch(`https://restcountries.com/v3.1/alpha/${border}`)
      )
      neighbors.value = await Promise.all(borderPromises)
    } catch (error) {
      console.error('Error fetching neighbor countries:', error)
      neighbors.value = []
    }
  }
})
</script>