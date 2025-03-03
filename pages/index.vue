<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Country List</h1>
    
    <!-- Show loading state -->
    <div v-if="!countries" class="text-center">
      Loading countries...
    </div>
    
    <!-- Show content only when data is loaded -->
    <template v-else>
      <div class="d-flex justify-content-center mb-4 position-relative">
        <input v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Search countries">
        <i class="fas fa-search search-icon"></i>
      </div>
      <div class="row justify-content-center">
        <div v-for="country in filteredCountries" :key="country.cca3" class="col-12 mb-4">
          <div class="card custom-card">
            <div class="card-body d-flex">
              <div class="flex-fill d-flex justify-content-center align-items-center">
                <img :src="country.flags.png" :alt="country.name.common" class="w-100" />
              </div>
              <div class="col-7 d-flex flex-column">
                <div style="margin-left: 10px;">
                  <h5 class="card-title">{{ country.name.common }}</h5>
                  <p class="card-text mb-1"><strong>Currency:</strong> {{ country.currencies ? Object.values(country.currencies)[0].name : 'N/A' }} ({{ country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A' }})</p>
                  <p class="card-text"><strong>Time:</strong> {{ country.timezones ? country.timezones[0] : 'N/A' }}</p>
                </div>
                <div class="mt-auto">
                  <button class="btn btn-primary btn-sm mr-2" @click="showMap(country.maps.googleMaps)"><strong>Show Map</strong></button>
                  <nuxt-link :to="`/country/${country.cca3}`" class="btn btn-secondary btn-sm"><strong>Details</strong></nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const { data: countries } = await useFetch('https://restcountries.com/v3.1/all')

const filteredCountries = computed(() => {
  // Add null check before filtering
  if (!countries.value) return []
  
  return countries.value.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const showMap = (mapUrl) => {
  window.open(mapUrl, '_blank')
}
</script>