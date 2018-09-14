<template>
  <div>
    This is the home page
    <span>{{message}}</span>
    <button v-on:click="goToAboutPage">Go to about page</button>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>