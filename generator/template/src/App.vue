<template>
  <div
    id="app"
    :class="{'dark-mode': $darkMode}"
  >
    <router-view />

    <snackbar
      v-if="prompt"
      message="New version found. Refresh to upgrade?"
      accept-text="Update"
      cancel-text="later"
      @snackbar-accept="reload"
      @snackbar-cancel="prompt = false"
    />
  </div>
</template>

<script>
import Snackbar from '@/components/Snackbar'

export default {
  components: { Snackbar },

  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener('waiting', () => {
        this.prompt = true
      })
    }
  },

  methods: {
    async reload() {
      this.prompt = false

      await this.$workbox.messageSW({ type: 'SKIP_WAITING' })
    },
  },

  data() {
    return {
      prompt: false,
    }
  },
}
</script>

<style lang="scss">
@import '@/scss/theme';

/* colors and font family
 */
body {
  margin: 0; // reset body margin
  color: $color-primary; /* grizzly */
  background-color: $color-primary-lightest; /* moccasin */
  line-height: 1.7;
  min-width: $query-min-width;
}

@include media-query-small {
  body {
    font-size: $font-size-min;
    letter-spacing: width($font-size-min, $letter-spacing);
  }
}

@include media-query-medium {
  body {
    font-size: $font-size-medium;
    letter-spacing: width($font-size-medium, $letter-spacing);
  }
}

@include media-query-large {
  body {
    font-size: $font-size-max;
    letter-spacing: width($font-size-max, $letter-spacing);
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: $color-primary; /* grizzly */
  color: $color-primary-lightest; /* moccasin */
}

a {
  color: $color-primary;
  text-decoration: none;

  &.router-link-exact-active,
  &:visited {
    color: $color-accent;
  }
}
</style>
