<template>
  <div class="detail-container mt-5" style="border: 1px solid #e4e4e4; width: 80rem; left: 4rem; position: relative; box-shadow: 0 4px 8px rgb(208, 208, 208, 0.5);">
    <h1 id="country-name" class="text-center mb-4" style="color: rgb(0, 0, 0);">{{ country.name.common }}</h1>
    
    <div class="d-flex mb-5" style="top: 1rem; position: relative; padding: 35px;">
      <!-- Big Flag -->
      <div class="flex-fill">
        <img 
          id="country-flag" 
          :src="country.flags.png" 
          :alt="country.name.common" 
          class="img-fluid" 
          style="width: 64%; height: 350px; object-fit: contain; left: 2.8rem; position: relative; top: 1.5rem;" 
        />
      </div>
      
      <!-- Country Details -->
      <div class="col-md-4">
        <div class="country-info" style="right: 12rem; position: relative; top: 1.6rem; line-height: 1.7; font-size: 23px;">
          <p>Native Name: <span>{{ country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A' }}</span></p>
          <p>Capital: <span>{{ country.capital ? country.capital.join(', ') : 'N/A' }}</span></p>
          <p>Population: <span>{{ country.population?.toLocaleString() || 'N/A' }}</span></p>
          <p>Region: <span>{{ country.region || 'N/A' }}</span></p>
          <p>Subregion: <span>{{ country.subregion || 'N/A' }}</span></p>
          <p>Area: <span>{{ country.area?.toLocaleString() || 'N/A' }}</span> km²</p>
          <p>Languages: <span>{{ country.languages ? Object.values(country.languages).join(', ') : 'N/A' }}</span></p>
          <p>Currency: <span>{{ country.currencies ? Object.values(country.currencies)[0].name : 'N/A' }}</span> ({{ country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A' }})</p>
          <p>TimeZones: <span>{{ country.timezones ? country.timezones[0] : 'N/A' }}</span></p>
        </div>
      </div>
    </div>

    <!-- Section 2: Neighboring Countries -->
    <div id="neighboring-countries" class="row" style="padding: 40px; margin: 60px; border: 1px solid black;">
      <div class="col-12">
        <h2 class="mb-4">Neighboring Countries</h2>
        <div class="d-flex flex-wrap gap-4">
          <div v-if="neighbors.length" v-for="neighbor in neighbors" :key="neighbor.cca3" style="flex: 0 0 30%;">
            <NuxtLink :to="`/country/${neighbor.cca3}`" class="text-decoration-none">
              <div class="card h-100" style="border-radius: 0;">
                <img 
                  :src="neighbor.flags.png" 
                  :alt="neighbor.name.common" 
                  class="card-img-top" 
                  style="height: 180px; object-fit: cover; border-radius: 0;"
                />
              </div>
            </NuxtLink>
          </div>
          <div v-else class="text-center">
            <p>This country has no bordering countries.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: countryResponse } = await useFetch(`https://restcountries.com/v3.1/alpha/${route.params.id}`)
const country = computed(() => countryResponse.value?.[0])

const neighbors = ref([])

watchEffect(async () => {
  if (country.value?.borders?.length) {
    try {
      const borderPromises = country.value.borders.map(async border => {
        const response = await $fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        // Extract first element from the array response
        return Array.isArray(response) ? response[0] : response
      })
      neighbors.value = await Promise.all(borderPromises)
    } catch (error) {
      console.error('Error fetching neighbor countries:', error)
      neighbors.value = []
    }
  } else {
    neighbors.value = [] // Reset neighbors if country has no borders
  }
})
</script>

<style scoped>
.detail-container {
  border: 1px solid #e4e4e4;
  width: 80rem;
  left: 4rem;
  position: relative;
  box-shadow: 0 4px 8px rgba(208, 208, 208, 0.5);
}
</style>