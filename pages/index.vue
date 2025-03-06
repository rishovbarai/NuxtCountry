<template>
  <div class="container mt-5">
    <h1 class="mb-2">Countries</h1>
    <div class="d-flex justify-content-center mb-4 position-relative">
      <input id="search-bar" v-model="searchQuery" type="text" class="form-control search-bar" placeholder="Search countries" style="height: 60px;" />
      <i class="fas fa-search search-icon"></i>
    </div>
    <div id="country-list" class="row justify-content-center">
      <div v-for="country in filteredCountries" :key="country.cca3" class="col-12 mb-4">
        <div class="card custom-card">
          <div class="card-body d-flex">
            <div class="flag-wrapper flex-fill d-flex justify-content-center align-items-center">
              <div class="flag-container">
                <img 
                  :src="country.flags.png" 
                  :alt="country.name.common" 
                  class="country-flag"
                />
              </div>
            </div>
            <div class="col-7 d-flex flex-column">
              <div style="margin-left: 10px;">
                <h5 class="card-title">{{ country.name.common || 'N/A' }}</h5>
                <p class="card-text mb-1"><strong>Currency:</strong> {{ country.currencies ? Object.values(country.currencies)[0].name : 'N/A' }} ({{ country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A' }})</p>
                <p class="card-text"><strong>Current date and time:</strong> <span>{{ formatDateTime(country.timezones) }}</span></p>
              </div>
              <div class="d-flex align-items-center mt-auto">
                <button class="btn btn-primary btn-sm mr-2" @click="showMap(country.maps.googleMaps)" style="font-size: 20px;"><strong>Show Map</strong></button>
                <nuxt-link :to="`/country/${country.cca3}`" class="btn btn-secondary btn-sm" style="line-height: 1.5; font-size: 20px;"><strong>Detail</strong></nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const { data: countries } = await useFetch('https://restcountries.com/v3.1/all')

// Filter countries based on search query
const filteredCountries = computed(() => {
  if (!countries.value) return []
  return countries.value.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Format date and time based on timezone
function formatDateTime(timezones) {
  try {
    const date = new Date()
    
    // Default format options
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }

    let formatted = date.toLocaleString('en-GB', options)
    
    // Add ordinal suffix to day
    const day = date.getDate()
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day - day % 10 !== 10) * (day % 10)] || "th"
    
    // Replace the day number with day + suffix
    formatted = formatted.replace(/(\d+)/, day + suffix)
    
    // If timezone exists, calculate the time difference
    if (timezones && timezones[0]) {
      const timezone = timezones[0]
      const offset = timezone.replace('UTC', '').replace(':', '.')
      const offsetHours = parseFloat(offset)
      
      if (!isNaN(offsetHours)) {
        date.setHours(date.getHours() + offsetHours)
        const timeString = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        formatted = formatted.replace(/\d{2}:\d{2}/, timeString)
      }
    }
    
    return formatted
    
  } catch (error) {
    console.error('Error formatting date:', error)
    return new Date().toLocaleString('en-GB')
  }
}

// Show map in a new tab
const showMap = (mapUrl) => {
  window.open(mapUrl, '_blank')
}
</script>

<style scoped>
.flag-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flag-container {
  width: 227px;
  height: 144px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.country-flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Media queries for responsive design */
@media screen and (max-width: 768px) {
  .card-body {
    flex-direction: column;
  }

  .flag-container {
    width: 100%;
    max-width: 227px;
    height: 144px;
    margin: 0 auto;
  }

  .col-7 {
    width: 100%;
    margin-top: 1rem;
    padding: 0 1rem;
  }

  .mt-auto {
    margin-top: 1rem !important;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
}

@media screen and (max-width: 576px) {
  .flag-container {
    height: 120px;
  }
}
</style>