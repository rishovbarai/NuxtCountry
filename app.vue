<template>
  <div class="app-container">
    <!-- Navigation announcer for accessibility -->
    <NuxtRouteAnnouncer />
    
    <!-- Main layout wrapper -->
    <div class="main-layout">
      <!-- Main content area -->
      <main class="main-content">
        <NuxtErrorBoundary>
          <NuxtPage />
          <template #error="{ error }">
            <div class="error-container">
              <h1>404 - Page Not Found</h1>
              <p>{{ error.message }}</p>
              <NuxtLink to="/" class="btn btn-primary">Return Home</NuxtLink>
            </div>
          </template>
        </NuxtErrorBoundary>
      </main>

      <!-- Footer section -->
      <footer class="footer">
        <p>&copy; {{ new Date().getFullYear() }} Your App Name</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Any component-level logic can go here
</script>

<style>
.app-container {
  min-height: 100vh;
}

.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem;
  background-color: #f8f9fa;
}

.nav-link {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

.nav-link:hover {
  color: #007bff;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  padding: 1rem;
  background-color: #f8f9fa;
  text-align: center;
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-container h1 {
  margin-bottom: 1rem;
}

.error-container .btn {
  margin-top: 1rem;
}
</style>
