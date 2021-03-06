<template>
  <div class="base-chapter">
    <div class="base-chapter__content" v-html="content"></div>

    <div class="base-chapter__reading-progress">
      <div class="base-chapter__text-hint">
        <div class="base-chapter__progress">{{ progress }}</div>

        <button class="base-chapter__toggle-dark-mode" @click="toggleDarkMode">
          {{ darkModeButtonText }}
        </button>

        <div class="base-chapter__read-time">{{ readMinutes }}</div>
      </div>
      <div class="base-chapter__progress-bar"></div>
    </div>
  </div>
</template>

<script>
import { bookmark, darkMode } from "@/storage";

function rafThrottle(fn) {
  let busy = false;

  return function() {
    if (busy) return;

    busy = true;
    fn.apply(this, arguments);
    window.requestAnimationFrame(function() {
      busy = false;
    });
  };
}

export default {
  props: {
    chapterNum: {
      type: [Number, String],
      required: true
    }
  },

  watch: {
    chapterNum: {
      async handler(newValue) {
        const md = await import(`./chapter-${newValue}.md`);
        this.content = md.default;
        this.$nextTick(() => {
          const content = this.$el.querySelector(".base-chapter__content");
          this.readMinutes = `${Math.round(
            content.textContent.length / 250
          )} min read`;

          window.scrollTo(0, this.$route.query.Y || 0);
        });
      },
      immediate: true
    }
  },

  data() {
    return {
      content: "",
      progress: "0%",
      readMinutes: "",

      darkModeButtonText: darkMode.getDarkModeSetting()
        ? "Dark mode is ON"
        : "Dark mode is OFF"
    };
  },

  methods: {
    updateProgress() {
      const de = document.documentElement;
      const scrollTop = de.scrollTop;
      const scrollBottom = de.scrollHeight - de.clientHeight;
      const scrollPercent = (scrollTop / scrollBottom) * 100;
      this.$el
        .querySelector(".base-chapter__progress-bar")
        .style.setProperty("--scroll", scrollPercent + "%");
      this.progress = Math.min(Math.ceil(scrollPercent), 100) + "%";
    },

    saveBookmarkY() {
      bookmark.setY(window.scrollY);
    },

    toggleDarkMode() {
      const dark = darkMode.getDarkModeSetting();
      this.$setDarkMode(!dark);
      this.darkModeButtonText = darkMode.getDarkModeSetting()
        ? "Dark mode is ON"
        : "Dark mode is OFF";
    }
  },

  mounted() {
    document.addEventListener("scroll", rafThrottle(this.updateProgress), {
      passive: true
    });
    document.addEventListener("scroll", rafThrottle(this.saveBookmarkY), {
      passive: true
    });
  },

  beforeDestroy() {
    document.removeEventListener("scroll", rafThrottle(this.updateProgress));
    document.removeEventListener("scroll", rafThrottle(this.saveBookmarkY));
  }
};
</script>

<style lang="scss">
@import "@/scss/theme";

.base-chapter {
  position: relative;

  &__reading-progress {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 12px;
    letter-spacing: 0;
    background-color: var(--color-primary-lightest);
    height: 48px;
    display: flex;
    flex-direction: column;
  }

  &__text-hint {
    margin: 4px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
  }

  &__toggle-dark-mode {
    border-radius: 4px;
    border: 1px solid var(--color-primary-lighter);
    padding: 4px 12px;
    background-color: var(--color-primary-lightest);
    color: var(--color-primary);
  }

  &__progress-bar {
    height: 4px;
    --scroll: 0%;
    background: linear-gradient(
      to right,
      var(--color-accent) var(--scroll),
      transparent 0
    );
  }

  &__content {
    margin: 1.999em 0;

    h1 {
      margin-top: 0em;
      font-size: 1.414em;
      font-weight: normal;
      color: var(--color-primary-lighter);
    }

    h2 {
      margin-bottom: 0.354em;
      font-size: 0.707em;
      font-weight: normal;
    }

    p {
      font-size: 1em;
      margin-bottom: 1.414em;
    }

    .commentary {
      margin-bottom: 1.414em;
      font-size: 1em;
      display: grid;
      grid-template-columns: repeat(2, max-content);
    }

    .inline-paragraph {
      p {
        margin: 0;
      }
    }

    pre {
      white-space: pre-wrap;
    }
  }
}

@include media-query-small {
  .base-chapter__content .commentary {
    gap: width($font-size-min, $gap / 5) width($font-size-min, $gap);
  }
}

@include media-query-medium {
  .base-chapter__content .commentary {
    gap: width($font-size-medium, $gap / 5) width($font-size-medium, $gap);
  }
}

@include media-query-large {
  .base-chapter__content .commentary {
    gap: width($font-size-max, $gap / 5) width($font-size-max, $gap);
  }
}
</style>
